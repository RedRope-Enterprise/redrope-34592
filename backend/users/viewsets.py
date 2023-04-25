import requests
from django.contrib.auth import get_user_model
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse
from rest_framework.authtoken.models import Token
from django.views.generic import DetailView, RedirectView, UpdateView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework.exceptions import ValidationError
from django.contrib.sites.shortcuts import get_current_site
from requests.exceptions import HTTPError
from rest_framework.viewsets import GenericViewSet
from utils.custom_permissions import IsOwnerAndReadOnly
from rest_framework.mixins import ListModelMixin
from rest_framework.mixins import UpdateModelMixin
from rest_framework.mixins import RetrieveModelMixin
from rest_framework.mixins import DestroyModelMixin
from rest_framework.permissions import IsAuthenticated, AllowAny
from allauth.socialaccount.providers.facebook.views import FacebookOAuth2Adapter
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from allauth.socialaccount.providers.apple.views import AppleOAuth2Adapter
from allauth.socialaccount.providers.apple.client import AppleOAuth2Client
from allauth.socialaccount.models import SocialAccount, SocialApp
from rest_auth.registration.views import SocialLoginView
from rest_framework.viewsets import ModelViewSet
from notifications.serializers import NotificationSerializer
from push_notifications.models import GCMDevice
from home.models import Event, Notification
from home.api.v1.serializers import (
    CustomUserDetailSerializer,
    CustomSocialLoginSerializer,
    CustomAppleSocialLoginSerializer,
)
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_403_FORBIDDEN,
    HTTP_400_BAD_REQUEST,
    HTTP_500_INTERNAL_SERVER_ERROR,
)
from rest_framework.response import Response
from users.serializers import UserSerializer, GCMDeviceSerializer, \
    BankAccountSerializer, WithdrawalSerializer
from rest_auth.registration.serializers import SocialLoginSerializer
from events.serializers import EventDetailsSerializer
from django.db import IntegrityError
from users.models import BankAccount, Withdrawal
import logging


User = get_user_model()

try:
    APP_DOMAIN = f"https://{get_current_site(None)}"
except Exception:
    APP_DOMAIN = ""


class UserDetailView(LoginRequiredMixin, DetailView):

    model = User
    slug_field = "username"
    slug_url_kwarg = "username"


user_detail_view = UserDetailView.as_view()


class UserUpdateView(LoginRequiredMixin, UpdateView):

    model = User
    fields = ["name"]

    def get_success_url(self):
        return reverse("users:detail", kwargs={"username": self.request.user.username})

    def get_object(self):
        return User.objects.get(username=self.request.user.username)


user_update_view = UserUpdateView.as_view()


class UserRedirectView(LoginRequiredMixin, RedirectView):

    permanent = False

    def get_redirect_url(self):
        return reverse("users:detail", kwargs={"username": self.request.user.username})


user_redirect_view = UserRedirectView.as_view()

