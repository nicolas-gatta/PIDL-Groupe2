from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from django.contrib.auth import authenticate
from rest_framework import status

from login.serializers import CustomUserSerializer

# Create your views here.

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get("username")
    password = request.data.get("password")
    
    user = authenticate(username=username, password=password)
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        serializer = CustomUserSerializer(instance = user)
        return Response({'token': token.key, "user": serializer.data}, status = status.HTTP_200_OK)
    else:
        return Response({"error": "Invalid credentials"}, status = status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def logout_view(request):
    request.user.auth_token.delete()
    return Response({"message": "Logged out successfully", "token": "", "user": {}}, status = status.HTTP_200_OK)
