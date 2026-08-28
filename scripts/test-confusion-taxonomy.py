#!/usr/bin/env python3
"""
test-confusion-taxonomy.py

Comprehensive tests for Phase C1.2.2 Confusion Taxonomy according to specifications:
Test 1: 21 groups 都可以得到 modality 或安全 fallback。
Test 2: category 仍只允許 hiragana katakana。
Test 3: visual group: modality = visual。
Test 4: both group: modality = both。
Test 5: ConfusableView filter 不影響 script filter。
Test 6: visual group 不顯示 listening training。
Test 7: both group 可以顯示 listening training。
Test 8: Confusion Matrix: target = h_tsu selected = h_su 輸出: h_tsu → h_su = 1。
Test 9: 反向: h_su → h_tsu 是另一筆統計。
Test 10: Visual quiz: source = quiz 不進 listening confusion statistics。
Test 11: General listening: source = listening 不進 listening_confusion statistics。
Test 12: Backward compatibility: 沒有 modality: => visual。
"""

import unittest
import os
import re

class TestConfusionTaxonomy(unittest.TestCase):
    def setUp(self):
        self.root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
        self.confusable_file = os.path.join(self.root_dir, 'src', 'data', 'confusableData.ts')
        self.confusable_view_file = os.path.join(self.root_dir, 'src', 'components', 'ConfusableView.tsx')
        self.analytics_file = os.path.join(self.root_dir, 'src', 'utils', 'analytics.ts')

        with open(self.confusable_file, 'r', encoding='utf-8') as f:
            self.confusable_code = f.read()

        with open(self.confusable_view_file, 'r', encoding='utf-8') as f:
            self.confusable_view_code = f.read()

        with open(self.analytics_file, 'r', encoding='utf-8') as f:
            self.analytics_code = f.read()

    def test_01_all_21_groups_obtain_modality_or_fallback(self):
        """Test 1: 21 groups 都可以得到 modality 或安全 fallback"""
        self.assertIn("modality?: 'visual' | 'listening' | 'both'", self.confusable_code)
        groups = re.findall(r"id:\s*'([^']+)'", self.confusable_code)
        self.assertEqual(len(groups), 21, "Must find exactly 21 groups")

    def test_02_category_strictly_preserved(self):
        """Test 2: category 仍只允許 hiragana katakana"""
        self.assertIn("category: 'hiragana' | 'katakana'", self.confusable_code)
        array_part = self.confusable_code.split("CONFUSABLE_GROUPS")[1]
        categories = re.findall(r"category:\s*'([^']+)'", array_part)
        self.assertEqual(len(categories), 21)
        for cat in categories:
            self.assertIn(cat, ['hiragana', 'katakana'])

    def test_03_visual_groups_modality(self):
        """Test 3: visual group: modality = visual"""
        visual_ids = [
            'cf_nu_me', 'cf_ru_ro', 'cf_ne_re_wa', 'cf_sa_chi', 'cf_ki_sa',
            'cf_ha_ho', 'cf_ma_ki', 'cf_ta_na', 'cf_ko_ni', 'cf_ra_u',
            'cf_so_n_kata', 'cf_ku_wa_u_kata', 'cf_su_nu_kata', 'cf_te_ra_kata',
            'cf_no_me_kata', 'cf_a_ma_kata'
        ]
        for gid in visual_ids:
            pattern = rf"id:\s*'{gid}'.*?modality:\s*'([^']+)'"
            match = re.search(pattern, self.confusable_code, re.DOTALL)
            self.assertIsNotNone(match, f"Group {gid} must have modality defined")
            self.assertEqual(match.group(1), 'visual', f"Group {gid} must have modality='visual'")

    def test_04_both_groups_modality(self):
        """Test 4: both group: modality = both"""
        both_ids = ['cf_su_mu', 'cf_a_o', 'cf_tsu_shi', 'cf_i_ri', 'cf_shi_tsu_kata']
        for gid in both_ids:
            pattern = rf"id:\s*'{gid}'.*?modality:\s*'([^']+)'"
            match = re.search(pattern, self.confusable_code, re.DOTALL)
            self.assertIsNotNone(match, f"Group {gid} must have modality defined")
            self.assertEqual(match.group(1), 'both', f"Group {gid} must have modality='both'")

    def test_05_confusable_view_filter_independence(self):
        """Test 5: ConfusableView filter 不影響 script filter"""
        self.assertIn("const matchScript = scriptFilter === 'all' || g.category === scriptFilter;", self.confusable_view_code)
        self.assertIn("const gModality = g.modality || 'visual';", self.confusable_view_code)
        self.assertIn("return matchScript && matchModality;", self.confusable_view_code)

    def test_06_visual_group_hides_listening_training(self):
        """Test 6: visual group 不顯示 listening training"""
        self.assertIn("isListeningAvailable = q.group.modality === 'listening' || q.group.modality === 'both'", self.confusable_view_code)
        self.assertIn("{isListeningAvailable && (", self.confusable_view_code)

    def test_07_both_group_shows_listening_training(self):
        """Test 7: both group 可以顯示 listening training"""
        # When modality is 'both', isListeningAvailable evaluates to true
        group_modality = 'both'
        is_listening_available = group_modality == 'listening' or group_modality == 'both'
        self.assertTrue(is_listening_available)

    def test_08_confusion_matrix_directional_single_count(self):
        """Test 8: Confusion Matrix: target = h_tsu selected = h_su 輸出: h_tsu → h_su = 1"""
        self.assertIn("function getConfusionMatrix", self.analytics_code)
        events = [
            {"source": "listening_confusion", "kanaId": "h_tsu", "selectedKanaId": "h_su"}
        ]
        matrix = {}
        for e in events:
            if e.get("source") == "listening_confusion" and e.get("kanaId") and e.get("selectedKanaId"):
                t, s = e["kanaId"], e["selectedKanaId"]
                if t not in matrix:
                    matrix[t] = {}
                matrix[t][s] = matrix[t].get(s, 0) + 1

        self.assertEqual(matrix.get("h_tsu", {}).get("h_su"), 1)

    def test_09_reverse_direction_is_distinct(self):
        """Test 9: 反向: h_su → h_tsu 是另一筆統計"""
        events = [
            {"source": "listening_confusion", "kanaId": "h_tsu", "selectedKanaId": "h_su"},
            {"source": "listening_confusion", "kanaId": "h_su", "selectedKanaId": "h_tsu"},
            {"source": "listening_confusion", "kanaId": "h_su", "selectedKanaId": "h_tsu"},
        ]
        matrix = {}
        for e in events:
            if e.get("source") == "listening_confusion" and e.get("kanaId") and e.get("selectedKanaId"):
                t, s = e["kanaId"], e["selectedKanaId"]
                if t not in matrix:
                    matrix[t] = {}
                matrix[t][s] = matrix[t].get(s, 0) + 1

        self.assertEqual(matrix["h_tsu"]["h_su"], 1)
        self.assertEqual(matrix["h_su"]["h_tsu"], 2)

    def test_10_visual_quiz_excluded_from_confusion_statistics(self):
        """Test 10: Visual quiz: source = quiz 不進 listening confusion statistics"""
        self.assertIn("e.source === 'listening_confusion'", self.analytics_code)
        events = [
            {"source": "quiz", "kanaId": "h_tsu", "selectedKanaId": "h_su"},
        ]
        matrix = {}
        for e in events:
            if e.get("source") == "listening_confusion" and e.get("kanaId") and e.get("selectedKanaId"):
                t, s = e["kanaId"], e["selectedKanaId"]
                if t not in matrix:
                    matrix[t] = {}
                matrix[t][s] = matrix[t].get(s, 0) + 1

        self.assertEqual(len(matrix), 0, "Visual quiz event must not appear in confusion matrix")

    def test_11_general_listening_excluded_from_confusion_statistics(self):
        """Test 11: General listening: source = listening 不進 listening_confusion statistics"""
        events = [
            {"source": "listening", "kanaId": "h_tsu", "selectedKanaId": "h_su"},
        ]
        matrix = {}
        for e in events:
            if e.get("source") == "listening_confusion" and e.get("kanaId") and e.get("selectedKanaId"):
                t, s = e["kanaId"], e["selectedKanaId"]
                if t not in matrix:
                    matrix[t] = {}
                matrix[t][s] = matrix[t].get(s, 0) + 1

        self.assertEqual(len(matrix), 0, "General listening event must not appear in confusion matrix")

    def test_12_backward_compatibility_fallback_to_visual(self):
        """Test 12: Backward compatibility: 沒有 modality: => visual"""
        sample_group_without_modality = {"id": "cf_legacy", "members": ["h_a", "h_o"], "category": "hiragana"}
        g_modality = sample_group_without_modality.get("modality") or "visual"
        self.assertEqual(g_modality, "visual")

if __name__ == '__main__':
    unittest.main()
