from rest_framework import serializers
from .models import Invoice, PaymentMethod


class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = ["id", "number", "amount_cents", "currency", "issued_at", "paid"]


class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = ["id", "stripe_pm_id", "brand", "last4", "exp_month", "exp_year"]


