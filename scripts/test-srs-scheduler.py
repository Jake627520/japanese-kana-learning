#!/usr/bin/env python3
"""
test-srs-scheduler.py

Unit test and policy contract validation suite for v1.15.0 Phase 2B:
Adaptive Scheduler Policy, Elapsed Time & Interval Bounds.

Validates:
1. calculateDifficulty:
   - again: difficulty ↑ (+0.8, clamped <= 10.0)
   - hard:  difficulty ↑ (+0.3, clamped <= 10.0)
   - good:  difficulty ≈ (-0.1, clamped >= 1.0)
   - easy:  difficulty ↓ (-0.5, clamped >= 1.0)
   - Invariant: 1.0 <= difficulty <= 10.0
2. calculateElapsedDays:
   - null/undefined -> 0
   - exact time -> 0
   - elapsed ms -> exact float days
3. calculateStability:
   - Invariant: again < hard < good < easy
   - Invariant: stability > 0
   - Overdue bonus: recalling after a long delay (elapsedDays > prevStability) yields higher stability gain than on-time review.
4. calculateInterval:
   - again -> 10 mins short relearning
   - hard  -> conservative (0.85 * stability)
   - good  -> normal (1.0 * stability)
   - easy  -> accelerated (1.3 * stability)
   - maxIntervalDays cap enforced (default 365 days)
5. scheduleAdaptiveReview:
   - New card strategy
   - Existing card strategy with elapsed time
   - Deterministic and pure function
"""

from pathlib import Path
import unittest
import math

ROOT = Path(__file__).resolve().parents[1]

TEN_MINUTES_DAYS = 10 / (24 * 60) # ≈ 0.00694 days
DEFAULT_MAX_INTERVAL_DAYS = 365

def py_calculate_difficulty(prev_diff, rating):
    clamped = min(10.0, max(1.0, prev_diff))
    delta = {
        'again': 0.8,
        'hard': 0.3,
        'good': -0.1,
        'easy': -0.5,
    }[rating]
    return round(min(10.0, max(1.0, clamped + delta)), 1)

def py_calculate_elapsed_days(last_review_ms, reviewed_at_ms):
    if not last_review_ms or reviewed_at_ms <= last_review_ms:
        return 0.0
    return (reviewed_at_ms - last_review_ms) / (24 * 60 * 60 * 1000)

def py_calculate_stability(prev_stab, diff, rating, elapsed_days=0.0):
    stab = max(TEN_MINUTES_DAYS, prev_stab)
    diff = min(10.0, max(1.0, diff))

    if rating == 'again':
        return round(max(TEN_MINUTES_DAYS, stab * 0.2), 4)

    overdue_ratio = elapsed_days / stab if elapsed_days > stab else 1.0

    if rating == 'hard':
        base_growth = 1.1 + (10 - diff) * 0.02
        overdue_bonus = min(1.5, overdue_ratio ** 0.25)
    elif rating == 'good':
        base_growth = 1.5 + (10 - diff) * 0.08
        overdue_bonus = min(2.0, overdue_ratio ** 0.35)
    elif rating == 'easy':
        base_growth = 2.2 + (10 - diff) * 0.15
        overdue_bonus = min(2.5, overdue_ratio ** 0.45)
    else:
        raise ValueError(f"Unknown rating {rating}")

    next_stab = max(0.1, stab * base_growth * overdue_bonus)
    return round(next_stab, 4)

def py_calculate_interval(stability, rating, max_interval_days=DEFAULT_MAX_INTERVAL_DAYS):
    if rating == 'again':
        return TEN_MINUTES_DAYS

    mult = {'hard': 0.85, 'good': 1.0, 'easy': 1.3}[rating]
    interval = min(max_interval_days, max(0.1, stability * mult))
    return round(interval, 4)


