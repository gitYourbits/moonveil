from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils import timezone
from .models import ApiKey
from .serializers import ApiKeySerializer
from .utils import generate_api_key


class ApiKeyViewSet(viewsets.ModelViewSet):
    serializer_class = ApiKeySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ApiKey.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        token, prefix, hashed = generate_api_key()
        instance = serializer.save(user=self.request.user, prefix=prefix, hashed_key=hashed)
        # Return the plain token once
        self._plain_token = token

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        if hasattr(self, "_plain_token"):
            response.data["token"] = self._plain_token
        return response

    @action(detail=True, methods=["post"], url_path="revoke")
    def revoke(self, request, pk=None):
        key = self.get_object()
        key.is_active = False
        key.save(update_fields=["is_active"])
        return Response(ApiKeySerializer(key).data)


# Create your views here.
