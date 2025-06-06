import json
import requests
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied, NotFound
from rest_framework.decorators import api_view
from .models import Event, Task
from .serializers import EventSerializer, TaskSerializer
from django.contrib.auth.models import User
from datetime import datetime, timedelta
from accounts.views import GoogleConnection
from django.utils.timezone import is_naive, make_aware
import base64


class EventViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = EventSerializer

    def get_queryset(self):
        return Event.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TaskViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = TaskSerializer

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class IndividualEventView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, event_id):
        event = get_object_or_404(Event, id=event_id, user=request.user)
        serializer = EventSerializer(event)
        return Response(serializer.data)

    def post(self, request, event_id):
        event = get_object_or_404(Event, id=event_id, user=request.user)
        serializer = EventSerializer(event, data=request.data, partial=True)

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteEventView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, event_id):
        event = get_object_or_404(Event, id=event_id, user=request.user)
        event.delete()
        return Response({"message": "Event deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


class IndividualTaskView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, task_id):
        task = get_object_or_404(Task, id=task_id, user=request.user)
        serializer = TaskSerializer(task)
        return Response(serializer.data)

    def post(self, request, task_id):
        task = get_object_or_404(Task, id=task_id, user=request.user)
        serializer = TaskSerializer(task, data=request.data, partial=True)

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteTaskView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, task_id):
        task = get_object_or_404(Task, id=task_id, user=request.user)
        task.delete()
        return Response({"message": "Task deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


# =======================
# GOOGLE CALENDAR 
# =======================
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required

@login_required
def check_auth(request):
    return JsonResponse({"isAuthenticated": True, "user": request.user.username})

class SyncGoogleCalendarView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        access_token = request.data.get("access_token")

        if not access_token:
            return Response({"error": "No access token provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            now = datetime.utcnow()
            past_date = now - timedelta(days=365)
            future_date = now + timedelta(days=365)

            google_calendar_url = "https://www.googleapis.com/calendar/v3/calendars/primary/events"
            headers = {"Authorization": f"Bearer {access_token}", "Accept": "application/json"}

            past_response = requests.get(
                google_calendar_url,
                headers=headers,
                params={
                    "maxResults": 1000,
                    "orderBy": "startTime",
                    "singleEvents": True,
                    "timeMin": past_date.isoformat() + "Z",
                    "timeMax": now.isoformat() + "Z",
                },
            )

            future_response = requests.get(
                google_calendar_url,
                headers=headers,
                params={
                    "maxResults": 1000,
                    "orderBy": "startTime",
                    "singleEvents": True,
                    "timeMin": now.isoformat() + "Z",
                    "timeMax": future_date.isoformat() + "Z",
                },
            )

            past_data = past_response.json()
            future_data = future_response.json()

            def process_events(data):
                events = []  # Initialize an empty list to store the events

                # Loop through each event in the data["items"]
                for event in data.get("items", []):
                    # Check if both "start" and "end" keys exist
                    if "start" in event and "end" in event:
                        # Extract the start and end times
                        start_time = event["start"].get("dateTime", event["start"].get("date"))
                        end_time = event["end"].get("dateTime", event["end"].get("date"))
                        
                        # Get the all_day value (default to False if not present)
                        all_day = event.get("all_day")

                        # Create a dictionary for the event
                        event_dict = {
                            "title": event.get("summary", "No Title"),
                            "start": start_time,
                            "end": end_time,
                            "color": "#4285F4",
                            "all_day": all_day,
                        }

                        # Append the event dictionary to the events list
                        events.append(event_dict)

                return events
            
            all_events = process_events(past_data) + process_events(future_data)

            # Clear existing Google-synced events first!
            Event.objects.filter(user=request.user, source='google').delete()

            for event in all_events:
                Event.objects.create(
                    user=request.user,
                    title=event["title"],
                    start=event["start"],
                    end=event["end"],
                    color=event["color"],
                    source='google'  # Marking Google events
                )
                
            return Response({"message": "Google Calendar events synced successfully!", "events": all_events})

        except requests.RequestException as e:
            return Response({"error": f"Error fetching events from Google: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetGoogleEventsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        events = Event.objects.filter(user=request.user).values("title", "start", "end", "color")
        return Response(events)

class DeleteGoogleEventsView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        # Delete only events from Google Calendar
        deleted_count, _ = Event.objects.filter(user=request.user, source='google').delete()

        response = Response({"message": f"{deleted_count} Google Calendar events deleted successfully!"})
        response.delete_cookie("access_token") 
        return response

class PushEventsToGoogleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            connection = GoogleConnection.objects.get(user=request.user)
            access_token = base64.b64decode(connection.googleToken).decode('utf-8')
        except GoogleConnection.DoesNotExist:
            return Response({"error": "No Google token found"}, status=400)

        events = Event.objects.filter(user=request.user).exclude(source='google')

        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }

        success_count = 0
        failure_count = 0

        for event in events:
            start_dt = event.start
            end_dt = event.end

            if is_naive(start_dt):
                from django.utils.timezone import get_current_timezone
                tz = get_current_timezone()
                start_dt = make_aware(start_dt, timezone=tz)
            if is_naive(end_dt):
                from django.utils.timezone import get_current_timezone
                tz = get_current_timezone()
                end_dt = make_aware(end_dt, timezone=tz)

            event_payload = {
                "summary": event.title,
                "start": { "dateTime": start_dt.isoformat() },
                "end": { "dateTime": end_dt.isoformat() },
            }

            response = requests.post(
                "https://www.googleapis.com/calendar/v3/calendars/primary/events",
                headers=headers,
                json=event_payload
            )

            if response.status_code in [200, 201]:
                success_count += 1
                event.source = "google"
                event.save()
            else:
                failure_count += 1

        return Response({
            "message": "Push complete",
            "uploaded": success_count,
            "failed": failure_count
        }, status=200)
