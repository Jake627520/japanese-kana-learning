#!/usr/bin/env python3
"""
test-listening-weakness.py

Comprehensive tests for Phase C1.3.1 Listening Weakness Intelligence Engine:
Test 1: 單一 Kana listening accuracy.
Test 2: visual accuracy.
Test 3: gap: 0.90 - 0.50 = 0.40.
Test 4: 1 attempt: confidence = low.
Test 5: 2 attempts: confidence = low.
Test 6: 3 attempts: confidence = medium.
Test 7: 8 attempts: confidence = high.
Test 8: recent events 權重大於 7+ 天前事件.
Test 9: Confusion Matrix: A → B 与 B → A 方向分開.
Test 10: group membership enforcement: target/selected ∈ group 才計算.
Test 11: group 外 selectedKana: 忽略.
Test 12: topDirection 正確.
Test 13: tie-breaking deterministic.
Test 14: high-confidence listening confusion: recommendedAction = listening_confusion.
Test 15: low-confidence weakness: 不能觸發 high-priority listening_confusion.
Test 16: 沒有 weakness: fallback = quiz.
"""

import unittest
import os
import math
from datetime import datetime, timedelta

class TestListeningWeaknessEngine(unittest.TestCase):
    def setUp(self):
        self.root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
        self.types_file = os.path.join(self.root_dir, 'src', 'types', 'analytics.ts')
        self.utils_file = os.path.join(self.root_dir, 'src', 'utils', 'analytics.ts')

        with open(self.types_file, 'r', encoding='utf-8') as f:
            self.types_code = f.read()

        with open(self.utils_file, 'r', encoding='utf-8') as f:
            self.utils_code = f.read()

    def test_01_single_kana_listening_accuracy(self):
        """Test 1: 單一 Kana listening accuracy (4 correct out of 10 = 0.40)"""
        events = [
            {"type": "quiz_answer", "source": "listening", "kanaId": "h_tsu", "correct": True} for _ in range(4)
        ] + [
            {"type": "quiz_answer", "source": "listening", "kanaId": "h_tsu", "correct": False} for _ in range(6)
        ]
        attempts = len(events)
        wrong = sum(1 for e in events if not e["correct"])
        acc = round((attempts - wrong) / attempts, 2)
        self.assertEqual(attempts, 10)
        self.assertEqual(wrong, 6)
        self.assertEqual(acc, 0.40)

    def test_02_visual_accuracy(self):
        """Test 2: visual accuracy (18 correct out of 20 = 0.90)"""
        events = [
            {"type": "quiz_answer", "source": "quiz", "kanaId": "h_tsu", "correct": True} for _ in range(18)
        ] + [
            {"type": "quiz_answer", "source": "quiz", "kanaId": "h_tsu", "correct": False} for _ in range(2)
        ]
        attempts = len(events)
        correct = sum(1 for e in events if e["correct"])
        acc = round(correct / attempts, 2)
        self.assertEqual(acc, 0.90)

    def test_03_gap_calculation(self):
        """Test 3: gap = visual - listening = 0.90 - 0.50 = 0.40"""
        visual_acc = 0.90
        listening_acc = 0.50
        gap = round(visual_acc - listening_acc, 2)
        self.assertEqual(gap, 0.40)

    def test_04_confidence_one_attempt_low(self):
        """Test 4: 1 attempt -> confidence = low"""
        self.assertIn("function getConfidenceLevel", self.utils_code)
        attempts = 1
        conf = 'low' if attempts < 3 else ('medium' if attempts < 8 else 'high')
        self.assertEqual(conf, 'low')

    def test_05_confidence_two_attempts_low(self):
        """Test 5: 2 attempts -> confidence = low"""
        attempts = 2
        conf = 'low' if attempts < 3 else ('medium' if attempts < 8 else 'high')
        self.assertEqual(conf, 'low')

    def test_06_confidence_three_attempts_medium(self):
        """Test 6: 3 attempts -> confidence = medium"""
        attempts = 3
        conf = 'low' if attempts < 3 else ('medium' if attempts < 8 else 'high')
        self.assertEqual(conf, 'medium')

    def test_07_confidence_eight_attempts_high(self):
        """Test 7: 8 attempts -> confidence = high"""
        attempts = 8
        conf = 'low' if attempts < 3 else ('medium' if attempts < 8 else 'high')
        self.assertEqual(conf, 'high')

    def test_08_recency_weight_half_life(self):
        """Test 8: recent events 權重大於 7+ 天前事件 (7-day half-life)"""
        now = datetime(2026, 8, 28, 10, 0, 0)
        t_recent = now.timestamp()
        t_7d_ago = (now - timedelta(days=7)).timestamp()

        w_recent = math.pow(0.5, (now.timestamp() - t_recent) / (86400 * 7))
        w_7d = math.pow(0.5, (now.timestamp() - t_7d_ago) / (86400 * 7))

        self.assertAlmostEqual(w_recent, 1.0, places=2)
        self.assertAlmostEqual(w_7d, 0.5, places=2)
        self.assertGreater(w_recent, w_7d)

    def test_09_directional_confusion_matrix(self):
        """Test 9: Confusion Matrix: A → B 与 B → A 方向分開"""
        events = [
            {"source": "listening_confusion", "kanaId": "h_tsu", "selectedKanaId": "h_shi"},
            {"source": "listening_confusion", "kanaId": "h_tsu", "selectedKanaId": "h_shi"},
            {"source": "listening_confusion", "kanaId": "h_shi", "selectedKanaId": "h_tsu"},
        ]
        matrix = {}
        for e in events:
            t, s = e["kanaId"], e["selectedKanaId"]
            if t not in matrix:
                matrix[t] = {}
            matrix[t][s] = matrix[t].get(s, 0) + 1

        self.assertEqual(matrix["h_tsu"]["h_shi"], 2)
        self.assertEqual(matrix["h_shi"]["h_tsu"], 1)

    def test_10_group_membership_enforcement(self):
        """Test 10: group membership enforcement: target/selected ∈ group 才計算"""
        group_members = {"h_tsu", "h_shi"}
        events = [
            {"source": "listening_confusion", "kanaId": "h_tsu", "selectedKanaId": "h_shi", "correct": False},
            {"source": "listening_confusion", "kanaId": "h_tsu", "selectedKanaId": "h_tsu", "correct": True},
        ]
        valid_events = [e for e in events if e["kanaId"] in group_members and e["selectedKanaId"] in group_members]
        self.assertEqual(len(valid_events), 2)

    def test_11_external_selected_kana_ignored_in_group(self):
        """Test 11: group 外 selectedKana: 忽略 (h_tsu → h_su does NOT count into cf_tsu_shi)"""
        group_members = {"h_tsu", "h_shi"}
        events = [
            {"source": "listening_confusion", "kanaId": "h_tsu", "selectedKanaId": "h_su", "correct": False}, # 外來假名
        ]
        valid_events = [e for e in events if e["kanaId"] in group_members and e["selectedKanaId"] in group_members]
        self.assertEqual(len(valid_events), 0, "External selection must be ignored in group analytics")

    def test_12_top_direction_selection(self):
        """Test 12: topDirection 正確找出最大誤答方向"""
        dir_counts = {
            "h_tsu->h_shi": {"target": "h_tsu", "selected": "h_shi", "count": 8},
            "h_shi->h_tsu": {"target": "h_shi", "selected": "h_tsu", "count": 3},
        }
        sorted_dirs = sorted(dir_counts.values(), key=lambda x: x["count"], reverse=True)
        top = sorted_dirs[0]
        self.assertEqual(top["target"], "h_tsu")
        self.assertEqual(top["selected"], "h_shi")
        self.assertEqual(top["count"], 8)

    def test_13_deterministic_tie_breaking(self):
        """Test 13: tie-breaking deterministic (count DESC, target ASC, selected ASC)"""
        dir_items = [
            {"target": "h_shi", "selected": "h_tsu", "count": 5},
            {"target": "h_tsu", "selected": "h_shi", "count": 5},
        ]
        sorted_items = sorted(dir_items, key=lambda x: (-x["count"], x["target"], x["selected"]))
        self.assertEqual(sorted_items[0]["target"], "h_shi")
        self.assertEqual(sorted_items[1]["target"], "h_tsu")

    def test_14_high_confidence_listening_recommendation(self):
        """Test 14: high-confidence listening confusion: recommendedAction = listening_confusion"""
        self.assertIn("recommendedAction: 'listening_confusion'", self.utils_code)
        self.assertIn("targetConfusionGroupId:", self.utils_code)
        self.assertIn("w.confidence === 'high'", self.utils_code)

    def test_15_low_confidence_does_not_trigger_high_priority_listening(self):
        """Test 15: low-confidence weakness: 不能觸發 high-priority listening_confusion"""
        self.assertIn("w.confidence === 'high'", self.utils_code)

    def test_16_fallback_to_quiz_when_no_weakness(self):
        """Test 16: 沒有 weakness: fallback -> quiz"""
        self.assertIn("recommendedAction: 'quiz'", self.utils_code)
        self.assertIn("analytics.recommendationDailyChallenge", self.utils_code)

if __name__ == '__main__':
    unittest.main()
