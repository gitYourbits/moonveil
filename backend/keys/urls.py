from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ApiKeyViewSet

router = DefaultRouter()
router.register(r"mine", ApiKeyViewSet, basename="api-key")

urlpatterns = [
    path("", include(router.urls)),
]


