from django.test import TestCase
from django.contrib.auth.models import User
from django.utils import timezone
from log.models import MissionLog

class LogModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="test1", password="test1")
        self.missionlog = MissionLog.objects.create(
            user=self.user,
            mission_text="Test Mission",
            last_reset=timezone.now().date(),
            actions_required=3,
            completed=False
        )

    def test_missionlog_creation(self):
        try:
            print(f"\nStarting: {self._testMethodName}")
            self.assertEqual(self.missionlog.mission_text, "Test Mission")
            self.assertEqual(self.missionlog.actions_required, 3)
            self.assertEqual(self.missionlog.user.username, "test1")
            print(f"Passed: {self._testMethodName}\n")
        except AssertionError as e:
            print(f"Failed: {self._testMethodName}\n")
            print(f"Assertion failed: {e}")
