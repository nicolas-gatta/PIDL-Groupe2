from rest_framework import serializers

from .models import Task, ModelTask, BasicDataModel, FullDataModel, Quantization, Pruning, KnowledgeDistillation

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

    def get_tasks(self, obj):
        
        # Find all task IDs linked to this model
        task_links = ModelTask.objects.filter(model_fk=obj.id)
        
        # Fetch the tasks
        tasks = Task.objects.filter(task_id__in=[link.task_fk_id for link in task_links])
        
        # Serialize tasks
        return TaskSerializer(tasks, many=True).data
    
class FullDataModelSerializer(serializers.ModelSerializer):
    tasks = serializers.SerializerMethodField()
    as_student = serializers.SerializerMethodField()
    as_teacher = serializers.SerializerMethodField()
    optimizations = serializers.SerializerMethodField()
    
    class Meta:
        model = FullDataModel
        fields = [
                    'id', 'model_name', 'architecture','model_size_label', 'precision', 
                    'layers', 'parameters_m', 'flops_b', 'model_size', 'training_time', 
                    'creation_date', 'description', 'accuracy','final_loss', 'latency_ms',
                    'fps_gpu','avg_emissions_gco2eq', 'avg_energy_mwh', 'map_50', 'map_50_95',
                    'cpu_type', 'memory_gpu' , 'memory_gb' , 'cpu_frequency_ghz', 'max_power_watts', 
                    'creator', 'tasks', 'students', 'teacher', 'optimizations']
        
    def get_tasks(self, obj):
        
        # Find all task IDs linked to this model
        task_links = ModelTask.objects.filter(model_fk=obj.id)
        
        # Fetch the tasks
        tasks = Task.objects.filter(task_id__in=[link.task_fk_id for link in task_links])
        
        # Serialize tasks
        return TaskSerializer(tasks, many=True).data