from django.urls import path
from .views import *

urlpatterns = [
    path('get_all_data_models_table', get_all_data_models_table, name='get_all_data_models_table'),
    path('get_all_data_models', get_all_data_models, name = "get_all_data_models"),
    path('get_full_data_models', get_all_full_data_models, name='get_all_full_data_models'),
    path('get_filtered_data_models/', FilteredFullModelListView.as_view(), name = "get_filtered_data_models"),
   
]
