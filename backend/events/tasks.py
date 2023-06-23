from celery import shared_task
import logging
from utils.helper import HelperClass
from django.utils import timezone
from datetime import datetime, timedelta
from home.models import UserEventRegistration
from django.contrib.contenttypes.models import ContentType
from django_celery_beat.models import PeriodicTask, IntervalSchedule
from django.db import IntegrityError
# create an interval for the task to run every 30 seconds


interval = IntervalSchedule.objects.create(every=1, period=IntervalSchedule.MINUTES)

task_name = 'UserNotifier'

try:
    # create the periodic task
    PeriodicTask.objects.get_or_create(
        name=task_name,
        defaults={
            "interval":interval,
            "task":"events.tasks.notify_event_attendees"
        }
    )
except Exception as e:
    logging.warning(e)
    pass

@shared_task
def notify_event_attendees():
    # code to run your task here
    
    try:
        now = timezone.now()
        start_of_tomorrow = now + timedelta(days=1)
        end_of_tomorrow = start_of_tomorrow + timedelta(days=1)

        start_of_next_tomorrow = end_of_tomorrow
        end_of_next_tomorrow = start_of_next_tomorrow + timedelta(days=1)

        events_48_hours = UserEventRegistration.objects.filter(event__start_date__range=(start_of_next_tomorrow, end_of_next_tomorrow), reserved=True)
        events_24_hours = UserEventRegistration.objects.filter(event__start_date__range=(start_of_tomorrow, end_of_tomorrow), reserved=True)

        for event in events_48_hours:
            data = {
                "email_body": f"<p>Event: <strong>{event.event.title}</strong> is starting soon, kindly balance your payment on RedRope app to attend. <p>Thank you.</p>", 
                "to_emails": [event.user.email,],
                "email_subject": f"{event.event.title} starting soon."}
            if event.balance_paid and event.balance_charge_id:
                data["email_body"] = f"Event: {event.event.title} is starting in two days' time."
            
            # Send in-app notification
            content_type = ContentType.objects.get_for_model(event)
            notify = event.notification.create(
                target=event.user,
                from_user=event.event.user,
                verb=data["email_body"],
                notification_type="interest_in_event",
                content_type=content_type,
            )

            # Send email notification
            HelperClass.send_email(data)

        for event in events_24_hours:
            data = {
                "email_body": f"<p>Event: <strong>{event.event.title}</strong> is starting tomorrow, kindly balance your payment on RedRope app to attend. <p>Thank you.</p>", 
                "to_emails": [event.user.email,],
                "email_subject": f"{event.event.title} starting tomorrow."}
            if event.balance_paid and event.balance_charge_id:
                data["email_body"] = f"Event: {event.event.title} is starting tomorrow."

            # Send in-app notification
            content_type = ContentType.objects.get_for_model(event)
            notify = event.notification.create(
                target=event.user,
                from_user=event.event.user,
                verb=data["email_body"],
                notification_type="interest_in_event",
                content_type=content_type,
            )

            # Send email notification
            HelperClass.send_email(data)
    except Exception as e:
        raise e
    return "=== Task completed ==="