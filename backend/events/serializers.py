from rest_framework import serializers
from home.models import (
    Event,
    EventImage,
    UserEventRegistration,
    BottleService,
    FavoriteEvent,
    Interest,
    Category,
)
from users.serializers import UserSerializer


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class EventImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventImage
        fields = ("image",)
        read_only_fields = ("event",)


class EventListSerializer(serializers.ModelSerializer):
    images = serializers.ImageField(write_only=True)
    event_categories = serializers.SerializerMethodField()
    event_bottle_services = serializers.SerializerMethodField()
    event_images = serializers.SerializerMethodField()
    favorite = serializers.SerializerMethodField()

    class Meta:
        model = Event
        exclude = ("user",)
        read_only_fields = ("id",)

        extra_kwargs = {
            "categories": {
                "write_only": True,
            },
            "bottle_services": {
                "write_only": True,
            },
        }

    def validate(self, attrs):
        location_data = (
            attrs.get("country")
            and attrs.get("street")
            and attrs.get("city")
            and attrs.get("zip_code")
        )

        if not attrs.get("location") and not location_data:
            raise serializers.ValidationError(
                {
                    "location": "Please select Location or provide Country, Street, City, and Zip code."
                }
            )

        return attrs

    def get_event_bottle_services(self, obj):
        if hasattr(obj, "bottle_services"):
            return BottleServiceSerializer(obj.bottle_services, many=True).data

    def get_event_images(self, obj):
        if hasattr(obj, "images"):
            return EventImageSerializer(obj.images, many=True).data

    def get_favorite(self, obj):
        user = self.context["request"].user
        return FavoriteEventSerializer(
            getattr(obj, "favorited").filter(user=user), many=True
        ).data

    def get_event_categories(self, obj):
        if hasattr(obj, "categories"):
            return CategorySerializer(obj.categories, many=True).data

    def create(self, validated_data):
        user = self.context["request"].user
        images = self.context["request"].FILES.getlist("images")
        validated_data.pop("images")
        categories = validated_data.pop("categories")
        bottle_services = validated_data.pop("bottle_services", [])
        instance = self.Meta.model._default_manager.create(
            **validated_data, **{"user": user}
        )
        instance.categories.add(*categories)
        instance.bottle_services.add(*bottle_services)

        for img in images:
            image_serializer = EventImageSerializer(data={"image": img})
            if image_serializer.is_valid(raise_exception=True):
                image_serializer.save(event=instance)
        return instance


class EventDetailsSerializer(serializers.ModelSerializer):
    images = serializers.ImageField(write_only=True)
    event_categories = serializers.SerializerMethodField()
    bottle_services = serializers.SerializerMethodField()
    event_images = serializers.SerializerMethodField()
    going_count = serializers.SerializerMethodField()
    going = serializers.SerializerMethodField()
    organizer = UserSerializer(source="user")
    favorite = serializers.SerializerMethodField()

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

    def get_bottle_services(self, obj):
        if hasattr(obj, "bottle_services"):
            return BottleServiceSerializer(obj.bottle_services, many=True).data

    def get_going(self, obj):
        if hasattr(obj, "going"):
            return GoingEventSerializer(obj.going.filter(reserved=True), many=True).data

    def get_going_count(self, obj):
        if hasattr(obj, "going"):
            return obj.going.filter(reserved=True).count()

    def get_favorite(self, obj):
        user = self.context["request"].user
        return FavoriteEventSerializer(
            getattr(obj, "favorited").filter(user=user), many=True
        ).data


class MyEventSerializer(serializers.ModelSerializer):
    event_categories = serializers.SerializerMethodField()
    event_images = serializers.SerializerMethodField()
    event_bottle_service = serializers.SerializerMethodField()
    going_count = serializers.SerializerMethodField()
    event_price = serializers.CharField(source="event.price")
    event_title = serializers.CharField(source="event.title")
    location = serializers.CharField(source="event.location")
    date = serializers.CharField(source="event.start_date")
    going = serializers.SerializerMethodField()
    organizer = UserSerializer(source="event.user")
    favorite = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    class Meta:
        model = UserEventRegistration
        exclude = (
            "user",
            "attendee",
            "interested",
            "reserved",
            "amount_paid",
            "amount_left",
            "transaction_id",
            "event",
        )
        read_only_fields = ("id",)

    def get_event_bottle_service(self, obj):
        return BottleServiceSerializer(obj.bottle_service).data

    def get_event_images(self, obj):
        if hasattr(obj.event, "images"):
            return EventImageSerializer(obj.event.images, many=True).data

    def get_event_categories(self, obj):
        if hasattr(obj.event, "categories"):
            return CategorySerializer(obj.event.categories, many=True).data

    def get_going(self, obj):
        if hasattr(obj.event, "going"):
            return GoingEventSerializer(
                obj.event.going.filter(reserved=True), many=True
            ).data

    def get_going_count(self, obj):
        if hasattr(obj.event, "going"):
            return obj.event.going.filter(reserved=True).count()

    def get_favorite(self, obj):
        user = self.context["request"].user
        return FavoriteEventSerializer(
            getattr(obj.event, "favorited").filter(user=user), many=True
        ).data

    def get_status(self, obj):
        return "reserved" if obj.reserved else "interested"


class RegisterEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserEventRegistration
        fields = "__all__"
        read_only_fields = (
            "id",
            "user",
            "interested",
            "reserved",
            "amount_paid",
            "amount_left",
        )


class GoingEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserEventRegistration
        exclude = "__all__"

    def to_representation(self, instance):
        return UserSerializer(instance.user).data


class ReserveSerializer(serializers.ModelSerializer):
    attendee = serializers.IntegerField()
    # percentage_upfront = serializers.IntegerField()
    payment_method = serializers.CharField()

    class Meta:
        model = UserEventRegistration
        fields = (
            "event",
            "bottle_service",
            "attendee",
            "payment_method",
            # "percentage_upfront",
        )

    def validate(self, attrs):
        if attrs.get("bottle_service") not in attrs.get("event").bottle_services.all():
            raise serializers.ValidationError(
                {"bottle_services": "Event doesn't have selected bottle service."}
            )
        return attrs


class ConfirmReservationSerializer(serializers.Serializer):
    payment_intent_id = serializers.CharField()


class FavoriteEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoriteEvent
        fields = "__all__"
        read_only_fields = ("id", "user")


class InterestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interest
        fields = "__all__"


class BottleServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = BottleService
        fields = "__all__"
        read_only_fields = ("user",)
