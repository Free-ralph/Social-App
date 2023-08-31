from django.contrib import admin
from .models import Like, Post, Profile, Comment, RandomUsers


class LikeInline(admin.TabularInline):
    model = Like.post.through


class PostAdmin(admin.ModelAdmin):
    inlines = [
        LikeInline
    ]

class RandomUserAdmin(admin.ModelAdmin):
    list_display = [
        'username',
        'name',
        'is_used' 
    ]


admin.site.register(Profile)
admin.site.register(Like)
admin.site.register(Comment)
admin.site.register(RandomUsers, RandomUserAdmin)
admin.site.register(Post, PostAdmin)