import logging
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from .models_views import BasicDataModel, FullDataModel, TaskView, PrecisionView
from .serializers import BasicDataModelSerializer, FullDataModelSerializer, TaskSerializer, PrecisionSerializer
from rest_framework import status, generics
from django_filters.rest_framework import DjangoFilterBackend
from .filters import BasicDataFilter
from drf_spectacular.utils import extend_schema, OpenApiResponse
from utils.checks import group_and_super_user_checks, checks_and_get_required_fields, get_present_fields
from django.utils import timezone
from .models import Model, Precision, Resource, Task, ModelTask, Evaluation, Optimization, ModelOptimization, Quantization, Pruning, KnowledgeDistillation
from login.models import CustomUser
from .pagination import CustomPageNumberPagination

logger = logging.getLogger(__name__)

@extend_schema(
    summary="Filtered models (simplified view)",
    description="Filtering of simplified models with all parameters defined in BasicDataModel.",
    responses = BasicDataModel
)
class FilteredModelListView(generics.ListAPIView):
    queryset = BasicDataModel.objects.all()
    serializer_class = BasicDataModelSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = BasicDataFilter
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPageNumberPagination
    
    
    def list(self, data):
        response = super().list({data})
        return Response({"models":response.data}, status = response.status_code)

@extend_schema(
    summary="Filtered models (full view)",
    description="Full model filtering with all parameters defined in FullDataFilter.",
    responses=FullDataModelSerializer
)
class FilteredFullModelListView(generics.ListAPIView):
    queryset = FullDataModel.objects.all()
    serializer_class = FullDataModelSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['id']
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def list(self, data):
        response = super().list({data})
        return Response({"models":response.data}, status = response.status_code)

@extend_schema(
    summary="List of Precisions",
    description="Returns all the precision.",
    responses={
        200: FullDataModelSerializer(many=True),
        403: OpenApiResponse(description="Login Required"),
        404: OpenApiResponse(description="Precision Not Found")
    }
)
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_all_precisions(request):
    try:
        precisions = PrecisionView.objects.all()
        serializer = PrecisionSerializer(precisions, many = True)
        return Response({"precisions": serializer.data}, status = status.HTTP_200_OK)
    except PrecisionView.DoesNotExist:
        return Response({"error": "No available Data"}, status = status.HTTP_404_NOT_FOUND)

@extend_schema(
    summary="List of Tasks",
    description="Returns all the task.",
    responses={
        200: FullDataModelSerializer(many=True),
        403: OpenApiResponse(description="Login Required"),
        404: OpenApiResponse(description="Tasks Not Found")
    }
)
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_all_tasks(request):
    try:
        tasks = TaskView.objects.all()
        serializer = TaskSerializer(tasks, many = True)
        return Response({"tasks": serializer.data}, status = status.HTTP_200_OK)
    except TaskView.DoesNotExist:
        return Response({"error": "No available Data"}, status = status.HTTP_404_NOT_FOUND)
 

@extend_schema(
    summary="List of basic models",
    description="Returns all models available in the simplified view.",
    responses={
        200: BasicDataModelSerializer(many=True),
        403: OpenApiResponse(description="Login Required"),
        404: OpenApiResponse(description="Models Not Found")
    }
)
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_all_simplify_data_models(request):
    try:
        models = BasicDataModel.objects.all()
        
        paginator = CustomPageNumberPagination()
        
        result_page = paginator.paginate_queryset(models, request)
        
        serializer = BasicDataModelSerializer(result_page, many=True)
        
        return Response({"models": paginator.get_paginated_response(serializer.data).data}, status = status.HTTP_200_OK)
    except BasicDataModel.DoesNotExist:
        return Response({"error": "No available Data"}, status = status.HTTP_404_NOT_FOUND) 


@extend_schema(
    summary="List of full models",
    description="Returns all AI models with full details (full view).",
    responses={
        200: FullDataModelSerializer(many=True),
        403: OpenApiResponse(description="Login Required"),
        404: OpenApiResponse(description="Models Not Found")
    }
)
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_all_full_data_models(request):
    try:
        models = FullDataModel.objects.all()
        serializer = FullDataModelSerializer(models, many=True)
        return Response({"models": serializer.data}, status=status.HTTP_200_OK)
    except FullDataModel.DoesNotExist:
        return Response({"error": "No available data"}, status=status.HTTP_404_NOT_FOUND)

