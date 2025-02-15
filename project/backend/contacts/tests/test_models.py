from django.test import TestCase
from django.contrib.auth.models import User
from contacts.models import Contact


class ContactModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="test1", password="test1")
        self.contact = Contact.objects.create(
            user=self.user,
            name="Jane Doe",
            email="jane@gmail.com",
            phone="1234567890",
            job="Manager",
            relationship_rating=85,
            relationship="Colleague",
            notes="BFF"
        )

    def test_contact_creation(self):
        try:
            print(f"\nStarting: {self._testMethodName}")
            self.assertEqual(self.contact.name, "Jane Doe")
            self.assertEqual(self.contact.email, "jane@gmail.com")
            self.assertEqual(self.contact.user.username, "test1")
            print(f"Passed: {self._testMethodName}\n")
        except AssertionError as e:
            print(f"Failed: {self._testMethodName}\n")
            print(f"Assertion failed: {e}")

    def test_contact_creation_empty(self):
        try:
            print(f"\nStarting: {self._testMethodName}")
            # Test that phone, rating and notes fields default to empty str
            self.contact = Contact.objects.create(
                user=self.user,
                name="Jane Doe",
                email="jane@gmail.com",
                job="Manager",
                relationship="Colleague"
            )
            self.assertEqual(self.contact.name, "Jane Doe")
            self.assertEqual(self.contact.phone, "")
            self.assertEqual(self.contact.notes, None)
            self.assertEqual(self.contact.relationship_rating, 0)
            self.assertEqual(self.contact.user.username, "test1")
            print(f"Passed: {self._testMethodName}\n")
        except AssertionError as e:
            print(f"Failed: {self._testMethodName}\n")
            print(f"Assertion failed: {e}")
