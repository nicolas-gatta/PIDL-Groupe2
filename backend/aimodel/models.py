from django.db import models
from login.models import CustomUser

# Create your models here.

class Resource(models.Model):
    resource_id = models.AutoField(primary_key=True)
    resource_name = models.CharField(max_length=50, blank=True, null=True)
    cpu_type = models.CharField(max_length=50, blank=True, null=True)
    memory_gpu = models.IntegerField(blank=True, null=True)
    memory_gb = models.IntegerField(blank=True, null=True)
    cpu_frequency_ghz = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    max_power_watts = models.IntegerField(blank=True, null=True)
    resource_description = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'resource'

class Precision(models.Model):
    precision_id = models.AutoField(primary_key=True)
    precision_name = models.CharField(max_length=50, blank=True, null=True)
    precision_description = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'precision'
        
class Task(models.Model):
    task_id = models.AutoField(primary_key=True)
    task_name = models.CharField(max_length=50, blank=True, null=True)
    task_description = models.CharField(max_length=150, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'task'

class Optimization(models.Model):
    optimization_id = models.AutoField(primary_key=True)
    optimization_name = models.CharField(max_length=100, blank=True, null=True)
    optimization_date = models.DateTimeField(blank=True, null=True)
    optimization_description = models.CharField(max_length=100, blank=True, null=True)
    resource_fk = models.ForeignKey(Resource, models.CASCADE, db_column='resource_fk')

    class Meta:
        managed = False
        db_table = 'optimization'

class Model(models.Model):
    model_id = models.AutoField(primary_key=True)
    model_name = models.CharField(max_length=100, blank=True, null=True)
    architecture = models.CharField(max_length=100, blank=True, null=True)
    parameter_count = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    layer_count = models.IntegerField(blank=True, null=True)
    model_size_label = models.CharField(max_length=1, blank=True, null=True)
    flops_billion = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    model_size = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    creation_date = models.DateTimeField(blank=True, null=True)
    model_description = models.CharField(max_length=100, blank=True, null=True)
    user_fk = models.ForeignKey(CustomUser, models.CASCADE, db_column='user_fk')
    precision_fk = models.ForeignKey(Precision,models.CASCADE, db_column='precision_fk')

    class Meta:
        managed = False
        db_table = 'model'
        
class Evaluation(models.Model):
    evaluation_id = models.AutoField(primary_key=True)
    accuracy = models.DecimalField(max_digits=5, decimal_places=4, blank=True, null=True)
    final_loss = models.DecimalField(max_digits=4, decimal_places=3, blank=True, null=True)
    latency_ms = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    execution_time_ms = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    energy_consumption_mwh = models.DecimalField(max_digits=6, decimal_places=4, blank=True, null=True)
    emissions_gco2eq = models.DecimalField(max_digits=8, decimal_places=5, blank=True, null=True)
    fps_gpu = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    map_50 = models.DecimalField(max_digits=5, decimal_places=4, blank=True, null=True)
    map_50_95 = models.DecimalField(max_digits=5, decimal_places=4, blank=True, null=True)
    evaluation_date = models.DateTimeField(blank=True, null=False)
    resource_fk = models.ForeignKey(Resource, models.CASCADE, db_column='resource_fk')
    model_fk = models.ForeignKey(Model, models.CASCADE, db_column='model_fk')

    class Meta:
        managed = False
        db_table = 'evaluation'


class Quantization(models.Model):
    quantization_id = models.AutoField(primary_key=True)
    quantization_type = models.CharField(max_length=50, blank=True, null=True)
    quantization_description = models.CharField(max_length=100, blank=True, null=True)
    precision_fk = models.ForeignKey(Precision,models.CASCADE, db_column='precision_fk')
    optimization_fk = models.OneToOneField(Optimization, models.CASCADE, db_column='optimization_fk')

    class Meta:
        managed = False
        db_table = 'quantization'

class Pruning(models.Model):
    pruning_id = models.AutoField(primary_key=True)
    pruning_strategy = models.CharField(max_length=50, blank=True, null=True)
    pruning_rate = models.DecimalField(max_digits=3, decimal_places=2, blank=True, null=True)
    pruning_description = models.CharField(max_length=100, blank=True, null=True)
    optimization_fk = models.OneToOneField(Optimization, models.CASCADE, db_column='optimization_fk')

    class Meta:
        managed = False
        db_table = 'pruning'
        
class KnowledgeDistillation(models.Model):
    knowledged_distillation_id = models.AutoField(primary_key=True)
    softmax_temperature = models.DecimalField(max_digits=3, decimal_places=1, blank=True, null=True)
    loss_function = models.CharField(max_length=50, blank=True, null=True)
    knowledged_distillation_description = models.CharField(max_length=100, blank=True, null=True)
    student = models.ForeignKey(Model, models.CASCADE, db_column='student')
    teacher = models.ForeignKey(Model, models.CASCADE, db_column='teacher', related_name='knowledgedistillation_teacher_set')
    optimization_fk = models.OneToOneField(Optimization, models.CASCADE, db_column='optimization_fk')

    class Meta:
        managed = False
        db_table = 'knowledge_distillation'


class ModelOptimization(models.Model):
    model_optimization_id = models.AutoField(primary_key=True)
    model_fk = models.ForeignKey(Model, models.CASCADE, db_column='model_fk')
    optimization_fk = models.ForeignKey(Optimization, models.CASCADE, db_column='optimization_fk')

    class Meta:
        managed = False
        db_table = 'model_optimization'


class ModelTask(models.Model):
    model_task_id = models.AutoField(primary_key=True)
    model_fk = models.ForeignKey(Model, models.CASCADE, db_column='model_fk')
    task_fk = models.ForeignKey(Task, models.CASCADE, db_column='task_fk')

    class Meta:
        managed = False
        db_table = 'model_task'
        
#class FullDataModel(models.Model):
