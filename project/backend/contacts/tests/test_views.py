import uuid
import json
from django.contrib.auth.models import User
from django.urls import reverse
from django.test import TestCase, Client
from contacts.models import Contact
from rest_framework import status
from rest_framework.test import APIClient


class ContactViewTests(TestCase):
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

    def setUp(self):
        self.create_and_login("test1", "test1")

        self.contact_data = {
            "name": "John Doe",
            "email": "john@example.com",
            "phone": "1234567890",
            "job": "Engineer",
            "relationship_rating": 80,
            "relationship": "Friend",
            "notes": "Met at a conference.",
        }

        # Reverse URLs
        self.contact_list_url = reverse("contacts_page")
        self.add_contact_url = reverse("add_contacts_page")
        # self.contact_detail_url = reverse("individual-contact", kwargs={"contact_id": self.contact.id})

    def test_authenticated_user_can_get_contacts(self):
        try:
            print(f"\nStarting: {self._testMethodName}")
            self.create_test_contact("AAAA", self.user)
            response = self.client.get(self.contact_list_url)
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(len(response.json()), 1)
            self.assertEqual(response.json()[0]["name"], "AAAA")
            print(f"Passed: {self._testMethodName}\n")
        except AssertionError as e:
            print(f"Failed: {self._testMethodName}\n")
            print(f"Assertion failed: {e}")

    def test_authenticated_user_can_get_multiple_contacts(self):
        try:
            print(f"\nStarting: {self._testMethodName}")
            self.create_test_contact("AAAA", self.user)
            self.create_test_contact("BBBB", self.user)

            response = self.client.get(self.contact_list_url)
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(len(response.json()), 2)
            self.assertEqual(response.json()[0]["name"], "AAAA")
            self.assertEqual(response.json()[1]["name"], "BBBB")
            self.assertEqual(response.json()[0]["job"], "Engineer")
            print(f"Passed: {self._testMethodName}\n")
        except AssertionError as e:
            print(f"Failed: {self._testMethodName}\n")
            print(f"Assertion failed: {e}")

    def test_unauthenticated_user_cannot_get_contacts(self):
        try:
            print(f"\nStarting: {self._testMethodName}")
            self.client.logout()  # Logout first

            response = self.client.get(self.contact_list_url)
            self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
            print(f"Passed: {self._testMethodName}\n")
        except AssertionError as e:
            print(f"Failed: {self._testMethodName}\n")
            print(f"Assertion failed: {e}")

    def test_user_contacts_get_is_separated(self):
        try:
            print(f"\nStarting: {self._testMethodName}")
            self.client.logout()  # Logout of test1 first
            self.create_and_login('test2', 'test2')
            self.create_test_contact("CCCC", self.user)

            response = self.client.get(self.contact_list_url)
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(len(response.json()), 1)
            self.assertEqual(response.json()[0]["name"], "CCCC")
            print(f"Passed: {self._testMethodName}\n")
        except AssertionError as e:
            print(f"Failed: {self._testMethodName}\n")
            print(f"Assertion failed: {e}")

    def test_user_get_contacts_concurrent_and_separated(self):
        try:
            print(f"\nStarting: {self._testMethodName}")
            # Checks that a user can't access another user's contacts when both are logged in
            # Create two users for testing
            self.user1 = User.objects.create_user(username="cat", password="cat")
            self.user2 = User.objects.create_user(username="dog", password="dog")

            self.client_user1 = self.client_class()
            self.client_user2 = self.client_class()

            # Login and get cookies for both clients
            response1 = self.client_user1.post(self.login_url, {"username": "cat", "password": "cat"})
            self.assertEqual(response1.status_code, status.HTTP_200_OK)  # Ensure login was successful
            response2 = self.client_user2.post(self.login_url, {"username": "dog", "password": "dog"})
            self.assertEqual(response2.status_code, status.HTTP_200_OK)  # Ensure login was successful
            self.client_user1.cookies = response1.cookies
            self.client_user2.cookies = response2.cookies

            self.create_test_contact("Meow", self.user1)
            self.create_test_contact("Woof", self.user2)

            response1 = self.client_user1.get(self.contact_list_url)
            self.assertEqual(response1.status_code, status.HTTP_200_OK)

            response2 = self.client_user2.get(self.contact_list_url)
            self.assertEqual(response2.status_code, status.HTTP_200_OK)

            self.assertEqual(len(response1.json()), 1)
            self.assertEqual(len(response2.json()), 1)
            self.assertEqual(response1.json()[0]["name"], "Meow")   # Ensure that the names are different
            self.assertEqual(response2.json()[0]["name"], "Woof")
            print(f"Passed: {self._testMethodName}\n")
        except AssertionError as e:
            print(f"Failed: {self._testMethodName}\n")
            print(f"Assertion failed: {e}")

    def test_user_add_contact(self):
        try:
            print(f"\nStarting: {self._testMethodName}")
            self.client.logout()  # Logout of test1 first
            self.create_and_login('test2', 'test2')
            self.create_test_contact("CCCC", self.user)

            response = self.client.get(self.contact_list_url)
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(len(response.json()), 1)
            self.assertEqual(response.json()[0]["name"], "CCCC")
            print(f"Passed: {self._testMethodName}\n")
        except AssertionError as e:
            print(f"Failed: {self._testMethodName}\n")
            print(f"Assertion failed: {e}")

    def test_authenticated_user_can_add_contact(self):
        try:
            print(f"\nStarting: {self._testMethodName}")
            response = self.client.post(self.add_contact_url, self.contact_data, format="json")
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)

            # Verify that the contact was created in the database
            self.assertEqual(Contact.objects.count(), 1)

            # Retrieve the contact and check if it belongs to the correct user
            contact = Contact.objects.first()
            self.assertEqual(contact.name, self.contact_data["name"])
            self.assertEqual(contact.email, self.contact_data["email"])
            self.assertEqual(contact.user, self.user)
            print(f"Passed: {self._testMethodName}\n")
        except AssertionError as e:
            print(f"Failed: {self._testMethodName}\n")
            print(f"Assertion failed: {e}")

    def test_unauthenticated_user_cannot_add_contact(self):
        try:
            print(f"\nStarting: {self._testMethodName}")
            self.client.logout()  # Ensure user is logged out
            response = self.client.post(self.add_contact_url, self.contact_data, format="json")

            # Expect an unauthorized response
            self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

            # Verify no contact was created
            self.assertEqual(Contact.objects.count(), 0)
            print(f"Passed: {self._testMethodName}\n")
        except AssertionError as e:
            print(f"Failed: {self._testMethodName}\n")
            print(f"Assertion failed: {e}")

    def test_delete_contact(self):
        try:
            print(f"\nStarting: {self._testMethodName}")
            # Reverse URL here because need contact ID first
            self.del_contact = self.create_test_contact("Test Delete", self.user)
            self.delete_contact_url = reverse("delete-contact", kwargs={"contact_id": self.del_contact.id})
            response = self.client.delete(self.delete_contact_url)
            self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

            # Verify that the contact is actually deleted
            self.assertFalse(Contact.objects.filter(id=self.del_contact.id).exists())
            print(f"Passed: {self._testMethodName}\n")
        except AssertionError as e:
            print(f"Failed: {self._testMethodName}\n")
            print(f"Assertion failed: {e}")

    def test_unauthenticated_user_cannot_delete_contact(self):
        try:
            print(f"\nStarting: {self._testMethodName}")
            self.del_contact = self.create_test_contact("Test Delete", self.user)
            self.delete_contact_url = reverse("delete-contact", kwargs={"contact_id": self.del_contact.id})
            self.client.logout()

            response = self.client.delete(self.delete_contact_url)
            self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

            self.assertTrue(Contact.objects.filter(id=self.del_contact.id).exists())
            print(f"Passed: {self._testMethodName}\n")
        except AssertionError as e:
            print(f"Failed: {self._testMethodName}\n")
            print(f"Assertion failed: {e}")
