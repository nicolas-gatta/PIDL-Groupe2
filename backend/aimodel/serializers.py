from rest_framework import serializers
from .models import *
from login.models import CustomUser
from login.serializers import CustomUserSerializer


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
    user_fk = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())

    class Meta:
        model = Model
        fields = '__all__'


# EVALUATION

class EvaluationListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evaluation
        fields = ['evaluation_id', 'accuracy', 'final_loss', 'model_fk']

class EvaluationDetailSerializer(serializers.ModelSerializer):
    model_fk = serializers.PrimaryKeyRelatedField(queryset=Model.objects.all())
    resource_fk = serializers.PrimaryKeyRelatedField(queryset=Resource.objects.all())

    class Meta:
        model = Evaluation
        fields = '__all__'


# OPTIMIZATION

class OptimizationListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Optimization
        fields = ['optimization_id', 'name', 'optimization_date']

class OptimizationDetailSerializer(serializers.ModelSerializer):
    resource_fk = serializers.PrimaryKeyRelatedField(queryset=Resource.objects.all())

    class Meta:
        model = Optimization
        fields = '__all__'


# TASK

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'


# KNOWLEDGE DISTILLATION

class KnowledgeDistillationSerializer(serializers.ModelSerializer):
    student = serializers.PrimaryKeyRelatedField(queryset=Model.objects.all())
    teacher = serializers.PrimaryKeyRelatedField(queryset=Model.objects.all())
    optimization_fk = serializers.PrimaryKeyRelatedField(queryset=Optimization.objects.all())

    class Meta:
        model = KnowledgeDistillation
        fields = '__all__'


# PRUNING

class PruningSerializer(serializers.ModelSerializer):
    optimization_fk = serializers.PrimaryKeyRelatedField(queryset=Optimization.objects.all())

    class Meta:
        model = Pruning
        fields = '__all__'


# QUANTIZATION

class QuantizationSerializer(serializers.ModelSerializer):
    optimization_fk = serializers.PrimaryKeyRelatedField(queryset=Optimization.objects.all())

    class Meta:
        model = Quantization
        fields = '__all__'


# MODEL OPTIMIZATION

class ModelOptimizationSerializer(serializers.ModelSerializer):
    model_fk = serializers.PrimaryKeyRelatedField(queryset=Model.objects.all())
    optimization_fk = serializers.PrimaryKeyRelatedField(queryset=Optimization.objects.all())

    class Meta:
        model = ModelOptimization
        fields = '__all__'


# MODEL TASK

class ModelTaskSerializer(serializers.ModelSerializer):
    model_fk = serializers.PrimaryKeyRelatedField(queryset=Model.objects.all())
    task_fk = serializers.PrimaryKeyRelatedField(queryset=Task.objects.all())

    class Meta:
        model = ModelTask
        fields = '__all__'
