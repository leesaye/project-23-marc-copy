from django.shortcuts import render
from rest_framework.views import APIView
from . models import Contact
from rest_framework.response import Response
from rest_framework import status
from . serializer import ContactSerializer
from . geminiapi import get_relationship_rating, GeminiAPIError

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
        try:
            # Quiz logic
            quiz_answers = request.data.get("quiz_answers", None)

            data = request.data.copy()

            if quiz_answers:
                relationship_rating = get_rating_of_contact(request)
                data["relationship_rating"] = relationship_rating

            data["user"] = request.user.id
            serializer = ContactSerializer(data=data)

            if serializer.is_valid(raise_exception=True):
                serializer.save()
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Contact.DoesNotExist:
            raise NotFound(detail="Contact not found", code=status.HTTP_404_NOT_FOUND)
        except GeminiAPIError as e:
            return Response({"error": f"Failed to generate relationship rating: {str(e)}"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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

            # Quiz logic
            quiz_answers = request.data.get("quiz_answers", None)

            if quiz_answers:
                relationship_rating = get_rating_of_contact(request)
                request.data["relationship_rating"] = relationship_rating

            # Update contact fields and serialize
            serializer = ContactSerializer(contact, data=request.data,
                                           partial=True)  # partial=True allows partial updates
            if serializer.is_valid(raise_exception=True):
                serializer.save()
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            return Response(serializer.data, status=status.HTTP_200_OK)

        except Contact.DoesNotExist:
            raise NotFound(detail="Contact not found", code=status.HTTP_404_NOT_FOUND)
        except GeminiAPIError as e:
            return Response({"error": f"Failed to generate relationship rating: {str(e)}"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# DELETE
class DeleteContactView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, contact_id):
        try:
            contact = Contact.objects.get(id=contact_id)
        except Contact.DoesNotExist:
            raise NotFound(detail="Contact not found", code=status.HTTP_404_NOT_FOUND)

        if contact.user != request.user:
            raise PermissionDenied("You do not have permission to delete this contact.")

        contact.delete()
        return Response({"message": "Contact deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


# Relationship quiz
# TODO: Move relationship quiz logic to here later
class RelationshipQuizView(APIView):
    def post(self, request, contact_id):
        # Get the contact based on contact_id
        try:
            contact = Contact.objects.get(id=contact_id)
            relationship_rating = get_relationship_rating(request.data)
            contact.relationship_rating = relationship_rating
            contact.save()

        except Contact.DoesNotExist:
            return Response({"error": "Contact not found"}, status=status.HTTP_404_NOT_FOUND)
        except GeminiAPIError as e:
            return Response({"error": f"Failed to generate relationship rating: {str(e)}"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Ret generated rating
        return Response({"relationship_rating": relationship_rating}, status=status.HTTP_200_OK)


def get_rating_of_contact(request):
    """Helper function for Gemini api getting relationship rating"""
    try:
        quiz_answers = request.data.get("quiz_answers", [])

        user_data = {
            "responses": [{"question": qa["question"], "answer": qa["answer"]} for qa in quiz_answers]
        }

        relationship_rating = get_relationship_rating(user_data)

    except GeminiAPIError as e:
        return Response({"error": f"Failed to generate relationship rating: {str(e)}"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Ret generated rating
    return relationship_rating
