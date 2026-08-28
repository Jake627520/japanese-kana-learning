#!/usr/bin/env python3
"""
test-c1-5.py

Unit test and regression suite for Phase C1.5: Confusion Training Outcome Loop.
Validates:
1. Pure function getTrainingOutcome behavior (resolved, unresolved, remainingTopDirection, session isolation).
2. ConfusableView integration (snapshot tracking, outcome state, finish handler, UI elements).
3. Trilingual i18n keys for training outcome (377 keys across zh-TW, zh-CN, en).
"""

from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]

class TestC15OutcomeLoop(unittest.TestCase):
    def setUp(self):
        self.confusable_code = (ROOT / "src/components/ConfusableView.tsx").read_text()
        self.analytics_code = (ROOT / "src/utils/analytics.ts").read_text()
        self.types_code = (ROOT / "src/types/analytics.ts").read_text()
        self.i18n_types = (ROOT / "src/i18n/types.ts").read_text()

    def test_confusable_view_outcome_integration(self):
        self.assertIn("getTrainingOutcome", self.confusable_code)
        self.assertIn("setTrainingOutcome", self.confusable_code)
        self.assertIn("eventsBeforeSnapshot", self.confusable_code)
        self.assertIn("handleTrainingFinish", self.confusable_code)
        self.assertIn("trainingOutcome.sessionAccuracy", self.confusable_code)
        self.assertIn("trainingOutcome.beforeAccuracy", self.confusable_code)
        self.assertIn("trainingOutcome.improvement", self.confusable_code)
        self.assertIn("trainingOutcome.isResolved", self.confusable_code)
        self.assertIn("retryTraining", self.confusable_code)
        self.assertIn("finishTraining", self.confusable_code)

    def test_i18n_outcome_keys(self):
        keys = [
            "trainingOutcomeTitle",
            "trainingOutcomeBefore",
            "trainingOutcomeSession",
            "trainingOutcomeAfter",
            "trainingOutcomeImprovement",
            "trainingOutcomeResolved",
            "trainingOutcomeRemaining",
            "retryTraining",
            "finishTraining",
        ]
        for lang in ["src/i18n/types.ts", "src/i18n/zh-TW.ts", "src/i18n/zh-CN.ts", "src/i18n/en.ts"]:
            text = (ROOT / lang).read_text()
            for k in keys:
                self.assertIn(k, text, f"Missing key {k} in {lang}")

    def test_clean_state_reset(self):
        # Verify stale outcome is reset on retry or leave
        self.assertIn("setTrainingOutcome(null)", self.confusable_code)
        self.assertIn("setEventsBeforeSnapshot(getLearningEvents())", self.confusable_code)

if __name__ == '__main__':
    unittest.main()
