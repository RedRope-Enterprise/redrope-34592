from rest_framework.viewsets import ModelViewSet, ViewSet
from rest_framework.mixins import ListModelMixin, CreateModelMixin
from rest_framework.viewsets import GenericViewSet
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_403_FORBIDDEN,
    HTTP_400_BAD_REQUEST,
    HTTP_500_INTERNAL_SERVER_ERROR,
)
from allauth.utils import generate_unique_username
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

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.serializer_class(data=request.data)
            serializer.is_valid(raise_exception=True)

            user_instance = User(
                **serializer.data,
                username=generate_unique_username(
                    [serializer.data.get("name"), serializer.data.get("email"), "user"]
                )
            )

            user_instance.set_password(serializer.validated_data.get("password"))
            user_instance.save()
            token, created = Token.objects.get_or_create(user=user_instance)

            user_serializer = CustomUserDetailSerializer(
                user_instance, context={"request": request, "user": user_instance}
            ).data

            return Response(
                {"token": token.key, "user": user_serializer}, status=HTTP_200_OK
            )

        except ValidationError as error:
            if error.detail.get("email"):
                error_str = {"error": error.detail.get("email")[0]}
            else:
                error_str = error.detail
            return Response(error_str, status=HTTP_200_OK)
        except Exception as error:
            return Response(
                {"error": str(error)}, status=HTTP_500_INTERNAL_SERVER_ERROR
            )


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


class DeleteAccount(ViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def create(self, request):
        """
        Method to delete user account.

        ---
            parameters:
        - No parameters required.


            responseMessages
        - code: 200
            message: "success"

        """

        try:
            user = self.request.user
            user.delete()
            return Response({"success": True}, status=HTTP_200_OK)
        except Exception as error:
            return Response(
                {"error_message": str(error)}, status=HTTP_500_INTERNAL_SERVER_ERROR
            )
