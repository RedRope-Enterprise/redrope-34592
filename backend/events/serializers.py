from rest_framework import serializers
from home.models import Event, EventImage
from home.api.v1.serializers import CategorySerializer


class EventImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventImage
        fields = "__all__"
        read_only_fields = ("event",)


class EventSerializer(serializers.ModelSerializer):
    images = serializers.ImageField(write_only=True)
    event_categories = serializers.SerializerMethodField()
    event_images = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = "__all__"
        read_only_fields = ("id", "user")

    def get_event_images(self, obj):
        if hasattr(obj, "images"):
            return EventImageSerializer(obj.images, many=True).data

    def get_event_categories(self, obj):
        if hasattr(obj, "categories"):
            return CategorySerializer(obj.categories, many=True).data

    def create(self, validated_data):
        user = self.context["request"].user
        images = self.context["request"].FILES.getlist("images")
        validated_data.pop("images")
        categories = validated_data.pop("categories")
        instance = self.Meta.model._default_manager.create(
            **validated_data, **{"user": user}
        )
        instance.categories.add(*categories)

        for img in images:
            image_serializer = EventImageSerializer(data={"image": img})
            if image_serializer.is_valid(raise_exception=True):
                image_serializer.save(event=instance)
        return instance
