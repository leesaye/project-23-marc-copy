from django.test import TestCase
from django.contrib.auth.models import User
from calendarapi.models import Event, Task
from contacts.models import Contact
from datetime import datetime

class EventModelTests(TestCase):

    def setUp(self):
        # Create a user
        self.user = User.objects.create_user(username="testuser", password="testpass")
        # Create an event with the updated model
        self.event = Event.objects.create(
            user=self.user,
            title="Test Event",
            start=datetime(2025, 2, 15, 10, 0),
            end=datetime(2025, 2, 15, 12, 0),
            color="#FF5733",  # New color field
            source="google"  # New source field
        )

    def test_event_creation(self):
        self.assertEqual(self.event.title, "Test Event")
        self.assertEqual(self.event.user.username, "testuser")
        self.assertEqual(self.event.color, "#FF5733")  # Check if the color field is set correctly
        self.assertEqual(self.event.source, "google")  # Check if the source field is set correctly

    def test_event_str_method(self):
        self.assertEqual(str(self.event), "Test Event")  # Test the __str__ method


class TaskModelTests(TestCase):

    def setUp(self):
        # Create a user
        self.user = User.objects.create_user(username="testuser", password="testpass")
        # Create a contact
        self.contact = Contact.objects.create(name="Test Contact", phone="1234567890", user=self.user)
        # Create a task with the updated model
        self.task = Task.objects.create(
            user=self.user,
            title="Test Task",
            date=datetime(2025, 2, 15).date(),
            color="#14E4B2",  # New color field
            contact=self.contact  # New contact field
        )

    def test_task_creation(self):
        self.assertEqual(self.task.title, "Test Task")
        self.assertEqual(self.task.user.username, "testuser")
        self.assertEqual(self.task.color, "#14E4B2")  # Check if the color field is set correctly
        self.assertEqual(self.task.contact.name, "Test Contact")  # Check if the contact is set correctly

    def test_task_str_method(self):
        self.assertEqual(str(self.task), "Test Task")  # Test the __str__ method
