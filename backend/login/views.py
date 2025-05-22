from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from django.contrib.auth import authenticate
from rest_framework import status

from login.serializers import CustomUserSerializer, RegisterInputSerializer, LoginInputSerializer
from login.models import CustomUser, Role
from utils.checks import group_and_super_user_checks, checks_and_get_required_fields
from drf_spectacular.utils import extend_schema, OpenApiResponse

# Create your views here.
@extend_schema(
    request=LoginInputSerializer,
    responses={
        200: OpenApiResponse(response=CustomUserSerializer, description="Successful Login"),
        404: OpenApiResponse(description="Invalid Credentials")
    },
    description="User login via email/password. Returns token and user info."
)
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    
    user_data = checks_and_get_required_fields(request.data, ["username", "password"])
    
    if isinstance(user_data, Response):
        return user_data
    
    user = authenticate(username = user_data["username"], password = user_data["password"])
    if user:
        token, _ = Token.objects.get_or_create(user = user)
        serializer = CustomUserSerializer(instance = user)
        return Response({'token': token.key, "user": serializer.data}, status = status.HTTP_200_OK)
    else:
        return Response({"error": "Invalid identification information"}, status = status.HTTP_404_NOT_FOUND)


@extend_schema(
    responses={
        200: OpenApiResponse(description="Successful Logout"),
        403: OpenApiResponse(description="Login Required")
    },
    description="User logout and deleting token."
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
        201: OpenApiResponse(response = CustomUserSerializer, description="User successfully registered."),
        400: OpenApiResponse(description="Missing email or password or first name or last name"),
        500: OpenApiResponse(description="Server error (e.g. existing user)")
    },
    description="Register a new user. The default role is 'Researcher'."
)
@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
@group_and_super_user_checks()
def register_view(request):
    email = request.data.get("email")
    password = request.data.get("password")
    first_name = request.data.get("first_name")
    last_name = request.data.get("last_name")

    user_data = checks_and_get_required_fields(request.data, ["email", "password", "first_name", "last_name"])
    
    if isinstance(user_data, Response):
        return user_data
    
    try:
        user = CustomUser.objects.create(
            email =  email,
            password = password,
            first_name = first_name,
            last_name = last_name,
            role_fk = Role.objects.get(role_id = 2)
        )

        serializer = CustomUserSerializer(user)
        
        return Response({
            "message": "Registration successful.",
            "user": serializer.data
        }, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        return Response({"error":str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

