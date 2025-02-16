from django.test import TestCase
from django.contrib.auth.models import User
from calendarapi.models import Event, Task
from datetime import datetime

class EventModelTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.event = Event.objects.create(
            user=self.user,
            title="Test Event",
            start=datetime(2025, 2, 15, 10, 0),
            end=datetime(2025, 2, 15, 12, 0)
        )

    def test_event_creation(self):
        self.assertEqual(self.event.title, "Test Event")
        self.assertEqual(self.event.user.username, "testuser")


class TaskModelTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.task = Task.objects.create(
            user=self.user,
            title="Test Task",
            date=datetime(2025, 2, 15).date()
        )

    def test_task_creation(self):
        self.assertEqual(self.task.title, "Test Task")
        self.assertEqual(self.task.user.username, "testuser")
