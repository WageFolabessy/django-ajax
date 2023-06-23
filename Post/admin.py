from django.contrib import admin
from .models import Post
# Register your models here.

class AdminPost(admin.ModelAdmin):
    list_display = ('title', 'description', 'count_likes', 'author', 'updated', 'created')

admin.site.register(Post, AdminPost)
