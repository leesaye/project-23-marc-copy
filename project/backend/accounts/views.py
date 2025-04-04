from django.shortcuts import render
from rest_framework import status
from django.utils import timezone

from django.contrib.auth.models import User
from .models import GoogleConnection
from .serializer import GoogleConnectionSerializer
from rest_framework.generics import CreateAPIView, RetrieveUpdateDestroyAPIView

#imports for class based view
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import permissions

#stuff for adding token to cookie
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

#Serializers
from .serializer import UserSerializer, UserRegisterSerializer, UpdateUserSerializer

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        tokens = response.data

        access_token = tokens.get('access')
        refresh_token = tokens.get('refresh')

        # Retrieve user manually since request.user is not available yet
        username = request.data.get("username")
        user = User.objects.get(username=username)

        user.last_login = timezone.now()
        user.save()
        
        serializer = UserSerializer(user)

        res = Response()

        res.data = {'success': True, **tokens, 'user': serializer.data}  # Include user data

        res.set_cookie(
            key='access_token',
            value=access_token,
            httponly=True,
            secure=True,
            samesite='None',
            path='/'
        )

        res.set_cookie(
            key='refresh_token',
            value=refresh_token,
            httponly=True,
            secure=True,
            samesite='None',
            path='/'
        )

        return res

class CustomRefreshTokenView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token')
        request.data['refresh'] = refresh_token

        response = super().post(request, *args, **kwargs)

        tokens = response.data
        access_token = tokens['access']

        res = Response()

        res.data = {'refreshed': True}

        res.set_cookie(
            key='access_token',
            value=access_token,
            httponly=True,
            secure=True, #may need to make this False
            samesite='None',
            path='/'
        )

        return res

class Logout(APIView):
    def post(self, request):
        res = Response()
        res.data = {'success':True}
        res.delete_cookie('access_token', path='/', samesite='None')
        res.delete_cookie('refresh_token', path='/',samesite='None')
        return res

class IsAuthenticated(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        serializer = UserSerializer(request.user, many=False)
        return Response(serializer.data)

class Register(CreateAPIView):
    permission_classes = [AllowAny] 
    authentication_classes = []  # Disable authentication for this view
    serializer_class = UserRegisterSerializer
    
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

# GET/POST
class GoogleTokenView(APIView):
    def get(self, request):
        try:
            googleConnection = GoogleConnection.objects.get(user=request.user)
        except GoogleConnection.DoesNotExist:
            return Response(None)
        
        serializer = GoogleConnectionSerializer(googleConnection)
        return Response(serializer.data)
    
    def post(self, request):
        try:
            user = request.user
            googleToken = request.data.get('googleToken')

            if not googleToken:
                return Response({"error": "No Google token to add"}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                googleConnection = GoogleConnection.objects.get(user=user)
                # If the connection exists, update it
                googleConnection.googleToken = googleToken
                googleConnection.save()
                serializer = GoogleConnectionSerializer(googleConnection)
            except GoogleConnection.DoesNotExist:
                # Otherwise make a connection
                googleConnection = GoogleConnection.objects.create(user=user, googleToken=googleToken)
                serializer = GoogleConnectionSerializer(googleConnection)

            return Response({"message": "Google token for user saved successfully", "data":serializer.data}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": f"Failed to save Google token: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class GoogleLogoutView(APIView):
    def delete(self, request):
        user=request.user
        try:
            connection = GoogleConnection.objects.get(user=user)
        except GoogleConnection.DoesNotExist:
            raise NotFound(detail="Google connection not found", code=status.HTTP_404_NOT_FOUND)

        if connection.user != user:
            raise PermissionDenied("You do not have permission to delete this contact.")

        connection.delete()
        return Response({"message": "Google connection deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    

class UpdateAccountView(RetrieveUpdateDestroyAPIView):
    serializer_class = UpdateUserSerializer
    permission_classes = [permissions.IsAuthenticated]  # Ensure user is authenticated

    def get_object(self):
        # Automatically return the logged-in user, so they can't update someone else's account
        return self.request.user

    def perform_update(self, serializer):
        # Perform the update, including password hashing if the password is provided
        serializer.save()
