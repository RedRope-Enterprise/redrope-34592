from django.db.models.signals import post_save
from django.dispatch import receiver
from django.urls import reverse
from django.core.mail import EmailMessage
from django.conf import settings
from django.contrib.contenttypes.models import ContentType
from home.models import UserEventRegistration, Event, \
    FavoriteEvent, FeedBackSupport
from users.models import User
from push_notifications.models import GCMDevice
from utils.helper import HelperClass
from pyfcm import FCMNotification
import logging

@receiver(post_save, sender=UserEventRegistration)
def user_registered_for_event(sender, instance, created, **kwargs):
    """Send notification to event organizer when user register"""

    if created:
        try:
            message_body = f"Someone is interested to go to the event {instance.event.title} with you."
            users = [obj.user for obj in UserEventRegistration.objects.filter(event=instance.event).exclude(user=instance.user)]

            content_type = ContentType.objects.get_for_model(instance)
            push_service = FCMNotification(api_key=settings.PUSH_NOTIFICATIONS_SETTINGS["FCM_API_KEY"])
            for user in users:
                notify = instance.notification.create(
                    target=user,
                    from_user=instance.user,
                    verb=message_body,
                    notification_type="interest_in_event",
                    content_type=content_type,
                )

                registration_ids = [device.registration_id for device in GCMDevice.objects.filter(user=user, active=True)]

                if registration_ids:
                    data_message = {
                        "notification_type":"interest_in_event"
                    }
                    try:
                        result = push_service.notify_multiple_devices(
                            registration_ids=registration_ids, 
                            message_title="Event", 
                            message_body=message_body, 
                            data_message=data_message
                            )
                    except Exception as e:
                        logging.warning(e)
                else:
                    logging.warning("No devices found for the user.")

        except Exception as e:
            raise Exception(e)


@receiver(post_save, sender=Event)
def new_event_created(sender, instance, created, **kwargs):
    """Send notification to event organizer when user register"""

    if created:
        try:
            message_body = "Check the new events we founded for you."
            users = User.objects.filter(event_planner=False)
            content_type = ContentType.objects.get_for_model(instance)
            push_service = FCMNotification(api_key=settings.PUSH_NOTIFICATIONS_SETTINGS["FCM_API_KEY"])
            for user in users:
                notify = instance.notification.create(
                    target=user,
                    from_user=instance.user,
                    notification_type="new_event",
                    verb=message_body,
                    content_type=content_type,
                )


                registration_ids = [device.registration_id for device in GCMDevice.objects.filter(user=user, active=True)]

                if registration_ids:
                    data_message = {
                        "notification_type":"new_event"
                    }
                    try:
                        result = push_service.notify_multiple_devices(
                            registration_ids=registration_ids, 
                            message_title="New Event", 
                            message_body=message_body,
                            data_message=data_message
                            )
                    except Exception as e:
                        logging.warning(e)
                else:
                    logging.warning("No devices found for the user.")

        except Exception as e:
            raise Exception(e)
        
@receiver(post_save, sender=FavoriteEvent)
def new_event_like(sender, instance, created, **kwargs):
    """Send notification to event organizer when user likes an event"""

    if created:
        try:
            message_body = f"{instance.user.name} likes event: {instance.event.title}."
            content_type = ContentType.objects.get_for_model(instance)
            push_service = FCMNotification(api_key=settings.PUSH_NOTIFICATIONS_SETTINGS["FCM_API_KEY"])
            notify = instance.notification.create(
                target=instance.event.user,
                from_user=instance.user,
                notification_type="event_likes",
                verb=message_body,
                content_type=content_type,
            )


            registration_ids = [device.registration_id for device in GCMDevice.objects.filter(user=instance.event.user, active=True)]

            if registration_ids:
                data_message = {
                    "notification_type":"event_likes",
                    "event_id": instance.event.id
                }
                try:
                    result = push_service.notify_multiple_devices(
                        registration_ids=registration_ids, 
                        message_title="Event Likes", 
                        message_body=message_body,
                        data_message=data_message
                        )
                except Exception as e:
                    logging.warning(e)
            else:
                logging.warning("No devices found for the user.")

        except Exception as e:
            raise Exception(e)
        

@receiver(post_save, sender=FeedBackSupport)
def new_user_feedback(sender, instance, created, **kwargs):
    """Send notification to admin when new feed back is recieved"""

    if created:
        try:
            

            admin_emails = [admin_user.email for admin_user in User.objects.filter(is_superuser=True, is_active=True)]

            email_body = f"<p>{instance.user.name} sent in a new feedback, click the link below for details.</p>"
            email_body += f"<p>https://redrope-34592.botics.co/home/feedbacksupport/{instance.id}/change/</p>"
            data = {'email_body': email_body, 'to_emails': admin_emails,
                        'email_subject': 'Feedback Received'}
            HelperClass.send_email(data)

        except Exception as e:
            raise Exception(e)