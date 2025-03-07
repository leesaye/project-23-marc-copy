from django.db import models
from contacts.models import Contact

# Create your models here.
class ExternalEvent(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    contact = models.ForeignKey(Contact, related_name='externalevents', on_delete=models.CASCADE)
    added = models.BooleanField(default=False)


    def __str__(self):
        return self.title