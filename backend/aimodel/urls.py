from django.urls import path
from .views import *

urlpatterns = [
    path('get_all_data_simplify_models', get_all_data_simplify_models, name='get_all_data_simplify_models'),
    path('get_filtered_data_simplify_models', FilteredModelListView.as_view(), name = "get_filtered_data_simplify_models"),
    path('get_all_full_data_models', FilteredFullModelListView.as_view(), name='get_all_full_data_models'),

]
