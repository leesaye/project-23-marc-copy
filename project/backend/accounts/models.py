from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class GoogleConnection(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    googleToken = models.CharField(blank=True, null=True, max_length=1000)

    def __str__(self):
        return self.user.__str__()
