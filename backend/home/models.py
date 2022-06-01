from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.utils.translation import ugettext_lazy as _


class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


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
    date = models.DateField(_("Event date"))


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
