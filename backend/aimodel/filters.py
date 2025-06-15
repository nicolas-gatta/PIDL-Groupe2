import django_filters
from rest_framework.exceptions import ValidationError 
from .models import ModelTask, Task
from .models_views import BasicDataModel, TaskView, ModelTaskView, ModelView, OptimizationView, ModelOptimizationView

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
    architecture = django_filters.CharFilter(method='filter_by_architecture')
    precision = django_filters.CharFilter(lookup_expr='iexact')
    model_size_label = django_filters.CharFilter(lookup_expr='iexact')
    model_size_min = django_filters.NumberFilter(field_name='model_size', lookup_expr='gte')
    model_size_max = django_filters.NumberFilter(field_name='model_size', lookup_expr='lte')
    emissions_min = django_filters.NumberFilter(field_name='avg_emissions_per_inference', lookup_expr='gte')
    emissions_max = django_filters.NumberFilter(field_name='avg_emissions_per_inference', lookup_expr='lte')
    energy_min = django_filters.NumberFilter(field_name='avg_energy_per_inference', lookup_expr='gte')
    energy_max = django_filters.NumberFilter(field_name='avg_energy_per_inference', lookup_expr='lte')
    max_training_time = django_filters.NumberFilter(field_name='training_time', lookup_expr='lte')
    user_id = django_filters.NumberFilter(field_name='user_id')
    creator = django_filters.CharFilter(lookup_expr='icontains')
    optimization_type = django_filters.CharFilter(method='filter_by_optimization')
    
    class Meta:
        model = BasicDataModel
        fields = []
        
    def filter_by_task(self, queryset, name, value):
        
        task_names = [v.strip() for v in value.split(',') if v.strip()]
        
        task_ids = TaskView.objects.filter(name__in=task_names).values_list('id', flat=True)
        
        model_ids = ModelTaskView.objects.filter(task_id__in=task_ids).values_list('model_id', flat=True)

        return queryset.filter(id__in=model_ids)
    
    def filter_by_architecture(self, queryset, name, value):
        
        architecture_names = [v.strip() for v in value.split(',') if v.strip()]
        
        model_ids = ModelView.objects.filter(architecture__in=architecture_names).values_list('id', flat=True)

        return queryset.filter(id__in=model_ids)
    def filter_by_optimization(self, queryset, name, value):
        """
        value  = chaîne de mots séparés par virgule → ex : "Pruning,Quantization"
        """
        opt_types = [v.strip() for v in value.split(',') if v.strip()]
        opt_ids = OptimizationView.objects.filter(name__in=opt_types) \
                                        .values_list('id', flat=True)
        model_ids = ModelOptimizationView.objects.filter(optimization_id__in=opt_ids) \
                                                .values_list('model_id', flat=True)
        return queryset.filter(id__in=model_ids)