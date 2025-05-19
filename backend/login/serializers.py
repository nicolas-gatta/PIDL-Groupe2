from rest_framework import serializers
from .models import CustomUser, Role

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['role_id', 'role_name', 'role_description']

class CustomUserSerializer(serializers.ModelSerializer):
    role_fk = RoleSerializer()

    class Meta:
        model = CustomUser
        fields = ['user_id', 'first_name', 'last_name', 'email', 'is_active', 'is_staff', 'is_superuser', 'role_fk']


class LoginInputSerializer(serializers.Serializer):
    username = serializers.EmailField(
        required=True, help_text="Adresse email de connexion"
    )
    password = serializers.CharField(
        required=True, write_only=True, help_text="Mot de passe"
    )

class RegisterInputSerializer(serializers.Serializer):
    email = serializers.EmailField(
        required=True, help_text="Adresse email de l'utilisateur"
    )
    password = serializers.CharField(
        required=True, min_length=6, write_only=True, help_text="Mot de passe"
    )
    first_name = serializers.CharField(
        required=False, allow_blank=True, help_text="Prénom"
    )
    last_name = serializers.CharField(
        required=False, allow_blank=True, help_text="Nom"
    )


