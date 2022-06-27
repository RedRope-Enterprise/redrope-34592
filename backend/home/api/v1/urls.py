from django.urls import path, include
from rest_framework.routers import DefaultRouter

from home.api.v1.viewsets import (
    SignupViewSet,
    LoginViewSet,
    FAQViewSet,
    AboutUsViewSet,
    FeedBackSupportViewSet,
)

router = DefaultRouter()
router.register("signup", SignupViewSet, basename="signup")
router.register("login", LoginViewSet, basename="login")
router.register("about-us", AboutUsViewSet, basename="about_us")
router.register("faqs", FAQViewSet, basename="faqs")
router.register(
    "feedback-support", FeedBackSupportViewSet, basename="feedback_and_support"
)

urlpatterns = [
    path("", include(router.urls)),
]
