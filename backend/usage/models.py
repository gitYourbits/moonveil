from django.db import models
from django.contrib.auth.models import User
from products.models import Product


class UsageEvent(models.Model):
    user = models.ForeignKey(User, related_name="usage_events", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name="usage_events", on_delete=models.CASCADE)
    api_key_prefix = models.CharField(max_length=12, blank=True)
    endpoint = models.CharField(max_length=200)
    request_id = models.CharField(max_length=64, blank=True)
    tokens_in = models.PositiveIntegerField(default=0)
    tokens_out = models.PositiveIntegerField(default=0)
    latency_ms = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["user", "product", "created_at"]),
        ]

# Create your models here.
