from rest_framework import serializers
from .models import ExternalEvent

class ExternalEventSerializer(serializers.ModelSerializer):
    title = serializers.CharField(required=False) 
    description = serializers.CharField(required=False) 
    contact = serializers.CharField(required=False) 

    class Meta:
        model = ExternalEvent
        fields = '__all__'
