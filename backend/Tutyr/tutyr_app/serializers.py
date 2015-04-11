from rest_framework import serializers
from tutyr_app.models import *

class SubjectSerializer(serializers.Serializer):
    subject_id = serializers.IntegerField()
    name = serializers.CharField(max_length=250)
    description = serializers.CharField(max_length=250)

    def create(self, validated_data):
        """
        Create and return a new `Snippet` instance, given the validated data.
        """
        return Subject.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing `Snippet` instance, given the validated data.
        """
        instance.subject_id = validated_data.get('subject_id', instance.subject_id)
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.save()
        return instance

class TutyrSerializer(serializers.Serializer):
    facebook_id = serializers.CharField(max_length=250)
    profile_pic = serializers.CharField(max_length=250)
    real_name = serializers.CharField(max_length=250)
    registration_date = serializers.DateTimeField()
    bio1 = serializers.CharField(max_length=250)
    bio2 = serializers.CharField(max_length=250)
    bio3 = serializers.CharField(max_length=250)
    rating = serializers.DecimalField(max_digits=10, decimal_places=2)
    latitude = serializers.DecimalField(max_digits=10, decimal_places=5)
    longitude = serializers.DecimalField(max_digits=10, decimal_places=5)
    hourly_rate = serializers.DecimalField(max_digits=10, decimal_places=2)
    subjects = SubjectSerializer(many=True, required=False)

    def create(self, validated_data):
        """
        Create and return a new `Snippet` instance, given the validated data.
        """
        return Tutyr.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing `Snippet` instance, given the validated data.
        """
        instance.facebook_id = validated_data.get('facebook_id', instance.facebook_id)
        instance.profile_pic = validated_data.get('profile_pic', instance.profile_pic)
        instance.real_name = validated_data.get('real_name', instance.real_name)
        instance.registration_date = validated_data.get('registration_date', instance.registration_date)
        instance.bio1 = validated_data.get('bio1', instance.bio1)
        instance.bio2 = validated_data.get('bio2', instance.bio2)
        instance.bio3 = validated_data.get('bio3', instance.bio3)
        instance.rating = validated_data.get('rating', instance.rating)
        instance.latitude = validated_data.get('latitude', instance.latitude)
        instance.longitude = validated_data.get('longitude', instance.longitude)
        instance.hourly_rate = validated_data.get('hourly_rate', instance.hourly_rate)
        instance.subjects = validated_data.get('subjects', instance.subjects)
        instance.save()
        return instance

class TutorRequestSerializer(serializers.Serializer):
    request_id = serializers.IntegerField()
    requesting_user = serializers.IntegerField()
    requested_user = serializers.IntegerField()
    comments = serializers.CharField(max_length=250)
    status = serializers.IntegerField()
    request_time = serializers.DateTimeField()
    session_start_time = serializers.DateTimeField()
    session_end_time = serializers.DateTimeField()
    session_rating = serializers.IntegerField()

    def create(self, validated_data):
        """
        Create and return a new `Snippet` instance, given the validated data.
        """
        return TutorRequest.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing `Snippet` instance, given the validated data.
        """
        instance.facebook_id = validated_data.get('facebook_id', instance.facebook_id)
        instance.request_id = validated_data.get('request_id', instance.request_id)
        instance.requesting_user = validated_data.get('requesting_user', instance.requesting_user)
        instance.requested_user = validated_data.get('requested_user', instance.requested_user)
        instance.comments = validated_data.get('comments', instance.comments)
        instance.status = validated_data.get('status', instance.status)
        instance.request_time = validated_data.get('request_time', instance.request_time)
        instance.session_start_time = validated_data.get('session_start_time', instance.session_start_time)
        instance.session_end_time = validated_data.get('session_end_time', instance.session_end_time)
        instance.session_rating = validated_data.get('session_rating', instance.session_rating)
        return instance
