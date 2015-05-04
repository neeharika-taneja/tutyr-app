from rest_framework import serializers
from tutyr_app.models import *

class SubjectSerializer(serializers.Serializer):
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
    num_ratings = serializers.IntegerField()
    latitude = serializers.DecimalField(max_digits=10, decimal_places=5)
    longitude = serializers.DecimalField(max_digits=10, decimal_places=5)
    hourly_rate = serializers.DecimalField(max_digits=10, decimal_places=2)
    subjects = SubjectSerializer(many=True, required=False)
    email = serializers.CharField(max_length=250)
    tutor_mode = serializers.BooleanField()
    busy = serializers.BooleanField()
    distance = serializers.DecimalField(max_digits=10, decimal_places=5)

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
        instance.num_ratings = validated_data.get('num_ratings', instance.num_ratings)
        instance.latitude = validated_data.get('latitude', instance.latitude)
        instance.longitude = validated_data.get('longitude', instance.longitude)
        instance.hourly_rate = validated_data.get('hourly_rate', instance.hourly_rate)
        instance.subjects = validated_data.get('subjects', instance.subjects)
        instance.email = validated_data.get('email', instance.email)
        instance.tutor_mode = validated_data.get('tutor_mode', instance.tutor_mode)
        instance.busy = validated_data.get('busy', instance.busy)
        instance.distance = validated_data.get('distance', instance.distance)
        instance.save()
        return instance

class TutorRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = TutorRequest
        fields = ('id', 'status', 'tutor_from', 'tutor_to', 'comments',
            'location_latitude', 'location_longitude', 'location_comments',
            'timestamp', 'session_start', 'session_end')
        depth = 1

class TutorRequestSerializer2(serializers.Serializer):
    id = serializers.IntegerField()
    status = serializers.IntegerField()
    tutor_from = TutyrSerializer()
    tutor_to = TutyrSerializer()
    comments = serializers.CharField(max_length=250)
    location_latitude = serializers.DecimalField(max_digits=10, decimal_places=10, required=False)
    location_longitude = serializers.DecimalField(max_digits=10, decimal_places=10, required=False)
    location_comments = serializers.CharField(max_length=250, required=False)
    timestamp = serializers.DateTimeField()
    session_start = serializers.DateTimeField(required=False)
    session_end = serializers.DateTimeField(required=False)

    def create(self, validated_data):
        """
        Create and return a new `TutorRequest` instance, given the validated data.
        """
        return TutorRequest.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing `TutorRequest` instance, given the validated data.
        """
        instance.id = validated_data.get('id', instance.id)
        instance.status = validated_data.get('status', instance.status)
        instance.tutor_from = validated_data.get('tutor_from', instance.tutor_from)
        instance.tutor_to = validated_data.get('tutor_to', instance.tutor_to)
        instance.comments = validated_data.get('comments', instance.comments)
        instance.location_latitude = validated_data.get('location_latitude', location_latitude.status)
        instance.location_longitude = validated_data.get('location_longitude', instance.location_longitude)
        instance.location_comments = validated_data.get('location_comments', instance.location_comments)
        instance.timestamp = validated_data.get('timestamp', instance.timestamp)
        instance.session_start = validated_data.get('session_start', instance.session_start)
        instance.session_end = validated_data.get('session_end', instance.session_end)
        return instance

class RatingSerializer(serializers.Serializer):
    session_id = serializers.IntegerField()
    rating = serializers.IntegerField()
    comments = serializers.CharField(max_length=250, required=False)
    fbID_from = serializers.CharField(max_length=250)
    fbID_to = serializers.CharField(max_length=250)

    def create(self, validated_data):
        """
        Create and return a new `Rating` instance, given the validated data.
        """
        return Rating.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing `Rating` instance, given the validated data.
        """
        instance.session_id = validated_data.get('session_id', instance.session_id)
        instance.rating = validated_data.get('rating', instance.rating)
        instance.comments = validated_data.get('comments', instance.comments)
        instance.fbID_from = validated_data.get('fbID_from', instance.fbID_from)
        instance.fbID_to = validated_data.get('fbID_to', instance.fbID_to)
        instance.save()
        return instance


