from django.urls import path, include
from rest_framework.routers import DefaultRouter
from events.viewsets import (
    EventViewset,
    RegisterEventViewset,
    BottleServiceViewset,
    FavoriteEventViewset,
    CategoryViewSet,
    InterestViewSet,
    ReserveViewset,
)

router = DefaultRouter()

router.register("bottle-service", BottleServiceViewset, basename="bottle_service")
router.register("register-event", RegisterEventViewset, basename="register_event")
router.register("favorite", FavoriteEventViewset, basename="favorite")
router.register("categories", CategoryViewSet, basename="categories")
router.register("interests", InterestViewSet, basename="interests")
router.register("", EventViewset, basename="events")

app_name = "events"
urlpatterns = [
    path("reserve/", ReserveViewset.as_view(), name="reserve"),
    path("", include(router.urls)),
]
