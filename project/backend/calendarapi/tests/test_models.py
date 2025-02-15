from django.test import TestCase
from calendarapi.models import Event, Task
from django.utils.timezone import now, timedelta

class EventModelTests(TestCase):
    def setUp(self):
        self.event = Event.objects.create(
            title="Meeting",
            start=now(),
            end=now() + timedelta(hours=1),
            color="#ff5733"
        )

    def test_event_creation(self):
        self.assertEqual(self.event.title, "Meeting")
        self.assertEqual(self.event.color, "#ff5733")

class TaskModelTests(TestCase):
    def setUp(self):
        self.task = Task.objects.create(
            title="Submit Report",
            date=now().date(),
            color="#014f86"
        )

    def test_task_creation(self):
        self.assertEqual(self.task.title, "Submit Report")
        self.assertEqual(self.task.color, "#014f86")
