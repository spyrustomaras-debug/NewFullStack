from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_ADMIN = "ADMIN"
    ROLE_WORKER = "WORKER"
    ROLE_CHOICES = (
        (ROLE_ADMIN, "Admin"),
        (ROLE_WORKER, "Worker"),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default=ROLE_WORKER)

    def __str__(self):
        return f"{self.username} ({self.role})"


class Project(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    created_by = models.ForeignKey("core.User", on_delete=models.CASCADE, related_name="projects")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
