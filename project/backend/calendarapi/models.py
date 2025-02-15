from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Event(models.Model):
    title = models.CharField(max_length=200)
    start = models.DateTimeField()
    end = models.DateTimeField()
    color = models.CharField(max_length=7, default='#2f61a1')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='events', default=1)

    def str(self):
        return self.title

class Task(models.Model):
    title = models.CharField(max_length=200)
    date = models.DateField()
    color = models.CharField(max_length=7, default='#014f86')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks', default=1)

    def str(self):
        return self.title