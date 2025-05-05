from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from .models import BasicDataModel
from .serializers import BasicDataModelSerializer
from rest_framework import status, generics
from django_filters.rest_framework import DjangoFilterBackend
from .filters import BasicDataFilter

# Create your views here.

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