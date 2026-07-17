from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Custom user model — extend here as needed (e.g., avatar, xp, level).
    Using AbstractUser so we keep all Django auth goodness (password hashing, etc.)
    """
    bio = models.TextField(blank=True, default="")
    avatar_url = models.URLField(blank=True, default="")

    class Meta:
        db_table = "users"
