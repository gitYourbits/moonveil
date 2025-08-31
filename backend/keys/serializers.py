from rest_framework import serializers
from .models import ApiKey


class ApiKeySerializer(serializers.ModelSerializer):
    class Meta:
        model = ApiKey
        fields = [
            "id",
            "name",
            "prefix",
            "is_active",
            "created_at",
            "last_used_at",
        ]


