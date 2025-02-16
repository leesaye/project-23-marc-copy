from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from django.core.validators import RegexValidator
from . models import Contact


# Serializer for Contact
class ContactSerializer(ModelSerializer):
    """Serializer for Contact model."""
    email = serializers.EmailField(required=True, error_messages={
        "invalid": "Please enter a valid email address.",
        "blank": "This field may not be blank.",
        "required": "This field is required."
    })
    phone = serializers.CharField(
        required=True,
        validators=[RegexValidator(regex=r'^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$', message="Please enter a valid phone number.")],
    )

    class Meta:
        model = Contact
        fields = ['id', 'user', 'name', 'email', 'phone', 'job', 'relationship_rating', 'relationship', 'notes', 'created_at']
