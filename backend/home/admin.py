from django.contrib import admin
from home.models import (
    Category,
    Event,
    UserEventRegistration,
    Notification,
    AboutUs,
    FAQ,
    BottleService,
    Interest,
    FavoriteEvent,
)

# Register your models here.


@admin.register(UserEventRegistration)
class UserEventRegistrationAdmin(admin.ModelAdmin):
    list_display = (
        "event",
        "user",
        "attendee",
        "interested",
        "reserved",
        "event_cost",
        "amount_paid",
        "amount_left",
        "transaction_id",
        "updated_at",
    )

    def event_cost(self, obj):
        return f"{obj.event.price}"

    event_cost.short_description = "Event Cost"


admin.site.register(Notification)
admin.site.register(Event)
admin.site.register(FavoriteEvent)
admin.site.register(Category)
admin.site.register(Interest)
admin.site.register(AboutUs)
admin.site.register(FAQ)
admin.site.register(BottleService)
