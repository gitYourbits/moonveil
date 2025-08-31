from django.db import models
from django.contrib.auth.models import User
import secrets


class ApiKey(models.Model):
    user = models.ForeignKey(User, related_name="api_keys", on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    prefix = models.CharField(max_length=12, editable=False)
    hashed_key = models.CharField(max_length=128, editable=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_used_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ("user", "name")

    def save(self, *args, **kwargs):
        if not self.prefix:
            self.prefix = secrets.token_urlsafe(9)[:12]
        super().save(*args, **kwargs)


# Create your models here.
