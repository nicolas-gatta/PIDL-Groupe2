from django.urls import path
from .views import register_form_view, login_form_view

urlpatterns = [
    path('register-test', register_form_view, name='register-form'),
    path('login-test', login_form_view, name='login-form'),
]
