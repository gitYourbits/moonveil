from rest_framework import serializers
from .models import Product, PricingPlan


class PricingPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricingPlan
        fields = [
            "id",
            "name",
            "slug",
            "monthly_price_cents",
            "annual_price_cents",
            "quota_requests_per_month",
            "is_active",
        ]


class ProductSerializer(serializers.ModelSerializer):
    plans = PricingPlanSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "slug",
            "short_description",
            "description",
            "is_active",
            "created_at",
            "updated_at",
            "plans",
        ]


