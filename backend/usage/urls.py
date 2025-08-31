from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UsageEventViewSet

router = DefaultRouter()
router.register(r"events", UsageEventViewSet, basename="usage-event")

urlpatterns = [
    path("", include(router.urls)),
]