@extend_schema(
    summary="Create a full model using json",
    description="Create a model with all the relavant informations like evaluations, optimizations, tasks,...",
    responses={
        200: OpenApiResponse(description="Model Created Successfully"),
        400: OpenApiResponse(description="Missing informations"),
        403: OpenApiResponse(description="Login Required")
    }
)
@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated]) 
@group_and_super_user_checks(["Researcher"])
def create_model(request):
    
    required_model_fields = ["model_name", "architecture", "parameter_count", "layer_count", "model_size_label",
                            "flops_billion", "model_size", "model_description", "precision_name", "tasks", "evaluations"]
    
    required_fields_evaluation = ["resources_name", "resources_cpu", "resources_cpu_frequency", "resources_gpu", "resources_gpu_memory",
                                  "resources_computer_memory", "resources_max_watt", "resources_description", "accuracies", 
                                  "final_losses", "latencies_ms", "executions_time_ms", "energies_consumption_mwh",
                                  "emissions_gco2eqs","avg_emissions_per_inference","avg_energy_per_inference", "fps_gpus","fps_cpus","std_gpus","std_cpus","num_macs", "map_50s", "map_50_95s", "dates"]
    
    model_data = checks_and_get_required_fields(data = request.data, required_fields = required_model_fields)
    
    if isinstance(model_data, Response):
        return model_data
    
    evaluations_data = checks_and_get_required_fields(data = request.data["evaluations"], required_fields = required_fields_evaluation)
    
    if isinstance(evaluations_data, Response):
        return evaluations_data

    model_data["user_id"] = request.user.pk
    
    model_instance = create_model_instance(data = model_data)
    
    tasks_instance = get_all_tasks_instance(data = model_data)
    
    _ = create_model_tasks_instance(model_instance, tasks_instance)
    
    evaluations_resource_instance = create_or_get_resource_instance(data = evaluations_data)
    
    _ = create_evaluation_instance(data = evaluations_data, model_instance = model_instance, resources_instance = evaluations_resource_instance)
    
    
    facultative_field = get_present_fields(data = request.data, present_field = ["optimizations"])
    
    if (facultative_field != {}):
        
        required_fields_optimization = ["resources_name", "resources_cpu", "resources_cpu_frequency", "resources_gpu", "resources_gpu_memory", 
                                        "resources_computer_memory", "resources_max_watt", "resources_description", "names", "dates", 
                                        "descriptions", "types"]
        
        required_fields_quantization = ["quantizations_type", "quantizations_precision_name", "quantizations_model_size_reduction", "quantizations_memory_reduction","quantizations_description"]
        required_fields_pruning = ["prunings_strategy","prunings_scope","prunings_compression_ratio", "prunings_memory_reduction", "prunings_rate", "prunings_description"]
        required_fields_knwoledge = ["knowledges_softmax","knowledges_loss_function", "knowledges_descritpion", "knowledges_teacher"]
        
        optimization_quantization_instance = []
        optimization_pruning_instance = []
        optimization_knowledge_instance = []
        
        optimization_data = checks_and_get_required_fields(data = request.data["optimizations"], required_fields = required_fields_optimization)
            
        optimizations_resource_instance = create_or_get_resource_instance(data = optimization_data)
        
        optimizations_instance = create_optimization_instance(data = optimization_data, resources_instance = optimizations_resource_instance)
        
        _ = create_model_optimization_instance(model_instance = model_instance, optimizations_instance = optimizations_instance)
        types = optimization_data["types"]
        
        if "Quantization" in types:
            quant_fields = checks_and_get_required_fields(data=request.data["optimizations"], required_fields=required_fields_quantization)
            if isinstance(quant_fields, Response):
                return quant_fields
            optimization_data.update(quant_fields)

        if "Pruning" in types:
            pruning_fields = checks_and_get_required_fields(data=request.data["optimizations"], required_fields=required_fields_pruning)
            if isinstance(pruning_fields, Response):
                return pruning_fields
            optimization_data.update(pruning_fields)

        if "Knowledge Distillation" in types:
            knowledge_fields = checks_and_get_required_fields(data=request.data["optimizations"], required_fields=required_fields_knwoledge)
            if isinstance(knowledge_fields, Response):
                return knowledge_fields
            optimization_data.update(knowledge_fields)

        for index, optimization_type in enumerate(optimization_data["types"]):
            if "Quantization" in optimization_data["types"]:
                optimization_quantization_instance.append(optimizations_instance[index])
                
            elif "Pruning" in optimization_data["types"]:
                optimization_pruning_instance.append(optimizations_instance[index])
                
            elif "Knowledge Distillation" in optimization_data["types"]:
                optimization_knowledge_instance.append(optimizations_instance[index])
                
        if (optimization_quantization_instance != []):
            create_quantization_instance(data = optimization_data, optimizations_instance = optimization_quantization_instance)
            
        if (optimization_pruning_instance != []):
            create_pruning_instance(data = optimization_data, optimizations_instance = optimization_pruning_instance)
            
        if (optimization_knowledge_instance != []):
            create_knowledge_distillation_instance(data = optimization_data, optimizations_instance = optimization_knowledge_instance, model_instance = model_instance)
        
    return Response({"message": "Model Created Successfully"}, status = status.HTTP_200_OK)

