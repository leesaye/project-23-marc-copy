from django.contrib.auth.models import User
from django.urls import reverse
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from calendarapi.models import Event, Task
from calendarapi.serializers import EventSerializer, TaskSerializer
import datetime

class BaseTestCase(TestCase):
    """
    Base test case for handling user authentication with cookies.
    """

    def create_and_login(self, username, password):
        """
        Creates a user and logs them in, storing the authentication cookies.
        """
        self.client = APIClient()
        self.user = User.objects.create_user(username=username, password=password)
        self.login_url = reverse("token_obtain_pair")

        response = self.client.post(self.login_url, {"username": username, "password": password})
        self.assertEqual(response.status_code, status.HTTP_200_OK)  

        self.client.cookies = response.cookies


class EventAPITests(BaseTestCase):
    """
    Tests for the Event API endpoints.
    """

    def setUp(self):
        self.create_and_login("testuser", "password123")
        self.event_data = {
            "title": "Meeting",
            "start": datetime.datetime.now(),
            "end": datetime.datetime.now() + datetime.timedelta(hours=1),
            "color": "#123456"
        }
        self.event_list_url = reverse("event-list")  

    def test_get_events(self):
        """Test fetching all events (authenticated user)"""
        response = self.client.get(self.event_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_event(self):
        """Test creating a new event"""
        response = self.client.post(self.event_list_url, self.event_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Event.objects.count(), 1)
        self.assertEqual(Event.objects.first().title, "Meeting")

    def test_unauthenticated_user_cannot_get_events(self):
        """Test that an unauthenticated user cannot access events"""
        self.client.logout()
        response = self.client.get(self.event_list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class TaskAPITests(BaseTestCase):
    """
    Tests for the Task API endpoints.
    """

    def setUp(self):
        self.create_and_login("testuser", "password123")
        self.task_data = {
            "title": "Complete Assignment",
            "date": datetime.date.today(),
            "color": "#654321"
        }
        self.task_list_url = reverse("task-list")  

    def test_get_tasks(self):
        """Test fetching all tasks (authenticated user)"""
        response = self.client.get(self.task_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_task(self):
        """Test creating a new task"""
        response = self.client.post(self.task_list_url, self.task_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Task.objects.count(), 1)
        self.assertEqual(Task.objects.first().title, "Complete Assignment")

    def test_unauthenticated_user_cannot_get_tasks(self):
        """Test that an unauthenticated user cannot access tasks"""
        self.client.logout()
        response = self.client.get(self.task_list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
