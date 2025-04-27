from rest_framework import serializers

from .models import Task, ModelTask, BasicDataModel

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['task_id', 'task_name', 'description']

class BasicDataModelSerializer(serializers.ModelSerializer):
    tasks = serializers.SerializerMethodField()

    class Meta:
        model = BasicDataModel
        fields = [
            'id', 'model_name', 'architecture', 'model_size', 'precision',
            'layers', 'parameters_m', 'flops_b', 'fps_gpu',
            'avg_emissions_gco2eq', 'avg_energy_mwh', 'map_50', 'map_50_95',
            'tasks']

    def get_tasks(self, obj):
        
        # Find all task IDs linked to this model
        task_links = ModelTask.objects.filter(model_fk=obj.id)
        
        # Fetch the tasks
        tasks = Task.objects.filter(task_id__in=[link.task_fk_id for link in task_links])
        
        # Serialize tasks
        return TaskSerializer(tasks, many=True).data