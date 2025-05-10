from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from .models import BasicDataModel, FullDataModel
from .serializers import BasicDataModelSerializer, FullDataModelSerializer
from rest_framework import status, generics
from django_filters.rest_framework import DjangoFilterBackend
from .filters import BasicDataFilter, FullDataFilter
from drf_spectacular.utils import extend_schema, OpenApiResponse

# Create your views here.
@extend_schema(
    summary="Liste des modèles de base",
    description="Retourne tous les modèles disponibles dans la vue simplifiée.",
    responses={
        200: BasicDataModelSerializer(many=True),
        404: OpenApiResponse(description="Aucun modèle trouvé")
    }
)
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_all_data_models(request):
    try:
        models = BasicDataModel.objects.all()
        serializer = BasicDataModelSerializer(models, many=True)
        return Response({"models": serializer.data}, status = status.HTTP_200_OK)
    except BasicDataModel.DoesNotExist:
        return Response({"error": "No available Data"}, status = status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_all_data_models_table(request):
    try:
        models = BasicDataModel.objects.all()
        serializer = BasicDataModelSerializer(models, many=True)
        return Response({"models": serializer.data}, status = status.HTTP_200_OK)
    except BasicDataModel.DoesNotExist:
        return Response({"error": "No available Data"}, status = status.HTTP_404_NOT_FOUND)
    
class FilteredModelListView(generics.ListAPIView):
    queryset = BasicDataModel.objects.all()
    serializer_class = BasicDataModelSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = BasicDataFilter


@extend_schema(
    summary="Liste des modèles complets",
    description="Retourne tous les modèles IA avec les détails complets (vue enrichie).",
    responses={
        200: FullDataModelSerializer(many=True),
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
@extend_schema(
    summary="Modèles filtrés (vue complète)",
    description="Filtrage des modèles complets avec tous les paramètres définis dans FullDataFilter.",
    responses=FullDataModelSerializer(many=True)
)
class FilteredFullModelListView(generics.ListAPIView):
    queryset = FullDataModel.objects.all()
    serializer_class = FullDataModelSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = FullDataFilter
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

