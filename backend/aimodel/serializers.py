from rest_framework import serializers
from drf_spectacular.utils import extend_schema_field

from .models import Task, ModelTask, BasicDataModel, FullDataModel, Quantization, Pruning, KnowledgeDistillation, ModelOptimization, Optimization

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['task_id', 'task_name', 'description']
        
class QuantizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quantization
        fields = ['quantization_type', 'target_precision', 'optimization_fk']


class PruningSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pruning
        fields = ['pruning_strategie', 'pruning_rate', 'optimization_fk']
        
class KnowledgeDistillationSerializer(serializers.ModelSerializer):
    student = serializers.StringRelatedField()
    teacher = serializers.StringRelatedField()

    class Meta:
        model = KnowledgeDistillation
        fields = ['softmax_temperature', 'loss_function', 'student', 'teacher', 'optimization_fk']

class BasicDataModelSerializer(serializers.ModelSerializer):
    tasks = serializers.SerializerMethodField()

    class Meta:
        model = BasicDataModel
        fields = [
            'id', 'model_name', 'architecture', 'model_size_label', 'precision',
            'model_size', 'layers', 'parameters_m', 'flops_b', 'fps_gpu',
            'avg_emissions_gco2eq', 'avg_energy_mwh', 'map_50', 'map_50_95', 'training_time',
            'creator', 'tasks']
    @extend_schema_field(TaskSerializer(many=True))
    def get_tasks(self, obj):
        
        # Find all task IDs linked to this model
        task_links = ModelTask.objects.filter(model_fk=obj.id)
        
        # Fetch the tasks
        tasks = Task.objects.filter(task_id__in=[link.task_fk_id for link in task_links])
        
        # Serialize tasks
        return TaskSerializer(tasks, many=True).data
    
class FullDataModelSerializer(serializers.ModelSerializer):
    tasks = serializers.SerializerMethodField()
    student = serializers.SerializerMethodField()
    teacher = serializers.SerializerMethodField()
    optimizations = serializers.SerializerMethodField()
    
    class Meta:
        model = FullDataModel
        fields = [
                    'id', 'model_name', 'architecture','model_size_label', 'precision', 
                    'layers', 'parameters_m', 'flops_b', 'model_size', 'training_time', 
                    'creation_date', 'description', 'accuracy','final_loss', 'latency_ms',
                    'fps_gpu','avg_emissions_gco2eq', 'avg_energy_mwh', 'map_50', 'map_50_95',
                    'cpu_type', 'memory_gpu' , 'memory_gb' , 'cpu_frequency_ghz', 'max_power_watts', 
                    'creator', 'tasks', 'student', 'teacher', 'optimizations']
    @extend_schema_field(TaskSerializer(many=True))
    def get_tasks(self, obj):
        
        # Find all task IDs linked to this model
        task_links = ModelTask.objects.filter(model_fk=obj.id)
        
        # Fetch the tasks
        tasks = Task.objects.filter(task_id__in=[link.task_fk_id for link in task_links])
        
        # Serialize tasks
        return TaskSerializer(tasks, many=True).data
    @extend_schema_field(KnowledgeDistillationSerializer(many=True))
    def get_student(self, obj):
        distillations = KnowledgeDistillation.objects.filter(student=obj.id)
        return KnowledgeDistillationSerializer(distillations, many=True).data
    @extend_schema_field(KnowledgeDistillationSerializer(many=True))
    def get_teacher(self, obj):
        distillations = KnowledgeDistillation.objects.filter(teacher=obj.id)
        return KnowledgeDistillationSerializer(distillations, many=True).data
    @extend_schema_field(serializers.ListSerializer(child=serializers.DictField()))
    def get_optimizations(self, obj):
        optimization_links = ModelOptimization.objects.filter(model_fk=obj.id)
        optimization_ids = [opt.optimization_fk_id for opt in optimization_links]
        optimizations = Optimization.objects.filter(optimization_id__in=optimization_ids)

        result = []
        for opt in optimizations:
            opt_data = {
                "optimization_id": opt.optimization_id,
                "name": opt.name,
                "date": opt.optimization_date,
                "description": opt.description,
            }

            if hasattr(opt, 'quantization'):
                opt_data['type'] = 'Quantization'
                opt_data['details'] = QuantizationSerializer(opt.quantization).data
            elif hasattr(opt, 'pruning'):
                opt_data['type'] = 'Pruning'
                opt_data['details'] = PruningSerializer(opt.pruning).data
            elif hasattr(opt, 'knowledgedistillation'):
                opt_data['type'] = 'KnowledgeDistillation'
                opt_data['details'] = KnowledgeDistillationSerializer(opt.knowledgedistillation).data
            else:
                opt_data['type'] = 'Unknown'
                opt_data['details'] = {}

            result.append(opt_data)

        return result