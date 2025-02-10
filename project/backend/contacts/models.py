from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


# Basic contact model
class Contact(models.Model):
    name = models.CharField(max_length=100)
    job = models.CharField(max_length=100)
    relationship_rating = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    relationship = models.CharField(max_length=100)

    def __str__(self):
        return self.name
