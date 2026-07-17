from django.db import models
from django.conf import settings


class Journal(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="journals",
    )
    title = models.CharField(max_length=255)
    excerpt = models.CharField(max_length=300, blank=True, default="")
    content = models.TextField(blank=True, default="")
    mood = models.CharField(max_length=10, blank=True, default="✨")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "journals"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.username} — {self.title}"
