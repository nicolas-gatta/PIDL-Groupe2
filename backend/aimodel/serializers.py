from rest_framework import serializers
from drf_spectacular.utils import extend_schema_field

from .models_views import *

class ModelSerializer(serializers.ModelSerializer):
    creation_date = serializers.DateTimeField(format="%d/%m/%Y %H:%M:%S")
    class Meta:
        model = ModelView
        fields = [ 'id', 'name', 'architecture', 'parameters_m', 'layers',  
                  'model_size_label', 'flops_b', 'model_size', 'training_time', 
                  'creation_date', 'description', 'precision', 'user_id', 'creator']

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskView
        fields = ['id', 'name', 'description']
        
class PrecisionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrecisionView
        fields = ['id', 'name', 'description']
        
class EvaluationSerializer(serializers.ModelSerializer):
    date = serializers.DateTimeField(format="%d/%m/%Y %H:%M:%S")
    class Meta:
        model = EvaluationView
        fields = ['id', 'accuracy', 'final_loss', 'latency_ms', 'execution_time_ms', 'energy_consumption_mwh',
                  'emissions_gco2eq','average_emissions_per_inference', 'average_energy_per_inference','fps_gpu','fps_cpu', 'std_cpu', 'std_gpu', 'num_macs', 'map_50', 'map_50_95', 'date', 
                  'cpu', 'gpu', 'gpu_memory', 'computer_ram', 'cpu_frenquency', 'max_watts']
        
class QuantizationSerializer(serializers.ModelSerializer):
    optimization_date = serializers.DateTimeField(format="%d/%m/%Y %H:%M:%S")
    class Meta:
        model = QuantizationView
        fields = ['type', 'target_precision','model_size_reduction', 'memory_reduction',
                  'gpu', 'cpu', 'gpu_memory', 'computer_ram', 
                  'cpu_frenquency', 'max_watts', 'optimization_date']


class PruningSerializer(serializers.ModelSerializer):
    optimization_date = serializers.DateTimeField(format="%d/%m/%Y %H:%M:%S")
    class Meta:
        model = PruningView
        fields = ['strategy', 'rate', 'scope', 'compression_ratio', 'memory_reduction'
                  ,'gpu', 'cpu', 'gpu_memory', 'computer_ram', 
                  'cpu_frenquency', 'max_watts', 'optimization_date']
        
class KnowledgeDistillationSerializer(serializers.ModelSerializer):
    student = serializers.SerializerMethodField()
    teacher = serializers.SerializerMethodField()
    optimization_date = serializers.DateTimeField(format="%d/%m/%Y %H:%M:%S")

    class Meta:
        model = KnowledgeDistillationView
        fields = ['softmax_temperature', 'loss_function','cpu', 'gpu', 'gpu_memory', 'computer_ram', 'cpu_frenquency', 
                  'max_watts', 'optimization_date', 'student', 'teacher']
    
    @extend_schema_field(ModelSerializer)
    def get_student(self, obj):
        
        model = ModelView.objects.get(id = obj.student_id)
        
        return ModelSerializer(model).data
    
    @extend_schema_field(ModelSerializer)
    def get_teacher(self, obj):
        
        model = ModelView.objects.get(id = obj.teacher_id)
        
        return ModelSerializer(model).data

class BasicDataModelSerializer(serializers.ModelSerializer):
    tasks = serializers.SerializerMethodField()
    creation_date = serializers.DateTimeField(format="%d/%m/%Y %H:%M:%S")

    class Meta:
        model = BasicDataModel
        fields = ['id', 'name', 'architecture', 'parameters_m', 'layers',  
                  'model_size_label', 'flops_b', 'model_size', 'training_time', 'creation_date',  
                  'precision', 'creator', 'fps_gpu','fps_cpu','std_gpu','std_cpu','num_macs', 'average_emissions_per_inference', 'average_energy_per_inference','avg_emissions_gco2eq', 'avg_energy_mwh', 
                  'map_50', 'map_50_95', 'tasks']
        
    @extend_schema_field(TaskSerializer(many = True))
    def get_tasks(self, obj):

        model_tasks = ModelTaskView.objects.filter(model_id=obj.id)

        tasks = TaskView.objects.filter(id__in=[model_task.task_id for model_task in model_tasks])

        return TaskSerializer(tasks, many = True).data
    
