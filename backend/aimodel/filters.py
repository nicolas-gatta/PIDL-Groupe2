from django_filters import rest_framework as filters
from django.db import models
from .models import *

class BaseFilterSet(filters.FilterSet):
    @classmethod
    def generate_numeric_filter_fields(cls, model):
        field_map = {}
        for field in model._meta.fields:
            if field.primary_key or isinstance(field, models.ForeignKey):
                continue  
            if isinstance(field, (models.DecimalField, models.IntegerField, models.FloatField, models.DateTimeField)):
                field_map[field.name] = ['exact', 'gte', 'lte', 'gt', 'lt']
            elif isinstance(field, (models.CharField, models.TextField)):
                field_map[field.name] = ['exact', 'icontains']
            elif isinstance(field, models.BooleanField):
                field_map[field.name] = ['exact']
            elif isinstance(field, models.ForeignKey):
                field_map[field.name] = ['exact']
        return field_map

# Filtres par entité
class EvaluationFilter(BaseFilterSet):
    class Meta:
        model = Evaluation
        fields = BaseFilterSet.generate_numeric_filter_fields(Evaluation)

class ModelFilter(BaseFilterSet):
    class Meta:
        model = Model
        fields = BaseFilterSet.generate_numeric_filter_fields(Model)

class OptimizationFilter(BaseFilterSet):
    class Meta:
        model = Optimization
        fields = BaseFilterSet.generate_numeric_filter_fields(Optimization)

class ResourceFilter(BaseFilterSet):
    class Meta:
        model = Resource
        fields = BaseFilterSet.generate_numeric_filter_fields(Resource)

class TaskFilter(BaseFilterSet):
    class Meta:
        model = Task
        fields = BaseFilterSet.generate_numeric_filter_fields(Task)

class QuantizationFilter(BaseFilterSet):
    class Meta:
        model = Quantization
        fields = BaseFilterSet.generate_numeric_filter_fields(Quantization)

class PruningFilter(BaseFilterSet):
    class Meta:
        model = Pruning
        fields = BaseFilterSet.generate_numeric_filter_fields(Pruning)

class KnowledgeDistillationFilter(BaseFilterSet):
    class Meta:
        model = KnowledgeDistillation
        fields = BaseFilterSet.generate_numeric_filter_fields(KnowledgeDistillation)

class ModelOptimizationFilter(BaseFilterSet):
    class Meta:
        model = ModelOptimization
        fields = BaseFilterSet.generate_numeric_filter_fields(ModelOptimization)

class ModelTaskFilter(BaseFilterSet):
    class Meta:
        model = ModelTask
        fields = BaseFilterSet.generate_numeric_filter_fields(ModelTask)
