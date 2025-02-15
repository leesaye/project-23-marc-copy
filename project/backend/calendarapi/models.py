from django.db import models

# Create your models here.
class Event(models.Model):
    title = models.CharField(max_length=200)
    start = models.DateTimeField()
    end = models.DateTimeField()
    color = models.CharField(max_length=7, default='#2f61a1')

    def __str__(self):
        return self.title

class Task(models.Model):
    title = models.CharField(max_length=200)
    date = models.DateField()
    color = models.CharField(max_length=7, default='#014f86')

    def __str__(self):
        return self.title
