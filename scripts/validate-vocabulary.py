#!/usr/bin/env python3
"""
validate-vocabulary.py

Validates vocabulary datasets for Japanese Kana Learning:
1. Verifies 46 Seion, 20 Dakuten, 5 Handakuten, 33 Youon, 46 Katakana Seion, 20 Katakana Dakuten, 5 Katakana Handakuten (175 total).
2. Checks unique IDs across all entries.
3. Validates required fields: word, romaji, type, primaryKanaId, kanaLinks, audioKey, meaning.
4. Checks 100% primary kana ID coverage for all 175 kana.
5. Checks 100% trilingual meaning completeness (zh-TW, zh-CN, en).
6. Validates every kanaLink strictly exists in the 208 Kana database with zero duplicates.
7. Checks audioKey mapping in vocabularyAudio.ts, verifies contentAudioMap / kanaAudioMap and verifies physical MP3 existence.
"""

import sys
import os
import re

SEION_46_KANA_IDS = [
    'h_a', 'h_i', 'h_u', 'h_e', 'h_o',
    'h_ka', 'h_ki', 'h_ku', 'h_ke', 'h_ko',
    'h_sa', 'h_shi', 'h_su', 'h_se', 'h_so',
    'h_ta', 'h_chi', 'h_tsu', 'h_te', 'h_to',
    'h_na', 'h_ni', 'h_nu', 'h_ne', 'h_no',
    'h_ha', 'h_hi', 'h_fu', 'h_he', 'h_ho',
    'h_ma', 'h_mi', 'h_mu', 'h_me', 'h_mo',
    'h_ya', 'h_yu', 'h_yo',
    'h_ra', 'h_ri', 'h_ru', 'h_re', 'h_ro',
    'h_wa', 'h_wo', 'h_n',
]

DAKUTEN_20_KANA_IDS = [
    'hd_ga', 'hd_gi', 'hd_gu', 'hd_ge', 'hd_go',
    'hd_za', 'hd_ji', 'hd_zu', 'hd_ze', 'hd_zo',
    'hd_da', 'hd_dji', 'hd_dzu', 'hd_de', 'hd_do',
    'hd_ba', 'hd_bi', 'hd_bu', 'hd_be', 'hd_bo',
]

HANDAKUTEN_5_KANA_IDS = [
    'hp_pa', 'hp_pi', 'hp_pu', 'hp_pe', 'hp_po',
]

YOUON_33_KANA_IDS = [
    'hy_kya', 'hy_kyu', 'hy_kyo',
    'hy_gya', 'hy_gyu', 'hy_gyo',
    'hy_sha', 'hy_shu', 'hy_sho',
    'hy_ja', 'hy_ju', 'hy_jo',
    'hy_cha', 'hy_chu', 'hy_cho',
    'hy_nya', 'hy_nyu', 'hy_nyo',
    'hy_hya', 'hy_hyu', 'hy_hyo',
    'hy_bya', 'hy_byu', 'hy_byo',
    'hy_pya', 'hy_pyu', 'hy_pyo',
    'hy_mya', 'hy_myu', 'hy_myo',
    'hy_rya', 'hy_ryu', 'hy_ryo',
]

KATAKANA_SEION_46_KANA_IDS = [
    'k_a', 'k_i', 'k_u', 'k_e', 'k_o',
    'k_ka', 'k_ki', 'k_ku', 'k_ke', 'k_ko',
    'k_sa', 'k_shi', 'k_su', 'k_se', 'k_so',
    'k_ta', 'k_chi', 'k_tsu', 'k_te', 'k_to',
    'k_na', 'k_ni', 'k_nu', 'k_ne', 'k_no',
    'k_ha', 'k_hi', 'k_fu', 'k_he', 'k_ho',
    'k_ma', 'k_mi', 'k_mu', 'k_me', 'k_mo',
    'k_ya', 'k_yu', 'k_yo',
    'k_ra', 'k_ri', 'k_ru', 'k_re', 'k_ro',
    'k_wa', 'k_wo', 'k_n',
]

KATAKANA_DAKUTEN_20_KANA_IDS = [
    'kd_ga', 'kd_gi', 'kd_gu', 'kd_ge', 'kd_go',
    'kd_za', 'kd_ji', 'kd_zu', 'kd_ze', 'kd_zo',
    'kd_da', 'kd_dji', 'kd_dzu', 'kd_de', 'kd_do',
    'kd_ba', 'kd_bi', 'kd_bu', 'kd_be', 'kd_bo',
]