@extend_schema(
    summary="Update a full model",
    description="Update a model with all the relavant informations like evaluations, optimizations, tasks,...",
    responses={
        200: OpenApiResponse(description="Model Updated Successfully"),
        400: OpenApiResponse(description="Missing informations"),
        403: OpenApiResponse(description="Login Required"),
        406: OpenApiResponse(description="You are not the owner of the model")
    }
)
@api_view(['PUT'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated]) 
@group_and_super_user_checks(["Researcher"])
def update_model(request):
    pass
    return Response({"message": "Model Updated Successfully"}, status = status.HTTP_200_OK)

@extend_schema(
    summary="Delete a model",
    description="Create a model with all the relavant informations like evaluations, optimizations, tasks,...",
    responses={
        200: OpenApiResponse(description="Model Deleted Successfully"),
        400: OpenApiResponse(description="Missing informations"),
        403: OpenApiResponse(description="Login Required"),
        406: OpenApiResponse(description="You are not the owner of the model")
    }
)
@api_view(['DELETE'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated]) 
@group_and_super_user_checks(["Researcher"])
def delete_model(request, pk):
    try:
        model = Model.objects.get(model_id = pk)
        if model.user_fk.pk != request.user.pk:
            return Response({"message": "You are not the owner of the model"}, status = status.HTTP_406_NOT_ACCEPTABLE)
        model.delete()
        return Response({"message": "Model Deleted Sucessfully"}, status = status.HTTP_200_OK)
    except Model.DoesNotExist:
        return Response({"error": "Model Not Found"}, status = status.HTTP_404_NOT_FOUND)


def create_model_instance(data):
    return Model.objects.create(
        model_name = data["model_name"], 
        architecture = data["architecture"],
        parameter_count = data["parameter_count"],
        layer_count = data["layer_count"],
        model_size_label = data["model_size_label"],
        flops_billion = data["flops_billion"], 
        model_size = data["model_size"],
        creation_date = timezone.now(),
        model_description = data["model_description"],
        user_fk = CustomUser.objects.get(user_id = data["user_id"]),
        precision_fk = Precision.objects.get(precision_name = data["precision_name"])
    )    

def get_all_tasks_instance(data):
    
    tasks_instance = []
    
    for task_name in data["tasks"]:
        tasks_instance.append(Task.objects.get(task_name = task_name))
        
    return tasks_instance

def create_model_tasks_instance(model_instance, tasks_instances):
        
    model_tasks_instances = [ModelTask(task_fk = task, model_fk = model_instance) for task in tasks_instances]
    
    return ModelTask.objects.bulk_create(model_tasks_instances)
    
def create_or_get_resource_instance(data):
    resources_instance = []

    for index in range(len(data["resources_cpu"])):
        
        resource_instance, _ = Resource.objects.get_or_create(
            cpu_type = data["resources_cpu"][index], 
            gpu_type = data["resources_gpu"][index],
            memory_gpu = data["resources_gpu_memory"][index], 
            memory_gb = data["resources_computer_memory"][index], 
            cpu_frequency_ghz = data["resources_cpu_frequency"][index], 
            max_power_watts = data["resources_max_watt"][index],
            defaults={'resource_name': data["resources_name"][index], 'resource_description': data["resources_description"][index]}
        )
        
        resources_instance.append(resource_instance)    
    
    return resources_instance

