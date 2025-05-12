from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from django.contrib.auth import authenticate
from rest_framework import status

from login.serializers import CustomUserSerializer, RegisterInputSerializer, LoginInputSerializer
from login.models import CustomUser, Role

from django.shortcuts import render
from drf_spectacular.utils import extend_schema, OpenApiResponse

# Create your views here.
@extend_schema(
    request=LoginInputSerializer,
    responses={
        200: OpenApiResponse(response=CustomUserSerializer, description="Connexion réussie"),
        404: OpenApiResponse(description="Identifiants invalides")
    },
    description="Connexion d'un utilisateur via email/mot de passe. Retourne un token et les infos utilisateur."
)
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


@extend_schema(
    responses={
        200: OpenApiResponse(description="Déconnexion réussie."),
        403: OpenApiResponse(description="Connexion Nécessaire")
    },
    description="Déconnexion de l'utilisateur en supprimant son token."
)
@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def logout_view(request):
    request.user.auth_token.delete()
    return Response({"message": "Logged out successfully", "token": "", "user": {}}, status = status.HTTP_200_OK)

@extend_schema(
    request=RegisterInputSerializer,
    responses={
        201: OpenApiResponse(response=CustomUserSerializer, description="Utilisateur inscrit avec succès."),
        400: OpenApiResponse(description="Email ou mot de passe manquant."),
        500: OpenApiResponse(description="Erreur serveur (ex : utilisateur existant)")
    },
    description="Inscription d'un nouvel utilisateur. Par défaut, le rôle est 'Researcher'."
)
@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def register_view(request):
    email = request.data.get("email")
    password = request.data.get("password")
    first_name = request.data.get("first_name")
    last_name = request.data.get("last_name")

    if not email or not password:
        return Response({"error": "Email et mot de passe requis."}, status = status.HTTP_400_BAD_REQUEST) 
    
    try:

        user = CustomUser.objects.create(
            email =  email,
            password = password,
            first_name = first_name,
            last_name = last_name,
            role_fk = Role.objects.get(role_id = 3)
        )

        serializer = CustomUserSerializer(user)
        return Response({
            "message": "inscription réussie.",
            "user": serializer.data
        }, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        return Response({"error":str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

