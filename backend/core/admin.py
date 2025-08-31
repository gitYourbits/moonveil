from django.contrib import admin
from .models import GuidePage


@admin.register(GuidePage)
class GuidePageAdmin(admin.ModelAdmin):
    list_display = ("title", "page_type", "published", "updated_at")
    prepopulated_fields = {"slug": ("title",)}

# Register your models here.
