from django.shortcuts import render
import pandas as pd
import uuid
import io
from io import StringIO
import csv
import base64
from PIL import Image
import json
import os
from django.conf import settings
from django.http import HttpResponse
from django.core.exceptions import ValidationError

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from . models import Contact
from . serializer import ContactSerializer
from . geminiapi import get_relationship_rating, GeminiAPIError


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
            data = request.data.copy()

            # Name is required
            if request.data.get("name", None) == "":
                return Response({"name": ["Name is required."]}, status=status.HTTP_400_BAD_REQUEST)

            # Quiz logic
            quiz_answers_str = request.data.get("quiz_answers", None)
            quiz_answers = json.loads(quiz_answers_str)  # Convert back to dictionary

            if quiz_answers:
                quiz_used = False
                for question in quiz_answers:
                    if question['answer'] is not None and question['answer'] != "":
                        quiz_used = True
                if quiz_used:
                    relationship_rating = get_rating_of_contact(quiz_answers)
                    data["relationship_rating"] = relationship_rating

            # validate pfp
            pfp_file = request.FILES.get("pfp")

            if pfp_file:
                validate_img(pfp_file)
                pfp_bin = encode_img(pfp_file)
            else:
                default_pfp_path = os.path.join(settings.BASE_DIR, 'default_pfp.jpg')
                default_pfp_file = open(default_pfp_path, 'rb')
                pfp_bin = encode_img(default_pfp_file)

            # Serializing
            data['user'] = request.user.id
            serializer = ContactSerializer(data=data)

            if serializer.is_valid(raise_exception=True):
                serializer.save(pfp=pfp_bin)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Contact.DoesNotExist:
            raise NotFound(detail="Contact not found", code=status.HTTP_404_NOT_FOUND)
        except GeminiAPIError as e:
            return Response({"error": f"Failed to generate relationship rating: {str(e)}"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except ValidationError as e:
            return Response({"image": f"Failed to upload image: {e.messages[0]}"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": f"Failed to edit contact: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# GET/POST
class IndividualContactView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, contact_id):
        try:
            contact = Contact.objects.get(id=contact_id, user=request.user)

            if contact.user != request.user:
                return Response(
                    {"error": "You do not have permission to view this contact."},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Serialize
            serializer = ContactSerializer(contact)

            # Decode only if image is available
            if serializer.data['pfp']:
                pfp_img = decode_img(serializer.data.get('pfp'))
                serializer.data['pfp'] = pfp_img
            return Response(serializer.data)
        except Contact.DoesNotExist:
            return Response({"error": "Contact not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": f"Failed to get contact: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, contact_id):
        try:
            contact = Contact.objects.get(id=contact_id, user=request.user)

            # Name is required
            if request.data.get("name", None) == "":
                return Response({"name": ["Name is required."]}, status=status.HTTP_400_BAD_REQUEST)

            # Quiz logic
            quiz_answers_str = request.data.get("quiz_answers", None)

            if quiz_answers_str:
                quiz_answers = json.loads(quiz_answers_str)  # Convert back to dictionary
            else:
                quiz_answers = {}

            # Flag for if quiz was used
            quiz_used = False
            if quiz_answers:
                for question in quiz_answers:
                    if question['answer'] is not None and question['answer'] != "":
                        quiz_used = True

            if quiz_used:
                relationship_rating = get_rating_of_contact(quiz_answers)
            else:
                relationship_rating = contact.relationship_rating

            # validate pfp
            pfp_file = request.FILES.get("pfp")

            if pfp_file:
                validate_img(pfp_file)
                pfp_bin = encode_img(pfp_file)
            else:
                pfp_bin = None

            # Update contact fields and serialize
            serializer = ContactSerializer(contact, data=request.data,
                                           partial=True)  # partial=True allows partial updates
            if serializer.is_valid(raise_exception=True):
                if quiz_used:
                    if pfp_bin:
                        serializer.save(pfp=pfp_bin, relationship_rating=relationship_rating)
                    else:
                        serializer.save(relationship_rating=relationship_rating)
                else:
                    if pfp_bin:
                        serializer.save(pfp=pfp_bin)
                    else:
                        serializer.save()
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            return Response(serializer.data, status=status.HTTP_200_OK)

        except Contact.DoesNotExist:
            raise NotFound(detail="Contact not found", code=status.HTTP_404_NOT_FOUND)
        except GeminiAPIError as e:
            return Response({"error": f"Failed to generate relationship rating: {str(e)}"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except ValidationError as e:
            return Response({"image": f"Failed to upload image: {e.messages[0]}"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": f"Failed to edit contact: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# DELETE
class DeleteContactView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, contact_id):
        try:
            contact = Contact.objects.get(id=contact_id)

            if contact.user != request.user:
                return Response(
                    {"error": "You do not have permission to view this contact."},
                    status=status.HTTP_403_FORBIDDEN
                )

            contact.delete()
            return Response({"message": "Contact deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Contact.DoesNotExist:
            return Response({"error": "Contact not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": f"Failed to delete contact: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AddGoogleContactsView(APIView):
    def post(self, request):
        try:
            user = request.user
            contacts = request.data
            default_pfp_path = os.path.join(settings.BASE_DIR, 'default_pfp.jpg')
            default_pfp_file = open(default_pfp_path, 'rb')
            pfp = encode_img(default_pfp_file)

            if not contacts:
                return Response({"error": "Failed to add Google contacts"}, status=status.HTTP_400_BAD_REQUEST)

            for contact_data in contacts:
                name = contact_data.get('name', '').strip()
                email = contact_data.get('email', '').strip()
                phone = contact_data.get('phone', '').strip()
                job = contact_data.get('job', '').strip()
                relationship = contact_data.get('relationship', '').strip()

                if name:
                    Contact.objects.create(
                        id=uuid.uuid4(),
                        user=user,
                        pfp=pfp,
                        name=name,
                        email=email if email else "",
                        phone=phone if phone else "",
                        job=job if job else "",
                        relationship_rating=50,
                        relationship=relationship if relationship else "",
                        notes="",
                    )

            return Response({"message": "Google contacts uploaded successfully"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": "Failed to add Google contacts"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# POST
class UploadLinkedInCSVView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if 'csv' not in request.FILES:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)
        file = request.FILES['csv']
        required_columns = ["First Name", "Last Name", "URL", "Email Address", "Company", "Position", "Connected On"]

        try:
            # Detect the header row first because LinkedIn adds rows at the top with useless info
            header_row = find_header_row(file)
            if header_row is None:
                return Response({"error": "Invalid CSV format, headers not found"}, status=status.HTTP_400_BAD_REQUEST)

            # Check for inconsistent col length
            if not validate_csv(file, header_row, len(required_columns)):
                return Response({"error": "Inconsistent column length in csv"},
                                status=status.HTTP_400_BAD_REQUEST)

            # Read CSV from the detected header row
            file.seek(0)
            df = pd.read_csv(file, skiprows=header_row)

            if df is None or df.empty:
                return Response({"error": "Uploaded CSV file is empty or invalid"}, status=status.HTTP_400_BAD_REQUEST)

            if not all(col in df.columns for col in required_columns):
                return Response({"error": "Invalid CSV format"}, status=status.HTTP_400_BAD_REQUEST)

            df.dropna(how="all", inplace=True)   # Drop rows where all values are NaN, needed because we change all NaN values in rows to ""
            df.reset_index(drop=True, inplace=True)  # Reset index after dropping rows

            # Convert columns to string and replace NaN values with default strings
            for col in required_columns:
                df[col] = df[col].fillna("").astype(str)  # Ensure all values are strings so no float errors from NaN

            contacts_to_create = []

            # Currently setting an upper limit of 20 contacts we can pull so we don't overload the server
            contact_counter = 0
            for _, row in df.iterrows():
                if contact_counter >= 20:
                    break

                first_name = row["First Name"].strip()
                last_name = row["Last Name"].strip()
                name = f"{first_name} {last_name}".strip()

                email = row["Email Address"].strip() or ""
                job = row["Position"].strip() or "No Job"
                company = row["Company"].strip() or "No Company"
                linkedin_url = row["URL"].strip() or "No URL"

                default_pfp_path = os.path.join(settings.BASE_DIR, 'default_pfp.jpg')
                default_pfp_file = open(default_pfp_path, 'rb')
                pfp = encode_img(default_pfp_file)

                if not name:
                    return Response({"error": "Contact name cannot be empty"}, status=status.HTTP_400_BAD_REQUEST)

                contact = Contact(
                    id=uuid.uuid4(),
                    user=request.user,
                    pfp=pfp,
                    name=name,
                    email=email,
                    job=job,
                    company=company,
                    relationship="LinkedIn connection",
                    relationship_rating=50,
                    linkedin_url=linkedin_url,
                    notes=""
                )

                contact_counter += 1
                contacts_to_create.append(contact)

            # Bulk create (supposedly faster)
            Contact.objects.bulk_create(contacts_to_create)

            return Response({"message": "Contacts uploaded successfully"}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ExportContactsCSV(APIView):
    permission_classes = [IsAuthenticated]  # Ensure only logged-in users can access

    def get(self, request):
        try:
            # get contacts
            contacts = Contact.objects.filter(user=request.user)

            csv_buffer = StringIO()
            writer = csv.writer(csv_buffer)

            # header
            writer.writerow([
                "Name", "Email", "Phone", "Job", "Company", "LinkedIn",
                "Relationship Rating", "Relationship", "Notes", "Created At"
            ])

            # write data
            for contact in contacts:
                writer.writerow([
                    contact.name if contact.name else "",
                    contact.email if contact.email else "",
                    contact.phone if contact.phone else "",
                    contact.job if contact.job else "",
                    contact.company if contact.company else "",
                    contact.linkedin_url if contact.linkedin_url else "",
                    contact.relationship_rating if contact.relationship_rating else "",
                    contact.relationship if contact.relationship else "",
                    contact.notes if contact.notes else "",
                    contact.created_at.strftime("%Y-%m-%d %H:%M:%S"),
                ])

            # HTTP response
            response = HttpResponse(csv_buffer.getvalue(), content_type="text/csv")
            response["Content-Disposition"] = 'attachment; filename="contacts.csv"'
            return response

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


##### Helpers for quiz, image and csv #####
def encode_img(file):
    if file:
        return file.read()  # Read and return binary data
    return None


def decode_img(bin_data):
    if bin_data:
        try:
            if isinstance(bin_data, str):
                bin_data = base64.b64decode(bin_data)  # Decode Base64 string to bytes

            # Open image and detect format
            image = Image.open(io.BytesIO(bin_data))
            format = image.format.lower()

            encoded_img = base64.b64encode(bin_data).decode('utf-8')
            return f"data:image/{format};base64,{encoded_img}"
        except Exception as e:
            print("Error decoding image:", e)
            return None  # Return None if Pillow fails to read it


MAX_IMG_SIZE = 200 * 1024  # 200 KB limit

def validate_img(file):
    if not file:
        return

    if file.size > MAX_IMG_SIZE:
        raise ValidationError("Image size must be under 200KB")

    try:
        img = Image.open(file)
        if img.format not in ["JPEG", "PNG"]:
            raise ValidationError("Only JPEG and PNG formats are allowed")
    except Exception as e:
        raise ValidationError(f"Invalid image data: {e}")

    file.seek(0)


def get_rating_of_contact(quiz_answers):
    """Helper function for Gemini api getting relationship rating"""
    try:
        user_data = {
            "responses": [{"question": qa["question"], "answer": qa["answer"]} for qa in quiz_answers]
        }

        relationship_rating = get_relationship_rating(user_data)

    except GeminiAPIError as e:
        return Response({"error": f"Failed to generate relationship rating: {str(e)}"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Ret generated rating
    return relationship_rating


def find_header_row(file):
    # Detects the correct header row dynamically.
    header_idx = 0
    for line in file:
        decoded = line.decode('utf-8').strip()
        if "First Name" in decoded and "Last Name" in decoded:
            return header_idx
        header_idx += 1
    return None


def validate_csv(file, header_row, num_req_cols):
    # Check that number of cols on all rows is consistent
    file.seek(0)
    decoded_file = file.read().decode('utf-8')
    text_file = io.StringIO(decoded_file)
    reader = csv.reader(text_file)

    # Skip to the header row
    for _ in range(header_row):
        next(reader, None)

    # Check if the number of columns matches exactly
    for row in reader:
        if len(row) != num_req_cols:
            return False

    return True
