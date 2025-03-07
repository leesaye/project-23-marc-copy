from django.urls import path
from .views import ExternalEventCreateAPIView, ExternalEventDetailAPIView

urlpatterns = [
    path('externalevents/', ExternalEventCreateAPIView.as_view(), name='external-event-list-create'),
    path('externalevents/<int:pk>/', ExternalEventDetailAPIView.as_view(), name='external-event-detail'),
]
