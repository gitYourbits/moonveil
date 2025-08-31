from rest_framework import serializers
from .models import UsageEvent


class UsageEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsageEvent
        fields = [
            "id",
            "product",
            "api_key_prefix",
            "endpoint",
            "request_id",
            "tokens_in",
            "tokens_out",
            "latency_ms",
            "created_at",
        ]


