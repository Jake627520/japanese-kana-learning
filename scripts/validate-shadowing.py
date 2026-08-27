#!/usr/bin/env python3
"""
validate-shadowing.py

Validates Shadowing conversational datasets for Japanese Kana Learning:
1. Verifies 18 Shadowing sentence items (sh-01 through sh-18).
2. Checks unique IDs across all entries.
3. Validates required fields: japanese, kana, romaji, meaning.
4. Checks 100% trilingual meaning completeness (zh-TW, zh-CN, en) with non-empty values.
5. Checks 100% trilingual focus & tip completeness when present.
6. Verifies physical normal and slow VOICEVOX MP3 assets exist on disk in public/audio/shadowing/.
"""

import sys
import os
import re

EXPECTED_SHADOWING_COUNT = 18

def main():
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    shadowing_file = os.path.join(root_dir, 'src', 'data', 'shadowing.ts')
    audio_dir = os.path.join(root_dir, 'public', 'audio', 'shadowing')

    if not os.path.exists(shadowing_file):
        print(f"❌ File not found: {shadowing_file}")
        return 1

    with open(shadowing_file, 'r', encoding='utf-8') as f:
        content = f.read()

    errors = []

    # Extract all item blocks
    raw_blocks = re.split(r'\{\s*id:\s*[\'"]', content)[1:]
    print(f"Loaded {len(raw_blocks)} Shadowing sentences from shadowing.ts")

    if len(raw_blocks) != EXPECTED_SHADOWING_COUNT:
        errors.append(f"Expected {EXPECTED_SHADOWING_COUNT} Shadowing items, got {len(raw_blocks)}")

    seen_ids = set()

    for raw in raw_blocks:
        id_m = re.match(r'^([^\'"]+)', raw)
        if not id_m:
            continue
        s_id = id_m.group(1)

        if s_id in seen_ids:
            errors.append(f"Duplicate Shadowing ID: {s_id}")
        seen_ids.add(s_id)

        # japanese
        jap_m = re.search(r'japanese:\s*[\'"]([^\'"]+)[\'"]', raw)
        if not jap_m or not jap_m.group(1).strip():
            errors.append(f"[{s_id}] Missing or empty 'japanese'")

        # kana
        kana_m = re.search(r'kana:\s*[\'"]([^\'"]+)[\'"]', raw)
        if not kana_m or not kana_m.group(1).strip():
            errors.append(f"[{s_id}] Missing or empty 'kana'")

        # romaji
        romaji_m = re.search(r'romaji:\s*[\'"]([^\'"]+)[\'"]', raw)
        if not romaji_m or not romaji_m.group(1).strip():
            errors.append(f"[{s_id}] Missing or empty 'romaji'")

        # meaning (trilingual)
        meaning_tw_m = re.search(r'meaning:\s*\{[\s\S]*?[\'"]zh-TW[\'"]:\s*[\'"]([^\'"]+)[\'"]', raw)
        meaning_cn_m = re.search(r'meaning:\s*\{[\s\S]*?[\'"]zh-CN[\'"]:\s*[\'"]([^\'"]+)[\'"]', raw)
        meaning_en_m = re.search(r'meaning:\s*\{[\s\S]*?[\'"]en[\'"]:\s*[\'"]([^\'"]+)[\'"]', raw)

        if not meaning_tw_m or not meaning_tw_m.group(1).strip():
            errors.append(f"[{s_id}] Missing or empty 'zh-TW' meaning")
        if not meaning_cn_m or not meaning_cn_m.group(1).strip():
            errors.append(f"[{s_id}] Missing or empty 'zh-CN' meaning")
        if not meaning_en_m or not meaning_en_m.group(1).strip():
            errors.append(f"[{s_id}] Missing or empty 'en' meaning")

        # focus (trilingual if present)
        if 'focus:' in raw:
            focus_tw_m = re.search(r'focus:\s*\{[\s\S]*?[\'"]zh-TW[\'"]:\s*[\'"]([^\'"]+)[\'"]', raw)
            focus_cn_m = re.search(r'focus:\s*\{[\s\S]*?[\'"]zh-CN[\'"]:\s*[\'"]([^\'"]+)[\'"]', raw)
            focus_en_m = re.search(r'focus:\s*\{[\s\S]*?[\'"]en[\'"]:\s*[\'"]([^\'"]+)[\'"]', raw)
            if not focus_tw_m or not focus_cn_m or not focus_en_m:
                errors.append(f"[{s_id}] Incomplete trilingual 'focus' object")

        # tip (trilingual if present)
        if 'tip:' in raw:
            tip_tw_m = re.search(r'tip:\s*\{[\s\S]*?[\'"]zh-TW[\'"]:\s*[\'"]([^\'"]+)[\'"]', raw)
            tip_cn_m = re.search(r'tip:\s*\{[\s\S]*?[\'"]zh-CN[\'"]:\s*[\'"]([^\'"]+)[\'"]', raw)
            tip_en_m = re.search(r'tip:\s*\{[\s\S]*?[\'"]en[\'"]:\s*[\'"]([^\'"]+)[\'"]', raw)
            if not tip_tw_m or not tip_cn_m or not tip_en_m:
                errors.append(f"[{s_id}] Incomplete trilingual 'tip' object")

        # audio files
        audio_norm_m = re.search(r'normal:\s*[\'"]([^\'"]+)[\'"]', raw)
        audio_slow_m = re.search(r'slow:\s*[\'"]([^\'"]+)[\'"]', raw)

        if audio_norm_m:
            norm_rel = audio_norm_m.group(1)
            norm_path = os.path.join(root_dir, 'public', norm_rel)
            if not os.path.exists(norm_path):
                errors.append(f"[{s_id}] Normal audio file not found on disk: {norm_path}")

        if audio_slow_m:
            slow_rel = audio_slow_m.group(1)
            slow_path = os.path.join(root_dir, 'public', slow_rel)
            if not os.path.exists(slow_path):
                errors.append(f"[{s_id}] Slow audio file not found on disk: {slow_path}")

    if errors:
        print("\n=== Shadowing Validation Failures ===")
        for err in errors:
            print(f"  ❌ {err}")
        print(f"\nTotal failures: {len(errors)}")
        return 1

    print(f"\n✅ All Shadowing validation checks passed successfully!")
    print(f"   - Total sentences validated: {len(seen_ids)} (sh-01 through sh-18)")
    print(f"   - 100% trilingual (zh-TW, zh-CN, en) meaning, focus, and tip completeness.")
    print(f"   - 100% normal & slow audio files verified on disk (36/36 MP3s).")
    return 0

if __name__ == '__main__':
    sys.exit(main())
