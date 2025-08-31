from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Subscription


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name"]


class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ["id", "plan", "is_active", "started_at", "ended_at"]


