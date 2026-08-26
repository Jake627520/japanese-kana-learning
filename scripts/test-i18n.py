#!/usr/bin/env python3
"""
test-i18n.py

Unit tests for i18n validator and resolution logic.
"""

import sys
import os
import unittest

# Add scripts directory to path to import validator
sys.path.insert(0, os.path.dirname(__file__))
from importlib.machinery import SourceFileLoader

validate_i18n = SourceFileLoader("validate_i18n", os.path.join(os.path.dirname(__file__), "validate-i18n.py")).load_module()

class TestI18nValidation(unittest.TestCase):
    def setUp(self):
        self.root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
        self.i18n_dir = os.path.join(self.root_dir, 'src', 'i18n')

    def test_translation_files_exist(self):
        for lang in ['zh-TW.ts', 'zh-CN.ts', 'en.ts', 'types.ts', 'index.ts']:
            path = os.path.join(self.i18n_dir, lang)
            self.assertTrue(os.path.exists(path), f"File {lang} must exist")

    def test_validator_run(self):
        exit_code = validate_i18n.main()
        self.assertEqual(exit_code, 0, "validate-i18n.py should exit with code 0")

    def test_language_storage_key_constant(self):
        index_path = os.path.join(self.i18n_dir, 'index.ts')
        with open(index_path, 'r', encoding='utf-8') as f:
            content = f.read()
        self.assertIn("kana_learning_language", content, "Storage key must be kana_learning_language")

if __name__ == '__main__':
    unittest.main()
