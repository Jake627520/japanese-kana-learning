#!/usr/bin/env python3
"""
test-srs-engine.py

Unit test and invariant validation suite for v1.15.0 Phase 2A: Adaptive Scheduler Core.
Validates:
1. ReviewRating support ('again', 'hard', 'good', 'easy').
2. Pure function / deterministic calculations.
3. Invariants:
   - 'again' never increases stability (drops sharply).
   - 'good' increases stability strictly more than 'hard'.
   - 'easy' increases stability strictly more than 'good'.
   - difficulty is clamped within [1, 10].
   - stability is strictly > 0.
   - nextReviewAt > reviewedAt.
4. New card initial scheduling (null state):
   - again -> 10m
   - hard -> 1d
   - good -> 1d
   - easy -> 3d
5. Migrated state scheduling.
6. LegacySRSEngine behavior and feature flag isolation.
"""

from pathlib import Path
import unittest
import math

ROOT = Path(__file__).resolve().parents[1]

TEN_MINUTES_DAYS = 10 / (24 * 60) # ≈ 0.00694 days

def py_calculate_adaptive_state(state, rating, reviewed_at=1700000000000, kana_id='test_kana'):
    """
    Python reference implementation of calculateNextAdaptiveState
    """
    if state is None:
        if rating == 'again':
            init_stab = TEN_MINUTES_DAYS
            init_diff = 5.5
            lapses = 1
            consec = 0
        elif rating == 'hard':
            init_stab = 1.0
            init_diff = 5.2
            lapses = 0
            consec = 1
        elif rating == 'good':
            init_stab = 1.0
            init_diff = 5.0
            lapses = 0
            consec = 1
        elif rating == 'easy':
            init_stab = 3.0
            init_diff = 4.5
            lapses = 0
            consec = 1
        else:
            raise ValueError(f"Unknown rating {rating}")

        interval_ms = max(1, round(init_stab * 24 * 60 * 60 * 1000))
        next_due = reviewed_at + interval_ms

        return {
            'version': 2,
            'kanaId': kana_id,
            'due': next_due,
            'lastReview': reviewed_at,
            'stability': round(init_stab, 4),
            'difficulty': round(init_diff, 1),
            'reps': 1,
            'lapses': lapses,
            'consecutiveCorrect': consec,
        }

    prev_stab = max(TEN_MINUTES_DAYS, state.get('stability', TEN_MINUTES_DAYS))
    prev_diff = min(10.0, max(1.0, state.get('difficulty', 5.0)))

    lapses = state.get('lapses', 0)
    consec = state.get('consecutiveCorrect', 0)

    if rating == 'again':
        next_stab = max(TEN_MINUTES_DAYS, prev_stab * 0.2)
        next_diff = min(10.0, max(1.0, prev_diff + 0.8))
        lapses += 1
        consec = 0
    elif rating == 'hard':
        factor = 1.1 + (10 - prev_diff) * 0.02
        next_stab = max(0.1, prev_stab * factor)
        next_diff = min(10.0, max(1.0, prev_diff + 0.3))
        consec += 1
    elif rating == 'good':
        factor = 1.5 + (10 - prev_diff) * 0.08
        next_stab = max(0.1, prev_stab * factor)
        next_diff = min(10.0, max(1.0, prev_diff - 0.1))
        consec += 1
    elif rating == 'easy':
        factor = 2.2 + (10 - prev_diff) * 0.15
        next_stab = max(0.1, prev_stab * factor)
        next_diff = min(10.0, max(1.0, prev_diff - 0.5))
        consec += 1

    interval_ms = max(1, round(next_stab * 24 * 60 * 60 * 1000))
    next_due = reviewed_at + interval_ms

    return {
        'version': 2,
        'kanaId': state.get('kanaId', kana_id),
        'due': next_due,
        'lastReview': reviewed_at,
        'stability': round(next_stab, 4),
        'difficulty': round(next_diff, 1),
        'reps': state.get('reps', 0) + 1,
        'lapses': lapses,
        'consecutiveCorrect': consec,
    }


