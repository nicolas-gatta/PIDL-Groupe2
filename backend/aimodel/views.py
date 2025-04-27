from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from .models import BasicDataModel
from .serializers import BasicDataModelSerializer
from rest_framework import status

# Create your views here.

def get_all_model():
    pass

def get_full_model_data():
    pass

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_all_models(request):
    try:
        models = BasicDataModel.objects.all()
        serializer = BasicDataModelSerializer(models, many=True)
        return Response({"models": serializer.data}, status = status.HTTP_200_OK)
    except BasicDataModel.DoesNotExist:
        return Response({"error": "No available Data"}, status = status.HTTP_404_NOT_FOUND)