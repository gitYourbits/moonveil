from rest_framework.authentication import BaseAuthentication
from rest_framework import exceptions
from django.contrib.auth.models import User
from .models import ApiKey
import hashlib


class ApiKeyAuthentication(BaseAuthentication):
    keyword = "Api-Key"

    def authenticate(self, request):
        token = request.headers.get(self.keyword) or request.query_params.get("api_key")
        if not token:
            return None
        try:
            prefix, _secret = token.split(".", 1)
        except ValueError:
            raise exceptions.AuthenticationFailed("Invalid API key format")
        hashed = hashlib.sha256(token.encode("utf-8")).hexdigest()
        try:
            item = ApiKey.objects.select_related("user").get(prefix=prefix, hashed_key=hashed, is_active=True)
        except ApiKey.DoesNotExist:
            raise exceptions.AuthenticationFailed("Invalid API key")
        return (item.user, None)


