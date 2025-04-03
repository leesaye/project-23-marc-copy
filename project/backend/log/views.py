from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import MissionLog
from calendarapi.models import Event, Task

from io import StringIO
import csv
from django.http import HttpResponse

# Create your views here.
class MissionLogView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            task_mission_status = MissionLog.check_task_mission_completion(request.user)
            contact_mission_status = MissionLog.check_contact_mission_completion(request.user)

            missions = [task_mission_status, contact_mission_status]

            return Response(missions, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "Failed to get mission log"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ExportActivityCSV(APIView):
    permission_classes = [IsAuthenticated]  # Ensure only logged-in users can access

    def get(self, request):
        try:
            # get events and tasks
            events = Event.objects.filter(user=request.user)
            tasks = Task.objects.filter(user=request.user)

            csv_buffer = StringIO()
            writer = csv.writer(csv_buffer)

            # header
            writer.writerow([
                "Title", "Start time", "End time", "Date", "Contact Name",
                "Tag", "Completed"
            ])

            # write event data
            for event in events:
                # get contact name first
                writer.writerow([
                    event.title,
                    event.start.strftime("%Y-%m-%d %H:%M"),
                    event.end.strftime("%Y-%m-%d %H:%M"),
                    "",
                    event.contact if event.contact else "",
                    event.tag if event.tag else "",
                    ""
                ])

            # write task data
            for task in tasks:
                # get contact name first
                writer.writerow([
                    task.title,
                    "",
                    "",
                    task.date.strftime("%Y-%m-%d"),
                    task.contact if task.contact else "",
                    task.tag if task.tag else "",
                    task.completed
                ])

            # HTTP response
            response = HttpResponse(csv_buffer.getvalue(), content_type="text/csv")
            response["Content-Disposition"] = 'attachment; filename="activity_log.csv"'
            return response

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
