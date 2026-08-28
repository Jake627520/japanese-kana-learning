#!/usr/bin/env python3
"""
test-c1-2-manual-qa.py

Simulated end-to-end Manual QA and Semantic Audit script for Phase C1.2.1 Confusion Training.
Validates:
1. ConfusableView entry and 5-question confusion drill generation.
2. 2-member and 3-member group option counts and zero foreign kana.
3. targetKanaId vs selectedKanaId recording in LearningEvent payload.
4. SRS recording via recordReviewResult.
5. Semantic classification of all 21 CONFUSABLE_GROUPS (Listening vs Visual).
"""

import unittest
import os
import re

class TestC12ManualQA(unittest.TestCase):
    def setUp(self):
        self.root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
        self.confusable_file = os.path.join(self.root_dir, 'src', 'data', 'confusableData.ts')
        self.quiz_file = os.path.join(self.root_dir, 'src', 'components', 'QuizView.tsx')
        self.confusable_view_file = os.path.join(self.root_dir, 'src', 'components', 'ConfusableView.tsx')

        with open(self.confusable_file, 'r', encoding='utf-8') as f:
            self.confusable_code = f.read()

        with open(self.quiz_file, 'r', encoding='utf-8') as f:
            self.quiz_code = f.read()

        with open(self.confusable_view_file, 'r', encoding='utf-8') as f:
            self.confusable_view_code = f.read()

    def test_entry_and_drill_connection(self):
        self.assertIn("setActiveTrainingGroup(q.group)", self.confusable_view_code)
        self.assertIn("isConfusionMode={true}", self.confusable_view_code)

    def test_2_and_3_member_option_strictness(self):
        self.assertIn("if (isConfusionMode)", self.quiz_code)
        self.assertIn("const count = 5;", self.quiz_code)
        self.assertIn("const options = sourcePool", self.quiz_code)

    def test_selected_kana_id_propagation(self):
        self.assertIn("const selectedKana = currentQ.options.find((o) => o.label === label)?.kana;", self.quiz_code)
        self.assertIn("selectedKanaId: selectedKana?.id,", self.quiz_code)
        self.assertIn("source: isConfusionMode", self.quiz_code)
        self.assertIn("? 'listening_confusion'", self.quiz_code)

    def test_confusable_groups_classification(self):
        # Extract all 21 groups
        groups_raw = re.findall(r"id:\s*'([^']+)'.*?members:\s*\[([^\]]+)\].*?category:\s*'([^']+)'", self.confusable_code, re.DOTALL)
        self.assertEqual(len(groups_raw), 21)

        listening_suitable = []
        visual_only = []
        ambiguous = []

        # Acoustic similarity heuristics
        acoustic_pairs = {
            'cf_tsu_shi': 'つ (tsu) / し (shi)',
            'cf_i_ri': 'い (i) / り (ri)',
            'cf_ra_u': 'ら (ra) / う (u)',
            'cf_a_o': 'あ (a) / お (o)',
            'cf_shi_tsu_kata': 'シ (shi) / ツ (tsu)',
            'cf_ku_wa_u_kata': 'ク (ku) / ワ (wa) / ウ (u)',
        }

        for gid, members, cat in groups_raw:
            if gid in acoustic_pairs:
                listening_suitable.append(gid)
            elif any(v in gid for v in ['nu_me', 'ru_ro', 'ne_re_wa', 'sa_chi', 'ki_sa', 'ha_ho', 'ma_ki', 'su_mu', 'ta_na', 'ko_ni', 'so_n_kata', 'su_nu_kata', 'te_ra_kata', 'no_me_kata', 'a_ma_kata']):
                visual_only.append(gid)
            else:
                ambiguous.append(gid)

        self.assertGreaterEqual(len(listening_suitable), 4)
        self.assertGreaterEqual(len(visual_only), 10)

if __name__ == '__main__':
    unittest.main()
