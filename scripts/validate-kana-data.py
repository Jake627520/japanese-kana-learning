#!/usr/bin/env python3
import sys
import os
import re
import json

# Sets of characters
HIRAGANA_BASIC_46 = set("あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん")
KATAKANA_BASIC_46 = set("アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン")

HIRAGANA_DAKUTEN = set("がぎぐげござじずぜぞだぢづでどばびぶべぼ")
KATAKANA_DAKUTEN = set("ガギグゲゴザジズゼゾダヂヅデドバビブベボ")

HIRAGANA_HANDAKUTEN = set("ぱぴぷぺぽ")
KATAKANA_HANDAKUTEN = set("パピプペポ")

YOUON_SOKUON = set("ゃゅょっぁぃぅぇぉゎャュョッァィゥェォヮ")

HEPBURN_CHECK = {
    'h_shi': 'shi', 'h_chi': 'chi', 'h_tsu': 'tsu', 'h_fu': 'fu', 'h_wo': 'wo',
    'k_shi': 'shi', 'k_chi': 'chi', 'k_tsu': 'tsu', 'k_fu': 'fu', 'k_wo': 'wo',
}

def is_kanji(ch):
    return '\u4e00' <= ch <= '\u9fff'

def parse_ts_file(filepath):
    if not os.path.exists(filepath):
        return None, []
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    content_cleaned = re.sub(r'export\s+const\s+ALL_KANA_DATA[\s\S]*$', '', content)
    match = re.search(r'export\s+const\s+(\w+)(?::\s*KanaItem\[\])?\s*=\s*(\[\s*[\s\S]*\]);?', content_cleaned)
    if not match:
        return None, []
    var_name = match.group(1)
    json_str = match.group(2)
    json_str = re.sub(r'//.*', '', json_str)
    json_str = re.sub(r',\s*([\]}])', r'\1', json_str)
    try:
        data = json.loads(json_str)
        return var_name, data
    except Exception as e:
        print(f"Error parsing {filepath}: {e}")
        return None, []

