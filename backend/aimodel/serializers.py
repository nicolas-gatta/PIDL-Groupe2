from rest_framework import serializers
from .models import *
from login.serializers import CustomUserSerializer  # pour afficher l'utilisateur lié


# RESOURCE

class ResourceListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = ['resource_id', 'resource_name', 'cpu_type']

class ResourceDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = '__all__'

# MODEL

class ModelListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Model
        fields = ['model_id', 'model_name', 'architecture', 'parameter_count']

class ModelDetailSerializer(serializers.ModelSerializer):
    user_fk = CustomUserSerializer()

    class Meta:
        model = Model
        fields = '__all__'


# EVALUATION

class EvaluationListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evaluation
        fields = ['evaluation_id', 'accaracy', 'final_loss', 'model_fk']

class EvaluationDetailSerializer(serializers.ModelSerializer):
    model_fk = ModelListSerializer()
    resource_fk = ResourceListSerializer()

    class Meta:
        model = Evaluation
        fields = '__all__'


# OPTIMIZATION

class OptimizationListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Optimization
        fields = ['optimization_id', 'name', 'optimization_date']

class OptimizationDetailSerializer(serializers.ModelSerializer):
    resource_fk = ResourceListSerializer()

    class Meta:
        model = Optimization
        fields = '__all__'

# Autres 

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

class KnowledgeDistillationSerializer(serializers.ModelSerializer):
    class Meta:
        model = KnowledgeDistillation
        fields = '__all__'

class PruningSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pruning
        fields = '__all__'

class QuantizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quantization
        fields = '__all__'

class ModelOptimizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModelOptimization
        fields = '__all__'

class ModelTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModelTask
        fields = '__all__'
