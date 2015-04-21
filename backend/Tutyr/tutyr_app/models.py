from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Subject(models.Model):
    subject_id = models.IntegerField()
    name = models.CharField(max_length=250)
    description = models.CharField(max_length=250)

class Tutyr(models.Model):
    facebook_id = models.CharField(max_length=250)
    email = models.CharField(max_length=250, blank=True, null=True)
    profile_pic = models.CharField(max_length=250)
    real_name = models.CharField(max_length=250)
    registration_date = models.DateTimeField()
    bio1 = models.CharField(max_length=250)
    bio2 = models.CharField(max_length=250)
    bio3 = models.CharField(max_length=250)
    rating = models.DecimalField(max_digits=10, decimal_places=2)
    latitude = models.DecimalField(max_digits=10, decimal_places=5, blank=True, null=True)
    longitude = models.DecimalField(max_digits=10, decimal_places=5, blank=True, null=True)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2)
    subjects = models.ManyToManyField(Subject, blank=True, null=True)
    tutor_mode = models.BooleanField(default=False)

class TutorRequest(models.Model):
    request_id = models.IntegerField()
    requesting_user = models.IntegerField()
    requested_user = models.IntegerField()
    comments = models.CharField(max_length=250)
    status = models.IntegerField()
    request_time = models.DateTimeField()
    session_start_time = models.DateTimeField()
    session_end_time = models.DateTimeField()
    session_rating = models.IntegerField()



