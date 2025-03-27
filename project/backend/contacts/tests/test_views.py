import uuid
import json
import io
from django.contrib.auth.models import User
from django.urls import reverse
from django.test import TestCase, Client
from contacts.models import Contact
from contacts.serializer import ContactSerializer
from rest_framework import status
from rest_framework.test import APIClient

from django.core.files.uploadedfile import SimpleUploadedFile


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
        self.upload_csv_url = reverse("upload-contacts-csv")
        # self.contact_detail_url = reverse("individual-contact", kwargs={"contact_id": self.contact.id})

    def tearDown(self):
        Contact.objects.filter(user=self.user).delete()

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

    def test_edit_contact(self):
        try:
            print(f"\nStarting: {self._testMethodName}")

            # Reverse URL here because need contact ID first
            self.id_contact = self.create_test_contact("Test Edit", self.user)
            self.id_contact_url = reverse("individual-contact", kwargs={"contact_id": self.id_contact.id})

            response = self.client.get(self.id_contact_url)
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(response.json()["name"], "Test Edit")
            self.assertEqual(response.json()["email"], "alice@example.com")

            updated_data = {
                "name": "Test Edit 111",
                "email": "111@gmail.com"
            }

            response = self.client.post(self.id_contact_url, updated_data, format="json")
            self.assertEqual(response.status_code, status.HTTP_200_OK)

            # Verify that the contact is changed
            response = self.client.get(self.id_contact_url)
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(response.json()["name"], "Test Edit 111")
            self.assertEqual(response.json()["email"], "111@gmail.com")
            print(f"Passed: {self._testMethodName}\n")
        except AssertionError as e:
            print(f"Failed: {self._testMethodName}\n")
            print(f"Assertion failed: {e}")

    def test_gemini_add_contact(self):
        try:
            print(f"\nStarting: {self._testMethodName}")

            sample_answers_bad = {
                "quiz_answers": json.dumps([
                    {"question": "How would you describe how well you click with A?",
                     "answer": "We fight alot. We don't click well."},
                    {"question": "How committed would you be to strengthening your relationship, and by how much?",
                     "answer": "Not committed. I don't like them."},
                    {"question": "How much have you contacted this person in the last month?",
                     "answer": "Zero times."}
                ])
            }

            high_rel_score_contact = {"name": "Jack", "email": "jack@example.com", "phone": "1234567890",
                                      "job": "Engineer", "relationship_rating": 99, "relationship": "Friend",
                                      "notes": "Met at a conference.",
                                      "quiz_answers": sample_answers_bad["quiz_answers"]}

            old_rel_rating = high_rel_score_contact["relationship_rating"]
            response = self.client.post(self.add_contact_url, high_rel_score_contact, format="multipart")
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)

            new_rating = response.data.get("relationship_rating")

            # rating should be much lower now, check that new one is lower than old one
            self.assertLess(new_rating, old_rel_rating)

            print(f"Passed: {self._testMethodName}\n")
        except AssertionError as e:
            print(f"Failed: {self._testMethodName}\n")
            print(f"Assertion failed: {e}")

    def test_gemini_edit_contact(self):
        try:
            print(f"\nStarting: {self._testMethodName}")

            # Reverse URL here because need contact ID first
            self.id_contact = self.create_test_contact("Gemini Edit Test", self.user)
            self.id_contact_url = reverse("individual-contact", kwargs={"contact_id": self.id_contact.id})

            response = self.client.get(self.id_contact_url)
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(response.json()["name"], "Gemini Edit Test")
            self.assertEqual(response.json()["email"], "alice@example.com")
            self.assertEqual(response.json()["relationship_rating"], 85)

            sample_answers_bad = {
                "quiz_answers": json.dumps([
                    {"question": "How would you describe how well you click with A?",
                     "answer": "We fight alot. We don't click well."},
                    {"question": "How committed would you be to strengthening your relationship, and by how much?",
                     "answer": "Not committed. I don't like them."},
                    {"question": "How much have you contacted this person in the last month?",
                     "answer": "Zero times."}
                ])
            }

            # No changes to any data, just adding quiz answers
            responsepost = self.client.post(self.id_contact_url, sample_answers_bad, format="multipart")
            self.assertEqual(responsepost.status_code, status.HTTP_200_OK)

            # Verify that the contact relationship rating is lower now (old rating is 85)
            responseget = self.client.get(self.id_contact_url)
            self.assertEqual(responseget.status_code, status.HTTP_200_OK)
            new_rating = responseget.data.get("relationship_rating")

            # Only thing that changes is rating
            self.assertLess(new_rating, 85)
            self.assertEqual(responseget.data["name"], "Gemini Edit Test")

            print(f"Passed: {self._testMethodName}\n")
        except AssertionError as e:
            print(f"Failed: {self._testMethodName}\n")
            print(f"Assertion failed: {e}")

    def test_gemini_edit_contact_empty(self):
        try:
            print(f"\nStarting: {self._testMethodName}")

            # Reverse URL here because need contact ID first
            self.id_contact = self.create_test_contact("Gemini Edit Test Empty Quiz", self.user)
            self.id_contact_url = reverse("individual-contact", kwargs={"contact_id": self.id_contact.id})

            response = self.client.get(self.id_contact_url)
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(response.json()["name"], "Gemini Edit Test Empty Quiz")
            self.assertEqual(response.json()["email"], "alice@example.com")
            self.assertEqual(response.json()["relationship_rating"], 85)

            empty_quiz_answers = {
                "quiz_answers": json.dumps([
                    {"question": "How would you describe how well you click with A?",
                     "answer": ""},
                    {"question": "How committed would you be to strengthening your relationship, and by how much?",
                     "answer": ""},
                    {"question": "How much have you contacted this person in the last month?",
                     "answer": ""}
                ])
            }

            # No changes to any data, not adding quiz answers either
            responsepost = self.client.post(self.id_contact_url, empty_quiz_answers, format="multipart")
            self.assertEqual(responsepost.status_code, status.HTTP_200_OK)

            responseget = self.client.get(self.id_contact_url)
            self.assertEqual(responseget.status_code, status.HTTP_200_OK)
            new_rating = responseget.data.get("relationship_rating")

            # Assert that rating has NOT changed
            self.assertEqual(new_rating, 85)
            self.assertEqual(responseget.data["name"], "Gemini Edit Test Empty Quiz")

            print(f"Passed: {self._testMethodName}\n")
        except AssertionError as e:
            print(f"Failed: {self._testMethodName}\n")
            print(f"Assertion failed: {e}")

    def test_csv_add_contact(self):
        try:
            # Mock csv, similar to real LinkedIn csv
            mock_csv_content = b"This is a mock csv.\nHere are some random lines, and, commas, and a new " \
                               b"line.\n\nFirst Name,Last Name,URL,Email Address,Company,Position,Connected On\nJohn," \
                               b"Cena,https://www.linkedin.com/in/johncena,,Company 1,Engineer,27 Jan 2025\nMorgan," \
                               b"Freeman,https://www.linkedin.com/in/morganfreeman,,,,27 Jan 2025\nAlex,Hamilton," \
                               b"https://www.linkedin.com/in/adotham,alexham@gmail.com,Prof,Robotics Lead,26 Jan 2025"

            csv_file = SimpleUploadedFile("test.csv", mock_csv_content, content_type="text/csv")
            responsepost = self.client.post(self.upload_csv_url, {"csv": csv_file}, format="multipart")

            # Check that contacts were created, and get them just to make sure
            self.assertEqual(responsepost.status_code, status.HTTP_201_CREATED)

            responseget = self.client.get(self.contact_list_url)
            self.assertEqual(responseget.status_code, status.HTTP_200_OK)

            found_flag = 0
            for contact in responseget.json():
                if contact["name"] == "John Cena":
                    found_flag = 1

            self.assertEqual(found_flag, 1)

            print(f"Passed: {self._testMethodName}\n")
        except AssertionError as e:
            print(f"Failed: {self._testMethodName}\n")
            print(f"Assertion failed: {e}")
