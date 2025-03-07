from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.urls import reverse
from ..models import ExternalEvent
from contacts.models import Contact

class AuthenticationTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpassword")
        self.contact = self.create_test_contact("setup_contact", self.user)
        self.login_url = reverse("token_obtain_pair")
        self.refresh_url = reverse("token_refresh")
        self.logout_url = reverse("logout")
        self.authenticated_url = reverse("is_authenticated")
        self.register_url = reverse("register")
        self.create_read_url = reverse("external-event-list-create")

    def create_test_contact(self, name, user):
        return Contact.objects.create(
            user=user,
            name=name,
            email="alice@example.com",
            phone="123456789",
            job="Engineer",
            relationship_rating=85,
            relationship="Friend",
            notes="Met at a conference."
        )
    def authenticate(self):
        response = self.client.post(self.login_url, {"username": "testuser", "password": "testpassword"})
        self.client.cookies = response.cookies

    def test_create_external_event_authenticated(self):
        self.authenticate()
        data = {"title": "Test Event", "description": "This is a test event", "contact": self.contact.id}
        response = self.client.post(self.create_read_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(ExternalEvent.objects.filter(title="Test Event").exists())

    def test_create_external_event_unauthenticated(self):
        data = {"title": "Test Event", "description": "This is a test event", "contact": self.contact.id}
        response = self.client.post(self.create_read_url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_external_events_authenticated(self):
        self.authenticate()
        ExternalEvent.objects.create(title="Event 1", description="Desc 1", contact=self.contact)
        ExternalEvent.objects.create(title="Event 2", description="Desc 2", contact=self.contact)
        response = self.client.get(self.create_read_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_list_external_events_unauthenticated(self):
        response = self.client.get(self.create_read_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

class ExternalEventDetailTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpassword")
        self.contact = self.create_test_contact("setup_contact", self.user)
        self.event = ExternalEvent.objects.create(title="Existing Event", description="Existing Desc", contact=self.contact)
        self.detail_url = reverse("external-event-detail", kwargs={"pk": self.event.id})

    def create_test_contact(self, name, user):
        return Contact.objects.create(
            user=user,
            name=name,
            email="alice@example.com",
            phone="123456789",
            job="Engineer",
            relationship_rating=85,
            relationship="Friend",
            notes="Met at a conference."
        )

    def authenticate(self):
        response = self.client.post(reverse("token_obtain_pair"), {"username": "testuser", "password": "testpassword"})
        self.client.cookies = response.cookies

    def test_retrieve_external_event_authenticated(self):
        self.authenticate()
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], self.event.title)

    def test_retrieve_external_event_unauthenticated(self):
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_external_event_authenticated(self):
        self.authenticate()
        data = {"title": "Updated Event", "description": "Updated Desc", "contact": self.contact.id}
        response = self.client.put(self.detail_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.event.refresh_from_db()
        self.assertEqual(self.event.title, "Updated Event")

    def test_update_external_event_unauthenticated(self):
        data = {"title": "Updated Event", "description": "Updated Desc"}
        response = self.client.put(self.detail_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_external_event_authenticated(self):
        self.authenticate()
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(ExternalEvent.objects.filter(id=self.event.id).exists())

    def test_delete_external_event_unauthenticated(self):
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
