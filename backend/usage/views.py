from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from .models import UsageEvent
from .serializers import UsageEventSerializer


class UsageEventViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UsageEventSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["product", "api_key_prefix"]

    def get_queryset(self):
        return UsageEvent.objects.filter(user=self.request.user)

# Create your views here.
