from django.contrib import admin
from .models import Message, Room, Notifications



admin.site.register(Message)
admin.site.register(Room)
admin.site.register(Notifications)
