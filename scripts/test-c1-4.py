#!/usr/bin/env python3
"""
test-c1-4.py

Unit test and structural regression suite for Phase C1.4:
- Explainable Recommendation Evidence
- Post-Training Outcome Tracking
"""

from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]

class TestC14(unittest.TestCase):
    def setUp(self):
        self.analytics_code = (ROOT / "src/utils/analytics.ts").read_text()
        self.types_code = (ROOT / "src/types/analytics.ts").read_text()
        self.i18n_types = (ROOT / "src/i18n/types.ts").read_text()
        self.dashboard_code = (ROOT / "src/components/HomeDashboard.tsx").read_text()

    def test_types_extended(self):
        self.assertIn("export interface RecommendationEvidence", self.types_code)
        self.assertIn("export interface TrainingOutcome", self.types_code)
        self.assertIn("evidence?: RecommendationEvidence;", self.types_code)

    def test_analytics_pure_functions(self):
        self.assertIn("export function getTrainingOutcome", self.analytics_code)
        self.assertIn("evidence:", self.analytics_code)
        self.assertIn("improvement", self.analytics_code)
        self.assertIn("isResolved", self.analytics_code)

    def test_i18n_contracts(self):
        for lang in ["src/i18n/types.ts", "src/i18n/zh-TW.ts", "src/i18n/zh-CN.ts", "src/i18n/en.ts"]:
            text = (ROOT / lang).read_text()
            self.assertIn("recommendationWhy", text)
            self.assertIn("recommendationEvidenceListening", text)
            self.assertIn("recommendationEvidenceVisual", text)
            self.assertIn("recommendationEvidenceGap", text)
            self.assertIn("trainingOutcomeTitle", text)

    def test_ui_evidence_panel(self):
        self.assertIn("aiRecommendation.evidence", self.dashboard_code)
        self.assertIn("recommendationWhy", self.dashboard_code)

if __name__ == '__main__':
    unittest.main()
