import logging
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from .models_views import BasicDataModel, FullDataModel
from .serializers import BasicDataModelSerializer, FullDataModelSerializer
from rest_framework import status, generics
from django_filters.rest_framework import DjangoFilterBackend
from .filters import BasicDataFilter
from drf_spectacular.utils import extend_schema, OpenApiResponse
from utils.checks import group_and_super_user_checks
from django.utils import timezone


logger = logging.getLogger(__name__)

@extend_schema(
    summary="Modèles filtrés (vue simplifiée)",
    description="Filtrage des modèles simplifiés avec tous les paramètres définis dans BasicDataModel.",
    responses=BasicDataModel
)
class FilteredModelListView(generics.ListAPIView):
    queryset = BasicDataModel.objects.all()
    serializer_class = BasicDataModelSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = BasicDataFilter
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def list(self, data):
        response = super().list({data})
        return Response({"models":response.data}, status = response.status_code)

@extend_schema(
    summary="Modèles filtrés (vue complète)",
    description="Filtrage des modèles complets avec tous les paramètres définis dans FullDataFilter.",
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
    summary="Liste des modèles de base",
    description="Retourne tous les modèles disponibles dans la vue simplifiée.",
    responses={
        200: BasicDataModelSerializer(many=True),
        403: OpenApiResponse(description="Connexion Nécessaire"),
        404: OpenApiResponse(description="Aucun modèle trouvé")
    }
)
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_all_simplify_data_models(request):
    try:
        models = BasicDataModel.objects.all()
        serializer = BasicDataModelSerializer(models, many=True)
        return Response({"models": serializer.data}, status = status.HTTP_200_OK)
    except BasicDataModel.DoesNotExist:
        return Response({"error": "No available Data"}, status = status.HTTP_404_NOT_FOUND)


@extend_schema(
    summary="Liste des modèles complets",
    description="Retourne tous les modèles IA avec les détails complets (vue enrichie).",
    responses={
        200: FullDataModelSerializer(many=True),
        403: OpenApiResponse(description="Connexion Nécessaire"),
        404: OpenApiResponse(description="Aucun modèle trouvé")
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

@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated]) 
@group_and_super_user_checks(["Researcher"])
def create_model(request):
    model_id = request.data.get("model_id")
    model_name = request.data.get("model_name")
    architecture = request.data.get("architecture")
    parameter_count = request.data.get("parameter_count")
    layer_count = request.data.get("layer_count")
    model_size_label = request.data.get("model_size_label")
    flops_billion = request.data.get("flops_billion")
    model_size = request.data.get("model_size")
    model_description = request.data.get("model_description")
    creation_date = timezone.now()
    
    user_id =  request.data.get("user_id")
    precision_name = request.data.get("precision_name")
    tasks = request.data.get("tasks")
    evaluations = request.data.get("evaluations")
    optimizations = request.data.get("optimizations")

@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated]) 
@group_and_super_user_checks(["Researcher"])
def create_model_json(request):
    pass

@api_view(['PUT'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated]) 
@group_and_super_user_checks(["Researcher"])
def update_model(request):
    pass

@api_view(['DELETE'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated]) 
@group_and_super_user_checks(["Researcher"])
def delete_model(request, pk):
    pass
    
