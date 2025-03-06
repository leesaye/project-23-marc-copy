from django.contrib.auth.models import User
from django.urls import reverse
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from calendarapi.models import Event, Task
from calendarapi.serializers import EventSerializer, TaskSerializer
from django.utils import timezone 
from unittest import mock
from unittest.mock import patch
from google.auth.credentials import AnonymousCredentials
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from datetime import timedelta
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


class EventDetailAPITests(BaseTestCase):
    """
    Tests for the Individual Event API endpoints.
    """

    def setUp(self):
        self.create_and_login("testuser", "password123")
        self.event_data = {
            "title": "Meeting",
            "start": datetime.datetime.now(),
            "end": datetime.datetime.now() + datetime.timedelta(hours=1),
            "color": "#123456"
        }
        self.event = Event.objects.create(
            user=self.user,
            title="Initial Event",
            start=datetime.datetime.now(),
            end=datetime.datetime.now() + datetime.timedelta(hours=1),
            color="#FFFFFF"
        )
        self.event_url = reverse("event-detail", kwargs={"pk": self.event.id})

    def test_get_individual_event(self):
        """Test fetching a single event"""
        response = self.client.get(self.event_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], self.event.title)

    def test_update_individual_event(self):
        """Test updating an event"""
        updated_data = {
        "title": "Updated Meeting",
        "color": "#654321",
        "start": timezone.now().isoformat(),  # Use the current time as the start
        "end": (timezone.now() + timezone.timedelta(hours=2)).isoformat(),  # 2 hours later as the end
    }
        response = self.client.put(self.event_url, updated_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.event.refresh_from_db()
        self.assertEqual(self.event.title, "Updated Meeting")
        self.assertEqual(self.event.color, "#654321")

    def test_unauthenticated_user_cannot_update_event(self):
        """Test that an unauthenticated user cannot update an event"""
        self.client.logout()
        updated_data = {"title": "Updated Meeting", "color": "#654321"}
        response = self.client.post(self.event_url, updated_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unauthorized_user_cannot_access_event(self):
        """Test that a user cannot access an event that does not belong to them"""
        another_user = User.objects.create_user(username="anotheruser", password="password123")
        self.client.logout()
        self.client.login(username="anotheruser", password="password123")
        response = self.client.get(self.event_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class EventDeleteAPITests(BaseTestCase):
    """
    Tests for the Event delete API endpoint.
    """

    def setUp(self):
        self.create_and_login("testuser", "password123")
        self.event = Event.objects.create(
            user=self.user,
            title="Event to Delete",
            start=datetime.datetime.now(),
            end=datetime.datetime.now() + datetime.timedelta(hours=1),
            color="#FFFFFF"
        )
        self.delete_event_url = reverse("delete-event", kwargs={"event_id": self.event.id})

    def test_delete_event(self):
        """Test deleting an event"""
        response = self.client.delete(self.delete_event_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Event.objects.count(), 0)

    def test_unauthenticated_user_cannot_delete_event(self):
        """Test that an unauthenticated user cannot delete an event"""
        self.client.logout()
        response = self.client.delete(self.delete_event_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unauthorized_user_cannot_delete_event(self):
        """Test that a user cannot delete an event that does not belong to them"""
        another_user = User.objects.create_user(username="anotheruser", password="password123")
        self.client.logout()
        self.client.login(username="anotheruser", password="password123")
        response = self.client.delete(self.delete_event_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class TaskDetailAPITests(BaseTestCase):
    """
    Tests for the Individual Task API endpoints.
    """

    def setUp(self):
        self.create_and_login("testuser", "password123")
        self.task_data = {
            "title": "Complete Assignment",
            "date": datetime.date.today(),
            "color": "#654321"
        }
        self.task = Task.objects.create(
            user=self.user,
            title="Initial Task",
            date=datetime.date.today(),
            color="#FFFFFF"
        )
        self.task_url = reverse("task-detail", kwargs={"pk": self.task.id})

    def test_get_individual_task(self):
        """Test fetching a single task"""
        response = self.client.get(self.task_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], self.task.title)

    def test_update_individual_task(self):
        """Test updating a task"""
        updated_data = {"title": "Updated Task", "color": "#654321", "date": timezone.now().date().isoformat()}
        response = self.client.put(self.task_url, updated_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.task.refresh_from_db()
        self.assertEqual(self.task.title, "Updated Task")
        self.assertEqual(self.task.color, "#654321")

    def test_unauthenticated_user_cannot_update_task(self):
        """Test that an unauthenticated user cannot update a task"""
        self.client.logout()
        updated_data = {"title": "Updated Task", "color": "#654321"}
        response = self.client.post(self.task_url, updated_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class TaskDeleteAPITests(BaseTestCase):
    """
    Tests for the Task delete API endpoint.
    """

    def setUp(self):
        self.create_and_login("testuser", "password123")
        self.task = Task.objects.create(
            user=self.user,
            title="Task to Delete",
            date=datetime.date.today(),
            color="#FFFFFF"
        )
        self.delete_task_url = reverse("delete-task", kwargs={"task_id": self.task.id})

    def test_delete_task(self):
        """Test deleting a task"""
        response = self.client.delete(self.delete_task_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Task.objects.count(), 0)

    def test_unauthenticated_user_cannot_delete_task(self):
        """Test that an unauthenticated user cannot delete a task"""
        self.client.logout()
        response = self.client.delete(self.delete_task_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unauthorized_user_cannot_delete_task(self):
        """Test that a user cannot delete a task that does not belong to them"""
        another_user = User.objects.create_user(username="anotheruser", password="password123")
        self.client.logout()
        self.client.login(username="anotheruser", password="password123")
        response = self.client.delete(self.delete_task_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)



class SyncGoogleCalendarViewTest(BaseTestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="testuser", password="password")
        self.client.force_authenticate(user=self.user)
        self.sync_url = reverse("sync_google_calendar")  # Adjust based on your URL patterns

    @patch("requests.get")
    def test_sync_google_calendar_success(self, mock_get):
        access_token = "fake_token"
        now = timezone.now()
        past_date = now - timedelta(days=365)
        future_date = now + timedelta(days=365)

        mock_response_past = {
            "items": [
                {"summary": "Past Event", "start": {"dateTime": past_date.isoformat()}, "end": {"dateTime": now.isoformat()}}
            ]
        }
        
        mock_response_future = {
            "items": [
                {"summary": "Future Event", "start": {"dateTime": now.isoformat()}, "end": {"dateTime": future_date.isoformat()}}
            ]
        }

        mock_get.side_effect = [
            MockResponse(mock_response_past, 200),
            MockResponse(mock_response_future, 200)
        ]

        response = self.client.post(self.sync_url, {"access_token": access_token})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Event.objects.count(), 2)
        self.assertIn("Past Event", [event.title for event in Event.objects.all()])
        self.assertIn("Future Event", [event.title for event in Event.objects.all()])
        
    def test_sync_google_calendar_no_token(self):
        response = self.client.post(self.sync_url, {}) 
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"], "No access token provided")
        
class MockResponse:
    def __init__(self, json_data, status_code):
        self.json_data = json_data
        self.status_code = status_code

    def json(self):
        return self.json_data