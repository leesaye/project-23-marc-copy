from django.db import models
from django.contrib.auth.models import User
from contacts.models import Contact

# Create your models here.
class Event(models.Model):
    title = models.CharField(max_length=200)
    start = models.DateTimeField()
    end = models.DateTimeField()
    color = models.CharField(max_length=7, default='#4A90E2')

    def str(self):
        return self.title

class Task(models.Model):
    title = models.CharField(max_length=200)
    date = models.DateField()
    color = models.CharField(max_length=7, default='#014f86')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks', default=1)
    contact = models.ForeignKey(Contact, on_delete=models.SET_NULL, blank=True, null=True)

    def str(self):
        return self.title