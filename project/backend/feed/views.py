from rest_framework import generics, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import ExternalEvent, UserStats
from .serializer import ExternalEventSerializer, UserStatsSerializer

# Create your views here.


# List all events and create new event
class ExternalEventCreateAPIView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = ExternalEvent.objects.all()
    serializer_class = ExternalEventSerializer


# Retivews, update, or delete a specific event
class ExternalEventDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = ExternalEvent.objects.all()
    serializer_class = ExternalEventSerializer


class UserStatsViewSet(viewsets.ModelViewSet):
    queryset = UserStats.objects.all()
    serializer_class = UserStatsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_stats, created = UserStats.objects.get_or_create(user=self.request.user)
        return UserStats.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["POST"])
    def increment_count(self, request):
        user_stats, created = UserStats.objects.get_or_create(user=request.user)
        user_stats.current_daily_count += 1
        user_stats.save()
        return Response(
            {
                "message": "Daily count incremented",
                "current_daily_count": user_stats.current_daily_count,
            }
        )

    @action(detail=False, methods=["POST"])
    def set_daily_goal(self, request):
        user_stats, created = UserStats.objects.get_or_create(user=request.user)
        goal = request.data.get("daily_goal")
        if goal is not None and isinstance(goal, int) and goal > 0:
            user_stats.daily_goal = goal
            user_stats.save()
            return Response(
                {"message": "Daily goal updated", "daily_goal": user_stats.daily_goal}
            )
        return Response({"error": "Invalid daily goal"}, status=400)

    # Periodic task (use Celery or a cron job to call this at midnight)
    def reset_and_update_streaks_cron(self):
        print("Cron Job Activated")
        for user_stats in UserStats.objects.all():
            user_stats.check_and_update_streak()

    @action(detail=False, methods=["POST"])
    def reset_and_update_streaks(self, request):
        # Loop through all UserStats and update streaks
        for user_stats in UserStats.objects.all():
            user_stats.check_and_update_streak()
        return Response({"message": "Streaks reset and updated for all users"})
