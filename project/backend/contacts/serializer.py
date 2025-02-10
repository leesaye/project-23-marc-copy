from rest_framework.serializers import ModelSerializer
from . models import Contact


# Serializer for Contact
class ContactSerializer(ModelSerializer):
    class Meta:
        model = Contact
        fields = ['name', 'job', 'relationship_rating', 'relationship']
