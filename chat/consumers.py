from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Room , Message, Notifications
from channels.db import database_sync_to_async
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.models import User
from asgiref.sync import sync_to_async
from backend.models import Profile
import json

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f"group_{self.room_name.lower()}"

        user_profile_id = self.scope['url_route']['kwargs']['user_id']
        receiver_profile_id = self.scope['url_route']['kwargs']['receiver_id']
        self.profile = await self.get_profile(user_profile_id)
        self.receiver = await self.get_profile(receiver_profile_id)

        await self.save_room()
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()
    
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)

        if text_data_json['type'] == 'chat':
            data = text_data_json['data']
            action = text_data_json['action']

            if action == 'read_all_messages' :
                await self.read_all_messages(data['message_id'])

            elif action == 'send_chat':
                message_id = await self.save_message(data['content'], data['receiver_profile_id'])

                # broadcast to all channels in the group
                # once the all consumer instances listening recieves a message
                #  the chat_meessage function handles it
                await self.channel_layer.group_send(
                    self.room_group_name, {
                        'type' : 'chat_message' ,
                        'data' : data,
                        'message_id' : message_id
                        }
                )
        elif text_data_json['type'] == 'notification' :
            if text_data_json['action'] == 'typing' : 
                await self.channel_layer.group_send(
                    self.room_group_name, {
                        'type' : 'notification' ,
                        'message' : {
                            'type' : 'notification',
                            'action' : 'typing',
                            'typing' : text_data_json['typing'],
                        }
                        }
                )
    async def notification(self, event):
        message = event['message']

        
        await self.send(text_data = json.dumps({
            **message
        }))
    
    async def chat_message(self, event):
        data = event['data']
        message_id = event['message_id']

        await self.read_message(message_id, data['receiver_profile_id'])

        # sends too client 
        await self.send(text_data = json.dumps({
            'type' : 'chat',
            'data' : data,
            }))
    
    @sync_to_async
    def read_message(self, message_id, receiver_profile_id):
        if int(self.profile.id) == int(receiver_profile_id):
            message = Message.objects.get(id = message_id)
            message.read = True
            message.save()

    @sync_to_async
    def read_all_messages(self, room_id):
        room = Room.objects.get(id = room_id)
        room.messages.filter(read = False).update(read = True)

    @sync_to_async
    def save_room(self):
        room_qs = Room.objects.filter(name = self.room_group_name)
        if not room_qs.exists():
            self.room = Room.objects.create(
                name = self.room_group_name
            )
            if self.profile and self.receiver :
                self.room.members.add(self.profile)
                self.room.members.add(self.receiver)
            
            self.room.save()
            return
        
        self.room = room_qs[0]

        
    @sync_to_async
    def save_message(self, message, receiver_profile_id):
        receiver_profile_qs = Profile.objects.filter(id = receiver_profile_id)
        if not self.profile and not receiver_profile_qs.exists():
            self.close(code='user does not exist')

        receiver_profile = receiver_profile_qs[0]
        instance = Message.objects.create(
            room = self.room,
            profile = self.profile, 
            receiver_profile = receiver_profile,
            content = message,
        )
        return instance.id

    @sync_to_async
    def get_profile(self, id):
        try:
            profile = Profile.objects.get(id = id)
            return profile
        except ObjectDoesNotExist:
            return None
        

        

class ChatNotificationConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.group_name = 'NotificationGroup'

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        receiver_id = text_data_json['receiver_id']


        await self.channel_layer.group_send(
            self.group_name, 
            {
                'type' : 'send_notification', 
                'message': {
                    'receiver_id' : receiver_id,
                    'type' : 'chat_notification'
                }
            }
        )

    
    async def send_notification(self, event):
        message = event['message']
        await self.send(json.dumps(message))
    
    async def disconnect(self, code):
        self.close()


    

