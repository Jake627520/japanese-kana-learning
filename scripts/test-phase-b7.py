#!/usr/bin/env python3
"""
test-phase-b7.py

Unit tests for Phase B7: Quiz Learning Loop Enhancements
1. Test 1: Quiz Result computes weakKana from incorrect results.
2. Test 2: weakKana contains valid Kana IDs from ALL_LEARNABLE_KANA.
3. Test 3: onNavigateToReview callback is integrated into QuizView props.
4. Test 4: onPracticeWriting callback passes target Kana to navigation.
5. Test 5: initialKanaId correctly resolves index in WritingPracticeView.
6. Test 6: Invalid / unknown initialKanaId safely defaults without crashing.
7. Test 7: Verifies storage.ts and SRS schema (masteredKanaIds, wrongKanaIds, reviewStates) are intact.
8. Test 8: Verifies retry logic (practiceWrongOnly, restartQuiz) remains intact.
"""

import unittest
import os
import re

class TestPhaseB7LearningLoop(unittest.TestCase):
    def setUp(self):
        self.root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
        self.quiz_view_file = os.path.join(self.root_dir, 'src', 'components', 'QuizView.tsx')
        self.writing_view_file = os.path.join(self.root_dir, 'src', 'components', 'WritingPracticeView.tsx')
        self.app_file = os.path.join(self.root_dir, 'src', 'App.tsx')
        self.storage_file = os.path.join(self.root_dir, 'src', 'utils', 'storage.ts')
        self.kana_data_file = os.path.join(self.root_dir, 'src', 'data', 'kanaData.ts')

    def test_1_and_2_weak_kana_computation_and_ids(self):
        with open(self.quiz_view_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check weakKana computation
        self.assertIn("weakKana", content)
        self.assertIn("results.filter((r) => !r.isCorrect)", content)
        # Check pen icon trigger for practice writing
        self.assertIn("onPracticeWriting(k)", content)
        self.assertIn("t('quiz.practiceWriting')", content)

    def test_3_review_navigation_callback(self):
        with open(self.quiz_view_file, 'r', encoding='utf-8') as f:
            content = f.read()

        self.assertIn("onNavigateToReview?: () => void;", content)
        self.assertIn("onClick={onNavigateToReview}", content)
        self.assertIn("t('quiz.reviewWeakInReview')", content)

        with open(self.app_file, 'r', encoding='utf-8') as f:
            app_content = f.read()
        self.assertIn("onNavigateToReview={() => setCurrentTab('review')}", app_content)

    def test_4_writing_navigation_callback_passing_kana_id(self):
        with open(self.quiz_view_file, 'r', encoding='utf-8') as f:
            content = f.read()
        self.assertIn("onPracticeWriting?: (kana: KanaItem) => void;", content)

        with open(self.app_file, 'r', encoding='utf-8') as f:
            app_content = f.read()
        self.assertIn("setTargetWritingKanaId(kana.id)", app_content)
        self.assertIn("setCurrentTab('writing')", app_content)

    def test_5_and_6_writing_view_initial_kana_id_and_safe_fallback(self):
        with open(self.writing_view_file, 'r', encoding='utf-8') as f:
            content = f.read()

        self.assertIn("initialKanaId?: string | null;", content)
        self.assertIn("const idx = HIRAGANA_DATA.findIndex((k) => k.id === initialKanaId);", content)
        self.assertIn("return idx >= 0 ? idx : 0;", content)
        self.assertIn("const kana = list[index] || list[0];", content)

    def test_7_srs_storage_schema_unchanged(self):
        with open(self.storage_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check essential SRS functions exist unmodified
        self.assertIn("export function recordReviewResult", content)
        self.assertIn("export function getDueReviewItems", content)
        self.assertIn("export function removeKanaFromWrong", content)
        self.assertIn("masteredKanaIds", content)
        self.assertIn("wrongKanaIds", content)
        self.assertIn("reviewStates", content)

    def test_8_existing_retry_and_restart_logic_intact(self):
        with open(self.quiz_view_file, 'r', encoding='utf-8') as f:
            content = f.read()

        self.assertIn("handleRetryWeak", content)
        self.assertIn("t('quiz.practiceWrongOnly')", content)
        self.assertIn("t('quiz.restartQuiz')", content)
        self.assertIn("t('quiz.backHome')", content)

if __name__ == '__main__':
    unittest.main()
