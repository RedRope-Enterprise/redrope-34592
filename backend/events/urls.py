from django.urls import path, include
from rest_framework.routers import DefaultRouter
from events.viewsets import EventViewset, RegisterEventViewset

router = DefaultRouter()

router.register("", EventViewset, basename="events")
router.register("register-event", RegisterEventViewset, basename="register_event")

app_name = "events"
urlpatterns = [
    path("", include(router.urls)),
]
