from django.shortcuts import render
import pandas as pd
import uuid

from django.views.decorators.csrf import csrf_exempt
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


# POST
class UploadLinkedInCSVView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if 'csv' not in request.FILES:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)
        file = request.FILES['csv']

        try:
            # Detect the header row first because LinkedIn adds rows at the top with useless info
            header_row = find_header_row(file)
            if header_row is None:
                return Response({"error": "Invalid CSV format, headers not found"}, status=status.HTTP_400_BAD_REQUEST)

            # Read CSV from the detected header row
            file.seek(0)
            df = pd.read_csv(file, skiprows=header_row)

            if df is None or df.empty:
                return Response({"error": "Uploaded CSV file is empty or invalid"}, status=status.HTTP_400_BAD_REQUEST)

            required_columns = ["First Name", "Last Name", "URL", "Email Address", "Company", "Position", "Connected On"]
            if not all(col in df.columns for col in required_columns):
                return Response({"error": "Invalid CSV format"}, status=status.HTTP_400_BAD_REQUEST)
            
            df.dropna(how="all", inplace=True)   # Drop rows where all values are NaN, needed because we change all NaN values in rows to ""
            df.reset_index(drop=True, inplace=True)  # Reset index after dropping rows
            
            # Convert columns to string and replace NaN values with default strings
            for col in required_columns:
                df[col] = df[col].fillna("").astype(str)  # Ensure all values are strings so no float errors from NaN

            contacts_to_create = []

            for _, row in df.iterrows():
                first_name = row["First Name"].strip()
                last_name = row["Last Name"].strip()
                name = f"{first_name} {last_name}".strip()
                
                email = row["Email Address"].strip() or "No Email"
                job = row["Position"].strip() or "No Job"
                company = row["Company"].strip() or "No Company"
                linkedin_url = row["URL"].strip() or "No URL"

                if not name:
                    return Response({"error": "Contact name cannot be empty"}, status=status.HTTP_400_BAD_REQUEST)

                contact = Contact(
                    id=uuid.uuid4(),
                    user=request.user,
                    name=name,
                    email=email,
                    job=job,
                    company=company,
                    relationship="LinkedIn connection",
                    relationship_rating=50,
                    linkedin_url=linkedin_url,
                    notes=""    
                )
                contacts_to_create.append(contact)

            # Bulk create (supposedly faster)
            Contact.objects.bulk_create(contacts_to_create)

            return Response({"message": "Contacts uploaded successfully"}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



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
    

def find_header_row(file):
    """Detects the correct header row dynamically."""
    sample = pd.read_csv(file, header=None, nrows=10)  # Read first 10 rows to check for header line
    for i, row in sample.iterrows():
        if "First Name" in row.values and "Last Name" in row.values:
            return i  # Return row index where headers are found
    return None
