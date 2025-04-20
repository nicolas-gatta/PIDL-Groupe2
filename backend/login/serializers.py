from rest_framework import serializers
from .models import CustomUser, Role

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['role_id', 'role_name', 'description']

class CustomUserSerializer(serializers.ModelSerializer):
    role_fk = RoleSerializer()

    class Meta:
        model = CustomUser
        fields = ['user_id', 'first_name', 'last_name', 'email', 'is_active', 'is_staff', 'role_fk']
