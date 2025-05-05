from django.urls import path
from .views import login_view, logout_view, register_view

urlpatterns = [
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('register/', register_view, name='register'),
]

from django.conf import settings

if settings.DEBUG:
    from . import urls_dev
    urlpatterns += urls_dev.urlpatterns