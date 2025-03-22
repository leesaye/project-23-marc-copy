from django.db import models
from contacts.models import Contact
from django.contrib.auth.models import User
from django.utils.timezone import now

# Create your models here.
class ExternalEvent(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    contact = models.ForeignKey(Contact, related_name='externalevents', on_delete=models.CASCADE)
    added = models.BooleanField(default=False)


    def __str__(self):
        return self.title

class UserStats(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    current_daily_count = models.PositiveIntegerField(default=0)
    daily_goal = models.PositiveIntegerField(default=1)
    running_streak_count = models.PositiveIntegerField(default=0)
    last_updated = models.DateField(auto_now=True)

    def check_and_update_streak(self):
        today = now().date()
        if self.last_updated < today:  # New day, check if goal was met
            if self.current_daily_count >= self.daily_goal:
                self.running_streak_count += 1
            else:
                self.running_streak_count = 0
            self.current_daily_count = 0
            self.last_updated = today
            self.save()

