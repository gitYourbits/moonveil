from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from .serializers import UserSerializer, SubscriptionSerializer
from .models import Subscription
from products.models import PricingPlan
from usage.models import UsageEvent
from billing.models import Invoice


class MeViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=["get"], url_path="profile")
    def profile(self, request):
        return Response(UserSerializer(request.user).data)

    @action(detail=False, methods=["get"], url_path="subscriptions")
    def subscriptions(self, request):
        subs = Subscription.objects.filter(user=request.user, is_active=True)
        return Response(SubscriptionSerializer(subs, many=True).data)

    @action(detail=False, methods=["post"], url_path="subscribe")
    def subscribe(self, request):
        plan_id = request.data.get("plan")
        if not plan_id:
            return Response({"detail": "plan is required"}, status=400)
        try:
            plan = PricingPlan.objects.get(id=plan_id, is_active=True)
        except PricingPlan.DoesNotExist:
            return Response({"detail": "invalid plan"}, status=404)
        sub, _created = Subscription.objects.get_or_create(user=request.user, plan=plan, defaults={"is_active": True})
        sub.is_active = True
        sub.ended_at = None
        sub.save()
        return Response(SubscriptionSerializer(sub).data, status=201)

    @action(detail=False, methods=["get"], url_path="dashboard")
    def dashboard(self, request):
        usage_count = UsageEvent.objects.filter(user=request.user).count()
        invoices_total = Invoice.objects.filter(user=request.user).count()
        invoices_unpaid = Invoice.objects.filter(user=request.user, paid=False).count()
        subs = Subscription.objects.filter(user=request.user, is_active=True).count()
        return Response({
            "usage_events": usage_count,
            "invoices_total": invoices_total,
            "invoices_unpaid": invoices_unpaid,
            "active_subscriptions": subs,
        })

    @action(detail=False, methods=["patch"], url_path="profile")
    def update_profile(self, request):
        user: User = request.user
        for field in ["first_name", "last_name", "email"]:
            if field in request.data:
                setattr(user, field, request.data[field])
        user.save()
        return Response(UserSerializer(user).data)

# Create your views here.
