from django.contrib import admin
from .models import Invoice, PaymentMethod


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ("user", "number", "amount_cents", "currency", "issued_at", "paid")
    list_filter = ("paid",)


@admin.register(PaymentMethod)
class PaymentMethodAdmin(admin.ModelAdmin):
    list_display = ("user", "brand", "last4", "exp_month", "exp_year")


# Register your models here.
