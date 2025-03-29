from django.urls import path
from . views import *

urlpatterns = [
    path('', MissionLogView.as_view(), name='mission_log'),
    path("export-activities/", ExportActivityCSV.as_view(), name="export_activities"),
]
