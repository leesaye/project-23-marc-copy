from django.urls import path

from .views import CustomTokenObtainPairView, CustomRefreshTokenView, Logout, IsAuthenticated, Register, GoogleTokenView, GoogleLogoutView, UpdateAccountView, UserProfileView

urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomRefreshTokenView.as_view(), name='token_refresh'),
    path('logout/', Logout.as_view(), name='logout'),
    path('authenticated/', IsAuthenticated.as_view(), name='is_authenticated'),
    path('register/', Register.as_view(), name='register'),
    path('googleToken/', GoogleTokenView.as_view(), name='google_token'),
    path('googleLogout/', GoogleLogoutView.as_view(), name='google_logout'),
    path("update/", UpdateAccountView.as_view(), name='account_update'),
    path('profile/', UserProfileView.as_view(), name='profile')
]