# -------------------------------------------------------------------------------------
class FacebookLogin(SocialLoginView):
    permission_classes = (AllowAny,)
    adapter_class = FacebookOAuth2Adapter
    client_class = OAuth2Client
    # serializer_class = CustomAppleSocialLoginSerializer

    def get_serializer(self, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        kwargs["context"] = self.get_serializer_context()
        return serializer_class(*args, **kwargs)

    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            if response.status_code == 200:
                cur_user = self.request.user
                social_account = SocialAccount.objects.filter(user=cur_user)[0]
                cur_user.name = social_account.extra_data["name"]
                cur_user.save()

                if social_account.extra_data.get("picture"):
                    cur_user.alt_profile_picture = social_account.extra_data["picture"]
                cur_user.save()

                data = UserSerializer(cur_user).data
                return Response(data, status=HTTP_200_OK)
            else:
                return response
        except KeyError as error:
            return Response(
                {"error_message": "Missing key :" + str(error)},
                status=HTTP_400_BAD_REQUEST,
            )
        except Exception as error:
            return Response(
                {"error_message": str(error)}, status=HTTP_500_INTERNAL_SERVER_ERROR
            )


class CustomGoogleOAuth2Adapter(GoogleOAuth2Adapter):
    # provider_id = GoogleProvider.id
    access_token_url = "https://accounts.google.com/o/oauth2/token"
    authorize_url = "https://accounts.google.com/o/oauth2/auth"
    profile_url = "https://www.googleapis.com/oauth2/v1/userinfo"
    token_url = "https://www.googleapis.com/oauth2/v1/tokeninfo"

    def complete_login(self, request, app, token, **kwargs):
        try:
            if "rest-auth/google" in request.path:
                # print('rest-auth api')
                # /api/rest-auth/google
                # but not for website login with google
                url = "{0}?id_token={1}&alt=json".format(self.token_url, token.token)
                resp = requests.get(url)

                # resp = requests.get(self.token_url,
                #                     params={'id_token': token.token,
                #                             'alt': 'json'})
            else:
                # print('else else rest-auth api')
                url = "{0}?access_token={1}&alt=json".format(
                    self.profile_url, token.token
                )
                resp = requests.get(url)

                # resp = requests.get(self.profile_url,
                #                     params={'access_token': token.token,
                #                             'alt': 'json'})
            resp.raise_for_status()
            extra_data = resp.json()
            login = self.get_provider().sociallogin_from_response(request, extra_data)
            return login
        except HTTPError as error:
            return {"error_message": str(error)}
        except Exception as error:
            return {"error_message": str(error)}


class GoogleLogin(SocialLoginView):
    permission_classes = (AllowAny,)
    adapter_class = CustomGoogleOAuth2Adapter
    client_class = OAuth2Client
    serializer_class = CustomAppleSocialLoginSerializer

    def get_serializer(self, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        kwargs["context"] = self.get_serializer_context()
        return serializer_class(*args, **kwargs)

    def post(self, request, *args, **kwargs):
        try:
            serializer = CustomSocialLoginSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            response = super().post(request, *args, **kwargs)
            if response.status_code == 200:
                cur_user = self.request.user
                social_account = SocialAccount.objects.filter(user=cur_user)[0]
                cur_user.name = social_account.extra_data["name"]

                if social_account.extra_data.get("picture"):
                    cur_user.alt_profile_picture = social_account.extra_data["picture"]

                if request.data.get("event_planner"):
                    cur_user.event_planner = request.data.get("event_planner")
                    cur_user.business_name = request.data.get("business_name")
                    cur_user.business_reg_no = request.data.get("business_reg_no")

                cur_user.save()
                # cur_user.subscribe_user_send_grid()

                token, created = Token.objects.get_or_create(user=cur_user)

                data = CustomUserDetailSerializer(
                    cur_user, context={"request": request, "user": cur_user}
                ).data
                return Response({"token": token.key, "user": data}, status=HTTP_200_OK)
            else:
                return response
        except KeyError as error:
            return Response(
                {"error_message": "Missing key :" + str(error)},
                status=HTTP_400_BAD_REQUEST,
            )
        except ValidationError as e:
            if e.detail.get("business_details_error"):
                error_str = {"error": e.detail.get("business_details_error")[0]}
            return Response(
                error_str,
                status=HTTP_400_BAD_REQUEST,
            )
        except Exception as error:
            return Response(
                {"error": str(error)}, status=HTTP_500_INTERNAL_SERVER_ERROR
            )


class AppleLogin(SocialLoginView):
    adapter_class = AppleOAuth2Adapter
    client_class = AppleOAuth2Client
    serializer_class = CustomAppleSocialLoginSerializer
    callback_url = f"https://{APP_DOMAIN}/social/apple/login/"


# ------------------------------------------------------------------------------------


class UserViewset(ListModelMixin, RetrieveModelMixin, GenericViewSet):
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated, IsOwnerAndReadOnly)
    queryset = User.objects.all()
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = [
        "name",
        "email",
    ]

    def get_serializer_class(self):
        if self.action == "list":
            return UserSerializer
        if self.action == "retrieve":
            return CustomUserDetailSerializer
        return CustomUserDetailSerializer


class MyEventViewset(ListModelMixin, GenericViewSet):
    serializer_class = EventDetailsSerializer
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

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)


class NotificationViewset(
    ListModelMixin,
    RetrieveModelMixin,
    UpdateModelMixin,
    DestroyModelMixin,
    GenericViewSet,
):
    serializer_class = NotificationSerializer
    permission_classes = (IsAuthenticated,)
    queryset = Notification.objects.all().order_by("-created_at")

    def get_queryset(self):
        return self.queryset.filter(target=self.request.user)


class GCMDeviceRegistrationViewset(ModelViewSet):
    http_method_names = ['get', 'post']
    queryset = GCMDevice.objects.all()
    serializer_class = GCMDeviceSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class BankAccountViewset(ModelViewSet):
    http_method_names = ['post']
    queryset = BankAccount.objects.all()
    serializer_class = BankAccountSerializer

    def perform_create(self, serializer):
        try:
            serializer.save(user=self.request.user)
        except IntegrityError as e:
            logging.warning(e)
            pass


class WithdrawalViewset(ModelViewSet):
    http_method_names = ['post', 'get']

    queryset = Withdrawal.objects.all()
    serializer_class = WithdrawalSerializer

    def perform_create(self, serializer):
        try:
            serializer.save(bank_account=self.request.user.bank_account)
        except IntegrityError as e:
            logging.warning(e)
            pass

    def get_queryset(self):
        return self.queryset.filter(bank_account=self.request.user.bank_account).order_by("-timestamp")
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        amount = serializer.validated_data['amount']
        try:
            bank_account = request.user.bank_account
        except:
            return Response({'detail': 'No bank connected'}, status=HTTP_400_BAD_REQUEST)
        
        # Check for sufficient balance before making the withdrawal
        # wallet = {}
        # if wallet.balance >= amount:

        #     wallet.balance -= amount
        #     self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=HTTP_201_CREATED, headers=headers)
        # else:
        #     return Response({'detail': 'Insufficient balance'}, status=HTTP_400_BAD_REQUEST)