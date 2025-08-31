from django.contrib import admin
from .models import ApiKey


@admin.register(ApiKey)
class ApiKeyAdmin(admin.ModelAdmin):
    list_display = ("user", "name", "prefix", "is_active", "created_at", "last_used_at")
    search_fields = ("user__username", "prefix", "name")

# Register your models here.
