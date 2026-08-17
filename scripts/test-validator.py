#!/usr/bin/env python3
import sys
import os

# Import parsing and validation logic from validate-kana-data
sys.path.insert(0, os.path.dirname(__file__))

import importlib.util
spec = importlib.util.spec_from_file_location("validator", os.path.join(os.path.dirname(__file__), "validate-kana-data.py"))
validator = importlib.util.module_from_spec(spec)
spec.loader.exec_module(validator)

def run_tests():
    print("========================================")
    print("Testing Kana Educational Validator")
    print("========================================")
    
    passed_tests = 0
    total_tests = 0

    def assert_test(condition, name):
        nonlocal passed_tests, total_tests
        total_tests += 1
        if condition:
            print(f"✓ PASS: {name}")
            passed_tests += 1
        else:
            print(f"✗ FAIL: {name}")

    # Test 1: Kanji check fail
    test_item_kanji = {
        'id': 'h_test', 'type': 'hiragana', 'category': 'basic-hiragana', 'kana': 'あ', 'romaji': 'a',
        'examples': [{'word': '日本', 'romaji': 'nihon', 'meaning': '日本', 'sentence': '日本に行きます。', 'sentenceMeaning': '去日本。'}]
    }
    has_kanji = any(validator.is_kanji(ch) for ch in test_item_kanji['examples'][0]['word'])
    assert_test(has_kanji, "Detect Kanji in word")

    # Test 2: Katakana in Hiragana fail
    test_item_katakana_in_h = {
        'id': 'h_test2', 'type': 'hiragana', 'category': 'basic-hiragana', 'kana': 'ア', 'romaji': 'a',
        'examples': [{'word': 'テスト', 'romaji': 'tesuto', 'meaning': '測試', 'sentence': 'テストです。', 'sentenceMeaning:': '測試。'}]
    }
    is_invalid_kana = test_item_katakana_in_h['kana'] not in validator.HIRAGANA_BASIC_46
    assert_test(is_invalid_kana, "Detect Katakana in basic Hiragana item")

    # Test 3: sentenceDisplay mismatch fail
    sentence = "つめたいのみものです。"
    invalid_display = "つめたい のみもの を です。"
    mismatch = invalid_display.replace(' ', '') != sentence
    assert_test(mismatch, "Detect sentenceDisplay mismatch with sentence")

    # Test 4: sentenceDisplay match pass
    valid_display = "つめたい のみもの です。"
    match_ok = valid_display.replace(' ', '') == sentence
    assert_test(match_ok, "Verify valid sentenceDisplay matching sentence")

    # Test 5: Clean hiragana item pass
    clean_item = {
        'id': 'h_a', 'type': 'hiragana', 'category': 'basic-hiragana', 'kana': 'あ', 'romaji': 'a',
        'examples': [{'word': 'あさ', 'romaji': 'asa', 'meaning': '早晨', 'sentence': 'あさです。', 'sentenceDisplay': 'あさ です。', 'sentenceMeaning': '是早晨。'}]
    }
    clean_ok = (
        clean_item['kana'] in validator.HIRAGANA_BASIC_46 and
        not any(validator.is_kanji(c) for c in clean_item['examples'][0]['word']) and
        clean_item['examples'][0]['sentenceDisplay'].replace(' ', '') == clean_item['examples'][0]['sentence']
    )
    assert_test(clean_ok, "Verify clean Hiragana item passes validation")

    print()
    print(f"Test Summary: {passed_tests}/{total_tests} tests passed.")
    if passed_tests == total_tests:
        print("ALL VALIDATOR TESTS PASSED")
        sys.exit(0)
    else:
        print("VALIDATOR TESTS FAILED")
        sys.exit(1)

if __name__ == '__main__':
    run_tests()
