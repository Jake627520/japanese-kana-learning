#!/usr/bin/env python3
"""
JLPT 題庫答案位置洗牌：把每題的選項重新排列、answer 號跟著更新，消除
「正解集中在第 1 位」的偏差（validate-jlpt-data.py 抓到 N3 100%、N4 99%）。

安全設計（針對上次「修位置時動到解說造出新錯」的教訓）：
  1. 只重排選項『原始 source token』並改 answer 數字——**逐字保留每個選項的
     原始位元組**，不 parse 再 serialize，解說／stem／其餘一律不碰。
  2. 每題洗完自我驗證：新位置的選項必須還是原本的正解，否則整檔中止不寫。
  3. 解說若含位置代號（①②③④／選項N／第N個／N番）就『跳過不洗』並列入
     flagged 清單交人工——避免打散後解說對不上。
  4. 預設 dry-run 只報告；加 --write 才真的改檔。

用法：
  python3 scripts/shuffle-jlpt-answers.py          # 預覽（不改檔）
  python3 scripts/shuffle-jlpt-answers.py --write  # 實際洗牌
"""
import os, re, sys, glob, random
from collections import Counter

JLPT_DIR = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'jlpt')
WRITE = '--write' in sys.argv

ID_PAT = re.compile(r"^(\s*)id:\s*['\"]([^'\"]+)['\"]", re.M)
# 完整引號字面值（含跳脫），用來『原封不動』搬移選項，不重新加引號
RAW_TOKEN = re.compile(r"'(?:\\.|[^'\\])*'|\"(?:\\.|[^\"\\])*\"")
OPTIONS = re.compile(r"(options:\s*\[)(.*?)(\])", re.S)
ANSWER = re.compile(r"(answer:\s*['\"])(\d+)(['\"])")
# 只擋「明確以編號指涉選項」的寫法。①②（條列理由）、第N個（表格※註記/語言學
# 內容）、裸數字對經全庫人工稽核確認安全，不列入。解說一律應以選項文字指涉，
# 這也是內容規範——用編號指涉選項本身就是該避免的寫法（見 n3-own-b3-18 的修正）。
FLAG = re.compile(r"選項\s*[0-9０-９１-４]|選択肢\s*[0-9０-９]")

def process_block(block, qid, stats, flagged):
    om = OPTIONS.search(block)
    am = ANSWER.search(block)
    if not om or not am:
        return block
    tokens = RAW_TOKEN.findall(om.group(2))
    answer = int(am.group(2))
    if len(tokens) < 2 or not (1 <= answer <= len(tokens)):
        return block  # 交給 validate-jlpt-data 報結構錯，這裡不動
    if FLAG.search(block):
        flagged.append(qid)
        return block

    n = len(tokens)
    order = list(range(n))
    random.Random(qid).shuffle(order)          # 依 id 決定，可重現
    new_tokens = [tokens[i] for i in order]
    new_answer = order.index(answer - 1) + 1    # 正解原本的 index 落到第幾位

    # 自我驗證：新位置的選項必須逐字等於原正解
    assert new_tokens[new_answer - 1] == tokens[answer - 1], f'{qid} 洗牌後正解對不上'

    new_block = block[:om.start()] + om.group(1) + ', '.join(new_tokens) + om.group(3) + block[om.end():]
    am2 = ANSWER.search(new_block)  # options 改動後重新定位 answer
    new_block = new_block[:am2.start()] + am2.group(1) + str(new_answer) + am2.group(3) + new_block[am2.end():]
    if new_answer != answer:
        stats['moved'] += 1
    stats['shuffled'] += 1
    return new_block

def main():
    files = sorted(glob.glob(os.path.join(JLPT_DIR, 'n?OriginalBatch*.ts')))
    total = Counter()
    all_flagged = []
    for path in files:
        txt = open(path, encoding='utf-8').read()
        ids = list(ID_PAT.finditer(txt))
        if not ids:
            continue
        stats = Counter()
        flagged = []
        result = txt[:ids[0].start()]
        for i, m in enumerate(ids):
            start = m.start()
            end = ids[i + 1].start() if i + 1 < len(ids) else len(txt)
            result += process_block(txt[start:end], m.group(2), stats, flagged)
        # 洗完的分布
        after = Counter(int(x.group(2)) for x in ANSWER.finditer(result))
        tot = sum(after.values())
        dist = '  '.join(f"{p}:{after.get(p,0)}({round(100*after.get(p,0)/tot)}%)" for p in (1,2,3,4)) if tot else ''
        print(f"{os.path.basename(path):26} 洗 {stats['shuffled']:>3} 題（移位 {stats['moved']:>3}）"
              f" 跳過 {len(flagged):>2} → {dist}")
        total.update(stats)
        all_flagged += flagged
        if WRITE:
            open(path, 'w', encoding='utf-8').write(result)

    print()
    print(f"合計：洗牌 {total['shuffled']} 題、位置改變 {total['moved']} 題、跳過（含位置代號）{len(all_flagged)} 題")
    if all_flagged:
        print(f"跳過需人工檢視的題目 id：{', '.join(all_flagged)}")
    if not WRITE:
        print("\n（這是預覽，未改檔。確認上面分布與跳過清單合理後，加 --write 實際執行。）")
    else:
        print("\n已寫入。接著請跑：npm run validate:jlpt && npm run lint && npm run build")

if __name__ == '__main__':
    main()
