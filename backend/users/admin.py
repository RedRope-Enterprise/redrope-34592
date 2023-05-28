from django.contrib import admin
from push_notifications.models import GCMDevice
# from django.contrib.admin import SimpleListFilter
from django.contrib.auth import admin as auth_admin
from django.contrib.auth import get_user_model
from users.models import UserWallet
from users.forms import UserChangeForm, UserCreationForm

User = get_user_model()


class UserRoleFilter(admin.SimpleListFilter):
    title = "Role"  # a label for our filter
    parameter_name = "pages"  # you can put anything here

    def lookups(self, request, model_admin):
        # This is where you create filter options; we have two:
        return [
            ("ordinary_user", "Ordinary user"),
            ("event_planner", "Event planner"),
        ]

    def queryset(self, request, queryset):
        # This is where you process parameters selected by use via filter options:
        if self.value() == "event_planner":
            # Get websites that have at least one page.
            return queryset.distinct().filter(event_planner=True)
        if self.value() == "ordinary_user":
            # Get websites that don't have any pages.
            return queryset.distinct().filter(event_planner=False)


class UserWalletInline(admin.TabularInline):
    model = UserWallet


@admin.register(User)
class UserAdmin(auth_admin.UserAdmin):

    form = UserChangeForm
    add_form = UserCreationForm
    list_filter = (UserRoleFilter,)

    fieldsets = (
        (
            "User",
            {
                "fields": (
                    "approved",
                    "name",
                    "email",
                    "bio",
                    "profile_picture",
                    "interests",
                    "phone",
                    "website",
                    "accept_tc",
                    "address_longitude",
                    "address_latitude",
                    "event_planner",
                    "is_stripe_complete",
                    "stripe_connect_account_id",
                    "stripe_customer_id",
                    "business_name",
                    "business_reg_no",
                )
            },
        ),
    ) #+ auth_admin.UserAdmin.fieldsets
    list_display = ["name", "username", "email", "event_planner", "approved", "is_superuser", "date_joined"]
    search_fields = ["name", "username", "email", "phone"]

    inlines = [
        UserWalletInline
    ]
