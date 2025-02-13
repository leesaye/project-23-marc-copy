from django.shortcuts import render
from rest_framework import viewsets
from .models import Event, Task
from .serializers import EventSerializer, TaskSerializer

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
