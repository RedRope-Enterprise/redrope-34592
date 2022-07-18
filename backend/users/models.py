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
        max_length=255,
        validators=[RegexValidator("[+-/%#$@!~^&*()1234567890]", inverse_match=True)],
    )
    bio = models.TextField(_("Bio"), blank=True, null=True)
    profile_picture = models.ImageField(
        _("Profile Picture"), max_length=300, blank=True, null=True
    )
    interests = models.ManyToManyField(
        "home.Interest",
        verbose_name=_("Interest"),
        blank=True,
        related_name="interest_users",
    )
    phone = models.CharField(_("Phone number"), max_length=15, null=True)
    website = models.URLField(_("Website"), max_length=200, null=True)
    accept_tc = models.BooleanField(_("Accept Terms and Conditions"), default=False)
    address_longitude = models.DecimalField(max_digits=22, decimal_places=16, null=True)
    address_latitude = models.DecimalField(max_digits=22, decimal_places=16, null=True)
    event_planner = models.BooleanField(_("Event planner"), default=False)
    business_name = models.CharField(
        _("Business name"), max_length=100, blank=True, null=True
    )
    business_reg_no = models.CharField(
        _("Business registration number"), max_length=100, blank=True, null=True
    )
    stripe_customer_id = models.CharField(
        _("Stripe ID"), blank=True, null=True, max_length=80
    )

    def get_absolute_url(self):
        return reverse("users:detail", kwargs={"username": self.username})


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
