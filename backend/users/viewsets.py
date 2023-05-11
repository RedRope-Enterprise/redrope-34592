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
from utils.helper import HelperClass
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
import time
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
    BankAccountSerializer, WithdrawalSerializer, \
    CompleteAccountStripeSerializer, PasswordResetTokenSerializer
from rest_auth.registration.serializers import SocialLoginSerializer
from events.serializers import EventDetailsSerializer
from django.db import IntegrityError
from users.models import BankAccount, Withdrawal
from django_rest_passwordreset.models import ResetPasswordToken
from django_rest_passwordreset.views import (
    HTTP_IP_ADDRESS_HEADER, 
    HTTP_USER_AGENT_HEADER, 
    ResetPasswordRequestToken, 
    ResetPasswordConfirm, 
    ResetPasswordValidateToken
)
import logging


User = get_user_model()

try:
    APP_DOMAIN = f"https://{get_current_site(None)}"
except Exception:
    APP_DOMAIN = ""

stripe.api_key = settings.STRIPE_API_KEY


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


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
            return Response({'detail': str(e)}, status=HTTP_400_BAD_REQUEST)
        
    
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
        

class CompleteStripeAcountView(APIView):

    def post(self, request, *args, **kwargs):

        try:
            user = request.user
            post_data = request.data
            serializer = CompleteAccountStripeSerializer(data=post_data)

            serializer.is_valid(raise_exception=True)

            client_id = get_client_ip(request)
            # This assumes you have already created a Stripe Connect Account and added the bank account to it
            
            stripe_connect_account_id = user.stripe_connect_account_id
            individual_details = {
                "first_name": serializer.validated_data["first_name"],
                "last_name": serializer.validated_data["last_name"],
                "ssn_last_4": serializer.validated_data["ssn_last_4"],
                "phone": serializer.validated_data["phone"],
                "email": user.email,
                "dob": {
                    "day": serializer.validated_data["dob"].day,
                    "month": serializer.validated_data["dob"].month,
                    "year": serializer.validated_data["dob"].year,
                },
                "address": {
                    "line1": serializer.validated_data["address"]["line1"],
                    "line2": serializer.validated_data["address"]["line2"],
                    "city": serializer.validated_data["address"]["city"],
                    "state": serializer.validated_data["address"]["state"],
                    "postal_code": serializer.validated_data["address"]["postal_code"],
                },
            }
            tos_acceptance = {
                "date": int(time.time()),
                "ip": client_id,
            }
            account = stripe.Account.modify(
                stripe_connect_account_id,
                business_type="individual",
                business_profile={
                    "url": "http://redrope-34592.botics.co/",
                    "mcc": "5734",  # Merchant Category Code for the industry
                },
                individual=individual_details,
                tos_acceptance=tos_acceptance,
            )
            user.is_stripe_complete = True
            user.save()
            return Response({'detail': 'Acct updated successful', 'Account': account}, status=HTTP_200_OK)

        except Exception as e:
            return Response({'detail': 'Error processing payout: {}'.format(e)}, status=HTTP_400_BAD_REQUEST)


class PasswordResetView(ResetPasswordRequestToken):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            try:
                user = User.objects.get(email=request.data['email'])
                token = ResetPasswordToken.objects.create(
                    user=user,
                    user_agent=request.META.get(HTTP_USER_AGENT_HEADER, ''),
                    ip_address=request.META.get(HTTP_IP_ADDRESS_HEADER, ''),
                )
                data = {'email_body': 'Reset token for Redrope is '+token.key, 'to_emails': [request.data['email']],
                        'email_subject': 'Reset your passsword'}
                HelperClass.send_email(data)
                response.data["detail"] = "Password reset e-mail has been sent."
            except User.DoesNotExist as e:
                response.data["status"] = "error"
                response.data["detail"] = "Email not associated to any user."
                response.status_code = 400

        return response
    

class PasswordResetConfirmView(ResetPasswordConfirm):
    serializer_class = PasswordResetTokenSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            response.data["detail"] = "Password has been reset successfuly"

        return response

class ResetPasswordVerifyToken(ResetPasswordValidateToken):
    def post(self, request, *args, **kwargs):

        response = super().post(request, *args, **kwargs)
        return response
    

from rest_framework.decorators import api_view, permission_classes

@api_view(["GET"])
def generate_stripe_connect_url(request):
    your_client_id = "ca_NodbjiRosSGJw68tVECIw2BQDsm7aFv4"
    your_redirect_uri = "http://localhost:8000/api/v1/users/handle-stripe-redirect/"
    
    stripe_connect_url = f"https://connect.stripe.com/express/oauth/authorize?response_type=code&client_id={your_client_id}&scope=read_write&redirect_uri={your_redirect_uri}"
    
    return Response({"url": stripe_connect_url})

@api_view(["GET"])
@permission_classes([AllowAny])
def handle_stripe_redirect(request):
    authorization_code = request.GET.get("code")

    response = requests.post("https://connect.stripe.com/oauth/token", data={
        "client_secret": settings.STRIPE_API_KEY,
        "code": authorization_code,
        "grant_type": "authorization_code",
    })

    access_token = response.json().get("access_token")
    refresh_token = response.json().get("refresh_token")
    stripe_user_id = response.json().get("stripe_user_id")

    # Store the tokens and Stripe user ID in your application as needed

    return Response({"message": "Successfully connected Stripe account", "data":{
        "access_token": access_token,
        "refresh_token": refresh_token,
        "stripe_user_id": stripe_user_id
    }})