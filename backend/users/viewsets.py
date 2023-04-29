import requests
from django.contrib.auth import get_user_model
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse
from django.conf import settings
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
import stripe
from rest_framework.views import APIView
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_403_FORBIDDEN,
    HTTP_404_NOT_FOUND,
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

stripe.api_key = settings.STRIPE_API_KEY

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

class BankAccountView(APIView):
    
    def post(self, request, *args, **kwargs):
        bank_account_id = request.data.get('bank_account_id')

        if not bank_account_id:
            return Response({'detail': 'Bank account id is required.'}, status=HTTP_400_BAD_REQUEST)

        try:
            user = request.user
            stripe_account_id = user.stripe_connect_account_id
            if not stripe_account_id:
                return Response({'detail': 'User does not have a Stripe Connect Account.'}, status=HTTP_400_BAD_REQUEST)

            # Attach the bank account token to the user's Stripe Connect account
            bank_account = stripe.Account.create_external_account(
                stripe_account_id,
                external_account=bank_account_id,
            )
            user.stripe_bank_account_id = bank_account.id
            user.save()
            return Response({'detail': 'Stripe bank account created', 'bank_account_id': bank_account.id}, status=HTTP_200_OK)

        except User.DoesNotExist:
            return Response({'detail': 'User not found'}, status=HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': 'Error creating Stripe bank account: {}'.format(e)}, status=HTTP_400_BAD_REQUEST)
        
    def get(self, request, *args, **kwargs):
        
        try:
            user = request.user
            stripe_account_id = user.stripe_connect_account_id
            if not stripe_account_id:
                return Response({'detail': 'User does not have a Stripe Connect Account'}, status=HTTP_400_BAD_REQUEST)

            # List bank accounts
            bank_accounts = stripe.Account.list_external_accounts(
                stripe_account_id,
                object='bank_account',
            )

            return Response({'account_id': stripe_account_id, 'bank_accounts': bank_accounts}, status=HTTP_200_OK)

        except User.DoesNotExist:
            return Response({'detail': 'User not found'}, status=HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': 'Error listing bank accounts: {}'.format(e)}, status=HTTP_400_BAD_REQUEST)


class WithdrawalView(APIView):

    def post(self, request, *args, **kwargs):
        amount = request.data.get('amount')

        if not amount:
            return Response({'detail': 'Amount is required'}, status=HTTP_400_BAD_REQUEST)

        try:
            user = request.user
            # This assumes you have already created a Stripe Connect Account and added the bank account to it
            stripe_connect_account_id = user.stripe_connect_account_id
            stripe_bank_account_id = user.stripe_bank_account_id

            payout = stripe.Payout.create(
                amount=int(amount * 100), # Convert the amount to cents
                currency="usd",
                destination=stripe_bank_account_id,
                stripe_account=stripe_connect_account_id,
            )
            withdrawal = Withdrawal.objects.create(
                user=user,
                payout_id=payout.id,
                amount=payout.amount,
                currency=payout.currency
            )
            withdrawal_data = WithdrawalSerializer(withdrawal).data
            return Response({'detail': 'Payout successful', 'withdrawal': withdrawal_data}, status=HTTP_200_OK)

        except Exception as e:
            return Response({'detail': 'Error processing payout: {}'.format(e)}, status=HTTP_400_BAD_REQUEST)
        
    
    def get(self, request, *args, **kwargs):
        
        try:
            user = request.user
            withdrawals = Withdrawal.objects.filter(user=user).order_by("-timestamp")
            withdrawal_data = WithdrawalSerializer(withdrawals, many=True).data
            return Response(withdrawal_data, status=HTTP_200_OK)

        except Exception as e:
            return Response({'detail': 'Error listing withdrawals: {}'.format(e)}, status=HTTP_400_BAD_REQUEST)


class AccountBalanceView(APIView):

    def get(self, request, *args, **kwargs):
        
        try:
            user = request.user
            stripe_account_id = user.stripe_connect_account_id
            if not stripe_account_id:
                return Response({'detail': 'User does not have a Stripe Connect Account'}, status=HTTP_400_BAD_REQUEST)

            # Retrieve the Stripe Connect account balance
            balance = stripe.Balance.retrieve(stripe_account=stripe_account_id)

            return Response({'account_id': stripe_account_id, 'balance': balance}, status=HTTP_200_OK)
        except Exception as e:
            return Response({'detail': 'Error retrieving account balance: {}'.format(e)}, status=HTTP_400_BAD_REQUEST)
        

class DemoBankToken(APIView):

    def get(self, request, *args, **kwargs):
        
        try:
            bank = stripe.Token.create(
                bank_account={
                    "country": "US",
                    "currency": "usd",
                    "account_holder_name": "Jenny Rosen",
                    "account_holder_type": "individual",
                    "routing_number": "110000000",
                    "account_number": "000123456789",
                },
                )

            return Response(bank, status=HTTP_200_OK)
        except Exception as e:
            return Response({'detail': 'Error creating bank token: {}'.format(e)}, status=HTTP_400_BAD_REQUEST)