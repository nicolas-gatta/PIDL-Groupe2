from django.db import models

class ResourceAbstract(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, blank=True, null=True)
    cpu = models.CharField(max_length=50, blank=True, null=True)
    gpu_memory = models.IntegerField(blank=True, null=True)
    computer_ram = models.IntegerField(blank=True, null=True)
    cpu_frenquency = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    max_watts = models.IntegerField(blank=True, null=True)
    description = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'v_resource'
        abstract = True
        
class ModelAbstract(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, blank=False, null=False)
    architecture = models.CharField(max_length=50, blank=False, null=False)
    parameters_m = models.FloatField(blank=False, null=False)
    layers = models.IntegerField(blank=False, null=False)
    model_size_label = models.CharField(max_length=50, blank=False, null=False)
    flops_b = models.FloatField(blank=False, null=False)
    model_size = models.FloatField(blank=False, null=False)
    training_time = models.FloatField(blank=False, null=False)
    creation_date = models.DateTimeField(blank=False, null=False)
    description = models.TextField(blank=True, null=True)
    precision = models.CharField(max_length=50, blank=False, null=False)
    creator = models.CharField(max_length=100, blank=False, null=False)
    
    class Meta:
        managed = False
        db_table = "v_model"
        abstract = True

class ResourceView(ResourceAbstract):
    class Meta:
        managed = False
        db_table = 'v_resource'

class PrecisionView(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, blank=True, null=True)
    description = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'v_precision'
               
class TaskView(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, blank=True, null=True)
    description = models.CharField(max_length=150, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'v_task'

class OptimizationView(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, blank=True, null=True)
    date = models.DateTimeField(blank=True, null=True)
    description = models.CharField(max_length=100, blank=True, null=True)
    cpu = models.CharField(max_length=50, blank=True, null=True)
    gpu_memory = models.IntegerField(blank=True, null=True)
    computer_ram = models.IntegerField(blank=True, null=True)
    cpu_frenquency = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    max_watts = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'v_optimization'
        
class ModelView(ModelAbstract):
    class Meta:
        managed = False
        db_table = "v_model"
    
class EvaluationView(ResourceAbstract):
    id = models.AutoField(primary_key=True)
    accuracy = models.FloatField()
    final_loss = models.FloatField()
    latency_ms = models.FloatField()
    execution_time_ms = models.FloatField()
    energy_consumption_mwh = models.FloatField()
    emissions_gco2eq = models.FloatField()
    fps_gpu = models.FloatField()
    map_50 = models.FloatField()
    map_50_95 = models.FloatField()
    date = models.DateTimeField()
    model_id = models.IntegerField()
    model_name = models.CharField(max_length=100)
    name = None
    description = None
    
    class Meta:
        managed = False
        db_table = "v_evaluation"

class QuantizationView(ResourceAbstract):
    id = models.AutoField(primary_key=True)
    type = models.CharField(max_length=50, blank=True, null=True)
    description = models.CharField(max_length=100, blank=True, null=True)
    target_precision = models.CharField(max_length=50, blank=True, null=True)
    optimization_id = models.IntegerField()
    name = None
    description = None
    optimization_date = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        managed = False
        db_table = 'v_quantization'

class PruningView(ResourceAbstract):
    id = models.AutoField(primary_key=True)
    strategy = models.CharField(max_length=50, blank=True, null=True)
    rate = models.DecimalField(max_digits=3, decimal_places=2, blank=True, null=True)
    description = models.CharField(max_length=100, blank=True, null=True)
    optimization_id = models.IntegerField()
    name = None
    description = None
    optimization_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'v_pruning'

class KnowledgeDistillationView(ResourceAbstract):
    id = models.AutoField(primary_key=True)
    softmax_temperature = models.DecimalField(max_digits=3, decimal_places=1, blank=True, null=True)
    loss_function = models.CharField(max_length=50, blank=True, null=True)
    description = models.CharField(max_length=100, blank=True, null=True)
    teacher_id = models.IntegerField()
    teacher_name = models.CharField(max_length=100, blank=True, null=True)
    student_id = models.IntegerField()
    student_name = models.CharField(max_length=100, blank=True, null=True)
    optimization_id = models.IntegerField()
    name = None
    description = None
    optimization_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'v_knowledge_distillation'

class ModelOptimizationView(models.Model):
    id = models.AutoField(primary_key=True)
    model_id = models.IntegerField()
    model_name = models.CharField(max_length=100, blank=True, null=True)
    optimization_id = models.IntegerField()
    optimization_name = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'v_model_optimization'
        
class ModelTaskView(models.Model):
    id = models.AutoField(primary_key=True)
    model_id = models.IntegerField()
    model_name = models.CharField(max_length=100, blank=True, null=True)
    task_id = models.IntegerField() 
    task_name = models.CharField(max_length=100, blank=True, null=True) 

    class Meta:
        managed = False
        db_table = 'v_model_task'

class BasicDataModel(ModelAbstract):
    description = None
    fps_gpu = models.FloatField(blank=False, null=False)
    avg_emissions_gco2eq = models.FloatField(blank=False, null=False)
    avg_energy_mwh = models.FloatField(blank=False, null=False)
    map_50 = models.FloatField(blank=False, null=False)
    map_50_95 = models.FloatField(blank=False, null=False)
    
    class Meta:
        managed = False
        db_table = "v_simplify_data_model"
        
class FullDataModel(ModelAbstract):
    class Meta:
        managed = False
        db_table = 'v_model'