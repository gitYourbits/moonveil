from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, PricingPlanViewSet

router = DefaultRouter()
router.register(r"items", ProductViewSet, basename="product")
router.register(r"plans", PricingPlanViewSet, basename="plan")

urlpatterns = [
    path("", include(router.urls)),
]


