import django_filters
from rest_framework.exceptions import ValidationError 
from .models import BasicDataModel, ModelTask, Task, FullDataModel, KnowledgeDistillation, ModelOptimization


class StrictFilterSet(django_filters.FilterSet):
    def __init__(self, data=None, *args, **kwargs):
        if data is not None:
            allowed_fields = set(self.get_filters().keys())
            incoming_fields = set(data.keys())
            invalid_fields = incoming_fields - allowed_fields
            if invalid_fields:
                raise ValidationError(f"Invalid filter(s): {', '.join(invalid_fields)}")
        super().__init__(data, *args, **kwargs)

class BasicDataFilter(StrictFilterSet):
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
    creator = django_filters.CharFilter(lookup_expr='icontains')
    
    class Meta:
        model = BasicDataModel
        fields = []
        
    def filter_by_task(self, queryset, name, value):
        
        task_names = [v.strip() for v in value.split(',') if v.strip()]
        
        task_ids = Task.objects.filter(task_name__in=task_names).values_list('task_id', flat=True)
        
        model_ids = ModelTask.objects.filter(task_fk_id__in=task_ids).values_list('model_fk_id', flat=True)

        return queryset.filter(id__in=model_ids)
    
class FullDataFilter(StrictFilterSet):
    # Filtres directs sur les caractéristiques du modèle
    architecture = django_filters.CharFilter(lookup_expr='icontains')
    model_name = django_filters.CharFilter(lookup_expr='icontains')
    precision = django_filters.CharFilter(lookup_expr='iexact')
    model_size_label = django_filters.CharFilter(lookup_expr='iexact')
    model_size_min = django_filters.NumberFilter(field_name='model_size', lookup_expr='gte')
    model_size_max = django_filters.NumberFilter(field_name='model_size', lookup_expr='lte')
    layers_min = django_filters.NumberFilter(field_name='layers', lookup_expr='gte')
    layers_max = django_filters.NumberFilter(field_name='layers', lookup_expr='lte')
    parameters_min = django_filters.NumberFilter(field_name='parameters_m', lookup_expr='gte')
    parameters_max = django_filters.NumberFilter(field_name='parameters_m', lookup_expr='lte')

    # Filtres sur performances
    accuracy_min = django_filters.NumberFilter(field_name='accuracy', lookup_expr='gte')
    accuracy_max = django_filters.NumberFilter(field_name='accuracy', lookup_expr='lte')
    loss_min = django_filters.NumberFilter(field_name='final_loss', lookup_expr='gte')
    loss_max = django_filters.NumberFilter(field_name='final_loss', lookup_expr='lte')
    latency_min = django_filters.NumberFilter(field_name='latency_ms', lookup_expr='gte')
    latency_max = django_filters.NumberFilter(field_name='latency_ms', lookup_expr='lte')

    # Filtres environnementaux
    emissions_min = django_filters.NumberFilter(field_name='avg_emissions_gco2eq', lookup_expr='gte')
    emissions_max = django_filters.NumberFilter(field_name='avg_emissions_gco2eq', lookup_expr='lte')
    energy_min = django_filters.NumberFilter(field_name='avg_energy_mwh', lookup_expr='gte')
    energy_max = django_filters.NumberFilter(field_name='avg_energy_mwh', lookup_expr='lte')

    # Filtres matériels
    memory_gpu_min = django_filters.NumberFilter(field_name='memory_gpu', lookup_expr='gte')
    memory_gpu_max = django_filters.NumberFilter(field_name='memory_gpu', lookup_expr='lte')
    cpu_freq_min = django_filters.NumberFilter(field_name='cpu_frequency_ghz', lookup_expr='gte')
    cpu_freq_max = django_filters.NumberFilter(field_name='cpu_frequency_ghz', lookup_expr='lte')
    max_power_min = django_filters.NumberFilter(field_name='max_power_watts', lookup_expr='gte')
    max_power_max = django_filters.NumberFilter(field_name='max_power_watts', lookup_expr='lte')

    # Autres
    creator = django_filters.CharFilter(lookup_expr='icontains')
    task = django_filters.CharFilter(method='filter_by_task')
    as_student = django_filters.BooleanFilter(method='filter_as_student')
    as_teacher = django_filters.BooleanFilter(method='filter_as_teacher')
    has_optimization = django_filters.BooleanFilter(method='filter_has_optimization')


    class Meta:
        model = FullDataModel
        fields = []

    def filter_by_task(self, queryset, name, value):
        task_names = [v.strip() for v in value.split(',') if v.strip()]
        task_ids = Task.objects.filter(task_name__in=task_names).values_list('task_id', flat=True)
        model_ids = ModelTask.objects.filter(task_fk_id__in=task_ids).values_list('model_fk_id', flat=True).distinct()
        return queryset.filter(id__in=model_ids)
    def filter_as_student(self, queryset, name, value):
        ids = KnowledgeDistillation.objects.values_list('student', flat=True).distinct()
        return queryset.filter(id__in=ids) if value else queryset.exclude(id__in=ids)

    def filter_as_teacher(self, queryset, name, value):
        ids = KnowledgeDistillation.objects.values_list('teacher', flat=True).distinct()
        return queryset.filter(id__in=ids) if value else queryset.exclude(id__in=ids)

    def filter_has_optimization(self, queryset, name, value):
        ids = ModelOptimization.objects.values_list('model_fk_id', flat=True).distinct()
        return queryset.filter(id__in=ids) if value else queryset.exclude(id__in=ids)
