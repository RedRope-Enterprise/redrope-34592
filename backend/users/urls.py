from django.urls import path, include
from rest_framework.routers import DefaultRouter
from users.viewsets import UserViewset, MyEventViewset, \
    NotificationViewset, GCMDeviceRegistrationViewset, \
    BankAccountView, WithdrawalView, AccountBalanceView, \
    DemoBankToken


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
    path("account-balance/", AccountBalanceView.as_view(), name="account_balance"),
    path("withdraw-to-bank/", WithdrawalView.as_view(), name="withdraw_to_bank"),
    path("bank-accounts/", BankAccountView.as_view(), name="bank_accounts"),
    path("", include(router.urls)),
    path("~redirect/", view=user_redirect_view, name="redirect"),
    path("~update/", view=user_update_view, name="update"),
    path("<str:username>/", view=user_detail_view, name="detail"),
]
