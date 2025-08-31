from django.db import models
from django.contrib.auth.models import User
from products.models import Product


class Invoice(models.Model):
    user = models.ForeignKey(User, related_name="invoices", on_delete=models.CASCADE)
    number = models.CharField(max_length=32, unique=True)
    amount_cents = models.PositiveIntegerField()
    currency = models.CharField(max_length=10, default="USD")
    issued_at = models.DateTimeField(auto_now_add=True)
    paid = models.BooleanField(default=False)


class PaymentMethod(models.Model):
    user = models.ForeignKey(User, related_name="payment_methods", on_delete=models.CASCADE)
    stripe_pm_id = models.CharField(max_length=64)
    brand = models.CharField(max_length=20, blank=True)
    last4 = models.CharField(max_length=4, blank=True)
    exp_month = models.PositiveSmallIntegerField(default=1)
    exp_year = models.PositiveSmallIntegerField(default=2030)

# Create your models here.
