from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import MissionLog

# Create your views here.
class MissionLogView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        #try:
            task_mission_status = MissionLog.check_task_mission_completion(request.user)
            contact_mission_status = MissionLog.check_contact_mission_completion(request.user)

            missions = [task_mission_status, contact_mission_status]

            return Response(missions, status=status.HTTP_200_OK)
        # except Exception as e:
        #     return Response({"error": "Failed to get mission log"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# class ActivityLogView(APIView):
#     permission_classes = [IsAuthenticated]
#
#     def get(self, request):
