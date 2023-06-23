from django.contrib import admin
from .models import Profile
# Register your models here.

class AdminProfile(admin.ModelAdmin):
    list_display = ('user', 'bio', 'avatar', 'updated', 'created')

admin.site.register(Profile, AdminProfile)
