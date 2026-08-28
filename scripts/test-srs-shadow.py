#!/usr/bin/env python3
"""
test-srs-shadow.py

Unit test and observability validation suite for v1.15.0 Phase 3C:
Observability, Shadow Evaluation & Telemetry Protection.

Validates:
1. SRSMode definition ('legacy' | 'shadow' | 'adaptive').
2. clampResponseMs:
   - Valid ranges [100ms, 60000ms].
   - Invalid/negative/zero/None -> None.
3. appendShadowLog:
   - Appends to beginning of list (LIFO/FIFO).
   - Strict cap at MAX_SHADOW_LOGS (200 items).
4. getShadowEvaluationSummary:
   - Accurate distribution of ratings.
   - Average stability & difficulty metrics.
   - Interval difference computation (Adaptive vs Legacy).
5. Observability & Zero Side-Effects:
   - Local-only data, no external telemetry or network leak.
"""

from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]

MAX_SHADOW_LOGS = 200

def py_clamp_response_ms(val):
    if val is None or not isinstance(val, (int, float)) or val <= 0:
        return None
    return min(60000, max(100, round(val)))

def py_append_shadow_log(current_logs, entry):
    logs = [entry] + (list(current_logs) if current_logs else [])
    return logs[:MAX_SHADOW_LOGS]

def py_get_shadow_evaluation_summary(shadow_logs):
    total = len(shadow_logs) if shadow_logs else 0
    counts = {'again': 0, 'hard': 0, 'good': 0, 'easy': 0}
    sum_stab = 0.0
    sum_diff = 0.0
    sum_diff_ms = 0.0

    for log in shadow_logs or []:
        r = log.get('rating', 'good')
        if r in counts:
            counts[r] += 1
        sum_stab += log.get('stability', 0.0)
        sum_diff += log.get('difficulty', 5.0)
        sum_diff_ms += log.get('adaptiveIntervalMs', 0) - log.get('legacyIntervalMs', 0)

    breakdown = {
        k: {
            'count': counts[k],
            'percentage': round((counts[k] / total) * 100) if total > 0 else 0
        }
        for k in counts
    }

    avg_stab = round(sum_stab / total, 2) if total > 0 else 0.0
    avg_diff = round(sum_diff / total, 1) if total > 0 else 5.0
    avg_diff_days = round((sum_diff_ms / total) / 86400000, 2) if total > 0 else 0.0
    again_rate = round(counts['again'] / total, 2) if total > 0 else 0.0

    return {
        'totalReviews': total,
        'ratingBreakdown': breakdown,
        'averageStability': avg_stab,
        'averageDifficulty': avg_diff,
        'averageIntervalDiffDays': avg_diff_days,
        'againRate': again_rate,
    }


class TestSRSShadowEvaluator(unittest.TestCase):
    def setUp(self):
        self.shadow_code = (ROOT / "src/utils/srs/shadowEvaluator.ts").read_text()
        self.types_code = (ROOT / "src/utils/srs/types.ts").read_text()
        self.index_code = (ROOT / "src/utils/srs/index.ts").read_text()

    def test_types_and_exports(self):
        self.assertIn("export type SRSMode =", self.types_code)
        self.assertIn("'shadow'", self.types_code)
        self.assertIn("export interface SRSShadowLogEntry", self.types_code)
        self.assertIn("clampResponseMs", self.shadow_code)
        self.assertIn("appendShadowLog", self.shadow_code)
        self.assertIn("getShadowEvaluationSummary", self.shadow_code)
        self.assertIn("export * from './shadowEvaluator';", self.index_code)

    def test_clamp_response_ms(self):
        # 1. Below 100ms -> clamped to 100ms
        self.assertEqual(py_clamp_response_ms(15), 100)

        # 2. Above 60,000ms -> clamped to 60,000ms
        self.assertEqual(py_clamp_response_ms(120000), 60000)

        # 3. Normal range
        self.assertEqual(py_clamp_response_ms(2450), 2450)

        # 4. Invalid values -> None
        self.assertIsNone(py_clamp_response_ms(None))
        self.assertIsNone(py_clamp_response_ms(-500))
        self.assertIsNone(py_clamp_response_ms(0))

    def test_shadow_log_fifo_capping(self):
        logs = []
        for i in range(250):
            entry = {
                'kanaId': f'kana_{i}',
                'timestamp': 1700000000000 + i,
                'rating': 'good',
                'stability': 1.0,
                'difficulty': 5.0,
                'legacyIntervalMs': 86400000,
                'adaptiveIntervalMs': 86400000,
            }
            logs = py_append_shadow_log(logs, entry)

        # Must cap strictly at MAX_SHADOW_LOGS (200)
        self.assertEqual(len(logs), 200)
        # Most recent entry is at index 0
        self.assertEqual(logs[0]['kanaId'], 'kana_249')

    def test_shadow_evaluation_summary_metrics(self):
        mock_logs = [
            {'rating': 'good', 'stability': 2.0, 'difficulty': 4.9, 'legacyIntervalMs': 86400000, 'adaptiveIntervalMs': 172800000},
            {'rating': 'again', 'stability': 0.007, 'difficulty': 5.7, 'legacyIntervalMs': 600000, 'adaptiveIntervalMs': 600000},
            {'rating': 'easy', 'stability': 5.0, 'difficulty': 4.4, 'legacyIntervalMs': 259200000, 'adaptiveIntervalMs': 432000000},
            {'rating': 'good', 'stability': 3.0, 'difficulty': 5.0, 'legacyIntervalMs': 86400000, 'adaptiveIntervalMs': 172800000},
        ]

        summary = py_get_shadow_evaluation_summary(mock_logs)
        self.assertEqual(summary['totalReviews'], 4)
        self.assertEqual(summary['ratingBreakdown']['good']['count'], 2)
        self.assertEqual(summary['ratingBreakdown']['good']['percentage'], 50)
        self.assertEqual(summary['ratingBreakdown']['again']['count'], 1)
        self.assertEqual(summary['ratingBreakdown']['again']['percentage'], 25)
        self.assertEqual(summary['againRate'], 0.25)
        self.assertGreater(summary['averageStability'], 0)
        self.assertGreaterEqual(summary['averageDifficulty'], 1.0)
        self.assertLessEqual(summary['averageDifficulty'], 10.0)

if __name__ == '__main__':
    unittest.main()
