from django.http import HttpRequest
from rest_framework.authtoken.models import Token
from django.utils.translation import ugettext_lazy as _
from allauth.account import app_settings as allauth_settings
from allauth.account.forms import ResetPasswordForm
from allauth.utils import email_address_exists, generate_unique_username
from allauth.account.adapter import get_adapter
from allauth.account.utils import setup_user_email
from rest_framework import serializers
from rest_auth.serializers import PasswordResetSerializer
from home.models import Category, AboutUs, FAQ, FeedBackSupport, Interest
from rest_auth.registration.serializers import SocialLoginSerializer
from events.serializers import InterestSerializer
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password
from requests.exceptions import HTTPError
from allauth.socialaccount.helpers import complete_social_login
from users.serializers import BankAccountSerializer

User = get_user_model()


class CustomAuthTokenSerializer(serializers.Serializer):
    email = serializers.EmailField(label=_("Email"), write_only=True)
    password = serializers.CharField(
        label=_("Password"),
        style={"input_type": "password"},
        trim_whitespace=False,
        write_only=True,
    )
    token = serializers.CharField(label=_("Token"), read_only=True)

    def authenticate(self, email=None, password=None):
        """Authenticate a user based on email address as the user name."""
        try:
            user = User.objects.get(email=email)
            if user.check_password(password):
                return user
        except User.DoesNotExist:
            return None

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        if email and password:
            user = self.authenticate(email=email, password=password)

            # The authenticate call simply returns None for is_active=False
            # users. (Assuming the default ModelBackend authentication
            # backend.)
            if not user:
                msg = _("Unable to log in with provided credentials.")
                raise serializers.ValidationError(msg, code="authorization")
        else:
            msg = _('Must include "username" and "password".')
            raise serializers.ValidationError(msg, code="authorization")

        attrs["user"] = user
        return attrs


class AboutUsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutUs
        fields = ("body",)


class FeedBackSupportSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedBackSupport
        fields = "__all__"
        read_only_fields = ["user",]


# class TermsAndConditionSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = TermsAndCondition
#         fields = ("body",)


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ("question", "response")


class SignupSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(
        write_only=True, required=True, style={"input_type": "password"}
    )

    class Meta:
        model = User
        fields = (
            "id",
            "name",
            "email",
            "password",
            "password2",
            "event_planner",
            "business_name",
            "business_reg_no",
            "accept_tc",
        )
        extra_kwargs = {
            "password": {"write_only": True, "style": {"input_type": "password"}},
            "password2": {"write_only": True, "style": {"input_type": "password"}},
            "email": {
                "required": True,
                "allow_blank": False,
            },
        }

    def _get_request(self):
        request = self.context.get("request")
        if (
            request
            and not isinstance(request, HttpRequest)
            and hasattr(request, "_request")
        ):
            request = request._request
        return request

    def validate(self, attrs):
        email = get_adapter().clean_email(attrs["email"])
        if allauth_settings.UNIQUE_EMAIL:
            if email and email_address_exists(email):
                raise serializers.ValidationError(
                    {
                        "email": _(
                            "A user is already registered with this e-mail address."
                        )
                    }
                )

        if attrs.get("password") != attrs.get("password2"):
            raise serializers.ValidationError({"password": "Password didn't match."})

        if not attrs.get("accept_tc"):
            raise serializers.ValidationError(
                {"accept_tc": "Please accept terms and conditions"}
            )
        if not attrs.get("event_planner") and not attrs.get("name"):
            raise serializers.ValidationError({"name": "This field is required"})

        if attrs.get("event_planner"):
            if not attrs.get("business_name") or not attrs.get("business_reg_no"):
                raise serializers.ValidationError(
                    "Please provide your business name and business registration number"
                )
        return attrs

    # def create(self, validated_data):
    #     validated_data.pop("password2")
    #     password = validated_data.pop("password")
    #     user = User(
    #         **validated_data,
    #         username=generate_unique_username(
    #             [validated_data.get("name"), validated_data.get("email"), "user"]
    #         ),
    #     )
    #     user.set_password(password)
    #     user.save()
    #     request = self._get_request()
    #     setup_user_email(request, user, [])
    #     return user

    # def save(self, request=None):
    #     """rest_auth passes request so we must override to accept it"""
    #     return super().save()


# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ["id", "email", "name", "profile_picture"]


class PasswordSerializer(PasswordResetSerializer):
    """Custom serializer for rest_auth to solve reset password error"""

    password_reset_form_class = ResetPasswordForm


