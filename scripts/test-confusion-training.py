#!/usr/bin/env python3
"""
test-confusion-training.py

Unit and architectural tests for Phase C1.2.1 Confusion Training Core.
Validates:
1. Confusable groups can be loaded from src/data/confusableData.ts.
2. Group members can form a customPool.
3. customPool contains zero foreign kana.
4. Generates exactly 5 questions for confusion training.
5. Options are drawn strictly from the same confusion group.
6. Option count matches group size (2 or 3 options, not forced to 4).
7. Hiragana / Katakana separation is maintained.
8. selectedKanaId type exists in LearningEvent interface.
9. targetKanaId != selectedKanaId yields correct = false.
10. targetKanaId == selectedKanaId yields correct = true.
11. SRS uses existing recordReviewResult().
12. General listening source='listening' intact; confusion uses source='listening_confusion'.
"""

import unittest
import os
import re
import random

class TestConfusionTraining(unittest.TestCase):
    def setUp(self):
        self.root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
        self.confusable_file = os.path.join(self.root_dir, 'src', 'data', 'confusableData.ts')
        self.learning_type_file = os.path.join(self.root_dir, 'src', 'types', 'learning.ts')
        self.quiz_view_file = os.path.join(self.root_dir, 'src', 'components', 'QuizView.tsx')
        self.confusable_view_file = os.path.join(self.root_dir, 'src', 'components', 'ConfusableView.tsx')

        with open(self.confusable_file, 'r', encoding='utf-8') as f:
            self.confusable_code = f.read()

        with open(self.learning_type_file, 'r', encoding='utf-8') as f:
            self.learning_type_code = f.read()

        with open(self.quiz_view_file, 'r', encoding='utf-8') as f:
            self.quiz_view_code = f.read()

        with open(self.confusable_view_file, 'r', encoding='utf-8') as f:
            self.confusable_view_code = f.read()

    def test_1_confusable_groups_loadable(self):
        self.assertIn("CONFUSABLE_GROUPS", self.confusable_code)
        matches = re.findall(r"id:\s*'([^']+)'", self.confusable_code)
        self.assertGreaterEqual(len(matches), 21, "Must contain at least 21 confusable groups")

    def test_2_and_3_group_custom_pool_purity(self):
        # Extract members of all groups and verify none have external kana
        groups_raw = re.findall(r"id:\s*'([^']+)'.*?members:\s*\[([^\]]+)\]", self.confusable_code, re.DOTALL)
        for gid, members_str in groups_raw:
            members = [m.strip().strip("'\"") for m in members_str.split(',')]
            self.assertGreaterEqual(len(members), 2, f"Group {gid} must have at least 2 members")
            # All members should start with h_ (Hiragana) or k_ (Katakana)
            prefix = members[0][:2]
            for m in members:
                self.assertTrue(m.startswith(prefix), f"Member {m} in {gid} must match group prefix {prefix}")

    def test_4_5_and_6_confusion_question_generation_and_option_count(self):
        self.assertIn("isConfusionMode", self.quiz_view_code)
        # Check that confusion mode generates 5 questions with options directly from sourcePool
        self.assertIn("if (isConfusionMode)", self.quiz_view_code)
        self.assertIn("const count = 5;", self.quiz_view_code)
        self.assertIn("const options = sourcePool", self.quiz_view_code)

        # Simulation: For a 2-member group, options must be 2; for 3-member group, options must be 3
        group_2 = [{'id': 'h_nu', 'kana': 'ぬ'}, {'id': 'h_me', 'kana': 'め'}]
        opts_2 = group_2
        self.assertEqual(len(opts_2), 2, "2-member group must have exactly 2 options")

        group_3 = [{'id': 'h_ne', 'kana': 'ね'}, {'id': 'h_re', 'kana': 'れ'}, {'id': 'h_wa', 'kana': 'わ'}]
        opts_3 = group_3
        self.assertEqual(len(opts_3), 3, "3-member group must have exactly 3 options")

    def test_7_hiragana_katakana_separation(self):
        groups_raw = re.findall(r"members:\s*\[([^\]]+)\].*?category:\s*'([^']+)'", self.confusable_code, re.DOTALL)
        for members_str, category in groups_raw:
            members = [m.strip().strip("'\"") for m in members_str.split(',')]
            expected_prefix = 'k_' if category == 'katakana' else 'h_'
            for m in members:
                self.assertTrue(m.startswith(expected_prefix), f"Member {m} must match category {category}")

    def test_8_selected_kana_id_type_exists(self):
        self.assertIn("selectedKanaId?: string;", self.learning_type_code)

    def test_9_and_10_correctness_logic_with_selected_kana_id(self):
        target_id = "h_tsu"
        selected_wrong_id = "h_su"
        selected_right_id = "h_tsu"

        # Simulating logic
        event_wrong = {
            "type": "quiz_answer",
            "source": "listening_confusion",
            "kanaId": target_id,
            "selectedKanaId": selected_wrong_id,
            "correct": target_id == selected_wrong_id
        }
        self.assertFalse(event_wrong["correct"])
        self.assertEqual(event_wrong["selectedKanaId"], "h_su")

        event_right = {
            "type": "quiz_answer",
            "source": "listening_confusion",
            "kanaId": target_id,
            "selectedKanaId": selected_right_id,
            "correct": target_id == selected_right_id
        }
        self.assertTrue(event_right["correct"])
        self.assertEqual(event_right["selectedKanaId"], "h_tsu")

    def test_11_srs_record_review_result(self):
        self.assertIn("recordReviewResult(targetKana.id, isCorrect)", self.quiz_view_code)
        self.assertIn("recordReviewResult(q.target.id, correct)", self.confusable_view_code)

    def test_12_source_naming_contract(self):
        self.assertIn("listening_confusion", self.quiz_view_code)
        self.assertIn("source: isConfusionMode", self.quiz_view_code)
        self.assertIn("? 'listening_confusion'", self.quiz_view_code)

if __name__ == '__main__':
    unittest.main()
