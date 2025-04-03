from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from ..models import ExternalEvent, UserStats
from contacts.models import Contact

class UserStatsTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpassword")
        self.stats = UserStats.objects.create(user=self.user, daily_goal=2)
        self.authenticate()
        self.increment_url = reverse("userstats-increment-count")
        self.reset_streak_url = reverse("userstats-reset-and-update-streaks")
        self.set_goal_url = reverse("userstats-set-daily-goal")
    
    def authenticate(self):
        response = self.client.post(reverse("token_obtain_pair"), {"username": "testuser", "password": "testpassword"})
        self.client.cookies = response.cookies
    
    def test_increment_daily_count(self):
        response = self.client.post(self.increment_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.stats.refresh_from_db()
        self.assertEqual(self.stats.current_daily_count, 1)
    
    
    def test_set_invalid_daily_goal(self):
        response = self.client.post(self.set_goal_url, {"daily_goal": -1})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
  
    
    def test_streak_reset_when_goal_not_met(self):
        self.stats.current_daily_count = 1
        self.stats.last_updated = self.stats.last_updated.replace(day=self.stats.last_updated.day - 1)
        self.stats.save()
        response = self.client.post(self.reset_streak_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.stats.refresh_from_db()
        self.assertEqual(self.stats.running_streak_count, 0)

class ExternalEventEdgeCaseTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpassword")
        self.contact = self.create_test_contact("setup_contact", self.user)
        self.create_read_url = reverse("external-event-list-create")
        self.authenticate()
    
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
    
    def test_create_event_missing_fields(self):
        data = {"title": "", "description": ""}
        response = self.client.post(self.create_read_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_retrieve_non_existent_event(self):
        detail_url = reverse("external-event-detail", kwargs={"pk": 999})
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_partial_update_external_event(self):
        event = ExternalEvent.objects.create(title="Test Event", description="Description", contact=self.contact)
        detail_url = reverse("external-event-detail", kwargs={"pk": event.id})
        response = self.client.patch(detail_url, {"title": "Updated Title"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        event.refresh_from_db()
        self.assertEqual(event.title, "Updated Title")
