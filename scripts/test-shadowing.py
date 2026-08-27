#!/usr/bin/env python3
"""
test-shadowing.py

Unit tests for Shadowing data layer and validation.
"""

import sys
import os
import unittest
from importlib.machinery import SourceFileLoader

validate_shadowing = SourceFileLoader("validate_shadowing", os.path.join(os.path.dirname(__file__), "validate-shadowing.py")).load_module()

class TestShadowingValidation(unittest.TestCase):
    def setUp(self):
        self.root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
        self.shadowing_file = os.path.join(self.root_dir, 'src', 'data', 'shadowing.ts')

    def test_shadowing_file_exists(self):
        self.assertTrue(os.path.exists(self.shadowing_file), "shadowing.ts must exist")

    def test_validator_run(self):
        exit_code = validate_shadowing.main()
        self.assertEqual(exit_code, 0, "validate-shadowing.py should exit with code 0")

if __name__ == '__main__':
    unittest.main()
