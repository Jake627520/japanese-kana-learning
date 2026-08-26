#!/usr/bin/env python3
"""
validate-i18n.py

Validates i18n translation dictionaries for Japanese Kana Learning:
1. Ensures zh-TW, zh-CN, and en translation files exist.
2. Extracts and parses object keys recursively.
3. Checks 100% key parity (no missing keys, no extra keys).
4. Verifies non-empty string values.
5. Verifies placeholder consistency across languages (e.g., {param}).
"""

import sys
import os
import re

def extract_keys_and_values(file_path):
    if not os.path.exists(file_path):
        print(f"ERROR: File not found: {file_path}")
        return None, None

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove comments
    content = re.sub(r'//.*', '', content)
    content = re.sub(r'/\*[\s\S]*?\*/', '', content)

    # Simple recursive tokenizer / parser for TS object literal
    # We can match key-value pairs accurately
    entries = {} # dot-separated key -> string value

    # We extract object body
    match = re.search(r'export\s+const\s+\w+\s*(?::\s*\w+)?\s*=\s*(\{[\s\S]*\});?', content)
    if not match:
        print(f"ERROR: Could not find exported object in {file_path}")
        return None, None

    raw_obj = match.group(1)

    # Line-based parser tracking nested object stack
    stack = []
    lines = raw_obj.split('\n')
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Object close
        if line.startswith('}') or line.startswith('},'):
            if stack:
                stack.pop()
            continue

        # Nested object start e.g. "nav: {" or "'nav': {"
        obj_start_match = re.match(r'^(?:[\'"]?(\w+)[\'"]?)\s*:\s*\{', line)
        if obj_start_match:
            key_name = obj_start_match.group(1)
            stack.append(key_name)
            continue

        # Key-value pair e.g. "key: 'value'," or "'key': 'value',"
        kv_match = re.match(r'^(?:[\'"]?([\w\-]+)[\'"]?)\s*:\s*[\'"`](.*)[\'"`],?$', line)
        if kv_match:
            key_name = kv_match.group(1)
            val = kv_match.group(2)
            full_key = '.'.join(stack + [key_name])
            entries[full_key] = val

    return entries

def main():
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    i18n_dir = os.path.join(root_dir, 'src', 'i18n')

    locales = {
        'zh-TW': os.path.join(i18n_dir, 'zh-TW.ts'),
        'zh-CN': os.path.join(i18n_dir, 'zh-CN.ts'),
        'en': os.path.join(i18n_dir, 'en.ts'),
    }

    errors = []
    parsed = {}

    for lang, path in locales.items():
        if not os.path.exists(path):
            errors.append(f"Missing locale file for {lang}: {path}")
            continue
        data = extract_keys_and_values(path)
        if data is None:
            errors.append(f"Failed to parse locale file: {path}")
            continue
        parsed[lang] = data

    if errors:
        for err in errors:
            print(f"[FAIL] {err}")
        return 1

    base_lang = 'zh-TW'
    base_keys = set(parsed[base_lang].keys())
    print(f"Loaded {len(base_keys)} translation keys from base locale '{base_lang}'.")

    # Check key parity & empty strings
    for lang, dict_data in parsed.items():
        keys = set(dict_data.keys())
        missing = base_keys - keys
        extra = keys - base_keys

        if missing:
            for k in sorted(missing):
                errors.append(f"[{lang}] Missing key: '{k}'")
        if extra:
            for k in sorted(extra):
                errors.append(f"[{lang}] Extra key not in {base_lang}: '{k}'")

        for k, v in dict_data.items():
            if not v or not v.strip():
                errors.append(f"[{lang}] Empty translation for key: '{k}'")

            # Check placeholders
            if lang != base_lang and k in parsed[base_lang]:
                base_placeholders = set(re.findall(r'\{(\w+)\}', parsed[base_lang][k]))
                lang_placeholders = set(re.findall(r'\{(\w+)\}', v))
                if base_placeholders != lang_placeholders:
                    errors.append(
                        f"[{lang}] Placeholder mismatch for key '{k}': expected {base_placeholders}, got {lang_placeholders}"
                    )

    if errors:
        print("\n=== i18n Validation Failures ===")
        for err in errors:
            print(f"  ❌ {err}")
        print(f"\nTotal failures: {len(errors)}")
        return 1

    print("\n✅ All i18n validation checks passed successfully!")
    print(f"   - Locales validated: {', '.join(locales.keys())}")
    print(f"   - Total keys per locale: {len(base_keys)}")
    print(f"   - 100% key parity, non-empty values, and placeholder matching.")
    return 0

if __name__ == '__main__':
    sys.exit(main())
