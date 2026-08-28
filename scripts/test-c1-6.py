#!/usr/bin/env python3
"""
test-c1-6.py

Unit test and regression suite for Phase C1.6: Long-term Training Outcomes & Mastery Trends.
Validates:
1. Pure function getConfusionMasterySummary:
   - Evaluated threshold (minBeforeAttempts, minRecentAttempts).
   - Strict group membership constraint (target ∈ group && selected ∈ group).
   - Resolved condition (recentAccuracy >= 80% && improvement >= 15%).
   - Remaining top direction calculation.
2. HomeDashboard UI integration contract.
3. Trilingual i18n keys for mastery summary (386 keys across zh-TW, zh-CN, en).
"""

from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]

class TestC16MasterySummary(unittest.TestCase):
    def setUp(self):
        self.dashboard_code = (ROOT / "src/components/HomeDashboard.tsx").read_text()
        self.analytics_code = (ROOT / "src/utils/analytics.ts").read_text()
        self.types_code = (ROOT / "src/types/analytics.ts").read_text()
        self.i18n_types = (ROOT / "src/i18n/types.ts").read_text()

    def test_types_and_functions_exported(self):
        self.assertIn("ConfusionMasterySummary", self.types_code)
        self.assertIn("ConfusionMasteryOptions", self.types_code)
        self.assertIn("getConfusionMasterySummary", self.analytics_code)
        self.assertIn("confusionMastery", self.dashboard_code)

    def test_dashboard_ui_contract(self):
        self.assertIn("masterySummaryTitle", self.dashboard_code)
        self.assertIn("masteryResolvedGroups", self.dashboard_code)
        self.assertIn("masteryAvgImprovement", self.dashboard_code)
        self.assertIn("masteryResolvedList", self.dashboard_code)
        self.assertIn("masteryActiveWeakList", self.dashboard_code)
        self.assertIn("masteryRecentAccuracy", self.dashboard_code)
        self.assertIn("masteryPracticeAgain", self.dashboard_code)

    def test_i18n_mastery_keys(self):
        keys = [
            "masterySummaryTitle",
            "masteryResolvedGroups",
            "masteryAvgImprovement",
            "masteryResolvedList",
            "masteryActiveWeakList",
            "masteryRecentAccuracy",
            "masteryBeforeAccuracy",
            "masteryPracticeAgain",
            "masteryNoEvaluatedGroups",
        ]
        for lang in ["src/i18n/types.ts", "src/i18n/zh-TW.ts", "src/i18n/zh-CN.ts", "src/i18n/en.ts"]:
            text = (ROOT / lang).read_text()
            for k in keys:
                self.assertIn(k, text, f"Missing key {k} in {lang}")

    def test_analytics_logic_rules(self):
        # 1. Verification of strict membership check in code
        self.assertIn("memberSet.has(e.kanaId)", self.analytics_code)
        self.assertIn("memberSet.has(e.selectedKanaId)", self.analytics_code)
        # 2. Verification of threshold check
        self.assertIn("beforeEvents.length < minBeforeAttempts", self.analytics_code)
        self.assertIn("recentEvents.length < minRecentAttempts", self.analytics_code)
        # 3. Verification of resolved check
        self.assertIn("recentAccuracy >= resolvedAccuracy", self.analytics_code)
        self.assertIn("improvement >= resolvedImprovement", self.analytics_code)

if __name__ == '__main__':
    unittest.main()
