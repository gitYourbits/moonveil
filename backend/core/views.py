from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import GuidePage
from .serializers import GuidePageSerializer


class PublicPageViewSet(viewsets.ViewSet):
    """Public non-auth pages content endpoints."""

    @action(detail=False, methods=["get"], url_path="home")
    def home(self, request):
        return Response({"title": "Home", "content": "Welcome to Finagen."})

    @action(detail=False, methods=["get"], url_path="explore")
    def explore(self, request):
        return Response({"title": "Explore Products", "content": "Browse AI agents."})

    @action(detail=False, methods=["get"], url_path="usage-guide")
    def usage_guide(self, request):
        return Response({"title": "Usage Guide", "content": "How to use products."})

    @action(detail=False, methods=["get"], url_path="contact")
    def contact(self, request):
        return Response({"title": "Contact Us", "email": "support@example.com"})

    @action(detail=False, methods=["get"], url_path="docs")
    def docs(self, request):
        return Response({"title": "Docs", "content": "API and integration docs."})


class GuidePageViewSet(viewsets.ModelViewSet):
    queryset = GuidePage.objects.filter(published=True)
    serializer_class = GuidePageSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "slug"

# Create your views here.
