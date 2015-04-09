from django.db import models
from django.contrib.auth.models import User
# Create your models here.

import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.path.join(BASE_DIR, 'profileimages')

class Tutyr(models.Model):
    facebook_id = models.CharField(max_length=250)
    #profile_image = models.FileField(upload_to='profileimages/', max_length=None, null=True)
    real_name = models.CharField(max_length=250)
    registration_date = models.DateTimeField()
    bio1 = models.CharField(max_length=250)
    bio2 = models.CharField(max_length=250)
    bio3 = models.CharField(max_length=250)
    rating = models.DecimalField(max_digits=10, decimal_places=5)
    latitude = models.DecimalField(max_digits=10, decimal_places=5)
    longitude = models.DecimalField(max_digits=10, decimal_places=5)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=5)



