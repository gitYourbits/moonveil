from django.db import models
from django.contrib.auth.models import User
from products.models import PricingPlan


class Subscription(models.Model):
    user = models.ForeignKey(User, related_name="subscriptions", on_delete=models.CASCADE)
    plan = models.ForeignKey(PricingPlan, related_name="subscriptions", on_delete=models.PROTECT)
    is_active = models.BooleanField(default=True)
    started_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(null=True, blank=True)

    def __str__(self) -> str:
        return f"{self.user.username} -> {self.plan}"

# Create your models here.
