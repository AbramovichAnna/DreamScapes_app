from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

class DreamUser(AbstractUser):
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True)
    date_of_birth = models.DateField(null=True)

    def __str__(self):
        return self.username

class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Sound(models.Model):
    title = models.CharField(max_length=100)
    file = models.FileField(upload_to='sounds/')
    icon = models.ImageField(upload_to='sound_icons/', null=True)
    categories = models.ManyToManyField(Category) #allow multiple categories per sound
    created_at = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return self.title

class UserMix(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    sounds = models.ManyToManyField(Sound)
    title = models.CharField(max_length=100)

    def __str__(self):
        return self.title

