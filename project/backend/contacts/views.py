from django.shortcuts import render
from rest_framework.views import APIView
from . models import Contact
from rest_framework.response import Response
from rest_framework import status
from . serializer import ContactSerializer

from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied


# GET
class ContactView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ContactSerializer

    def get(self, request):
        contacts = Contact.objects.filter(user=request.user)
        serializer = ContactSerializer(contacts, many=True)
        return Response(serializer.data)


# POST
class AddContactView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        data = request.data.copy()
        data["user"] = request.user.id
        serializer = ContactSerializer(data=data)

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# GET/POST
class IndividualContactView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, contact_id):
        try:
            contact = Contact.objects.get(id=contact_id, user=request.user)
        except Contact.DoesNotExist:
            raise NotFound(detail="Contact not found", code=status.HTTP_404_NOT_FOUND)

        if contact.user != request.user:
            raise PermissionDenied("You do not have permission to view this contact.")

        # Serialize
        serializer = ContactSerializer(contact)
        return Response(serializer.data)

    def post(self, request, contact_id):
        try:
            contact = Contact.objects.get(id=contact_id, user=request.user)
        except Contact.DoesNotExist:
            raise NotFound(detail="Contact not found", code=status.HTTP_404_NOT_FOUND)

        # Update contact fields and serialize
        serializer = ContactSerializer(contact, data=request.data, partial=True)  # partial=True allows partial updates
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Relationship quiz
# TODO: integrate this with frontend in a separate page
class RelationshipQuizView(APIView):
    def get(self, request, contact_id):
        # PLACEHOLDER: Just one random question for now
        question = "How often do you communicate?"
        options = [
            {"id": 1, "text": "Never"},
            {"id": 2, "text": "Rarely"},
            {"id": 3, "text": "Sometimes"},
            {"id": 4, "text": "Often"},
            {"id": 5, "text": "Daily"}
        ]
        return Response({"question": question, "options": options}, status=status.HTTP_200_OK)

    def post(self, request, contact_id):
        # Get the contact based on contact_id
        try:
            contact = Contact.objects.get(id=contact_id)
        except Contact.DoesNotExist:
            return Response({"error": "Contact not found"}, status=status.HTTP_404_NOT_FOUND)

        # Fetch the answer from the user
        selected_answer_id = request.data.get('answer')

        # Update the relationship rating based on the selected answer
        relationship_rating_map = {
            1: 10,
            2: 20,
            3: 50,
            4: 80,
            5: 100
        }
        relationship_rating = relationship_rating_map.get(selected_answer_id)

        # Update contact with new relationship rating
        contact.relationship_rating = relationship_rating
        contact.save()

        # Return the updated contact data
        serializer = ContactSerializer(contact)
        return Response(serializer.data, status=status.HTTP_200_OK)


# Delete a contact (post or delete)
