from django.shortcuts import render
from rest_framework import status

from django.contrib.auth.models import User
from rest_framework.generics import CreateAPIView

#imports for class based view
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

#stuff for adding token to cookie
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

#Serializers
from .serializer import UserSerializer, UserRegisterSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        # try:
        response = super().post(request, *args, **kwargs)
        tokens = response.data

        access_token = tokens.get('access')
        refresh_token = tokens.get('refresh')

        # Retrieve user manually since request.user is not available yet
        username = request.data.get("username")
        user = User.objects.get(username=username)
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

#if error messages need changing later on
        # except User.DoesNotExist:
        #     # Return a 404 (Not Found) if user is not found
        #     return Response({'success': False, 'error': str(e), 'error type': type(e).__name__}, status=status.HTTP_404_NOT_FOUND)
        # except Exception as e:
        #     # Return a 500 (Internal Server Error) for unexpected errors
        #     return Response({'success': False, 'error': str(e), 'error type': type(e).__name__}, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 


class CustomRefreshTokenView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        # try:
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

        # except Exception as e:
        #     return Response({'success': False, 'error': str(e), 'error type': type(e).__name__})

class Logout(APIView):
    def post(self, request):
        # try:
        res = Response()
        res.data = {'success':True}
        res.delete_cookie('access_token', path='/', samesite='None')
        res.delete_cookie('refresh_token', path='/',samesite='None')
        return res

        # except Exception as e:
        #     return Response({'success': False, 'error': str(e), 'error type': type(e).__name__})
        
class IsAuthenticated(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        serializer = UserSerializer(request.user, many=False)
        return Response(serializer.data)

# class Register(APIView):
#     permission_classes = [AllowAny] 
#     def post(self, request):
#         try:
#             serializer = UserRegisterSerializer(data=request.data)
#             if serializer.is_valid():
#                 serializer.save()
#                 return Response({'success': True, 'user': serializer.data})

#             # Return validation errors where such as user already exists
#             return Response({'success': False, 'errors': serializer.errors}, status=status.401)

#         except Exception as e:
#             return Response({'success': False, 'error': str(e), 'error type': type(e).__name__}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class Register(CreateAPIView):
    permission_classes = [AllowAny] 
    authentication_classes = []  # Disable authentication for this view
    serializer_class = UserRegisterSerializer
    
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)