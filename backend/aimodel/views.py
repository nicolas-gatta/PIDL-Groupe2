from rest_framework import viewsets, filters as drf_filters
from .models import *
from .serializers import *
from django_filters.rest_framework import DjangoFilterBackend
from .filters import *  

class BaseModelViewSet(viewsets.ModelViewSet):
    filter_backends = [DjangoFilterBackend, drf_filters.OrderingFilter, drf_filters.SearchFilter]

    def get_queryset(self):
        return self.queryset.all()

class ResourceViewSet(BaseModelViewSet):
    queryset = Resource.objects.all()
    filterset_class = ResourceFilter

    def get_serializer_class(self):
        return ResourceListSerializer if self.action == 'list' else ResourceDetailSerializer

class TaskViewSet(BaseModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    filterset_class = TaskFilter

class ModelViewSet(BaseModelViewSet):
    queryset = Model.objects.all()
    filterset_class = ModelFilter

    def get_serializer_class(self):
        return ModelListSerializer if self.action == 'list' else ModelDetailSerializer

class EvaluationViewSet(BaseModelViewSet):
    queryset = Evaluation.objects.all()
    filterset_class = EvaluationFilter

    def get_serializer_class(self):
        return EvaluationListSerializer if self.action == 'list' else EvaluationDetailSerializer

class OptimizationViewSet(BaseModelViewSet):
    queryset = Optimization.objects.all()
    filterset_class = OptimizationFilter

    def get_serializer_class(self):
        return OptimizationListSerializer if self.action == 'list' else OptimizationDetailSerializer

class KnowledgeDistillationViewSet(BaseModelViewSet):
    queryset = KnowledgeDistillation.objects.all()
    serializer_class = KnowledgeDistillationSerializer
    filterset_class = KnowledgeDistillationFilter

class PruningViewSet(BaseModelViewSet):
    queryset = Pruning.objects.all()
    serializer_class = PruningSerializer
    filterset_class = PruningFilter

class QuantizationViewSet(BaseModelViewSet):
    queryset = Quantization.objects.all()
    serializer_class = QuantizationSerializer
    filterset_class = QuantizationFilter

class ModelOptimizationViewSet(BaseModelViewSet):
    queryset = ModelOptimization.objects.all()
    serializer_class = ModelOptimizationSerializer
    filterset_class = ModelOptimizationFilter

class ModelTaskViewSet(BaseModelViewSet):
    queryset = ModelTask.objects.all()
    serializer_class = ModelTaskSerializer
    filterset_class = ModelTaskFilter