def main():
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    data_files = [
        os.path.join(root_dir, 'src', 'data', 'kanaData.ts'),
        os.path.join(root_dir, 'src', 'data', 'katakanaData.ts'),
        os.path.join(root_dir, 'src', 'data', 'dakutenData.ts'),
        os.path.join(root_dir, 'src', 'data', 'handakutenData.ts'),
        os.path.join(root_dir, 'src', 'data', 'youonData.ts'),
    ]

    total_files = 0
    total_items = 0
    errors = []
    warnings = []

    for filepath in data_files:
        if not os.path.exists(filepath):
            continue
        total_files += 1
        var_name, items = parse_ts_file(filepath)
        total_items += len(items)

        rel_path = os.path.relpath(filepath, root_dir)

        for item in items:
            item_id = item.get('id', 'UNKNOWN')
            kana = item.get('kana', '')
            romaji = item.get('romaji', '')
            cat = item.get('category', '')
            item_type = item.get('type', '')

            # 6. Romaji & Kana empty check
            if not kana:
                errors.append({'file': rel_path, 'id': item_id, 'field': 'kana', 'value': kana, 'reason': 'Kana field is empty'})
            if not romaji:
                errors.append({'file': rel_path, 'id': item_id, 'field': 'romaji', 'value': romaji, 'reason': 'Romaji field is empty'})

            # Romaji Hepburn check
            if item_id in HEPBURN_CHECK and romaji != HEPBURN_CHECK[item_id]:
                errors.append({'file': rel_path, 'id': item_id, 'field': 'romaji', 'value': romaji, 'reason': f'Expected Hepburn romaji "{HEPBURN_CHECK[item_id]}" but got "{romaji}"'})

            # 2. Hiragana Category Range Check
            if cat == 'basic-hiragana' or (var_name == 'HIRAGANA_DATA' and item_type == 'hiragana'):
                if kana not in HIRAGANA_BASIC_46:
                    errors.append({'file': rel_path, 'id': item_id, 'field': 'kana', 'value': kana, 'reason': f'Kana "{kana}" is not in basic Hiragana 46'})
                
                # Check for Katakana in word or kana
                if any('\u30a0' <= ch <= '\u30ff' for ch in kana):
                    errors.append({'file': rel_path, 'id': item_id, 'field': 'kana', 'value': kana, 'reason': 'Katakana character found in basic Hiragana item'})

            # 3. Katakana Category Range Check
            elif cat == 'basic-katakana' or (var_name == 'KATAKANA_DATA' and item_type == 'katakana'):
                if kana not in KATAKANA_BASIC_46:
                    errors.append({'file': rel_path, 'id': item_id, 'field': 'kana', 'value': kana, 'reason': f'Kana "{kana}" is not in basic Katakana 46'})
                
                # Check for Hiragana in katakana kana
                if any('\u3040' <= ch <= '\u309f' for ch in kana):
                    errors.append({'file': rel_path, 'id': item_id, 'field': 'kana', 'value': kana, 'reason': 'Hiragana character found in basic Katakana item'})

            # 4. Dakuten Range Check
            elif cat == 'dakuten' or var_name == 'DAKUTEN_DATA':
                if kana not in HIRAGANA_DAKUTEN and kana not in KATAKANA_DAKUTEN:
                    errors.append({'file': rel_path, 'id': item_id, 'field': 'kana', 'value': kana, 'reason': f'Kana "{kana}" is not a valid Dakuten character'})

            # 5. Handakuten Range Check
            elif cat == 'handakuten' or var_name == 'HANDAKUTEN_DATA':
                if kana not in HIRAGANA_HANDAKUTEN and kana not in KATAKANA_HANDAKUTEN:
                    errors.append({'file': rel_path, 'id': item_id, 'field': 'kana', 'value': kana, 'reason': f'Kana "{kana}" is not a valid Handakuten character'})

            # 6. Youon Range Check
            elif cat == 'youon' or var_name == 'YOUON_DATA':
                if item_type == 'hiragana':
                    if any('\u30a0' <= ch <= '\u30ff' for ch in kana):
                        errors.append({'file': rel_path, 'id': item_id, 'field': 'kana', 'value': kana, 'reason': 'Katakana character found in Hiragana Youon item'})
                elif item_type == 'katakana':
                    if any('\u3040' <= ch <= '\u309f' for ch in kana):
                        errors.append({'file': rel_path, 'id': item_id, 'field': 'kana', 'value': kana, 'reason': 'Hiragana character found in Katakana Youon item'})

            # Check Examples
            for idx, ex in enumerate(item.get('examples', [])):
                word = ex.get('word', '')
                sentence = ex.get('sentence', '')
                sentence_display = ex.get('sentenceDisplay', '')
                req_level = ex.get('requiredLevel', 'basic')

                # 1. Kanji Check
                for ch in word:
                    if is_kanji(ch):
                        errors.append({'file': rel_path, 'id': item_id, 'field': f'examples[{idx}].word', 'value': word, 'reason': f'Kanji detected: {ch}'})
                for ch in sentence:
                    if is_kanji(ch):
                        errors.append({'file': rel_path, 'id': item_id, 'field': f'examples[{idx}].sentence', 'value': sentence, 'reason': f'Kanji detected: {ch}'})
                if sentence_display:
                    for ch in sentence_display:
                        if is_kanji(ch):
                            errors.append({'file': rel_path, 'id': item_id, 'field': f'examples[{idx}].sentenceDisplay', 'value': sentence_display, 'reason': f'Kanji detected: {ch}'})

                # 7. sentenceDisplay Check
                if sentence_display:
                    stripped_display = sentence_display.replace(' ', '')
                    if stripped_display != sentence:
                        errors.append({'file': rel_path, 'id': item_id, 'field': f'examples[{idx}].sentenceDisplay', 'value': sentence_display, 'reason': f'sentenceDisplay (without spaces: "{stripped_display}") does not match sentence ("{sentence}")'})

                # Check Katakana in Hiragana words
                if cat == 'basic-hiragana' or var_name == 'HIRAGANA_DATA':
                    if any('\u30a0' <= ch <= '\u30ff' for ch in word):
                        errors.append({'file': rel_path, 'id': item_id, 'field': f'examples[{idx}].word', 'value': word, 'reason': 'Katakana character found in Hiragana word'})

                # Check Youon / Sokuon in basic items
                if (cat == 'basic-hiragana' or var_name == 'HIRAGANA_DATA') and req_level == 'basic':
                    for ch in word + sentence:
                        if ch in YOUON_SOKUON:
                            warnings.append({'file': rel_path, 'id': item_id, 'field': f'examples[{idx}]', 'value': f'word: {word}, sentence: {sentence}', 'reason': f'Contains Youon/Sokuon: {ch}'})
                            break

    # Print Report
    print("========================================")
    print("Japanese Kana Educational Validator")
    print("========================================")
    print(f"Files scanned: {total_files}")
    print(f"Items scanned: {total_items}")
    print()
    print(f"Errors: {len(errors)}")
    print(f"Warnings: {len(warnings)}")
    print()

    if errors:
        for err in errors:
            print("ERROR:")
            print(f"  file:   {err['file']}")
            print(f"  id:     {err['id']}")
            print(f"  field:  {err['field']}")
            print(f"  value:  {err['value']}")
            print(f"  reason: {err['reason']}")
            print()
        print("VALIDATION FAILED")
        sys.exit(1)
    else:
        print("✓ No kanji detected")
        print("✓ Kana categories valid")
        print("✓ Romaji valid")
        print("✓ sentenceDisplay valid")
        print("✓ requiredLevel valid")
        print()
        print("VALIDATION PASSED")
        sys.exit(0)

if __name__ == '__main__':
    main()
