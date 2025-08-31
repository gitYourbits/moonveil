from django.contrib import admin
from .models import Ticket


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ("user", "subject", "status", "created_at", "updated_at")
    list_filter = ("status",)

# Register your models here.
