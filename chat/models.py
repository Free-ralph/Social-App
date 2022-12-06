from django.db import models
from django.utils.text import slugify
from django.contrib.auth.models import User
from backend.models import Profile


class Room(models.Model):
    name = models.CharField(max_length = 100)
    slug = models.SlugField(blank = True, null = True)
    members = models.ManyToManyField(Profile, related_name = "rooms")

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)

        return super().save(*args, **kwargs)  


class Message(models.Model):
    room = models.ForeignKey(Room, on_delete = models.CASCADE, related_name = 'messages')
    profile = models.ForeignKey(Profile, on_delete = models.CASCADE, related_name = 'sent_messages', null = True)
    receiver_profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name = 'received_messages', null = True)
    read = models.BooleanField( default=False )
    content = models.TextField()
    date_added = models.DateTimeField(auto_now_add = True)

    def __str__(self):
        return f"{self.room.name}"
    
class Notifications(models.Model):
    receiver = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='notifications')
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='notifications')
    message = models.CharField(max_length=200, null = True, blank=True)
    seen = models.BooleanField(default=False)

    def __str__(self):
        return self.receiver.name
