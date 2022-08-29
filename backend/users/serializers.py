from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):

    # username = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "email", "name", "profile_picture"]

    # def get_username(self, obj):

    #         return obj.username
