from home.models import Notification
from rest_framework import serializers


class NotificationSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source="from_user.name", read_only=True)
    sender_avatar = serializers.URLField(
        source="from_user.profile_picture", read_only=True
    )

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
