from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from events.serializers import (
    EventListSerializer,
    EventDetailsSerializer,
    RegisterEventSerializer,
    BottleServiceSerializer,
    FavoriteEventSerializer,
    CategorySerializer,
    InterestSerializer,
    MyEventSerializer,
)
from home.models import (
    Event,
    BottleService,
    FavoriteEvent,
    Interest,
    Category,
    UserEventRegistration,
)
from rest_framework import status
from rest_framework import filters
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import (
    CreateModelMixin,
    ListModelMixin,
    UpdateModelMixin,
    DestroyModelMixin,
)
from django_filters.rest_framework import DjangoFilterBackend
from utils.custom_permissions import (
    IsOwnerAndReadOnly,
    IsEventPlannerOrReadOnly,
    IsEventPlanner,
)
from rest_framework.permissions import IsAuthenticated
from utils.custom_filters import filter_events_with_get_param
from users.serializers import UserSerializer

# Create your views here.


class EventViewset(ModelViewSet):
    serializer_class = EventListSerializer
    permission_classes = (IsAuthenticated, IsEventPlannerOrReadOnly, IsOwnerAndReadOnly)
    queryset = Event.objects.all().order_by("-id")
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = [
        "title",
        "desc",
        "location",
        "price",
        "date",
        "images",
        "categories",
    ]
    # filterset_fields = ["title",]

    def get_serializer_class(self):
        if self.action == "list":
            return EventListSerializer
        if self.action == "retrieve":
            return EventDetailsSerializer
        return EventListSerializer

    def get_queryset(self):
        # queryset = (
        #     self.filter_queryset(self.queryset)
        #     .filter(categories__in=self.request.user.interests.all())
        #     .distinct()
        # )
        queryset = filter_events_with_get_param(self.queryset, self.request)
        return queryset

    @action(methods=["get"], detail=True)
    def going(self, request, pk=None):
        """Retieve users going for an event"""

        try:
            going = self.get_object().going.values_list("user", flat=True)
            page = self.paginate_queryset(going)
            if page is not None:
                serializer = UserSerializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            serializer = UserSerializer(going, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(methods=["get"], detail=False, url_path="my-events")
    def my_events(self, request):
        if request.user.event_planner:
            try:
                """Retrieve events created by user"""
                user_events = self.get_queryset().filter(user=request.user)

                page = self.paginate_queryset(user_events)
                if page is not None:
                    serializer = self.get_serializer(
                        page, context={"request": request}, many=True
                    )
                    return self.get_paginated_response(serializer.data)
                serializer = self.get_serializer(
                    user_events, context={"request": request}, many=True
                )
                return Response(serializer.data)
            except Exception as e:
                return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            """Retrieve events enrolled by user"""

            try:
                my_events = UserEventRegistration.objects.filter(user=request.user)
                page = self.paginate_queryset(my_events)
                if page is not None:
                    serializer = MyEventSerializer(
                        page, context={"request": request}, many=True
                    )
                    return self.get_paginated_response(serializer.data)
                serializer = MyEventSerializer(
                    my_events, context={"request": request}, many=True
                )
                return Response(serializer.data)
            except Exception as e:
                return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(
        methods=["get"],
        detail=False,
        permission_classes=[
            IsEventPlanner,
        ],
        url_path="my-bookings",
    )
    def my_bookings(self, request):
        """Retrieve events enrolled by user"""

        try:
            my_bookings = UserEventRegistration.objects.filter(event__user=request.user)
            page = self.paginate_queryset(my_bookings)
            if page is not None:
                serializer = MyEventSerializer(
                    page, context={"request": request}, many=True
                )
                return self.get_paginated_response(serializer.data)
            serializer = MyEventSerializer(
                my_bookings, context={"request": request}, many=True
            )
            return Response(serializer.data)
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RegisterEventViewset(CreateModelMixin, UpdateModelMixin, GenericViewSet):
    serializer_class = RegisterEventSerializer

    def perform_create(self, serializer):
        return serializer.save(user=self.request.user)


class BottleServiceViewset(ModelViewSet):
    serializer_class = BottleServiceSerializer
    permission_classes = (IsAuthenticated, IsOwnerAndReadOnly)
    queryset = BottleService.objects.all()
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = [
        "name",
    ]

    def perform_create(self, serializer):
        return serializer.save(user=self.request.user)


class FavoriteEventViewset(CreateModelMixin, DestroyModelMixin, GenericViewSet):
    serializer_class = FavoriteEventSerializer
    permission_classes = (IsAuthenticated, IsOwnerAndReadOnly)
    queryset = FavoriteEvent.objects.all()

    def perform_create(self, serializer):
        return serializer.save(user=self.request.user)


class CategoryViewSet(ListModelMixin, GenericViewSet):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()


class InterestViewSet(ListModelMixin, GenericViewSet):
    serializer_class = InterestSerializer
    queryset = Interest.objects.all()
