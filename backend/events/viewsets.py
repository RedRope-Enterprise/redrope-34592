from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from events.serializers import EventListSerializer, EventDetailsSerializer
from home.models import Event
from rest_framework import status
from rest_framework import filters
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import ListModelMixin
from django_filters.rest_framework import DjangoFilterBackend
from utils.custom_permissions import IsOwnerAndReadOnly
from rest_framework.permissions import IsAuthenticated
from utils.custom_filters import filter_events_with_get_param
from home.api.v1.serializers import UserSerializer

# Create your views here.


class EventViewset(ModelViewSet):
    serializer_class = EventListSerializer
    permission_classes = (IsAuthenticated, IsOwnerAndReadOnly)
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
        queryset = (
            self.filter_queryset(self.queryset)
            .filter(categories__in=self.request.user.interests.all())
            .distinct()
        )
        queryset = filter_events_with_get_param(queryset, self.request)
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
