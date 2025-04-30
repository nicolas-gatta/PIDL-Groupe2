from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register('resources', ResourceViewSet)
router.register('tasks', TaskViewSet)
router.register('models', ModelViewSet)
router.register('evaluations', EvaluationViewSet)
router.register('optimizations', OptimizationViewSet)
router.register('knowledge-distillations', KnowledgeDistillationViewSet)
router.register('prunings', PruningViewSet)
router.register('quantizations', QuantizationViewSet)
router.register('model-optimizations', ModelOptimizationViewSet)
router.register('model-tasks', ModelTaskViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