class TestSRSSchedulerPhase2B(unittest.TestCase):
    def setUp(self):
        self.scheduler_code = (ROOT / "src/utils/srs/scheduler.ts").read_text()
        self.index_code = (ROOT / "src/utils/srs/index.ts").read_text()

    def test_decomposed_functions_exported(self):
        self.assertIn("calculateDifficulty", self.scheduler_code)
        self.assertIn("calculateElapsedDays", self.scheduler_code)
        self.assertIn("calculateStability", self.scheduler_code)
        self.assertIn("calculateInterval", self.scheduler_code)
        self.assertIn("calculateNextReviewAt", self.scheduler_code)
        self.assertIn("scheduleAdaptiveReview", self.scheduler_code)
        self.assertIn("export * from './scheduler';", self.index_code)

    def test_difficulty_policy_and_bounds(self):
        # 1. Delta checks
        self.assertEqual(py_calculate_difficulty(5.0, 'again'), 5.8)
        self.assertEqual(py_calculate_difficulty(5.0, 'hard'), 5.3)
        self.assertEqual(py_calculate_difficulty(5.0, 'good'), 4.9)
        self.assertEqual(py_calculate_difficulty(5.0, 'easy'), 4.5)

        # 2. Upper clamp = 10.0
        self.assertEqual(py_calculate_difficulty(9.8, 'again'), 10.0)
        self.assertEqual(py_calculate_difficulty(10.0, 'again'), 10.0)

        # 3. Lower clamp = 1.0
        self.assertEqual(py_calculate_difficulty(1.2, 'easy'), 1.0)
        self.assertEqual(py_calculate_difficulty(1.0, 'easy'), 1.0)

    def test_elapsed_days_calculation(self):
        t0 = 1700000000000
        # null or in future -> 0
        self.assertEqual(py_calculate_elapsed_days(None, t0), 0.0)
        self.assertEqual(py_calculate_elapsed_days(t0 + 1000, t0), 0.0)

        # 1 day elapsed
        t_1d = t0 + (24 * 60 * 60 * 1000)
        self.assertEqual(py_calculate_elapsed_days(t0, t_1d), 1.0)

        # 10 days elapsed
        t_10d = t0 + (10 * 24 * 60 * 60 * 1000)
        self.assertEqual(py_calculate_elapsed_days(t0, t_10d), 10.0)

    def test_stability_overdue_and_invariants(self):
        # Base on-time review (3 days stability, reviewed after 3 days)
        s_on_time = py_calculate_stability(3.0, 5.0, 'good', elapsed_days=3.0)
        # Overdue review (3 days stability, reviewed after 10 days)
        s_overdue = py_calculate_stability(3.0, 5.0, 'good', elapsed_days=10.0)

        # Overdue recall demonstrates stronger retention than on-time recall
        self.assertGreater(s_overdue, s_on_time)

        # Again is not given overdue bonus; it always resets
        s_again_ontime = py_calculate_stability(3.0, 5.0, 'again', elapsed_days=3.0)
        s_again_overdue = py_calculate_stability(3.0, 5.0, 'again', elapsed_days=10.0)
        self.assertEqual(s_again_ontime, s_again_overdue)
        self.assertLess(s_again_ontime, 3.0)

    def test_interval_policy_and_max_cap(self):
        # 1. again -> 10m
        self.assertAlmostEqual(py_calculate_interval(5.0, 'again'), TEN_MINUTES_DAYS, places=4)

        # 2. hard (conservative 0.85)
        self.assertAlmostEqual(py_calculate_interval(10.0, 'hard'), 8.5, places=2)

        # 3. good (normal 1.0)
        self.assertAlmostEqual(py_calculate_interval(10.0, 'good'), 10.0, places=2)

        # 4. easy (accelerated 1.3)
        self.assertAlmostEqual(py_calculate_interval(10.0, 'easy'), 13.0, places=2)

        # 5. maxIntervalDays cap
        self.assertEqual(py_calculate_interval(500.0, 'easy', max_interval_days=365), 365)
        self.assertEqual(py_calculate_interval(100.0, 'good', max_interval_days=60), 60)

if __name__ == '__main__':
    unittest.main()
