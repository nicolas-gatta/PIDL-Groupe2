from django.urls import path
from .views import get_all_models

urlpatterns = [
    path('get_all_models', get_all_models, name='get_all_models'),
]
