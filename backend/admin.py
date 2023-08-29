from django.contrib import admin
from .models import Like, Post, Profile, Comment, RandomUsers


class LikeInline(admin.TabularInline):
    model = Like.post.through


class PostAdmin(admin.ModelAdmin):
    inlines = [
        LikeInline
    ]


admin.site.register(Profile)
admin.site.register(Like)
admin.site.register(Comment)
admin.site.register(RandomUsers)
admin.site.register(Post, PostAdmin)