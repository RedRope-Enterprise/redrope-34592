from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.utils.translation import ugettext_lazy as _
from django.contrib.contenttypes.fields import GenericRelation
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType


class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class AboutUs(BaseModel):
    # heading = models.CharField(_("Content Heading"), max_length=300, blank=True, null=True)
    body = models.TextField(_("Content Body"))

    class Meta:
        verbose_name_plural = "About us"


class FAQ(BaseModel):
    question = models.CharField(_("Question"), max_length=400, blank=True, null=True)
    response = models.TextField(_("Response"))

    class Meta:
        verbose_name_plural = "FAQs"


# class PrivacyPolicy(BaseModel):
#     # heading = models.CharField(_("Content Heading"), max_length=300, blank=True, null=True)
#     body = models.TextField(_("Content Body"))

#     class Meta:
#         verbose_name_plural = "Privacy policies"


# class TermsAndCondition(BaseModel):
#     # heading = models.CharField(_("Content Heading"), max_length=300, blank=True, null=True)
#     body = models.TextField(_("Content Body"))


class Notification(BaseModel):

    target = models.ForeignKey(
        "users.User", related_name="my_notification", on_delete=models.CASCADE
    )  # Who the notification is sent to

    # The notification was triggered by.
    from_user = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="from_user",
    )
    redirect_url = models.URLField(_("Redirect URL"), null=True, max_length=200)
    # statement describing the notification (ex: "You have a new service request")
    verb = models.CharField(max_length=255, unique=False, blank=True, null=True)

    # Some notifications can be marked as "read". (I used "read" instead of "active". I think its more appropriate)
    read = models.BooleanField(default=False)

    # A generic type that can refer to a FriendRequest, Unread Message, or any other type of "Notification"
    # See article: https://simpleisbetterthancomplex.com/tutorial/2016/10/13/how-to-use-generic-relations.html
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey()

    def __str__(self):
        return self.verb


class Event(BaseModel):
    user = models.ForeignKey(
        "users.User", verbose_name=_("Creator"), on_delete=models.CASCADE
    )
    title = models.CharField(_("Event title"), max_length=50, blank=True, null=True)
    desc = models.TextField(_("Event description"), blank=True, null=True)
    location = models.CharField(
        _("Event location"), max_length=50, blank=True, null=True
    )
    price = models.DecimalField(_("Event price"), max_digits=8, decimal_places=2)
    categories = models.ManyToManyField(
        "home.Category",
        verbose_name=_("Event category"),
        related_name="category_events",
    )
    address_longitude = models.DecimalField(max_digits=22, decimal_places=16, null=True)
    address_latitude = models.DecimalField(max_digits=22, decimal_places=16, null=True)
    start_date = models.DateField(_("Event start date"))
    end_date = models.DateField(_("Event end date"))


class Category(BaseModel):
    name = models.CharField(_("Category name"), max_length=50)
    image = models.ImageField(
        _("Category image"), max_length=300, blank=True, null=True
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"


class EventImage(BaseModel):
    event = models.ForeignKey(
        "home.Event",
        verbose_name=_("Event"),
        related_name="images",
        on_delete=models.CASCADE,
    )
    image = models.FileField(_("Event image"), upload_to="", max_length=1000)


class UserEventRegistration(BaseModel):
    event = models.ForeignKey(
        "home.Event",
        verbose_name=_("Event"),
        related_name="going",
        on_delete=models.CASCADE,
    )
    user = models.ForeignKey(
        "users.User",
        verbose_name=_("User"),
        related_name="going_event",
        on_delete=models.CASCADE,
    )
    attendee = models.PositiveIntegerField(_("Number of attendees"), default=1)

    notification = GenericRelation(Notification)
