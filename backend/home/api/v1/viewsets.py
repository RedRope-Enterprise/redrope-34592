from rest_framework.viewsets import ModelViewSet, ViewSet
from rest_framework.mixins import ListModelMixin, CreateModelMixin
from rest_framework.viewsets import GenericViewSet
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import permissions
from home.models import AboutUs, FAQ, FeedBackSupport
from home.api.v1.serializers import (
    SignupSerializer,
    AboutUsSerializer,
    FAQSerializer,
    CustomAuthTokenSerializer,
    FeedBackSupportSerializer,
    CustomUserDetailSerializer,
)
from users.serializers import UserSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


class SignupViewSet(ModelViewSet):
    serializer_class = SignupSerializer
    permission_classes = [
        permissions.AllowAny,
    ]
    http_method_names = ["post"]


class LoginViewSet(ViewSet):
    """Based on rest_framework.authtoken.views.ObtainAuthToken"""

    serializer_class = CustomAuthTokenSerializer
    permission_classes = [
        permissions.AllowAny,
    ]

    def create(self, request):
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        token, created = Token.objects.get_or_create(user=user)
        user_serializer = CustomUserDetailSerializer(
            user, context={"request": request, "user": user}
        )
        return Response({"token": token.key, "user": user_serializer.data})


class FAQViewSet(ListModelMixin, GenericViewSet):
    permission_classes = (permissions.AllowAny,)
    serializer_class = FAQSerializer
    queryset = FAQ.objects.all()


class AboutUsViewSet(ListModelMixin, GenericViewSet):
    permission_classes = (permissions.AllowAny,)
    serializer_class = AboutUsSerializer
    queryset = AboutUs.objects.all()


class FeedBackSupportViewSet(ListModelMixin, CreateModelMixin, GenericViewSet):
    # permission_classes = (permissions.AllowAny,)
    serializer_class = FeedBackSupportSerializer
    queryset = FeedBackSupport.objects.all()


# class TermsAndConditionViewSet(ListModelMixin, GenericViewSet):
#     permission_classes = (permissions.AllowAny,)
#     serializer_class = TermsAndConditionSerializer
#     queryset = TermsAndCondition.objects.all()
