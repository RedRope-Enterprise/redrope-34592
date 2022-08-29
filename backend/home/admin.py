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
        "amount_paid",
        "amount_left",
        "payment_intent_id",
        "transaction_id",
        "updated_at",
    )

    # def event_cost(self, obj):
    #     return f"{obj.event.price}"

    # event_cost.short_description = "Event Cost"


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = (
        "event_organizer",
        "title",
        "location",
        "country",
        "active",
        "start_date",
        "start_time",
        "end_date",
        "end_time",
    )

    def event_organizer(self, obj):
        return f"{obj.user.name}" if obj.user.name else "Unspecified"

    event_organizer.short_description = "Organizer"


admin.site.register(Notification)
# admin.site.register(Event)
admin.site.register(FavoriteEvent)
admin.site.register(Category)
admin.site.register(Interest)
admin.site.register(AboutUs)
admin.site.register(FAQ)
admin.site.register(BottleService)