def create_evaluation_instance(data, model_instance, resources_instance):
    
    evaluations_instance = []
    
    for index in range(len(resources_instance)):
        evaluation = Evaluation(
            accuracy = data["accuracies"][index],
            final_loss = data["final_losses"][index],
            latency_ms = data["latencies_ms"][index],
            execution_time_ms = data["executions_time_ms"][index],
            energy_consumption_mwh = data["energies_consumption_mwh"][index],
            emissions_gco2eq = data["emissions_gco2eqs"][index],
            average_emissions_per_inference = data["avg_emissions_per_inference"][index],
            average_energy_per_inference = data["avg_energy_per_inference"][index],
            fps_gpu = data["fps_gpus"][index],
            fps_cpu = data["fps_cpus"][index],
            std_gpu = data["std_gpus"][index],
            std_cpu = data["std_cpus"][index],
            num_macs = data["num_macs"][index],
            map_50 = data["map_50s"][index],
            map_50_95 = data["map_50_95s"][index],
            evaluation_date = data["dates"][index],
            resource_fk = resources_instance[index],
            model_fk = model_instance
        )
        
        evaluations_instance.append(evaluation)
        
    return Evaluation.objects.bulk_create(evaluations_instance)

def create_optimization_instance(data, resources_instance):
    
    optimizations_instance = []
    
    for index in range(len(resources_instance)):
        
        optimization = Optimization.objects.create(
            optimization_name = data["names"][index],
            optimization_date = data["dates"][index],
            optimization_description = data["descriptions"][index],
            resource_fk = resources_instance[index]
        )
        
        optimizations_instance.append(optimization)
    
    return optimizations_instance

def create_model_optimization_instance(model_instance, optimizations_instance):
    
    model_optimizations_instance = [ModelOptimization(model_fk = model_instance, optimization_fk = optimization) for optimization in optimizations_instance]
        
    return ModelOptimization.objects.bulk_create(model_optimizations_instance)

def create_quantization_instance(data, optimizations_instance):
    quantizations_instance = []
    
    for index in range(len(optimizations_instance)):
        quantization = Quantization(
            quantization_type = data["quantizations_type"][index],
            quantization_memory_reduction = data["quantizations_memory_reduction"][index], 
            quantization_model_size_reduction = data["quantizations_model_size_reduction"][index],
            quantization_description = data["quantizations_description"][index],
            precision_fk = Precision.objects.get(precision_name = data["quantizations_precision_name"][index]),
            optimization_fk = optimizations_instance[index]
        )
        
        quantizations_instance.append(quantization)
        
    return Quantization.objects.bulk_create(quantizations_instance)
    
def create_pruning_instance(data, optimizations_instance):
    
    prunings_instance = []
    
    for index in range(len(optimizations_instance)):
        pruning = Pruning(
            pruning_strategy = data["prunings_strategy"][index],
            pruning_scope = data["prunings_scope"][index],
            pruning_compression_ratio = data["prunings_compression_ratio"][index],
            pruning_memory_reduction = data["prunings_memory_reduction"][index],
            pruning_rate = data["prunings_rate"][index],
            pruning_description = data["prunings_description"][index],
            optimization_fk = optimizations_instance[index]
        )
        
        prunings_instance.append(pruning)
    
    return Pruning.objects.bulk_create(prunings_instance)
    
def create_knowledge_distillation_instance(data, optimizations_instance, model_instance):
    knowledges_instance = []
    
    for index in range(len(optimizations_instance)):
        knowledge = KnowledgeDistillation(
            softmax_temperature = data["knowledges_softmax"][index],
            loss_function = data["knowledges_loss_function"][index],
            knowledge_distillation_description = data["knowledges_descritpion"][index],
            student = model_instance,
            teacher = Model.objects.get(model_id = data["knowledges_teacher"][index]),
            optimization_fk = optimizations_instance[index]
        )
        
        knowledges_instance.append(knowledge)
        
    return KnowledgeDistillation.objects.bulk_create(knowledges_instance)
    