from django.db.models.signals import post_save
from push_notifications.models import GCMDevice
from django.core.mail import EmailMessage
from django.dispatch import receiver
from django.conf import settings
from users.models import User, UserWallet
import logging
import stripe


stripe.api_key = settings.STRIPE_SECRET_KEY

@receiver(post_save, sender=User)
def user_signed_up(sender, instance, created, **kwargs):
    """Send notification to event organizer when user register"""

    if created:
        try:
            if instance.event_planner:
                wallet = UserWallet.objects.create(user=instance)
                account = stripe.Account.create(
                    type='custom',
                    country='US',
                    email=instance.email,
                    capabilities={
                        'card_payments': {'requested': True},
                        'transfers': {'requested': True},
                    }
                )

                # Save the Stripe Connect Account ID to the user model
                instance.stripe_connect_account_id = account.id
                instance.approved = False
                instance.save()

                admin_email_body = f"""
                <p><strong>{instance.name},</strong> created a new event planner account.</p>
                <p>Click the following link to approve profile.</p>
                <p><a href="https://redrope-34592.botics.co/admin/users/user/{instance.pk}/change/">Click here</a><p>
                Thank you."""

                admins = User.objects.filter(is_superuser=True)
                admin_email_addresses = admins.values_list("email", flat=True)
                msg = EmailMessage(
                    "Event Planner Account",
                    admin_email_body,
                    getattr(settings, "DEFAULT_FROM_EMAIL"),
                    admin_email_addresses,
                )
                msg.content_subtype = "html"  # Main content is now text/html
                try:
                    msg.send()
                except Exception as e:
                    logging.warning(
                        e
                    )
        except Exception as e:
            raise Exception(e)



@receiver(post_save, sender=GCMDevice)
def device_registered(sender, instance, created, **kwargs):
    """Create device profile after signup"""
    try:

        if created:
            user_profile = instance.user
            user_profile.subscribed_push_notification = True
            user_profile.save()

    except Exception as e:
        raise Exception(e)