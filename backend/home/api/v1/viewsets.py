from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.viewsets import ModelViewSet, ViewSet
from rest_framework.mixins import ListModelMixin
from rest_framework.viewsets import GenericViewSet
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import permissions
from home.models import Category, AboutUs, PrivacyPolicy, TermsAndCondition, FAQ
from home.api.v1.serializers import (
    SignupSerializer,
    UserSerializer,
    CategorySerializer,
    AboutUsSerializer,
    PrivacyPolicySerializer,
    TermsAndConditionSerializer,
    FAQSerializer,
)


class SignupViewSet(ModelViewSet):
    serializer_class = SignupSerializer
    http_method_names = ["post"]


class LoginViewSet(ViewSet):
    """Based on rest_framework.authtoken.views.ObtainAuthToken"""

    serializer_class = AuthTokenSerializer

    def create(self, request):
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        token, created = Token.objects.get_or_create(user=user)
        user_serializer = UserSerializer(user)
        return Response({"token": token.key, "user": user_serializer.data})


class CategoryViewSet(ListModelMixin, GenericViewSet):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()


class FAQViewSet(ListModelMixin, GenericViewSet):
    permission_classes = (permissions.AllowAny,)
    serializer_class = FAQSerializer
    queryset = FAQ.objects.all()


class AboutUsViewSet(ListModelMixin, GenericViewSet):
    permission_classes = (permissions.AllowAny,)
    serializer_class = AboutUsSerializer
    queryset = AboutUs.objects.all()


class PrivacyPolicyViewSet(ListModelMixin, GenericViewSet):
    permission_classes = (permissions.AllowAny,)
    serializer_class = PrivacyPolicySerializer
    queryset = PrivacyPolicy.objects.all()


class TermsAndConditionViewSet(ListModelMixin, GenericViewSet):
    permission_classes = (permissions.AllowAny,)
    serializer_class = TermsAndConditionSerializer
    queryset = TermsAndCondition.objects.all()
