from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import GoogleConnection

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'last_login']

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
    
class GoogleConnectionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = GoogleConnection
        fields = ['user', 'googleToken']


# class UpdateUserSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(write_only=True, required=False)

#     class Meta:
#         model = User
#         fields = ['email', 'first_name', 'last_name', 'password']

#     def update(self, instance, validated_data):
#         password = validated_data.pop('password', None)
#         if password:
#             instance.set_password(password)  # Hashes password before saving
#         return super().update(instance, validated_data)


class UpdateUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)  # To allow password update

    class Meta:
        model = User
        fields = ['username', 'email', 'password']  # Include password field

    def update(self, instance, validated_data):
        # If the password is being updated, hash it
        password = validated_data.pop('password', None)
        
        if password:
            instance.set_password(password)
        
        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance

