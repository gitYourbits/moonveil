from django.contrib import admin
from .models import Product, PricingPlan


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "is_active", "created_at")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name", "short_description")


@admin.register(PricingPlan)
class PricingPlanAdmin(admin.ModelAdmin):
    list_display = ("product", "name", "monthly_price_cents", "is_active")
    list_filter = ("product", "is_active")

# Register your models here.
