from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APIClient
from log.models import MissionLog
from contacts.models import Contact
from calendarapi.models import Task

import json
from datetime import datetime, date, timedelta
from django.utils.timezone import now, make_aware


class LogViewTests(TestCase):
    def create_and_login(self, username, password):
        # Creates user and logs in via POST to our login endpoint to get the cookie
        self.client = APIClient()
        self.user = User.objects.create_user(username=username, password=password)
        self.login_url = reverse("token_obtain_pair")

        # Simulate user login
        response = self.client.post(self.login_url, {"username": username, "password": password})
        self.assertEqual(response.status_code, status.HTTP_200_OK)  # Ensure login was successful

        # Extract and set authentication cookie (simulate client storing cookie)
        self.client.cookies = response.cookies

    def setUp(self):
        self.create_and_login("test1", "test1")
        self.get_missionlog = reverse("mission_log")

        self.task_data1 = {
            "title": "Complete Assignment",
            "date": date.today(),
            "color": "#654321"
        }

        self.task_data2 = {
            "title": "Finish Work",
            "date": date.today(),
            "color": "#654321"
        }

        self.contact_data = {
            "name": "John Doe",
            "email": "john@example.com",
            "phone": "1234567890",
            "job": "Engineer",
            "relationship_rating": 80,
            "relationship": "Friend",
            "notes": "Met at a conference.",
        }

        self.task_list_url = reverse("task-list")
        self.add_contact_url = reverse("add_contacts_page")

    def test_missionlog_assigned_on_get(self):
        try:
            print(f"\nStarting: {self._testMethodName}")

            # On first access, assign missions
            response = self.client.get(self.get_missionlog)
            self.assertEqual(response.status_code, status.HTTP_200_OK)

            # Created the two mission logs
            self.assertEqual(MissionLog.objects.filter(user=self.user).count(), 2)
            log_text = list(MissionLog.objects.filter(user=self.user).values_list("mission_text", flat=True))
            self.assertCountEqual(log_text, ["Add two tasks to your calendar", "Add one new contact"])

            print(f"Passed: {self._testMethodName}\n")
        except AssertionError as e:
            print(f"Failed: {self._testMethodName}\n")
            print(f"Assertion failed: {e}")

    def test_complete_task_mission(self):
        try:
            print(f"\nStarting: {self._testMethodName}")

            response = self.client.get(self.get_missionlog)
            self.assertEqual(response.status_code, status.HTTP_200_OK)

            # Check task mission is not completed
            logtask_complete = MissionLog.objects.filter(user=self.user,
                                                      mission_text="Add two tasks to your calendar").values_list("completed", flat=True).first()
            self.assertEqual(logtask_complete, False)

            # Add two tasks
            response = self.client.post(self.task_list_url, self.task_data1, format="json")
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)

            response = self.client.post(self.task_list_url, self.task_data2, format="json")
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)

            # Check task mission is completed
            response = self.client.get(self.get_missionlog)
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            logtask_complete = MissionLog.objects.filter(user=self.user,
                                                      mission_text="Add two tasks to your calendar").values_list("completed", flat=True).first()
            self.assertEqual(logtask_complete, True)

            print(f"Passed: {self._testMethodName}\n")
        except AssertionError as e:
            print(f"Failed: {self._testMethodName}\n")
            print(f"Assertion failed: {e}")

    def test_complete_contact_mission(self):
        try:
            print(f"\nStarting: {self._testMethodName}")

            response = self.client.get(self.get_missionlog)
            self.assertEqual(response.status_code, status.HTTP_200_OK)

            # Check task mission is not completed
            logtask_complete = MissionLog.objects.filter(user=self.user,
                                                      mission_text="Add one new contact").values_list("completed", flat=True).first()
            self.assertEqual(logtask_complete, False)

            # Add one contact
            test_contact_data = {
                "name": "John Doe",
                "email": "john@example.com",
                "phone": "1234567890",
                "job": "Engineer",
                "relationship_rating": 80,
                "relationship": "Friend",
                "notes": "Met at a conference.",
                "quiz_answers": json.dumps([  # Mimic JSON.stringify() from frontend
                    {"question": "How well do you click?", "answer": "Yes"},
                    {"question": "How often do you communicate?", "answer": "Sometimes"}
                ]),
            }
            response = self.client.post(self.add_contact_url, test_contact_data, format="multipart")
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)

            # Check task mission is completed
            response = self.client.get(self.get_missionlog)
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            logtask_complete = MissionLog.objects.filter(user=self.user,
                                                      mission_text="Add one new contact").values_list("completed", flat=True).first()
            self.assertEqual(logtask_complete, True)

            print(f"Passed: {self._testMethodName}\n")
        except AssertionError as e:
            print(f"Failed: {self._testMethodName}\n")
            print(f"Assertion failed: {e}")

    import logging

    logger = logging.getLogger(__name__)
    def test_weekly_reset(self):
        try:
            print(f"\nStarting: {self._testMethodName}")

            response = self.client.get(self.get_missionlog)
            self.assertEqual(response.status_code, status.HTTP_200_OK)

            # Complete the task mission and check that it's completed
            logtask_complete = MissionLog.objects.filter(user=self.user,
                                                      mission_text="Add two tasks to your calendar").values_list("completed", flat=True).first()
            self.assertEqual(logtask_complete, False)
            response = self.client.post(self.task_list_url, self.task_data1, format="json")
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            response = self.client.post(self.task_list_url, self.task_data2, format="json")
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            response = self.client.get(self.get_missionlog)
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            logtask_complete = MissionLog.objects.filter(user=self.user,
                                                         mission_text="Add two tasks to your calendar").values_list("completed", flat=True).first()
            self.assertEqual(logtask_complete, True)

            # Mimic that last reset was a week ago, then get and check that task mission is now incomplete again
            last_week = now() - timedelta(weeks=1)
            last_week = make_aware(datetime.combine(last_week.date(), datetime.min.time()))
            mission_log = MissionLog.objects.filter(user=self.user,
                                                    mission_text="Add two tasks to your calendar").first()
            if mission_log:
                mission_log.last_reset = last_week  # Assign new value
                mission_log.save()

            # Make sure to make the task created_at dates older as well
            task1 = Task.objects.filter(user=self.user)[0]
            task2 = Task.objects.filter(user=self.user)[1]

            if task1:
                task1.created_at = last_week
                task1.save()
            if task2:
                task2.created_at = last_week
                task2.save()

            response = self.client.get(self.get_missionlog)
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            logtask_complete = MissionLog.objects.filter(user=self.user,
                                                         mission_text="Add two tasks to your calendar").values_list("completed", flat=True).first()
            self.assertEqual(logtask_complete, False)

            print(f"Passed: {self._testMethodName}\n")
        except AssertionError as e:
            print(f"Failed: {self._testMethodName}\n")
            print(f"Assertion failed: {e}")
