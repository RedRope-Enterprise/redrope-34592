from django.urls import path, include
from rest_framework.routers import DefaultRouter
from users.viewsets import UserViewset, MyEventViewset, \
    NotificationViewset, GCMDeviceRegistrationViewset, \
    BankAccountView, WithdrawalView, AccountBalanceView, \
    DemoBankToken, CompleteStripeAcountView, PasswordResetView,\
    PasswordResetConfirmView, ResetPasswordVerifyToken, \
    generate_stripe_connect_url, handle_stripe_redirect


router = DefaultRouter()

router.register("register-device", GCMDeviceRegistrationViewset, basename="register_device")
router.register("my-events", MyEventViewset, basename="my_events")
router.register("notifications", NotificationViewset, basename="notifications")
router.register("", UserViewset, basename="users")

from users.viewsets import (
    user_redirect_view,
    user_update_view,
    user_detail_view,
)

app_name = "users"

urlpatterns = [
    path("demo-bank-token/", DemoBankToken.as_view(), name="demo_bank_token"),
    path("complete-stripe-account/", CompleteStripeAcountView.as_view(), name="update_stripe_account"),
    path("account-balance/", AccountBalanceView.as_view(), name="account_balance"),
    path("withdraw-to-bank/", WithdrawalView.as_view(), name="withdraw_to_bank"),
    path("bank-accounts/", BankAccountView.as_view(), name="bank_accounts"),
    path('generate_stripe_connect_url/', generate_stripe_connect_url),
    path('handle-stripe-redirect/', handle_stripe_redirect),
    path('password/reset/', PasswordResetView.as_view(), name='api-rest_password'),
    path('password/reset/confirm/', PasswordResetConfirmView.as_view(),
         name='api-rest_password_confirm'),
    path('password/reset/verify-token/',
         ResetPasswordVerifyToken.as_view(), name='api-rest_password'),
    path("", include(router.urls)),
    path("~redirect/", view=user_redirect_view, name="redirect"),
    path("~update/", view=user_update_view, name="update"),
    path("<str:username>/", view=user_detail_view, name="detail"),
]
