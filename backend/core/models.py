from django.db import models


class GuidePage(models.Model):
    TYPE_CHOICES = (
        ("product_launch", "Product Launch"),
        ("integration", "Integration"),
        ("help", "Help"),
        ("docs", "Docs"),
    )
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    page_type = models.CharField(max_length=32, choices=TYPE_CHOICES, default="docs")
    body = models.TextField(blank=True)
    published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["title"]

    def __str__(self) -> str:
        return self.title

# Create your models here.
