from django.urls import path
from .views import login_view, logout_view, register_view, validate_token

urlpatterns = [
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('register/', register_view, name='register'),
    path('validate_token/', validate_token, name='validate_token'),
]