from django.contrib import admin
from .models import UsageEvent


@admin.register(UsageEvent)
class UsageEventAdmin(admin.ModelAdmin):
    list_display = ("user", "product", "endpoint", "tokens_in", "tokens_out", "latency_ms", "created_at")
    list_filter = ("product",)

# Register your models here.
