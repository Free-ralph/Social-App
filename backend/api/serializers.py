from dataclasses import field, fields
from multiprocessing import context
import profile
from pyexpat import model
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import password_validation
from django.core import exceptions
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from backend.models import Like, Profile, Post, Comment


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'username', 
            'email', 
            'password',
        ]

    def validate(self, data):
        user = User(**data)
        password = data.get('password')
        errors = dict()
        

        try :
            password_validation.validate_password(password=password, user = user)
        except exceptions.ValidationError as e:
            errors['password'] = list(e)

        if errors :
            raise serializers.ValidationError(errors)
        
        return super(RegisterSerializer, self).validate(data)
    
    def create(self, validated_data):
        password = validated_data.get('password')
        user  = User(**validated_data)
        user.set_password(password)
        return user    

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'username', 
            'email'
        ]

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['id'] = user.id

        return token


    

class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = [
            'name',
            'city', 
            'state', 
            'bio', 
            'profile_image', 
            'cover_image'
        ]

        extra_kwargs = {
            'profile_image' : {'required' : False},
            'cover_image' : {'required' : False},
            'bio' : {'required' : False},
            'state' : {'required' : False},
            'city' : {'required' : False},
            'name' : {'required' : False},
            }


class ProfileInfoSerializer(serializers.ModelSerializer):
    profile_image = serializers.SerializerMethodField()
    class Meta:
        model = Profile
        fields = [
            'id',
            'profile_image', 
            'name', 
        ]

    def get_profile_image(self, obj):
        request = self.context.get('request')
        if obj.profile_image:
            image_url = obj.profile_image.url
            return request.build_absolute_uri(image_url)

class CommentSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()
    profile_image = serializers.SerializerMethodField()
    first_reply = serializers.SerializerMethodField()
    isLiked = serializers.SerializerMethodField()
    likes = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            'id',
            'author', 
            'message', 
            'created_at', 
            'profile_image',
            'first_reply', 
            'isLiked', 
            'likes'
        ]

    def get_author(self, obj):
        if not obj.profile:
            return 'anonymous'
        author = obj.profile.author.username
        return author

    def get_profile_image(self, obj):
        request = self.context.get('request')
        if obj.profile.profile_image:
            image_url = obj.profile.profile_image.url
            return request.build_absolute_uri(image_url)
    
    def get_first_reply(self, obj):
        return CommentSerializer(obj.replies.first(), context = self.context).data
    
    def get_isLiked(self, obj):
        request = self.context.get('request')
        liked_qs = Like.objects.filter(profile__author = request.user)
        if not liked_qs.exists():
            return False
        
        if not obj.likes.filter(id = liked_qs[0].id).exists():
            return False
        
        return True

    def get_likes(self, obj):
        return obj.likes.count()

class PostSerializer(serializers.ModelSerializer):
    profile = ProfileInfoSerializer( read_only = True)
    image = serializers.SerializerMethodField()
    likes = serializers.SerializerMethodField()
    isLiked = serializers.SerializerMethodField()
    commentCount = serializers.SerializerMethodField()

    class Meta:
        model = Post
        depth = 1
        fields = [
            'id',
            'profile',
            'timestamp',
            'message',
            'image',
            'likes',
            'isLiked',
            'commentCount'
        ]
        extra_kwargs  = {'image' : {'required' : False}}

    def create(self, validated_data):
        post = Post(**validated_data)
        return post

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image:
            image_url = obj.image.url
            return request.build_absolute_uri(image_url)

    def get_isLiked(self, obj):
        request = self.context.get('request')
        liked_profile_qs = Like.objects.filter(profile__author = request.user)
        if not liked_profile_qs.exists():
            return False
        if not obj.likes.filter(id = liked_profile_qs[0].id).exists():
            return False
        
        return True
    
    def get_likes(self, obj):
        return obj.likes.count()
    
    def get_commentCount(self, obj):
        return obj.comments.count()

class ProfileSerializer(serializers.ModelSerializer):
    posts = PostSerializer(many = True, read_only = True)
    author = UserSerializer(read_only = True)
    profile_image = serializers.SerializerMethodField()
    cover_image = serializers.SerializerMethodField()
    class Meta:
        model = Profile 
        depth = 2
        fields = [
                'id',
                'name',
                'city',
                'state',
                'bio',
                'created_at',
                'following',
                'followers',
                'author', 
                'profile_image', 
                'cover_image', 
                'posts' ,
                ]
        
    def get_profile_image(self, obj):
        request = self.context.get('request')
        if obj.profile_image:
            image_url = obj.profile_image.url
            return request.build_absolute_uri(image_url)

    def get_cover_image(self, obj):
        request = self.context.get('request')
        if obj.cover_image:
            image_url = obj.cover_image.url
            return request.build_absolute_uri(image_url)
    

class CommentCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Comment
        fields = [
            'message',
        ]
    
    def create(self, validated_data):
        comment = Comment(**validated_data)
        return comment