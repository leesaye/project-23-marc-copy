from django.urls import path
from . views import *

urlpatterns = [
    path('', MissionLogView.as_view(), name='mission_log')
]
