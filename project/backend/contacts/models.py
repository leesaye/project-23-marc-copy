import uuid
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator


class Contact(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    pfp = models.BinaryField(null=True, blank=True)     # storing in db as binary
    name = models.CharField(max_length=100)
    email = models.CharField(max_length=100, default="")    # manual add is required, default empty for csv upload
    phone = models.CharField(max_length=15, blank=True, default="")
    job = models.CharField(max_length=100, blank=True, default="")
    company = models.CharField(max_length=100, blank=True, default="")
    linkedin_url = models.CharField(max_length=255, blank=True, default="")
    relationship_rating = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)], default=0)
    relationship = models.CharField(max_length=100, blank=True, default="")  # manual add is required, default empty for csv upload
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
