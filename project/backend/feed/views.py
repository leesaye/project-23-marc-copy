from rest_framework import generics
from .models import ExternalEvent
from .serializer import ExternalEventSerializer
from rest_framework.permissions import IsAuthenticated

# Create your views here.

#List all events and create new event
class ExternalEventCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = ExternalEvent.objects.all()
    serializer_class = ExternalEventSerializer

#Retivews, update, or delete a specific event
class ExternalEventDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = ExternalEvent.objects.all()
    serializer_class = ExternalEventSerializer





