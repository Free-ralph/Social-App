from django.urls import path
from .views import RoomListApiView, ProfileDetialApiView, ChatsListApiView, ProfileDetialByIDApiView

urlpatterns = [
    path('rooms', RoomListApiView.as_view()),  
    path('<str:room_name>', ChatsListApiView.as_view()),
    path('profile_info/', ProfileDetialApiView.as_view()),
    path('profile_info/<int:id>', ProfileDetialByIDApiView.as_view())
]