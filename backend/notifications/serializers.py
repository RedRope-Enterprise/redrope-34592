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
            "notification_type",
            "read",
            "created_at",
        )
        read_only_fields = ("redirect_url", "verb", "notification_type")

    def get_sender_avatar(self, obj):
        return UserSerializer(obj.from_user).data["profile_picture"]
    
    def to_representation(self, instance):
        data = super(NotificationSerializer, self).to_representation(instance)
        if instance.notification_type in ("new_reservation", "interest_in_event"):
            data["reservation_id"] = instance.content_object.id
        
        if instance.notification_type == "event_likes":
            data["event_id"] = instance.content_object.id
        return data
