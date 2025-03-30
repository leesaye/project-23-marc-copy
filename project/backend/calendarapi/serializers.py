from rest_framework import serializers
from .models import Event, Task
from contacts.models import Contact

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'user', 'title', 'start', 'end', 'color', 'contact', 'tag']

class TaskSerializer(serializers.ModelSerializer):
    contact_name = serializers.CharField(source='contact.name', read_only=True)
    contact_id = serializers.PrimaryKeyRelatedField(
        queryset=Contact.objects.all(), source="contact", write_only=True, required=False
    )

    class Meta:
        model = Task
        fields = ['id', 'title', 'date', 'color', 'user', 'contact', 'contact_name', 'contact_id', 'completed', 'created_at', 'tag']
