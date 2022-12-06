from django.urls import path
from .views import RoomListApiView, ProfileDetialApiView, ChatsListApiView

urlpatterns = [
    path('rooms/', RoomListApiView.as_view()),  
    path('<str:room_name>/', ChatsListApiView.as_view()),
    path('profile/<int:id>', ProfileDetialApiView.as_view())
]