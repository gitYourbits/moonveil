from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PublicPageViewSet, GuidePageViewSet

router = DefaultRouter()
router.register(r"pages", PublicPageViewSet, basename="public-pages")
router.register(r"guides", GuidePageViewSet, basename="guide-page")

urlpatterns = [
    path("", include(router.urls)),
]


