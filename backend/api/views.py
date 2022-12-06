from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ObjectDoesNotExist
from backend.models import Comment, Post, Profile, Like
from .serializers import ( 
    CommentCreateSerializer, CommentSerializer, ProfileInfoSerializer, RegisterSerializer, UserSerializer, 
    MyTokenObtainPairSerializer, PostSerializer, 
    ProfileSerializer, ProfileUpdateSerializer )
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser


class FeedApiView(GenericAPIView):
    permission_classes = [IsAuthenticated, ]
    def get(self, *args, **kwargs) :
        profile_qs = Profile.objects.filter(author__id = self.request.user.id).prefetch_related('following', 'followers')
        if not profile_qs.exists():
            return Response({'message' : 'something has gone wrong'}, status=status.HTTP_404_NOT_FOUND)
        context = { 'request' : self.request}
        profile = profile_qs[0]
        profile_serializer = ProfileSerializer(profile, context = context)
        posts = Post.objects.filter( profile__in = profile.following.all()).prefetch_related('likes')
        suggestions = Profile.objects.exclude( id__in = profile.following.all())
        post_serializer = PostSerializer(posts, many = True, context = context)
        suggestions_serializer = ProfileInfoSerializer(suggestions, many = True, context = context)
        
        data = {
            'profile' : profile_serializer.data,
            'feed' : post_serializer.data, 
            'suggestions' : suggestions_serializer.data,
        }
        return Response(data)

class RegisterApiView(GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializedData = self.get_serializer(data = request.data)
        if serializedData.is_valid():
            user = serializedData.save()
            # remember you defined the create method in the RegisterSerializer to return the instance
            # so you'll have to explicitly run save on the returned instance
            user.save()
            return Response({
                'message' : 'user created successfuly', 
                'user' : UserSerializer(user).data
            })
        return Response(serializedData.errors, status=status.HTTP_400_BAD_REQUEST)


class ObtainTokenPairApiView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class ProfileApiView(GenericAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated, ]

    def get(self, *args, **kwargs):
        profile_id = kwargs['profile_id']
        try:
            profile = Profile.objects.get(id = profile_id)
        except ObjectDoesNotExist:
            return Response({'message' : 'Profile has been deactivated or deleted'}, status = status.HTTP_404_NOT_FOUND)
        
        serializer = self.get_serializer(profile, context = { 'request' : self.request})

        return Response(serializer.data)

    def post(self, *args, **kwargs):
        pass

class PostApiView(GenericAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated,]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, *args, **kwargs):
        try:
            profile = Profile.objects.get(author__id = self.request.user.id)
        except ObjectDoesNotExist:
            return Response({'message' : 'Please create a profile'}, status = status.HTTP_404_NOT_FOUND)
        posts = profile.followers.post
        serializer = self.get_serializer(posts, many = True, context = { 'request' : self.request})

        return Response(serializer.data)
    
    def post(self, *args, **kwargs):
        profile_qs = Profile .objects.filter(author__id = self.request.user.id)
        if not profile_qs.exists():
            return Response({'message' : 'Profile has been deactivated or deleted'}, status = status.HTTP_404_NOT_FOUND)
        
        profile = profile_qs[0]
        image = self.request.data.get('image')
        serializer = self.get_serializer(data = self.request.data)
        if serializer.is_valid():
            post = serializer.save()
            post.profile = profile
            if image:
                post.image = image
            post.save()
            return Response({'message' : 'posted succesfully'})
        
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)


class FollowApiView(GenericAPIView):
    
    def get(self, *args, **kwargs):
        profile_id = kwargs['profile_id']
        action = kwargs['action']
        print(action)
        profile_qs = Profile.objects.filter(author__id = self.request.user.id)
        if not profile_qs.exists():
            return Response({'message' : 'Profile has been deactivated or deleted'}, status = status.HTTP_404_NOT_FOUND)
        
        profile = profile_qs[0]
        follow = Profile.objects.get(id = profile_id)

        if action == 'follow' :
            # follow
            profile.following.add(follow)
        elif action == 'remove' : 
            # remove a follower
            profile.followers.remove(follow)
        else :
            # unfollow
            profile.following.remove(follow)

        
        profile.save()

        return Response({'message' : 'successfully removed'})

