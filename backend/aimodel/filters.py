import django_filters
from rest_framework.exceptions import ValidationError 
from .models import ModelTask, Task
from .models_views import BasicDataModel

class StrictFilterSet(django_filters.FilterSet):

    IGNORE_KEYS = {"page", "page_size", "ordering", "format"}

    def __init__(self, data=None, *args, **kwargs):
        if data is not None:
            allowed_fields = set(self.get_filters().keys())
            incoming_fields = set(data.keys())
            invalid_fields = incoming_fields - allowed_fields - self.IGNORE_KEYS
            if invalid_fields:
                raise ValidationError(f"Invalid filter(s): {', '.join(invalid_fields)}")
        super().__init__(data, *args, **kwargs)

class BasicDataFilter(StrictFilterSet):
    id = django_filters.NumberFilter(field_name='id')
    task = django_filters.CharFilter(method='filter_by_task')
    architecture = django_filters.CharFilter(lookup_expr='icontains')
    precision = django_filters.CharFilter(lookup_expr='iexact')
    model_size_label = django_filters.CharFilter(lookup_expr='iexact')
    model_size_min = django_filters.NumberFilter(field_name='model_size', lookup_expr='gte')
    model_size_max = django_filters.NumberFilter(field_name='model_size', lookup_expr='lte')
    emissions_min = django_filters.NumberFilter(field_name='avg_emissions_gco2eq', lookup_expr='gte')
    emissions_max = django_filters.NumberFilter(field_name='avg_emissions_gco2eq', lookup_expr='lte')
    energy_min = django_filters.NumberFilter(field_name='avg_energy_mwh', lookup_expr='gte')
    energy_max = django_filters.NumberFilter(field_name='avg_energy_mwh', lookup_expr='lte')
    max_training_time = django_filters.NumberFilter(field_name='training_time', lookup_expr='lte')
    user_id = django_filters.NumberFilter(field_name='user_id')
    creator = django_filters.CharFilter(lookup_expr='icontains')
    
    class Meta:
        model = BasicDataModel
        fields = []
        
    def filter_by_task(self, queryset, name, value):
        
        task_names = [v.strip() for v in value.split(',') if v.strip()]
        
        task_ids = Task.objects.filter(task_name__in=task_names).values_list('task_id', flat=True)
        
        model_ids = ModelTask.objects.filter(task_fk_id__in=task_ids).values_list('model_fk_id', flat=True)

        return queryset.filter(id__in=model_ids)