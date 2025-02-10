from django.shortcuts import render
from rest_framework.views import APIView
from . models import Contact
from rest_framework.response import Response
from . serializer import *


class ContactView(APIView):
    serializer_class = ContactSerializer

    def get(self, request):
        contacts = [{'name': contact.name, 'job': contact.job,
                   'relationship_rating': contact.relationship_rating,
                   'relationship': contact.relationship} for contact in Contact.objects.all()]
        return Response(contacts)

# Add a contact (post)

# Edit a contact (get + post)

# Delete a contact (post or delete)
