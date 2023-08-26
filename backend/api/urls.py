from django.urls import path
from .views import (
        RegisterApiView, 
        FeedApiView, PostApiView, ProfileApiView, 
        FollowApiView, UpdateProfileApiView,LikeUnlikeApiView,
        AddCommentApiView, CommentLikeUnlikeApiView, CommentReplyApiView,
        CommentApiView, UserProfileApiView, CommentLikeCount
        )
from rest_framework_simplejwt.views import (
    TokenRefreshView, TokenObtainPairView
)

urlpatterns = [
    path('feed', FeedApiView.as_view()), 
    path('register', RegisterApiView.as_view()), 
    path('token', TokenObtainPairView.as_view()), 
    path('token/refresh', TokenRefreshView.as_view()), 
    path('profile/user', UserProfileApiView.as_view()), 
    path('profile/<int:profile_id>', ProfileApiView.as_view()), 
    path('profile/update/<int:profile_id>', UpdateProfileApiView.as_view()), 
    path('timeline', PostApiView.as_view()),
    path('social/<str:action>/<int:profile_id>', FollowApiView.as_view()),
    path('favourite/comment/<int:comment_id>', CommentLikeUnlikeApiView.as_view()),
    path('favourite/<int:post_id>', LikeUnlikeApiView.as_view()),
    path('comment/add/<int:post_id>', AddCommentApiView.as_view()),
    path('comment/reply/<int:comment_id>', CommentReplyApiView.as_view()),
    path('comments/<str:type>/<int:id>', CommentApiView.as_view()),
    path('comment/like-count/<int:id>', CommentLikeCount.as_view()),
]