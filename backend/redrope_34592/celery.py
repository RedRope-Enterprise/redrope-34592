from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
# from events.tasks import notify_event_attendees

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'redrope_34592.settings')

app = Celery('redrope_34592')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

# app.task(notify_event_attendees)
# notify_event_attendees.apply_async()