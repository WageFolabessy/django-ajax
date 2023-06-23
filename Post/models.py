from django.db import models
from django.contrib.auth.models import User
from Profile.models import Profile
# Create your models here.

class Post(models.Model):
    title = models.CharField(max_length=50)
    description = models.TextField()
    liked = models.ManyToManyField(User, related_name='num_likes', blank=True)
    author = models.ForeignKey(Profile, on_delete=models.CASCADE)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)
    
    def __str__(self) -> str:
        return str(self.title)
    
    @property
    def count_likes(self):
        return self.liked.all().count()
    
    class Meta:
        ordering = ("-created",)
