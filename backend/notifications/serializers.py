from home.models import Notification
from rest_framework import serializers
from users.serializers import UserSerializer


class NotificationSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source="from_user.name", read_only=True)
    sender_avatar = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = (
            "sender_name",
            "sender_avatar",
            "redirect_url",
            "verb",
            "read",
            "created_at",
        )
        read_only_fields = ("redirect_url", "verb")

    def get_sender_avatar(self, obj):
        return UserSerializer(obj.from_user).data["profile_picture"]
