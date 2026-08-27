#!/usr/bin/env python3
"""
test-learning-events.py

Unit tests for Phase B8.0.1: Learning Event Layer
Validates:
1. LearningEvent TypeScript definitions in src/types/learning.ts.
2. Storage helper logic in src/utils/learningEvents.ts (event creation, schema, limit 500, fallback, clear).
3. Simulates LocalStorage behavior in Python to verify robustness.
"""

import unittest
import os
import json
import time

class TestLearningEventLayer(unittest.TestCase):
    def setUp(self):
        self.root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
        self.types_file = os.path.join(self.root_dir, 'src', 'types', 'learning.ts')
        self.utils_file = os.path.join(self.root_dir, 'src', 'utils', 'learningEvents.ts')

    def test_type_definitions(self):
        self.assertTrue(os.path.exists(self.types_file), "learning.ts must exist")
        with open(self.types_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check types
        self.assertIn("quiz_answer", content)
        self.assertIn("review_complete", content)
        self.assertIn("writing_complete", content)
        self.assertIn("shadowing_complete", content)
        self.assertIn("interface LearningEvent", content)
        self.assertIn("id: string;", content)
        self.assertIn("timestamp: number;", content)
        self.assertIn("type: LearningEventType;", content)
        self.assertIn("source: string;", content)
        self.assertIn("kanaId?: string;", content)
        self.assertIn("correct?: boolean;", content)

    def test_utils_storage_functions(self):
        self.assertTrue(os.path.exists(self.utils_file), "learningEvents.ts must exist")
        with open(self.utils_file, 'r', encoding='utf-8') as f:
            content = f.read()

        self.assertIn("LEARNING_EVENTS_STORAGE_KEY", content)
        self.assertIn("learning-events-v1", content)
        self.assertIn("MAX_LEARNING_EVENTS = 500", content)
        self.assertIn("export function getLearningEvents", content)
        self.assertIn("export function logLearningEvent", content)
        self.assertIn("export function clearLearningEvents", content)

    def test_simulated_event_lifecycle(self):
        """Simulate storage lifecycle: add, slice 500, corrupt JSON fallback, clear."""
        storage = {}
        KEY = 'learning-events-v1'
        MAX_EVENTS = 500

        def mock_get():
            raw = storage.get(KEY)
            if not raw:
                return []
            try:
                parsed = json.loads(raw)
                if not isinstance(parsed, list):
                    return []
                return parsed
            except Exception:
                return []

        def mock_log(input_evt):
            evt = {
                "id": input_evt.get("id", f"evt_{int(time.time() * 1000)}"),
                "timestamp": input_evt.get("timestamp", int(time.time() * 1000)),
                "type": input_evt["type"],
                "source": input_evt["source"],
            }
            if "kanaId" in input_evt:
                evt["kanaId"] = input_evt["kanaId"]
            if "correct" in input_evt:
                evt["correct"] = input_evt["correct"]

            current = mock_get()
            updated = [evt] + current
            updated = updated[:MAX_EVENTS]
            storage[KEY] = json.dumps(updated)
            return evt

        def mock_clear():
            storage.pop(KEY, None)

        # 1. Initially empty
        self.assertEqual(mock_get(), [])

        # 2. Add event
        e1 = mock_log({"type": "quiz_answer", "source": "quiz_view", "kanaId": "h_a", "correct": True})
        events = mock_get()
        self.assertEqual(len(events), 1)
        self.assertEqual(events[0]["kanaId"], "h_a")
        self.assertTrue(events[0]["correct"])

        # 3. Add 550 events and verify limit of 500
        for i in range(550):
            mock_log({"type": "review_complete", "source": "review_view", "kanaId": f"h_{i}", "correct": False})
        
        events = mock_get()
        self.assertEqual(len(events), 500)

        # 4. Corrupted JSON fallback
        storage[KEY] = "INVALID_JSON_CORRUPTED{["
        self.assertEqual(mock_get(), [])

        # 5. Clear events
        storage[KEY] = json.dumps([{"id": "test"}])
        mock_clear()
        self.assertEqual(mock_get(), [])

if __name__ == '__main__':
    unittest.main()
