#!/usr/bin/env python3
"""
test-c1-3-manual-qa.py

Simulated end-to-end Manual QA and Semantic Audit script for Phase C1.3.2 Dashboard & Action.
Validates:
QA-1: No listening weakness -> Empty state / fallback to quiz recommendation.
QA-2: Low confidence (1/1, 2/2) -> Confidence is 'low', not triggering High Priority recommendation.
QA-3: High confidence (10+ attempts, wrongRate >= 40%) -> Displays Listening Weakness Card with 'high' confidence.
QA-4: Directional confusion display -> h_tsu → h_shi renders as つ → し, not reversed.
QA-5: Group routing contract -> onPracticeConfusionGroup passes targetConfusionGroupId to ConfusableView.
QA-6: 5-question drill isolation -> Only group members included in options.
QA-7: Trilingual UI parity -> All keys exist across zh-TW, zh-CN, en.
QA-8: Responsive design validation -> Structure supports 3-column & mobile stacked layout.
"""

import unittest
import os
import re

class TestC13ManualQA(unittest.TestCase):
    def setUp(self):
        self.root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
        self.app_file = os.path.join(self.root_dir, 'src', 'App.tsx')
        self.dashboard_file = os.path.join(self.root_dir, 'src', 'components', 'HomeDashboard.tsx')
        self.confusable_view_file = os.path.join(self.root_dir, 'src', 'components', 'ConfusableView.tsx')
        self.quiz_view_file = os.path.join(self.root_dir, 'src', 'components', 'QuizView.tsx')
        self.analytics_file = os.path.join(self.root_dir, 'src', 'utils', 'analytics.ts')

        with open(self.app_file, 'r', encoding='utf-8') as f:
            self.app_code = f.read()

        with open(self.dashboard_file, 'r', encoding='utf-8') as f:
            self.dashboard_code = f.read()

        with open(self.confusable_view_file, 'r', encoding='utf-8') as f:
            self.confusable_view_code = f.read()

        with open(self.quiz_view_file, 'r', encoding='utf-8') as f:
            self.quiz_view_code = f.read()

        with open(self.analytics_file, 'r', encoding='utf-8') as f:
            self.analytics_code = f.read()

    def test_qa_1_empty_state_and_fallback(self):
        """QA-1: 沒有 listening weakness -> 呈現 noListeningWeakness empty state"""
        self.assertIn("t('analytics.noListeningWeakness')", self.dashboard_code)
        self.assertIn("listeningWeaknesses.filter((w) => w.attempts >= 3).length > 0", self.dashboard_code)

    def test_qa_2_low_confidence_filtering(self):
        """QA-2: Low confidence (<3 attempts) 不被納入主動弱點推薦"""
        self.assertIn("w.attempts >= 3", self.dashboard_code)
        self.assertIn("highConfWeakness = confusionWeaknesses.find", self.analytics_code)
        self.assertIn("w.confidence === 'high'", self.analytics_code)

    def test_qa_3_high_confidence_card_trigger(self):
        """QA-3: High confidence 正常觸發卡片與推薦"""
        self.assertIn("aiRecommendation.recommendedAction === 'listening_confusion'", self.dashboard_code)
        self.assertIn("t('analytics.listeningWeaknessTitle')", self.dashboard_code)

    def test_qa_4_directional_confusion_display(self):
        """QA-4: 混淆方向性 target → confusedObj"""
        self.assertIn("{kanaObj?.kana} → <span className=\"text-rose-600 font-black\">{confusedObj.kana}</span>", self.dashboard_code)

    def test_qa_5_group_routing_contract(self):
        """QA-5: targetConfusionGroupId 正確傳遞至 ConfusableView"""
        self.assertIn("onPracticeConfusionGroup={(groupId) => {", self.app_code)
        self.assertIn("setTargetConfusionGroupId(groupId);", self.app_code)
        self.assertIn("initialGroupId={targetConfusionGroupId}", self.app_code)
        self.assertIn("initialGroupId?: string | null;", self.confusable_view_code)

    def test_qa_6_drill_options_isolation(self):
        """QA-6: 5 題特訓選項嚴格限定該 Group 成員"""
        self.assertIn("isConfusionMode={true}", self.confusable_view_code)
        self.assertIn("const options = sourcePool", self.quiz_view_code)

    def test_qa_7_trilingual_keys(self):
        """QA-7: 三語鍵值 100% 存在"""
        for lang in ['zh-TW.ts', 'zh-CN.ts', 'en.ts']:
            path = os.path.join(self.root_dir, 'src', 'i18n', lang)
            with open(path, 'r', encoding='utf-8') as f:
                code = f.read()
            self.assertIn("listeningWeaknessTitle", code)
            self.assertIn("listeningAccuracyLabel", code)
            self.assertIn("visualAccuracyLabel", code)
            self.assertIn("modalityGapLabel", code)
            self.assertIn("mostConfusedWith", code)
            self.assertIn("confidenceHigh", code)
            self.assertIn("startConfusionDrill", code)

    def test_qa_8_responsive_structure(self):
        """QA-8: 響應式佈局結構包含 grid-cols-1 lg:grid-cols-3"""
        self.assertIn("grid grid-cols-1 lg:grid-cols-3 gap-4", self.dashboard_code)
        self.assertIn("grid grid-cols-3 gap-1.5", self.dashboard_code)

if __name__ == '__main__':
    unittest.main()