class CustomUserDetailSerializer(serializers.ModelSerializer):
    """
    User model w/o password
    """

    likes = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            "pk",
            "username",
            "name",
            "bio",
            "likes",
            "profile_picture",
            "alt_profile_picture",
            "email",
            "interests",
            "event_planner",
            "address_longitude",
            "address_latitude",
            "stripe_customer_id",
            "stripe_connect_account_id",
            "subscribed_push_notification",
            "stripe_bank_account_id",
            "is_stripe_complete",
            "phone",
            "website",
            "location",
            
        )
        read_only_fields = (
            "email", 
            "event_planner",
            "stripe_customer_id",
            "stripe_connect_account_id",
            "subscribed_push_notification",
            )

        extra_kwargs = {
            "username": {
                "required": False,
                "allow_blank": False,
            },
            "interests": {"write_only": True},
        }

    def __init__(self, *args, **kwargs):
        # initialize fields
        super(CustomUserDetailSerializer, self).__init__(*args, **kwargs)

        if not self.context["request"].user.is_authenticated:
            # now modify the fields
            if self.context["user"].event_planner:
                self.Meta.fields += (
                    "business_name",
                    "business_reg_no",
                )
        elif self.context["request"].user.event_planner:
            self.Meta.fields += (
                "business_name",
                "business_reg_no",
            )

    def get_likes(self, obj):
        return InterestSerializer(obj.interests, many=True).data



class CustomSocialLoginSerializer(SocialLoginSerializer):
    event_planner = serializers.BooleanField(required=False)  # Extra field
    accept_tc = serializers.BooleanField(required=False)
    business_name = serializers.CharField(max_length=100, required=False)  # Extra field
    business_reg_no = serializers.CharField(max_length=100, required=False)  # Extra field

    def validate(self, data):
        attr = super().validate(data)
        
        # Custom validation for event_planner
        if attr.get('event_planner', None) is not None:
            if not attr.get("business_name") or not attr.get("business_reg_no"):
                raise serializers.ValidationError(
                    {
                        "business_details_error": _(
                            "Please provide your business name and business registration number"
                        )
                    }
                )
        return attr


class CustomAppleSocialLoginSerializer(SocialLoginSerializer):
    access_token = serializers.CharField(required=False, allow_blank=True)
    code = serializers.CharField(required=False, allow_blank=True)
    id_token = serializers.CharField(required=False, allow_blank=True)

    def _get_request(self):
        request = self.context.get("request")
        if not isinstance(request, HttpRequest):
            request = request._request
        return request

    def get_social_login(self, adapter, app, token, response):
        """
        :param adapter: allauth.socialaccount Adapter subclass.
            Usually OAuthAdapter or Auth2Adapter
        :param app: `allauth.socialaccount.SocialApp` instance
        :param token: `allauth.socialaccount.SocialToken` instance
        :param response: Provider's response for OAuth1. Not used in the
        :returns: A populated instance of the
            `allauth.socialaccount.SocialLoginView` instance
        """
        request = self._get_request()
        social_login = adapter.complete_login(request, app, token, response=response)
        social_login.token = token
        return social_login

    def validate(self, attrs):
        view = self.context.get("view")
        request = self._get_request()

        if not view:
            raise serializers.ValidationError(
                "View is not defined, pass it as a context variable"
            )

        adapter_class = getattr(view, "adapter_class", None)
        if not adapter_class:
            raise serializers.ValidationError("Define adapter_class in view")

        adapter = adapter_class(request)
        app = adapter.get_provider().get_app(request)

        # More info on code vs access_token
        # http://stackoverflow.com/questions/8666316/facebook-oauth-2-0-code-and-token

        # Case 1: We received the access_token
        if attrs.get("access_token"):
            access_token = attrs.get("access_token")
            token = {"access_token": access_token}

        # Case 2: We received the authorization code
        elif attrs.get("code"):
            self.callback_url = getattr(view, "callback_url", None)
            self.client_class = getattr(view, "client_class", None)

            if not self.callback_url:
                raise serializers.ValidationError("Define callback_url in view")
            if not self.client_class:
                raise serializers.ValidationError("Define client_class in view")

            code = attrs.get("code")

            provider = adapter.get_provider()
            scope = provider.get_scope(request)
            client = self.client_class(
                request,
                app.client_id,
                app.secret,
                adapter.access_token_method,
                adapter.access_token_url,
                self.callback_url,
                scope,
                key=app.key,
                cert=app.cert,
            )
            token = client.get_access_token(code)
            access_token = token["access_token"]

        else:
            raise serializers.ValidationError(
                "Incorrect input. access_token or code is required."
            )

        # Custom changes introduced to handle apple login on allauth
        try:
            social_token = adapter.parse_token(
                {
                    "access_token": access_token,
                    "id_token": attrs.get("id_token"),  # For apple login
                }
            )
            social_token.app = app
        except OAuth2Error as err:
            raise serializers.ValidationError(str(err)) from err

        try:
            login = self.get_social_login(adapter, app, social_token, access_token)
            complete_social_login(request, login)
        except HTTPError:
            raise serializers.ValidationError("Incorrect value")

        if not login.is_existing:
            # We have an account already signed up in a different flow
            # with the same email address: raise an exception, for security reasons.
            # If you decide to follow up with this flow, checkout allauth implementation:
            # add login.connect(request, email_address.user)
            # https://github.com/pennersr/django-allauth/issues/1149
            #
            # if allauth_settings.UNIQUE_EMAIL:
            #     # Do we have an account already with this email address?
            #     if get_user_model().objects.filter(email=login.user.email).exists():
            #         raise serializers.ValidationError(
            #             'E-mail already registered using different signup method.')

            login.lookup()
            login.save(request, connect=True)

        attrs["user"] = login.account.user
        return attrs