class UpdateProfileApiView(GenericAPIView):
    serializer_class = ProfileUpdateSerializer
    permission_classes = [IsAuthenticated,]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, *args, **kwargs):
        profile_id = kwargs.get('profile_id')
        profile_qs = Profile.objects.filter(id = profile_id)
        if not profile_qs.exists():
            return Response({'message' : 'Profile has been deactivated or deleted'}, status = status.HTTP_404_NOT_FOUND)
        
        profile = profile_qs[0]
        if profile.author.id != self.request.user.id :
            return Response({'message' : 'your not allowed'}, status = status.HTTP_400_BAD_REQUEST)
        
        serializer = self.get_serializer(profile, data = self.request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
        
        
        serializer.save()
        return Response({'message' : 'updated successfully'})


class LikeUnlikeApiView(GenericAPIView):
    
    def get(self, *args, **kwargs):
        post_id = kwargs.get('post_id')
        profile_qs = Profile.objects.filter(author__id = self.request.user.id)
        post_qs = Post.objects.filter(id = post_id)
        if not profile_qs.exists() or not post_qs.exists():
            return Response({'message' : "oops, something's off"}, status = status.HTTP_404_NOT_FOUND)
        profile = profile_qs[0]
        post = post_qs[0]

        like, created    = Like.objects.get_or_create(profile = profile)
        if post.likes.filter(id = like.id).exists():
            post.likes.remove(like)
            return Response({'status' : False })
        
        post.likes.add(like)
        return Response({"status" : True})


class CommentApiView(GenericAPIView):
    serializer_class = CommentSerializer
    def get(self, *args, **kwargs):
        Id = kwargs.get('id')
        Type = kwargs.get('type')
        if Type == 'post' :
            post_qs = Post.objects.filter(id = Id)
            if not post_qs.exists():
                return Response({'message' : "oops, something's off"}, status = status.HTTP_404_NOT_FOUND)
            post = post_qs[0]
            
            serializer = self.get_serializer(post.comments.all().order_by('-created_at'), many = True)
        elif Type == 'comment' :
            comment_qs = Comment.objects.filter(id = Id)
            if not comment_qs.exists():
                return Response({'message' : "oops, something's off"}, status = status.HTTP_404_NOT_FOUND)
            comment = comment_qs[0]
            
            serializer = self.get_serializer(comment.replies.all().order_by('-created_at'), many = True)

        return Response(serializer.data)


class AddCommentApiView(GenericAPIView):
    serializer_class = CommentCreateSerializer

    def post(self, *args, **kwargs):
        profile_qs = Profile.objects.filter(author = self.request.user)
        post_id = kwargs.get('post_id')

        if not profile_qs.exists():
            return Response({'message' : "oops, something's off"}, status = status.HTTP_404_NOT_FOUND)
        
        serializer = self.get_serializer(data = self.request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
        
        post_qs = Post.objects.filter(id = post_id)
        if not post_qs.exists():
            return Response({'message' : "oops, something's off"}, status = status.HTTP_404_NOT_FOUND)

        post = post_qs[0]
        profile = profile_qs[0]
        comment = serializer.save()
        comment.post = post
        comment.profile = profile
        comment.save()

        
        return Response({'message' : 'comment added'})


class CommentLikeUnlikeApiView(GenericAPIView):
    def get(self, *args, **kwargs):
        comment_id = kwargs.get('comment_id')
        profile_qs = Profile.objects.filter(author = self.request.user)
        comment_qs = Comment.objects.filter(id = comment_id)
        if not profile_qs.exists() or not comment_qs.exists():
            return Response({'message' : "oops, something's off"}, status = status.HTTP_404_NOT_FOUND)
        profile = profile_qs[0]
        comment = comment_qs[0]

        like, created    = Like.objects.get_or_create(profile = profile)
        if comment.likes.filter(id = like.id).exists():
            comment.likes.remove(like)
            return Response({'status' : False })
        
        comment.likes.add(like)
        return Response({"status" : True})

class CommentReplyApiView(GenericAPIView):
    serializer_class = CommentCreateSerializer

    def post(self, *args, **kwargs):
        profile_qs = Profile.objects.filter(author = self.request.user)
        comment_id = kwargs.get('comment_id')

        if not profile_qs.exists():
            return Response({'message' : "oops, something's off"}, status = status.HTTP_404_NOT_FOUND)
        
        serializer = self.get_serializer(data = self.request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
        
        comment_qs = Comment.objects.filter(id = comment_id)
        if not comment_qs.exists():
            return Response({'message' : "oops, something's off"}, status = status.HTTP_404_NOT_FOUND)

        comment = comment_qs[0]
        profile = profile_qs[0]
        comment_instance = serializer.save()
        comment_instance.profile = profile
        comment_instance.save()
        comment.replies.add(comment_instance)
        comment.save()

        return Response({'message' : 'comment added'})

