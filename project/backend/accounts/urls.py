from django.urls import path

from .views import CustomTokenObtainPairView, CustomRefreshTokenView, Logout, IsAuthenticated, Register 

urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomRefreshTokenView.as_view(), name='token_refresh'),
    path('logout/', Logout.as_view(), name='logout'),
    path('authenticated/', IsAuthenticated.as_view(), name='is_authenticated'),
    path('register/', Register.as_view(), name='register')
]