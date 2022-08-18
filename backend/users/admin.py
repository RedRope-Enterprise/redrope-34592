from django.contrib import admin

# from django.contrib.admin import SimpleListFilter
from django.contrib.auth import admin as auth_admin
from django.contrib.auth import get_user_model

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
                    "name",
                    "bio",
                    "profile_picture",
                    "interests",
                    "phone",
                    "website",
                    "accept_tc",
                    "address_longitude",
                    "address_latitude",
                    "event_planner",
                    "business_name",
                    "business_reg_no",
                )
            },
        ),
    ) + auth_admin.UserAdmin.fieldsets
    list_display = ["username", "name", "event_planner", "is_superuser", "date_joined"]
    search_fields = ["name"]