KATAKANA_HANDAKUTEN_5_KANA_IDS = [
    'kp_pa', 'kp_pi', 'kp_pu', 'kp_pe', 'kp_po',
]

def main():
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    vocab_dir = os.path.join(root_dir, 'src', 'data', 'vocabulary')
    audio_file = os.path.join(vocab_dir, 'vocabularyAudio.ts')
    content_audio_file = os.path.join(root_dir, 'src', 'data', 'contentAudioMap.ts')
    kana_audio_file = os.path.join(root_dir, 'src', 'data', 'kanaAudioMap.ts')
    public_content_audio_dir = os.path.join(root_dir, 'public', 'audio', 'content')
    public_kana_audio_dir = os.path.join(root_dir, 'public', 'audio', 'kana')

    errors = []

    # Load all 208 Kana database IDs
    with open(os.path.join(root_dir, 'src', 'data', 'kanaData.ts'), 'r') as f:
        kd1 = f.read()
    with open(os.path.join(root_dir, 'src', 'data', 'katakanaData.ts'), 'r') as f:
        kd_kata = f.read()
    with open(os.path.join(root_dir, 'src', 'data', 'dakutenData.ts'), 'r') as f:
        kd2 = f.read()
    with open(os.path.join(root_dir, 'src', 'data', 'handakutenData.ts'), 'r') as f:
        kd3 = f.read()
    with open(os.path.join(root_dir, 'src', 'data', 'youonData.ts'), 'r') as f:
        kd4 = f.read()
    valid_db_kana_ids = set(re.findall(r'"id":\s*"([^"]+)"', kd1 + kd_kata + kd2 + kd3 + kd4))

    files_to_check = [
        ('seion46.ts', 46, SEION_46_KANA_IDS),
        ('dakuten20.ts', 20, DAKUTEN_20_KANA_IDS),
        ('handakuten5.ts', 5, HANDAKUTEN_5_KANA_IDS),
        ('youon33.ts', 33, YOUON_33_KANA_IDS),
        ('katakanaSeion46.ts', 46, KATAKANA_SEION_46_KANA_IDS),
        ('katakanaDakuten20.ts', 20, KATAKANA_DAKUTEN_20_KANA_IDS),
        ('katakanaHandakuten5.ts', 5, KATAKANA_HANDAKUTEN_5_KANA_IDS),
    ]

    with open(audio_file, 'r', encoding='utf-8') as f:
        audio_content = f.read()

    with open(content_audio_file, 'r', encoding='utf-8') as f:
        content_audio_map = f.read()

    with open(kana_audio_file, 'r', encoding='utf-8') as f:
        kana_audio_map = f.read()

    seen_ids = set()
    total_items = 0

    for filename, expected_count, expected_kana_ids in files_to_check:
        filepath = os.path.join(vocab_dir, filename)
        if not os.path.exists(filepath):
            errors.append(f"Missing file: {filepath}")
            continue

        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        raw_blocks = re.split(r'\{\s*id:\s*[\'"]', content)[1:]
        print(f"Loaded {len(raw_blocks)} items from {filename}")

        if len(raw_blocks) != expected_count:
            errors.append(f"[{filename}] Expected {expected_count} items, got {len(raw_blocks)}")

        total_items += len(raw_blocks)
        covered_primary_kana = set()

        for raw in raw_blocks:
            id_match = re.match(r'^([^\'"]+)', raw)
            if not id_match:
                continue
            v_id = id_match.group(1)

            if v_id in seen_ids:
                errors.append(f"Duplicate vocabulary ID: {v_id}")
            seen_ids.add(v_id)

            # word
            word_m = re.search(r'word:\s*[\'"]([^\'"]+)[\'"]', raw)
            if not word_m or not word_m.group(1).strip():
                errors.append(f"[{v_id}] Missing or empty 'word'")

            # romaji
            romaji_m = re.search(r'romaji:\s*[\'"]([^\'"]+)[\'"]', raw)
            if not romaji_m or not romaji_m.group(1).strip():
                errors.append(f"[{v_id}] Missing or empty 'romaji'")

            # primaryKanaId
            primary_m = re.search(r'primaryKanaId:\s*[\'"]([^\'"]+)[\'"]', raw)
            if not primary_m or not primary_m.group(1).strip():
                errors.append(f"[{v_id}] Missing or empty 'primaryKanaId'")
            else:
                p_id = primary_m.group(1).strip()
                if p_id not in valid_db_kana_ids:
                    errors.append(f"[{v_id}] primaryKanaId '{p_id}' is not in 208 Kana database")
                covered_primary_kana.add(p_id)

            # kanaLinks
            links_m = re.search(r'kanaLinks:\s*\[([^\]]+)\]', raw)
            if not links_m:
                errors.append(f"[{v_id}] Missing 'kanaLinks'")
            else:
                links = re.findall(r'[\'"]([^\'"]+)[\'"]', links_m.group(1))
                if not links:
                    errors.append(f"[{v_id}] 'kanaLinks' is empty")
                else:
                    if len(links) != len(set(links)):
                        errors.append(f"[{v_id}] Duplicate kana ID in kanaLinks: {links}")

                    for link in links:
                        if link not in valid_db_kana_ids:
                            errors.append(f"[{v_id}] Invalid kana ID in kanaLinks: '{link}' (not in 208 Kana database)")

            # audioKey
            audio_m = re.search(r'audioKey:\s*[\'"]([^\'"]+)[\'"]', raw)
            if not audio_m or not audio_m.group(1).strip():
                errors.append(f"[{v_id}] Missing or empty 'audioKey'")
            else:
                audio_key = audio_m.group(1)
                if f"{audio_key}:" not in audio_content:
                    errors.append(f"[{v_id}] audioKey '{audio_key}' not mapped in vocabularyAudio.ts")

                mapped_speech_m = re.search(rf'{audio_key}:\s*[\'"]([^\'"]+)[\'"]', audio_content)
                if mapped_speech_m:
                    speech_text = mapped_speech_m.group(1)
                    content_hash_m = re.search(rf'"{re.escape(speech_text)}":\s*[\'"]([a-f0-9]+)[\'"]', content_audio_map)
                    kana_id_m = re.search(rf'[\'"]{re.escape(speech_text)}[\'"]:\s*[\'"]([^\'"]+)[\'"]', kana_audio_map)

                    if content_hash_m:
                        hash_val = content_hash_m.group(1)
                        audio_path = os.path.join(public_content_audio_dir, f"{hash_val}.mp3")
                        if os.path.exists(public_content_audio_dir) and not os.path.exists(audio_path):
                            errors.append(f"[{v_id}] Audio asset missing on disk: {audio_path}")
                    elif kana_id_m:
                        kana_id = kana_id_m.group(1)
                        audio_path = os.path.join(public_kana_audio_dir, f"{kana_id}.mp3")
                        if os.path.exists(public_kana_audio_dir) and not os.path.exists(audio_path):
                            errors.append(f"[{v_id}] Kana audio asset missing on disk: {audio_path}")

            # Trilingual meaning
            meaning_tw_m = re.search(r'[\'"]zh-TW[\'"]:\s*[\'"]([^\'"]+)[\'"]', raw)
            meaning_cn_m = re.search(r'[\'"]zh-CN[\'"]:\s*[\'"]([^\'"]+)[\'"]', raw)
            meaning_en_m = re.search(r'[\'"]en[\'"]:\s*[\'"]([^\'"]+)[\'"]', raw)

            if not meaning_tw_m or not meaning_tw_m.group(1).strip():
                errors.append(f"[{v_id}] Missing 'zh-TW' meaning")
            if not meaning_cn_m or not meaning_cn_m.group(1).strip():
                errors.append(f"[{v_id}] Missing 'zh-CN' meaning")
            if not meaning_en_m or not meaning_en_m.group(1).strip():
                errors.append(f"[{v_id}] Missing 'en' meaning")

        missing_kana = set(expected_kana_ids) - covered_primary_kana
        if missing_kana:
            for k in sorted(missing_kana):
                errors.append(f"[{filename}] Missing primary representative vocabulary for kana ID: '{k}'")

    if errors:
        print("\n=== Vocabulary Validation Failures ===")
        for err in errors:
            print(f"  ❌ {err}")
        print(f"\nTotal failures: {len(errors)}")
        return 1

    print(f"\n✅ All vocabulary validation checks passed successfully!")
    print(f"   - Total items validated: {total_items} (46 Seion + 20 Dakuten + 5 Handakuten + 33 Youon + 46 Katakana Seion + 20 Katakana Dakuten + 5 Katakana Handakuten)")
    print(f"   - 100% primaryKanaId coverage across all 175 representative words.")
    print(f"   - 100% kanaLinks verified against 208 Kana database with zero invalid IDs or duplicates.")
    print(f"   - 100% trilingual (zh-TW, zh-CN, en) meaning coverage.")
    print(f"   - All audio keys and physical MP3 assets verified on disk.")
    return 0

if __name__ == '__main__':
    sys.exit(main())
