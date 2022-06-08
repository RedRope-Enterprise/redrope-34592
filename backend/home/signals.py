from django.db.models.signals import post_save
from django.dispatch import receiver
from django.urls import reverse
from django.core.mail import EmailMessage
from django.conf import settings
from django.contrib.contenttypes.models import ContentType
from home.models import UserEventRegistration


@receiver(post_save, sender=UserEventRegistration)
def user_registered_for_event(sender, instance, created, **kwargs):
    """Send notification to event organizer when user register"""

    if created:
        try:

            content_type = ContentType.objects.get_for_model(instance)
            notify = instance.notification.create(
                target=instance.event.user,
                from_user=instance.user,
                verb=f"{instance.user.name} is interested to go to {instance.event.title} with you",
                content_type=content_type,
            )

            notify.redirect_url = reverse(
                "users:notifications-detail", args=[notify.pk]
            )

            notify.save()

        except Exception as e:
            raise Exception(e)
