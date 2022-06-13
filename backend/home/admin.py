from django.contrib import admin
from home.models import (
    Category,
    Event,
    UserEventRegistration,
    Notification,
    AboutUs,
    PrivacyPolicy,
    TermsAndCondition,
    FAQ,
)

# Register your models here.

admin.site.register(Notification)
admin.site.register(Event)
admin.site.register(Category)
admin.site.register(UserEventRegistration)
admin.site.register(AboutUs)
admin.site.register(PrivacyPolicy)
admin.site.register(TermsAndCondition)
admin.site.register(FAQ)
