from django.urls import path
from .views import *

urlpatterns = [
    path('get_all_simplify_data_models', get_all_simplify_data_models, name='get_all_simplify_data_models'),
    path('get_filtered_simplify_data_models', FilteredModelListView.as_view(), name = "get_filtered_simplify_data_models"),
    path('get_all_full_data_models', get_all_full_data_models, name='get_all_full_data_models'),
    path('get_filtered_full_data_models', FilteredFullModelListView.as_view(), name = "get_filtered_full_data_models"),

]
