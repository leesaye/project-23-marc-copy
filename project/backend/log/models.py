from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now
from datetime import timedelta

from calendarapi.models import Task
from contacts.models import Contact

# Weekly missions
class MissionLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    mission_text = models.CharField(max_length=255)
    last_reset = models.DateField(auto_now_add=True)
    actions_required = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return self.mission_text

    @classmethod
    def get_current_week_start(cls):
        today = now().date()
        return today - timedelta(days=today.weekday())

    def reset_if_new_week(self):
        current_week_start = self.get_current_week_start()
        if self.last_reset < current_week_start:
            self.completed = False
            self.last_reset = current_week_start
            self.save()

# Assign missions (happens once per user, on sign up or log in)
    @classmethod
    def assign_task_mission(cls, user):
        week_start = cls.get_current_week_start()
        mission = cls.objects.get_or_create(
            user=user,
            last_reset=week_start,
            mission_text="Add two tasks to your calendar",
            actions_required=2,
            completed=False
        )
        return mission

    @classmethod
    def assign_contact_mission(cls, user):
        week_start = cls.get_current_week_start()
        mission = cls.objects.get_or_create(
            user=user,
            last_reset=week_start,
            mission_text="Add one new contact",
            actions_required=1,
            completed=False
        )
        return mission

# Check mission completion
    @classmethod
    def check_task_mission_completion(cls, user):
        week_start = MissionLog.get_current_week_start()
        week_end = week_start + timedelta(days=6)

        # Reset mission if needed
        mission = MissionLog.objects.filter(user=user, mission_text="Add two tasks to your calendar").first()

        # If mission doesn't exist for some reason, assign it
        if not mission:
            MissionLog.assign_task_mission(user)
            mission = MissionLog.objects.filter(user=user, mission_text="Add one new contact").first()

        mission.reset_if_new_week()

        task_count = Task.objects.filter(user=user, created_at__date__range=[week_start, week_end]).count()

        mission.completed = task_count >= mission.actions_required
        mission.save()

        return {
            "mission_text": mission.mission_text,
            "completed": mission.completed,
            "progress": min(task_count, mission.actions_required),
            "total_required": mission.actions_required
        }

    @classmethod
    def check_contact_mission_completion(cls, user):
        week_start = MissionLog.get_current_week_start()
        week_end = week_start + timedelta(days=6)

        # Reset mission if needed
        mission = MissionLog.objects.filter(user=user, mission_text="Add one new contact").first()

        # If mission doesn't exist for some reason, assign it
        if not mission:
            MissionLog.assign_contact_mission(user)
            mission = MissionLog.objects.filter(user=user, mission_text="Add one new contact").first()

        mission.reset_if_new_week()

        contacts_count = Contact.objects.filter(user=user, created_at__date__range=[week_start, week_end]).count()

        mission.completed = contacts_count >= mission.actions_required
        mission.save()

        return {
            "mission_text": mission.mission_text,
            "completed": mission.completed,
            "progress": min(contacts_count, mission.actions_required),
            "total_required": mission.actions_required
        }


# class ActivityLog(models.Model):
#     title = models.CharField(max_length=200)
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     event = models.ForeignKey(Event, on_delete=models.SET_NULL, blank=True, null=True)
#     task = models.ForeignKey(Task, on_delete=models.SET_NULL, blank=True, null=True)
#
#     def __str__(self):
#         return self.title
