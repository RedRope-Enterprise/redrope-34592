from django.urls import path, include
from rest_framework.routers import DefaultRouter

from home.api.v1.viewsets import (
    SignupViewSet,
    LoginViewSet,
    CategoryViewSet,
    FAQViewSet,
    AboutUsViewSet,
)

router = DefaultRouter()
router.register("signup", SignupViewSet, basename="signup")
router.register("login", LoginViewSet, basename="login")
router.register("categories", CategoryViewSet, basename="categories")
router.register("about-us", AboutUsViewSet, basename="about_us")
router.register("faqs", FAQViewSet, basename="faqs")

urlpatterns = [
    path("", include(router.urls)),
]
