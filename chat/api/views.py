from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.core.exceptions import ObjectDoesNotExist
from .serializers import RoomSerializer, ProfileSerializer, ChatSerializer
from chat.models import Message, Room
from backend.models import Profile




class RoomListApiView(GenericAPIView):
    serializer_class = RoomSerializer
    permission_classes = [IsAuthenticated, ]

    def get(self, *args, **kwargs):
        try:
            profile = Profile.objects.get(author__id = self.request.user.id)
        except ObjectDoesNotExist:
            return Response({ 'message ' : 'profile does not exist'}, status = status.HTTP_400_BAD_REQUEST)
        rooms = profile.rooms.exclude()

        return Response(self.get_serializer(rooms, many = True, context = { 'request' : self.request}).data)

class ProfileDetialApiView(GenericAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated, ]

    def post(self, *args, **kwargs):
        ID = kwargs['id']

        if self.request.data['type'] == 'userID':
            profile_qs = Profile.objects.filter(author__id = ID)
        else:
            profile_qs = Profile.objects.filter(id = ID)

        if not profile_qs.exists():
            return Response({ 'message ' : 'profile does not exist'}, status = status.HTTP_404_NOT_FOUND)
        
        profile = profile_qs[0]
        return Response(self.get_serializer(profile).data)

class ChatsListApiView(GenericAPIView):
    serializer_class = ChatSerializer
    permission_classes = [IsAuthenticated, ]

    def get(self, *args, **kwargs):
        room_name = kwargs['room_name']
        room_qs = Room.objects.filter(name = f"group_{room_name.lower()}")
        if not room_qs.exists():
            return Response({ 'message ' : 'Room does not exist'}, status = status.HTTP_404_NOT_FOUND)
        
        room = room_qs[0]
        chats = room.messages.all()

        return Response(self.get_serializer(chats, many = True).data)
        

