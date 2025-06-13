from django.urls import path
from .views import *

urlpatterns = [
    path('get_simplify_data_models/', FilteredModelListView.as_view(), name = "get_simplify_data_models"),
    path('get_full_data_models/', FilteredFullModelListView.as_view(), name = "get_full_data_models"),
    path('get_all_tasks/', get_all_tasks, name = "get_all_tasks"),
    path('get_all_precisions/', get_all_precisions, name = "get_all_precisions"),
    
    path('create_model/', create_model, name = "create_model_json"),
    
    path('update_model/', update_model, name = "update_model"),
    
    path('delete_model/<int:pk>/', delete_model, name = "delete_model"),

]
