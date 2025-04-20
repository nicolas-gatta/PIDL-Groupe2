from django.urls import path
from .views import login_view, logout_view

urlpatterns = [
    path('api/login/', login_view, name='login'),
    path('api/logout/', logout_view, name='logout'),
]
