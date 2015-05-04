from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Subject(models.Model):
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
    num_ratings = models.IntegerField(default=0)
    latitude = models.DecimalField(max_digits=10, decimal_places=5, blank=True, null=True)
    longitude = models.DecimalField(max_digits=10, decimal_places=5, blank=True, null=True)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2)
    subjects = models.ManyToManyField(Subject, blank=True, null=True)
    tutor_mode = models.BooleanField(default=False)
    busy = models.BooleanField(default=False)
    distance = models.DecimalField(max_digits=10, decimal_places=5, default=0.0)

class TutorRequest(models.Model):
    status = models.IntegerField()
    tutor_from = models.ForeignKey(Tutyr, related_name='tutor_from')
    tutor_to = models.ForeignKey(Tutyr, related_name='tutor_to')
    comments = models.CharField(max_length=250, null=True)
    location_latitude = models.DecimalField(max_digits=10, decimal_places=5, blank=True, null=True)
    location_longitude = models.DecimalField(max_digits=10, decimal_places=5, blank=True, null=True)
    location_comments = models.CharField(max_length=250, blank=True)
    timestamp = models.DateTimeField(null=True)
    session_start = models.DateTimeField(blank=True, null=True)
    session_end = models.DateTimeField(blank=True, null=True)

class Rating(models.Model):
    session_id = models.IntegerField()
    rating = models.IntegerField()
    comments = models.CharField(max_length=250)
    fbID_from = models.CharField(max_length=250)
    fbID_to = models.CharField(max_length=250)


