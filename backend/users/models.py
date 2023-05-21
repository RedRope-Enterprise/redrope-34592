from django.contrib.auth.models import AbstractUser
from django.db import models
from django.urls import reverse
from django.contrib.postgres.fields import ArrayField
from django.utils.translation import ugettext_lazy as _
from django.core.validators import RegexValidator


class User(AbstractUser):
    # WARNING!
    """
    Some officially supported features of Crowdbotics Dashboard depend on the initial
    state of this User model (Such as the creation of superusers using the CLI
    or password reset in the dashboard). Changing, extending, or modifying this model
    may lead to unexpected bugs and or behaviors in the automated flows provided
    by Crowdbotics. Change it at your own risk.


    This model represents the User instance of the system, login system and
    everything that relates with an `User` is represented by this model.
    """

    # First Name and Last Name do not cover name patterns
    # around the globe.
    name = models.CharField(
        _("Name of User"),
        blank=True,
        max_length=255,
        validators=[RegexValidator("[+-/%#$@!~^&*()1234567890]", inverse_match=True)],
    )
    bio = models.TextField(_("Bio"), blank=True, null=True)
    profile_picture = models.ImageField(
        _("Profile Picture"), max_length=300, blank=True, null=True
    )
    alt_profile_picture = models.CharField(
        _("Alt Profile Picture"), max_length=200, null=True, blank=True
    )
    interests = models.ManyToManyField(
        "home.Interest",
        verbose_name=_("Interest"),
        blank=True,
        related_name="interest_users",
    )
    phone = models.CharField(_("Phone number"), max_length=15, null=True)
    website = models.URLField(_("Website"), max_length=200, null=True)
    accept_tc = models.BooleanField(_("Accept Terms and Conditions"), default=True)
    address_longitude = models.DecimalField(max_digits=22, decimal_places=16, null=True)
    address_latitude = models.DecimalField(max_digits=22, decimal_places=16, null=True)
    event_planner = models.BooleanField(_("Event planner"), default=False)
    is_stripe_complete = models.BooleanField(_("Is Stripe Complete"), default=False)
    subscribed_push_notification = models.BooleanField(_("Subscribed For Push-Notification"), default=False)
    business_name = models.CharField(
        _("Business name"), max_length=100, blank=True, null=True
    )
    business_reg_no = models.CharField(
        _("Business registration number"), max_length=100, blank=True, null=True
    )
    stripe_connect_account_id = models.CharField(
        _("Stripe Connect Account ID"), blank=True, null=True, max_length=100
    )
    stripe_bank_account_id = models.CharField(
        _("Stripe Bank Account ID"), blank=True, null=True, max_length=100
    )
    stripe_customer_id = models.CharField(
        _("Stripe ID"), blank=True, null=True, max_length=80
    )
    location = models.CharField(
        _("Location"), blank=True, null=True, max_length=80
    )

    def get_absolute_url(self):
        return reverse("users:detail", kwargs={"username": self.username})


class UserWallet(models.Model):
    user = models.OneToOneField('users.User', related_name="wallet", on_delete=models.CASCADE)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f"{self.user.username} - ${self.balance}"
    

class BankAccount(models.Model):
    user = models.OneToOneField('users.User', related_name="bank_account", on_delete=models.CASCADE)
    account_number = models.CharField(max_length=20)
    routing_number = models.CharField(max_length=9)
    account_type = models.CharField(max_length=20, choices=[('checking', 'Checking'), ('savings', 'Savings')])

    def __str__(self):
        return f"{self.user.username} - {self.account_type}"


class Withdrawal(models.Model):
    user = models.ForeignKey("users.User", on_delete=models.CASCADE)
    payout_id = models.CharField(_("Payout ID"), max_length=50)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(_("Currency"), max_length=50)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.name} - {self.currency} {self.amount}"
    
# class StripeDetail(BaseModel):
#     user = models.OneToOneField(
#         "users.User",
#         verbose_name=_("User"),
#         related_name="stripe_detail",
#         on_delete=models.CASCADE,
#     )
#     customer_id = models.CharField(_("Customer ID"), max_length=100)

#     class Meta:
#         verbose_name_plural = "Stripe Account Details"
