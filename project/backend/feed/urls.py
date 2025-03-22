from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ExternalEventCreateAPIView, ExternalEventDetailAPIView, UserStatsViewSet

router = DefaultRouter()
router.register(r'user-stats', UserStatsViewSet, basename='userstats')

urlpatterns = [
    path('externalevents/', ExternalEventCreateAPIView.as_view(), name='external-event-list-create'),
    path('externalevents/<int:pk>/', ExternalEventDetailAPIView.as_view(), name='external-event-detail'),
    path('', include(router.urls))
]
