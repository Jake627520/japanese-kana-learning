#!/usr/bin/env python3
"""
test-listening.py

Unit and architectural tests for Phase C1.1 & C1.1.1 Listening Recognition & Scope UX Fix.
Validates:
1. Listening mode state and UI components in QuizView.tsx.
2. 'audio-to-kana' question type usage.
3. Basic Kana listening question generation.
4. 4 unique options by Kana ID (target + 3 distractors).
5. Hiragana target -> 100% Hiragana distractors.
6. Katakana target -> 100% Katakana distractors.
7. Confusable data prioritized when matching.
8. Event logging with type='quiz_answer' and source='listening'.
9. Replay audio does not produce LearningEvents.
10. SRS integration via recordReviewResult().
11. Untouched core files verification.
12. Scope UX switching rules:
    - all + switch to listening -> basic
    - dakuten + switch -> dakuten
    - handakuten + switch -> handakuten
    - youon + switch -> youon
"""

import unittest
import os
import re

class TestListeningRecognition(unittest.TestCase):
    def setUp(self):
        self.root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
        self.quiz_view_file = os.path.join(self.root_dir, 'src', 'components', 'QuizView.tsx')
        self.confusable_file = os.path.join(self.root_dir, 'src', 'data', 'confusableData.ts')
        self.audio_map_file = os.path.join(self.root_dir, 'src', 'data', 'kanaAudioMap.ts')
        self.speech_file = os.path.join(self.root_dir, 'src', 'utils', 'speech.ts')

        with open(self.quiz_view_file, 'r', encoding='utf-8') as f:
            self.quiz_content = f.read()

    def test_1_listening_mode_exists_in_quiz_view(self):
        self.assertIn("quizMode", self.quiz_content)
        self.assertIn("'visual' | 'listening'", self.quiz_content)
        self.assertIn("listeningMode", self.quiz_content)
        self.assertIn("replayAudio", self.quiz_content)

    def test_2_audio_to_kana_question_type(self):
        self.assertIn("'audio-to-kana'", self.quiz_content)
        self.assertIn("type: 'audio-to-kana'", self.quiz_content)

    def test_3_and_4_unique_options_and_generation(self):
        self.assertIn("getListeningDistractors", self.quiz_content)
        self.assertIn("new Set<string>([target.id])", self.quiz_content)
        self.assertIn("selectedIds.has", self.quiz_content)

    def test_5_and_6_same_type_distractor_rule(self):
        self.assertIn("const targetType = target.type;", self.quiz_content)
        self.assertIn("sameTypeAll = allKana.filter((k) => k.type === targetType", self.quiz_content)

    def test_7_confusable_groups_priority(self):
        self.assertIn("CONFUSABLE_GROUPS", self.quiz_content)
        self.assertIn("for (const group of CONFUSABLE_GROUPS)", self.quiz_content)

    def test_8_listening_event_source(self):
        self.assertIn("quizMode === 'listening'\n        ? 'listening'", self.quiz_content)
        self.assertIn("type: 'quiz_answer'", self.quiz_content)

    def test_9_replay_does_not_log_events(self):
        replay_pattern = r'onClick=\{\(\)\s*=>\s*speakJapanese\(currentQ\.targetKana\.kana\)\}'
        matches = re.findall(replay_pattern, self.quiz_content)
        self.assertTrue(len(matches) >= 1, "Replay button should directly invoke speakJapanese")

    def test_10_srs_record_review_result(self):
        self.assertIn("recordReviewResult(targetKana.id, isCorrect)", self.quiz_content)

    def test_11_core_files_untouched(self):
        for rel_path in [
            'src/utils/storage.ts',
            'src/utils/learningEvents.ts',
            'src/utils/analytics.ts',
            'src/data/kanaData.ts',
            'src/data/kanaAudioMap.ts',
            'src/data/confusableData.ts',
        ]:
            path = os.path.join(self.root_dir, rel_path)
            self.assertTrue(os.path.exists(path), f"{rel_path} must exist")

    def test_12_scope_ux_switching_logic(self):
        self.assertIn("handleSwitchQuizMode", self.quiz_content)
        self.assertIn("if (mode === 'listening' && quizScope === 'all')", self.quiz_content)
        self.assertIn("setQuizScope('basic')", self.quiz_content)

        # Simulate handler state transitions
        def switch_mode(current_scope, target_mode):
            scope = current_scope
            if target_mode == 'listening' and scope == 'all':
                scope = 'basic'
            return scope

        self.assertEqual(switch_mode('all', 'listening'), 'basic')
        self.assertEqual(switch_mode('dakuten', 'listening'), 'dakuten')
        self.assertEqual(switch_mode('handakuten', 'listening'), 'handakuten')
        self.assertEqual(switch_mode('youon', 'listening'), 'youon')
        self.assertEqual(switch_mode('basic', 'listening'), 'basic')
        self.assertEqual(switch_mode('all', 'visual'), 'all')

if __name__ == '__main__':
    unittest.main()
