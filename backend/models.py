from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from backend.utils import compress_and_save_image

class Post(models.Model):
    profile = models.ForeignKey('Profile', related_name = 'posts', on_delete = models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add = True)
    message = models.TextField(null = True)
    image = models.ImageField(upload_to = 'feeds', null = True)

    class Meta:
        ordering = ['-timestamp']
    def __str__(self):
        return self.profile.author.username

class Like(models.Model):
    profile = models.OneToOneField('Profile', on_delete = models.SET_NULL, null = True, blank = True)
    post = models.ManyToManyField('Post', related_name = 'likes', blank = True)
    comment = models.ManyToManyField('Comment', related_name = 'likes', blank = True)

    def __str__(self):
        if not self.profile:
            return 'anonymous'
        return self.profile.author.username

class Profile(models.Model):
    name = models.CharField(max_length = 200)
    city = models.CharField(max_length = 100, blank = True)
    state = models.CharField(max_length = 100, blank = True)
    bio = models.TextField(blank = True)
    created_at = models.DateTimeField(auto_now_add = True)
    author = models.OneToOneField(User, on_delete = models.CASCADE, related_name='profile')
    following = models.ManyToManyField('self', related_name = 'followers', symmetrical=False, blank = True)
    profile_image = models.ImageField(upload_to = 'profile', default = 'profile/default.jpg', null = True, blank = True)
    cover_image = models.ImageField(upload_to = 'profile_cover', default = 'profile/default.jpg',  null = True, blank = True)

    # def followers(self):
    #     return self.followers
    def __str__(self):
        return self.author.username

@receiver(post_save, sender = User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        profile = Profile(
            author = instance, 
        )
        profile.save()
        profile.following.add(profile)
        profile.save()

class Comment(models.Model):
    post = models.ForeignKey('Post', on_delete = models.CASCADE, related_name = 'comments', null = True )
    profile = models.ForeignKey('Profile', on_delete = models.CASCADE, related_name = 'comments', null = True)
    message = models.TextField()
    replies = models.ManyToManyField('self', symmetrical = False, blank=True)
    created_at = models.DateTimeField(auto_now_add = True)

    def __str__(self):
        return self.message

class RandomUsers(models.Model):
    username = models.CharField(max_length=200)
    password = models.CharField(max_length=300)
    name = models.CharField(max_length=200, null = True)
    is_used = models.BooleanField(default=False)
    email = models.EmailField(null=True)

    def __str__(self):
        return self.username