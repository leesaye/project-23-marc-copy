from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from . models import Contact


# Serializer for Contact
class ContactSerializer(ModelSerializer):
    """Serializer for Contact model."""
    class Meta:
        model = Contact
        fields = ['id', 'name', 'email', 'phone', 'job', 'relationship_rating', 'relationship', 'notes', 'created_at']
