from rest_framework import serializers
from home.models import Event, EventImage, UserEventRegistration
from home.api.v1.serializers import CategorySerializer, UserSerializer


class EventImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventImage
        fields = ("image",)
        read_only_fields = ("event",)


class EventListSerializer(serializers.ModelSerializer):
    images = serializers.ImageField(write_only=True)
    event_categories = serializers.SerializerMethodField()
    event_images = serializers.SerializerMethodField()

    class Meta:
        model = Event
        exclude = ("user",)
        read_only_fields = ("id",)

        extra_kwargs = {
            "categories": {
                "write_only": True,
            }
        }

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


class EventDetailsSerializer(serializers.ModelSerializer):
    images = serializers.ImageField(write_only=True)
    event_categories = serializers.SerializerMethodField()
    event_images = serializers.SerializerMethodField()
    going_count = serializers.IntegerField(source="going.count")
    going = serializers.SerializerMethodField()
    organizer = UserSerializer(source="user")

    class Meta:
        model = Event
        exclude = ("user",)
        read_only_fields = ("id",)

        extra_kwargs = {
            "categories": {
                "write_only": True,
            }
        }

    def get_event_images(self, obj):
        if hasattr(obj, "images"):
            return EventImageSerializer(obj.images, many=True).data

    def get_event_categories(self, obj):
        if hasattr(obj, "categories"):
            return CategorySerializer(obj.categories, many=True).data

    def get_going(self, obj):
        if hasattr(obj, "going"):
            return UserSerializer(
                obj.going.values_list("user", flat=True), many=True
            ).data


class RegisterEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserEventRegistration
        fields = "__all__"
