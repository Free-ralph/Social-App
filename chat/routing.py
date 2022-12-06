from django.urls import path
from . import consumers


websocket_urlpatterns = [
    path("ws/chat/notification", consumers.ChatNotificationConsumer.as_asgi() ),
    path("ws/chat/<str:room_name>/<int:user_id>/<int:receiver_id>", consumers.ChatConsumer.as_asgi() ),
]