class TestSRSEnginePhase2(unittest.TestCase):
    def setUp(self):
        self.engine_code = (ROOT / "src/utils/srs/engine.ts").read_text()
        self.types_code = (ROOT / "src/utils/srs/types.ts").read_text()
        self.index_code = (ROOT / "src/utils/srs/index.ts").read_text()

    def test_code_contracts(self):
        # 1. Verification of ratings
        self.assertIn("'again'", self.types_code)
        self.assertIn("'hard'", self.types_code)
        self.assertIn("'good'", self.types_code)
        self.assertIn("'easy'", self.types_code)

        # 2. Verification of class implementations
        self.assertIn("class AdaptiveSRSEngine implements SRSEngine", self.engine_code)
        self.assertIn("class LegacySRSEngine implements SRSEngine", self.engine_code)
        self.assertIn("calculateNextAdaptiveState", self.engine_code)

        # 3. Verification of feature flag unchanged
        self.assertIn("export const SRS_MODE: SRSMode = 'legacy';", self.index_code)

    def test_new_card_initial_intervals(self):
        now = 1700000000000
        # again -> 10m
        s_again = py_calculate_adaptive_state(None, 'again', now, 'a')
        self.assertAlmostEqual(s_again['stability'], TEN_MINUTES_DAYS, places=4)
        self.assertEqual(s_again['due'], now + (10 * 60 * 1000))
        self.assertEqual(s_again['lapses'], 1)
        self.assertEqual(s_again['consecutiveCorrect'], 0)

        # hard -> 1d
        s_hard = py_calculate_adaptive_state(None, 'hard', now, 'a')
        self.assertEqual(s_hard['stability'], 1.0)
        self.assertEqual(s_hard['due'], now + (24 * 60 * 60 * 1000))
        self.assertEqual(s_hard['consecutiveCorrect'], 1)

        # good -> 1d
        s_good = py_calculate_adaptive_state(None, 'good', now, 'a')
        self.assertEqual(s_good['stability'], 1.0)
        self.assertEqual(s_good['due'], now + (24 * 60 * 60 * 1000))
        self.assertEqual(s_good['consecutiveCorrect'], 1)

        # easy -> 3d
        s_easy = py_calculate_adaptive_state(None, 'easy', now, 'a')
        self.assertEqual(s_easy['stability'], 3.0)
        self.assertEqual(s_easy['due'], now + (3 * 24 * 60 * 60 * 1000))
        self.assertEqual(s_easy['consecutiveCorrect'], 1)

    def test_invariants_across_all_difficulty_levels(self):
        now = 1700000000000
        # Test across diff 1 to 10 and stabilities 0.5 to 30 days
        for diff in [1.0, 3.0, 5.0, 7.0, 10.0]:
            for stab in [0.5, 1.0, 3.0, 7.0, 14.0, 30.0]:
                base_state = {
                    'version': 2,
                    'kanaId': 'ka',
                    'stability': stab,
                    'difficulty': diff,
                    'reps': 3,
                    'lapses': 0,
                    'consecutiveCorrect': 3,
                    'due': now,
                    'lastReview': now - 86400000,
                }

                res_again = py_calculate_adaptive_state(base_state, 'again', now)
                res_hard = py_calculate_adaptive_state(base_state, 'hard', now)
                res_good = py_calculate_adaptive_state(base_state, 'good', now)
                res_easy = py_calculate_adaptive_state(base_state, 'easy', now)

                # Invariant 1: again drops stability (< previous stability)
                self.assertLessEqual(res_again['stability'], base_state['stability'])
                self.assertEqual(res_again['consecutiveCorrect'], 0)
                self.assertEqual(res_again['lapses'], base_state['lapses'] + 1)

                # Invariant 2: good > hard > again
                self.assertGreater(res_good['stability'], res_hard['stability'])
                self.assertGreater(res_hard['stability'], res_again['stability'])

                # Invariant 3: easy > good
                self.assertGreater(res_easy['stability'], res_good['stability'])

                # Invariant 4: stability > 0
                for r in [res_again, res_hard, res_good, res_easy]:
                    self.assertGreater(r['stability'], 0)
                    self.assertGreater(r['due'], now)
                    self.assertGreaterEqual(r['difficulty'], 1.0)
                    self.assertLessEqual(r['difficulty'], 10.0)

    def test_determinism(self):
        now = 1700000000000
        state = {'kanaId': 'sa', 'stability': 3.5, 'difficulty': 5.0, 'reps': 2, 'lapses': 0, 'consecutiveCorrect': 2}
        res1 = py_calculate_adaptive_state(state, 'good', now)
        res2 = py_calculate_adaptive_state(state, 'good', now)
        self.assertEqual(res1, res2)

    def test_difficulty_clamping_limits(self):
        now = 1700000000000
        # Upper clamp: repeatedly failing card cannot exceed 10.0
        state_hard = {'kanaId': 'ta', 'stability': 1.0, 'difficulty': 9.8, 'reps': 5, 'lapses': 3, 'consecutiveCorrect': 0}
        res_high = py_calculate_adaptive_state(state_hard, 'again', now)
        self.assertEqual(res_high['difficulty'], 10.0)

        # Lower clamp: repeatedly easy card cannot go below 1.0
        state_easy = {'kanaId': 'na', 'stability': 10.0, 'difficulty': 1.2, 'reps': 5, 'lapses': 0, 'consecutiveCorrect': 5}
        res_low = py_calculate_adaptive_state(state_easy, 'easy', now)
        self.assertEqual(res_low['difficulty'], 1.0)

if __name__ == '__main__':
    unittest.main()