class FullDataModelSerializer(serializers.ModelSerializer):
    tasks = serializers.SerializerMethodField()
    evaluations = serializers.SerializerMethodField()
    students = serializers.SerializerMethodField()
    teachers = serializers.SerializerMethodField()
    optimizations = serializers.SerializerMethodField()
    creation_date = serializers.DateTimeField(format="%d/%m/%Y %H:%M:%S")
    
    class Meta:
        model = FullDataModel
        fields = [
                    'id', 'name', 'architecture', 'parameters_m', 'layers',  
                    'model_size_label', 'flops_b', 'model_size', 'training_time', 'creation_date',  
                    'description', 'precision', 'creator', 'tasks', 'evaluations', 
                    'students', 'teachers', 'optimizations']
        
    @extend_schema_field(TaskSerializer(many = True))
    def get_tasks(self, obj):

        model_tasks = ModelTaskView.objects.filter(model_id=obj.id)

        tasks = TaskView.objects.filter(id__in=[model_task.task_id for model_task in model_tasks])

        return TaskSerializer(tasks, many = True).data
    
    @extend_schema_field(EvaluationSerializer(many = True))
    def get_evaluations(self, obj):
        
        evaluations = EvaluationView.objects.filter(model_id = obj.id)
        
        return EvaluationSerializer(evaluations, many = True).data
        
    @extend_schema_field(ModelSerializer(many = True))
    def get_students(self, obj):
        
        distillations = KnowledgeDistillationView.objects.filter(teacher_id = obj.id)
        
        student_ids = [student.student_id for student in distillations]
        
        students = ModelView.objects.filter(id__in = student_ids)
        
        return ModelSerializer(students, many = True).data
    
    @extend_schema_field(ModelSerializer(many = True))
    def get_teachers(self, obj):
        
        distillations = KnowledgeDistillationView.objects.filter(student_id = obj.id)
        
        teacher_ids = [teacher.teacher_id for teacher in distillations]
        
        teachers = ModelView.objects.filter(id__in = teacher_ids)
        
        return ModelSerializer(teachers, many = True).data
    
    
    @extend_schema_field(serializers.ListSerializer(child = serializers.DictField()))
    def get_optimizations(self, obj):
        
        model_optimization = ModelOptimizationView.objects.filter(model_id=obj.id)
        
        optimization_ids = [opt.id for opt in model_optimization]
        
        optimizations = OptimizationView.objects.filter(id__in = optimization_ids)

        result = []
        for opt in optimizations:
            
            try:
                
                quantization = QuantizationView.objects.get(optimization_id=opt.id)
            except QuantizationView.DoesNotExist:
                quantization = None
            
            try:
                pruning = PruningView.objects.get(optimization_id=opt.id)
            except PruningView.DoesNotExist:
                pruning = None

            try:          
                distillation = KnowledgeDistillationView.objects.get(optimization_id=opt.id)
            except KnowledgeDistillationView.DoesNotExist:
                distillation = None
        
            opt_data = {
                "optimization_id": opt.id,
                "name": opt.name,
                "date": opt.date,
                "description": opt.description,
            }
            
            if quantization:
                opt_data['type'] = 'Quantization'
                opt_data['details'] = QuantizationSerializer(quantization).data
            elif pruning:
                opt_data['type'] = 'Pruning'
                opt_data['details'] = PruningSerializer(pruning).data
            elif distillation:
                opt_data['type'] = 'KnowledgeDistillation'
                opt_data['details'] = KnowledgeDistillationSerializer(distillation).data
            else:
                opt_data['type'] = 'Unknown'
                opt_data['details'] = {}

            result.append(opt_data)

        return result