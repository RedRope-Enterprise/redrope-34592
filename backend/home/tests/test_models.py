from django.test import TestCase
from decimal import Decimal
from home.models import Event
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
import datetime
from django.db.utils import IntegrityError

# Create your tests here.


class EventModelTests(TestCase):
    """Test events model"""

    def test_create_event(self):
        """Test creating events with all fields provided"""

        user = get_user_model().objects.create(
            email="test@email.com", password="test_password"
        )

        event = Event.objects.create(
            user=user,
            title="Test event",
            location="Venue location",
            price=Decimal("20.12"),
            # image=SimpleUploadedFile(name='test_image.jpg', content=open("/", 'rb').read(), content_type='image/jpeg'),
            desc="Event description",
            date=datetime.date.today(),
        )

        self.assertEqual(event.user, user)
        self.assertEqual(event.title, "Test event")
        self.assertEqual(event.location, "Venue location")
        self.assertEqual(event.price, Decimal("20.12"))
        self.assertEqual(event.desc, "Event description")
        self.assertEqual(event.date, datetime.date.today())

    def test_create_event_fails_no_event_date(self):
        """Test creating events should fail when no event date is provided"""

        user = get_user_model().objects.create(
            email="test@email.com", password="test_password"
        )

        with self.assertRaises(Exception) as raised:
            event = Event.objects.create(
                user=user,
                title="Test event",
                location="Venue location",
                price=Decimal("20.12"),
                desc="Event description",
            )

        self.assertEqual(IntegrityError, type(raised.exception))
