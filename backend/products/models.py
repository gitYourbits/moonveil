from django.db import models


class Product(models.Model):
    """AI Agent product offered on the platform."""
    name = models.CharField(max_length=200, unique=True)
    slug = models.SlugField(max_length=200, unique=True)
    short_description = models.CharField(max_length=300, blank=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name


class PricingPlan(models.Model):
    """Pricing plans for a product (e.g., Free, Pro, Enterprise)."""
    product = models.ForeignKey(Product, related_name="plans", on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120)
    monthly_price_cents = models.PositiveIntegerField(default=0)
    annual_price_cents = models.PositiveIntegerField(default=0)
    quota_requests_per_month = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ("product", "slug")
        ordering = ["product__name", "monthly_price_cents"]

    def __str__(self) -> str:
        return f"{self.product.name} - {self.name}"

# Create your models here.
