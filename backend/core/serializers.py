from rest_framework import serializers
from .models import GuidePage


class GuidePageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GuidePage
        fields = [
            "id",
            "title",
            "slug",
            "page_type",
            "body",
            "published",
            "created_at",
            "updated_at",
        ]


