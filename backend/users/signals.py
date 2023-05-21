from django.db.models.signals import post_save
from push_notifications.models import GCMDevice
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
            instance.save()
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