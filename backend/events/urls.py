from django.urls import path, include
from rest_framework.routers import DefaultRouter
from events.viewsets import EventViewset

router = DefaultRouter()

router.register("", EventViewset, basename="events")

app_name = "events"
urlpatterns = [
    path("", include(router.urls)),
]
