from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from users.models import User
import logging
import stripe


stripe.api_key = settings.STRIPE_SECRET_KEY

@receiver(post_save, sender=User)
def user_signed_up(sender, instance, created, **kwargs):
    """Send notification to event organizer when user register"""

    if created:
        try:
            account = stripe.Account.create(
                type='express',
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

