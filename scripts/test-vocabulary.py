#!/usr/bin/env python3
"""
test-vocabulary.py

Unit tests for vocabulary data layer and validation.
"""

import sys
import os
import unittest
from importlib.machinery import SourceFileLoader

validate_vocab = SourceFileLoader("validate_vocab", os.path.join(os.path.dirname(__file__), "validate-vocabulary.py")).load_module()

class TestVocabularyValidation(unittest.TestCase):
    def setUp(self):
        self.root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
        self.vocab_dir = os.path.join(self.root_dir, 'src', 'data', 'vocabulary')

    def test_vocabulary_files_exist(self):
        for f in ['vocabularyTypes.ts', 'seion46.ts', 'dakuten20.ts', 'handakuten5.ts', 'youon33.ts', 'vocabularyAudio.ts', 'index.ts']:
            path = os.path.join(self.vocab_dir, f)
            self.assertTrue(os.path.exists(path), f"File {f} must exist in vocabulary directory")

    def test_validator_run(self):
        exit_code = validate_vocab.main()
        self.assertEqual(exit_code, 0, "validate-vocabulary.py should exit with code 0")

if __name__ == '__main__':
    unittest.main()
