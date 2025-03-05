from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    EventViewSet, TaskViewSet, 
    IndividualEventView, IndividualTaskView, 
    DeleteEventView, DeleteTaskView, proxy_google_calendar
)

router = DefaultRouter()
router.register(r'events', EventViewSet, basename="event")
router.register(r'tasks', TaskViewSet, basename="task")

urlpatterns = [
    path('', include(router.urls)),  
    path('events/<int:event_id>/', IndividualEventView.as_view(), name='individual-event'),
    path('events/<int:event_id>/delete/', DeleteEventView.as_view(), name='delete-event'),
    path('tasks/<int:task_id>/', IndividualTaskView.as_view(), name='individual-task'),
    path('tasks/<int:task_id>/delete/', DeleteTaskView.as_view(), name='delete-task'),
    path("events/google/", proxy_google_calendar, name="get_google_calendar_events"),
]
