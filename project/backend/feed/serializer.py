from rest_framework import serializers
from .models import ExternalEvent
from .models import UserStats

class ExternalEventSerializer(serializers.ModelSerializer):
    title = serializers.CharField(required=False) 
    description = serializers.CharField(required=False) 

    class Meta:
        model = ExternalEvent
        fields = '__all__'

class UserStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserStats
        fields = ['user', 'current_daily_count', 'daily_goal', 'running_streak_count']
        read_only_fields = ['user', 'running_streak_count']