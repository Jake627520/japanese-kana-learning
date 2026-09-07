#!/usr/bin/env python3
"""
JLPT 題庫內容驗證：抓「結構性」與「統計性」缺陷——這正是 AI 生成題庫最容易
系統性出錯、又能自動檢查的部分。

背景：先前三個 fix commit 顯示題庫曾有 222/280 題正解都在第 1 位、13 題雙重
正解、27 處解說教錯規則。前兩類（位置偏差、選項重複/越界）這支腳本會擋下；
解說對不對、兩個選項是否都成立，需要人工／fresh-context 覆核，本腳本抓不到
——通過本檢查是「必要非充分」，不等於內容正確。

自動掃描 src/data/jlpt/ 下所有 n?OriginalBatch*.ts，新增 batch 免改腳本。

用法：python3 scripts/validate-jlpt-data.py  ／  npm run validate:jlpt
"""
import os, re, sys, glob
from collections import Counter, defaultdict

JLPT_DIR = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'jlpt')

def quoted_values(s):
    """抓一段文字裡的引號字串（單/雙引號皆可）。選項是短日文詞，不含內嵌引號。"""
    out = []
    for m in re.finditer(r"'([^']*)'|\"([^\"]*)\"", s):
        out.append(m.group(1) if m.group(1) is not None else m.group(2))
    return out

def level_of(path):
    m = re.match(r'(n[345])', os.path.basename(path))
    return m.group(1) if m else '?'

def parse_questions(path):
    """以 id: 當切點，逐題抓 id/options/answer/primary/license/origin。"""
    txt = open(path, encoding='utf-8').read()
    ids = [(m.start(), m.group(1)) for m in re.finditer(r"id:\s*['\"]([^'\"]+)['\"]", txt)]
    out = []
    for i, (pos, qid) in enumerate(ids):
        end = ids[i + 1][0] if i + 1 < len(ids) else len(txt)
        block = txt[pos:end]
        opts = re.search(r"options:\s*\[(.*?)\]", block, re.S)
        ans = re.search(r"answer:\s*['\"](\d+)['\"]", block)
        prim = re.search(r"primary:\s*['\"]([^'\"]+)['\"]", block)
        lic = re.search(r"license:\s*['\"]([^'\"]+)['\"]", block)
        ori = re.search(r"origin:\s*['\"]([^'\"]+)['\"]", block)
        out.append({
            'id': qid,
            'options': quoted_values(opts.group(1)) if opts else [],
            'answer': ans.group(1) if ans else None,
            'primary': prim.group(1) if prim else None,
            'license': lic.group(1) if lic else None,
            'origin': ori.group(1) if ori else None,
            'file': os.path.basename(path),
            'level': level_of(path),
        })
    return out

def parse_topic_ids(path):
    return re.findall(r"id:\s*['\"]([^'\"]+)['\"]", open(path, encoding='utf-8').read())

def main():
    orig = sorted(glob.glob(os.path.join(JLPT_DIR, 'n?OriginalBatch*.ts')))
    topic = sorted(glob.glob(os.path.join(JLPT_DIR, 'n?TopicsBatch*.ts')))
    if not orig:
        print('找不到題庫檔（n?OriginalBatch*.ts）'); sys.exit(1)

    all_q = [q for f in orig for q in parse_questions(f)]
    defined = set()
    for f in topic:
        defined.update(parse_topic_ids(f))

    errors, warnings = [], []

    for qid, c in Counter(q['id'] for q in all_q).items():
        if c > 1:
            errors.append(f'ID 重複 {c} 次：{qid}')

    for q in all_q:
        where = f"{q['file']} / {q['id']}"
        n = len(q['options'])
        if n != 4:
            errors.append(f'{where}：選項數 {n}（應為 4）')
        if q['answer'] is None:
            errors.append(f'{where}：缺 answer')
        elif not (q['answer'].isdigit() and 1 <= int(q['answer']) <= max(n, 1)):
            errors.append(f"{where}：answer={q['answer']} 越界（選項只有 {n} 個）")
        dups = [o for o, c in Counter(q['options']).items() if c > 1]
        if dups:
            errors.append(f'{where}：選項文字重複 {dups}（雙重正解／複製貼上的徵兆）')
        if not q['primary']:
            errors.append(f'{where}：缺 topics.primary')
        elif defined and q['primary'] not in defined:
            errors.append(f"{where}：primary={q['primary']} 不在任何 Topics 檔定義中")
        if q['license'] != 'own' or q['origin'] != 'own':
            warnings.append(f"{where}：license/origin 非 own/own（{q['license']}／{q['origin']}）")

    # 答案位置分布——抓「正解集中在某一位」的偏差
    def report(qs, label):
        pos = [int(q['answer']) for q in qs if q['answer'] and q['answer'].isdigit()]
        if not pos:
            return
        c, total = Counter(pos), len(pos)
        line = '  '.join(f"{p}:{c.get(p,0)}({round(100*c.get(p,0)/total)}%)" for p in (1, 2, 3, 4))
        print(f'  [{label}] {total} 題 → {line}')
        worst = max(c.values()) / total
        if worst > 0.35:
            top = max(c, key=c.get)
            warnings.append(f'{label}：答案位置偏差——第 {top} 位佔 {round(100*worst)}%（理想約 25%）')

    print('答案位置分布：')
    by_lv = defaultdict(list)
    for q in all_q:
        by_lv[q['level']].append(q)
    for lv in ('n5', 'n4', 'n3'):
        if by_lv[lv]:
            report(by_lv[lv], lv.upper())
    report(all_q, '全體')

    print(f"\n題庫：{len(all_q)} 題（{len(orig)} 檔）／已定義考點 {len(defined)} 個")
    if warnings:
        print(f'\n⚠ {len(warnings)} 項警告：')
        for w in warnings: print('  ⚠', w)
    if errors:
        print(f'\n✘ {len(errors)} 項錯誤：')
        for e in errors: print('  ✘', e)
        print('\n本腳本只抓結構／統計缺陷。雙重正解（兩選項都成立）與解說教錯規則')
        print('需人工／fresh-context 覆核，本檢查抓不到——通過 ≠ 內容正確。')
        sys.exit(1)
    print('\n✔ 結構與統計檢查全數通過。')
    print('※ 提醒：雙重正解與解說正確性仍需人工／fresh-context 覆核，本檢查為必要非充分。')

if __name__ == '__main__':
    main()
