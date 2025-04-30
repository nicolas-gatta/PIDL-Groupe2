from rest_framework import viewsets
from .models import *
from .serializers import *

# Resource

class ResourceViewSet(viewsets.ModelViewSet):
    queryset = Resource.objects.all()

    def get_serializer_class(self):
        if self.action == 'list':
            return ResourceListSerializer
        return ResourceDetailSerializer

# Task

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

# Model

class ModelViewSet(viewsets.ModelViewSet):
    queryset = Model.objects.all()

    def get_serializer_class(self):
        if self.action == 'list':
            return ModelListSerializer
        return ModelDetailSerializer

# Evaluation

class EvaluationViewSet(viewsets.ModelViewSet):
    queryset = Evaluation.objects.all()

    def get_serializer_class(self):
        if self.action == 'list':
            return EvaluationListSerializer
        return EvaluationDetailSerializer

# Optimization

class OptimizationViewSet(viewsets.ModelViewSet):
    queryset = Optimization.objects.all()

    def get_serializer_class(self):
        if self.action == 'list':
            return OptimizationListSerializer
        return OptimizationDetailSerializer

# Les autres modèles simples

class KnowledgeDistillationViewSet(viewsets.ModelViewSet):
    queryset = KnowledgeDistillation.objects.all()
    serializer_class = KnowledgeDistillationSerializer

class PruningViewSet(viewsets.ModelViewSet):
    queryset = Pruning.objects.all()
    serializer_class = PruningSerializer

class QuantizationViewSet(viewsets.ModelViewSet):
    queryset = Quantization.objects.all()
    serializer_class = QuantizationSerializer

class ModelOptimizationViewSet(viewsets.ModelViewSet):
    queryset = ModelOptimization.objects.all()
    serializer_class = ModelOptimizationSerializer

class ModelTaskViewSet(viewsets.ModelViewSet):
    queryset = ModelTask.objects.all()
    serializer_class = ModelTaskSerializer
