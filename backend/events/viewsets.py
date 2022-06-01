from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from events.serializers import EventSerializer
from home.models import Event
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from utils.custom_permissions import IsOwnerAndReadOnly
from rest_framework.permissions import IsAuthenticated
from utils.custom_filters import filter_activities_with_get_param

# Create your views here.


class EventViewset(ModelViewSet):
    serializer_class = EventSerializer
    # permission_classes = (IsAuthenticated, IsOwnerAndReadOnly)
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

    def get_queryset(self):
        queryset = (
            self.filter_queryset(self.queryset)
            .filter(categories__in=self.request.user.interests.all())
            .distinct()
        )
        queryset = filter_activities_with_get_param(queryset, self.request)
        return queryset

    # def perform_create(self, serializer):
    #     serializer.save(user=self.request.user)
