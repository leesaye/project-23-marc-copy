from django.db import models
from django.contrib.auth.models import User
from contacts.models import Contact
from django.utils import timezone


# Create your models here.

class Event(models.Model):
    title = models.CharField(max_length=200)
    start = models.DateTimeField()
    end = models.DateTimeField()
    color = models.CharField(max_length=7, default='#4A90E2')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='events', default=1)
    contact = models.ForeignKey(Contact, on_delete=models.SET_NULL, blank=True, null=True)
    source = models.CharField(max_length=20, default='local')
    tag = models.CharField(max_length=100, default='')

    def __str__(self):
        return self.title

class Task(models.Model):
    title = models.CharField(max_length=200)
    date = models.DateField()
    color = models.CharField(max_length=7, default='#014f86')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks', default=1)
    contact = models.ForeignKey(Contact, on_delete=models.SET_NULL, blank=True, null=True)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)    # default for migrations
    tag = models.CharField(max_length=100, default='')

    def __str__(self):
        return self.title
