from django.db import models
from django.contrib.auth.models import User


class Ticket(models.Model):
    user = models.ForeignKey(User, related_name="tickets", on_delete=models.CASCADE)
    subject = models.CharField(max_length=200)
    message = models.TextField()
    status = models.CharField(max_length=20, default="open")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

# Create your models here.
