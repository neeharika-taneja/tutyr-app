from django.forms import widgets
from rest_framework import serializers
from tutyr_app.models import Tutyr


class TutyrSerializer(serializers.Serializer):
    facebook_id = serializers.CharField(max_length=250)
    #profile_image = serializers.FileField(max_length=None, allow_empty_file=True, use_url=True)
    real_name = serializers.CharField(max_length=250)
    registration_date = serializers.DateTimeField()
    bio1 = serializers.CharField(max_length=250)
    bio2 = serializers.CharField(max_length=250)
    bio3 = serializers.CharField(max_length=250)
    rating = serializers.DecimalField(max_digits=10, decimal_places=5)
    latitude = serializers.DecimalField(max_digits=10, decimal_places=5)
    longitude = serializers.DecimalField(max_digits=10, decimal_places=5)
    hourly_rate = serializers.DecimalField(max_digits=10, decimal_places=5)

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
        #instance.profile_image = validated_data.get('profile_image', instance.profile_image)
        instance.real_name = validated_data.get('real_name', instance.real_name)
        instance.registration_date = validated_data.get('registration_date', instance.registration_date)
        instance.bio1 = validated_data.get('bio1', instance.bio1)
        instance.bio2 = validated_data.get('bio2', instance.bio2)
        instance.bio3 = validated_data.get('bio3', instance.bio3)
        instance.rating = validated_data.get('rating', instance.rating)
        instance.latitude = validated_data.get('latitude', instance.latitude)
        instance.longitude = validated_data.get('longitude', instance.longitude)
        instance.hourly_rate = validated_data.get('hourlyrate', instance.hourly_rate)
        instance.save()
        return instance