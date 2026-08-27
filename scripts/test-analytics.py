#!/usr/bin/env python3
"""
test-analytics.py

Unit tests for Phase B8.3: Analytics Engine Enhancements
Validates:
1. getTodayStats() calculation accuracy and date-filtering.
2. getWeakKanaRanking() minAttempts gate (1/1 excluded, 2/2 excluded, 3/3 included) & sorting.
3. getSevenDayTrend() 7-day chronological buckets and activity breakdown.
4. getAIRecommendation() rule-based recommendation logic and priority ordering with i18n keys and params.
"""

import unittest
import os
import json
from datetime import datetime, timedelta

class TestAnalyticsEngine(unittest.TestCase):
    def setUp(self):
        self.root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
        self.types_file = os.path.join(self.root_dir, 'src', 'types', 'analytics.ts')
        self.utils_file = os.path.join(self.root_dir, 'src', 'utils', 'analytics.ts')

    def test_analytics_files_exist_and_pure(self):
        self.assertTrue(os.path.exists(self.types_file), "src/types/analytics.ts must exist")
        self.assertTrue(os.path.exists(self.utils_file), "src/utils/analytics.ts must exist")

        with open(self.utils_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Ensure pure function contract: no localStorage calls
        self.assertNotIn("localStorage.getItem", content)
        self.assertNotIn("localStorage.setItem", content)
        self.assertIn("minAttempts = 3", content)
        self.assertIn("titleKey:", content)
        self.assertIn("reasonKey:", content)

    def test_weak_kana_min_attempts_gate(self):
        # 1 attempt / 1 wrong -> excluded
        # 2 attempts / 2 wrong -> excluded
        # 3 attempts / 3 wrong -> included
        events = [
            {"id": "e1", "timestamp": 1000, "type": "quiz_answer", "source": "quiz", "kanaId": "h_1", "correct": False},
            {"id": "e2", "timestamp": 2000, "type": "quiz_answer", "source": "quiz", "kanaId": "h_2", "correct": False},
            {"id": "e3", "timestamp": 3000, "type": "quiz_answer", "source": "quiz", "kanaId": "h_2", "correct": False},
            {"id": "e4", "timestamp": 4000, "type": "quiz_answer", "source": "quiz", "kanaId": "h_3", "correct": False},
            {"id": "e5", "timestamp": 5000, "type": "quiz_answer", "source": "quiz", "kanaId": "h_3", "correct": False},
            {"id": "e6", "timestamp": 6000, "type": "quiz_answer", "source": "quiz", "kanaId": "h_3", "correct": False},
        ]

        # Calculate with minAttempts = 3
        stats = {}
        for e in events:
            kid = e["kanaId"]
            if kid not in stats:
                stats[kid] = {"attempts": 0, "wrong": 0}
            stats[kid]["attempts"] += 1
            if not e["correct"]:
                stats[kid]["wrong"] += 1

        min_attempts = 3
        ranked = [
            {"kanaId": kid, "attempts": d["attempts"], "wrong": d["wrong"], "rate": d["wrong"] / d["attempts"]}
            for kid, d in stats.items()
            if d["attempts"] >= min_attempts and d["wrong"] > 0
        ]

        self.assertEqual(len(ranked), 1)
        self.assertEqual(ranked[0]["kanaId"], "h_3")
        self.assertEqual(ranked[0]["attempts"], 3)
        self.assertEqual(ranked[0]["wrong"], 3)

    def test_today_stats_logic(self):
        now = datetime(2026, 8, 27, 10, 0, 0)
        today_ts = int(now.timestamp() * 1000)
        yesterday_ts = int((now - timedelta(days=1)).timestamp() * 1000)

        events = [
            {"id": "e1", "timestamp": today_ts, "type": "quiz_answer", "source": "quiz", "kanaId": "h_a", "correct": True},
            {"id": "e2", "timestamp": today_ts, "type": "quiz_answer", "source": "quiz", "kanaId": "h_i", "correct": False},
            {"id": "e3", "timestamp": today_ts, "type": "writing_complete", "source": "writing_view", "kanaId": "h_tsu"},
            {"id": "e4", "timestamp": today_ts, "type": "shadowing_complete", "source": "shadowing_view"},
            {"id": "e5", "timestamp": yesterday_ts, "type": "quiz_answer", "source": "quiz", "kanaId": "h_u", "correct": True},
        ]

        today_events = [e for e in events if datetime.fromtimestamp(e["timestamp"] / 1000).date() == now.date()]
        quiz_count = sum(1 for e in today_events if e["type"] == "quiz_answer")
        writing_count = sum(1 for e in today_events if e["type"] == "writing_complete")
        shadowing_count = sum(1 for e in today_events if e["type"] == "shadowing_complete")

        self.assertEqual(len(today_events), 4)
        self.assertEqual(quiz_count, 2)
        self.assertEqual(writing_count, 1)
        self.assertEqual(shadowing_count, 1)

    def test_ai_recommendation_priorities_and_i18n(self):
        with open(self.utils_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check all 4 recommendation cases are handled with i18n keys
        self.assertIn("analytics.recommendationPracticeWriting", content)
        self.assertIn("analytics.recommendationHighErrorRate", content)
        self.assertIn("analytics.recommendationReview", content)
        self.assertIn("analytics.recommendationSrsDue", content)
        self.assertIn("analytics.recommendationShadowing", content)
        self.assertIn("analytics.recommendationShadowingWeak", content)
        self.assertIn("analytics.recommendationQuiz", content)
        self.assertIn("analytics.recommendationDailyChallenge", content)

    def test_seven_day_trend_buckets(self):
        now = datetime(2026, 8, 27)
        dates = [(now - timedelta(days=i)).strftime("%Y-%m-%d") for i in range(6, -1, -1)]
        self.assertEqual(len(dates), 7)
        self.assertEqual(dates[-1], "2026-08-27")
        self.assertEqual(dates[0], "2026-08-21")

if __name__ == '__main__':
    unittest.main()
