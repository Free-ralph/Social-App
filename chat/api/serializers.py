from rest_framework import serializers
from chat.models import Message, Room
from backend.models import Profile

class ProfileSerializer(serializers.ModelSerializer):
    class Meta :
        model = Profile
        fields = ['name', 'id']

class RoomSerializer(serializers.ModelSerializer):
    members = ProfileSerializer(read_only = True, many = True)
    unread_message_count = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()
    profileID = serializers.SerializerMethodField() 
    profile_image = serializers.SerializerMethodField() 
    
    class Meta:
        model = Room
        fields = [
            'id',
            'name', 
            'members', 
            'unread_message_count', 
            'last_message', 
            'name', 
            'profileID',
            'profile_image'
        ]
    
    def get_unread_message_count(self, obj):
        count = obj.messages.filter(read = False).count()
        return count

    def get_last_message(self, obj):
        message = obj.messages.last()
        if message:
            return message.content
    
    def get_name(self, obj):
        # since every room has two member, i'll exclude mine and return the name of the other
        profile = self.context['request'].user.profile
        other_profile_qs = obj.members.exclude(id = profile.id)
        name = 'Anonymous'
        if other_profile_qs:
            name = other_profile_qs[0].name

        return name
    
    def get_profileID(self, obj):
        user_profile = self.context['request'].user.profile
        other_profile_qs = obj.members.exclude(id = user_profile.id)
        ID = None
        if other_profile_qs.exists():
            ID = other_profile_qs[0].id

        return ID
    
    def get_profile_image(self, obj):
        request = self.context.get('request')
        user_profile = request.user.profile
        other_profile_qs = obj.members.exclude(id = user_profile.id)
        if other_profile_qs.exists():
            other_profile = other_profile_qs[0]
            if other_profile.profile_image:
                image_url = other_profile.profile_image.url
                return request.build_absolute_uri(image_url)

class ProfileSerializer(serializers.ModelSerializer):
    profile_image = serializers.SerializerMethodField()
    cover_image = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()
    class Meta:
        model = Profile
        fields = [
                'id',
                'name',
                'bio',
                'created_at',
                'following',
                'followers',
                'profile_image', 
                'cover_image',
                'username'
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

    def get_username(self, obj):
        username = obj.author.username
        return username


class ChatSerializer(serializers.ModelSerializer):
    receiver_profile_id = serializers.SerializerMethodField()
    class Meta:
        model = Message
        fields = [
            'read',
            'content',
            'date_added',
            'receiver_profile_id', 
            'profile',
        ]

    def get_receiver_profile_id(self, obj):
        return obj.receiver_profile.id