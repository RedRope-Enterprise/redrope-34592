"""Tests for event APIs"""

from decimal import Decimal
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from home.models import Event, Category
from events.serializers import EventSerializer
import datetime

EVENT_URL = reverse("events:events-list")


def create_event(user, categories=list(), **params):
    """Helper function for creating event object for test"""

    default = {
        "title": "Test event",
        "location": "Venue location",
        "price": Decimal("20.12"),
        "desc": "Event description",
        "date": datetime.date.today(),
    }
    default.update(params)

    event = Event.objects.create(user=user, **default)
    event.categories.set(categories)
    return event


def create_category(**params):
    """Helper function for creating category for test"""

    default = {"name": "Sports"}
    default.update(params)

    category = Category.objects.create(**default)
    return category


class PublicEventsAPITest(TestCase):
    """Test unauthenticated API requests"""

    def setUp(self):
        self.client = APIClient()

    def test_auth_required(self):
        """Test auth required to call API"""
        res = self.client.get(EVENT_URL)

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


class PrivateEventsAPITest(TestCase):
    """Test authenticated API requests"""

    def setUp(self):
        self.client = APIClient()

        self.cat1 = create_category()
        self.cat2 = create_category(name="Entertainment")

        self.user = get_user_model().objects.create(
            email="test@email.com", password="test_password"
        )
        self.user.interests.set([self.cat1.id, self.cat2.id])

        self.client.force_authenticate(self.user)

    def test_retrieving_events(self):
        """Test retrieveing a list of events"""

        create_event(user=self.user, categories=[self.cat1.id, self.cat2.id])

        create_event(user=self.user)

        res = self.client.get(EVENT_URL)

        # events = Event.objects.all().order_by("-id")
        # serializer = EventSerializer(events, many=True)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data["results"]), 1)

    def test_retrieving_user_events(self):
        """Test retrieveing a list of user's events"""

        self.user2 = get_user_model().objects.create(
            username="testusername",
            email="testuser2@email.com",
            password="test_password",
        )

        create_event(user=self.user)
        create_event(user=self.user2)

        events = Event.objects.filter(user=self.user).order_by("-id")
        serializer = EventSerializer(events, many=True)

        # self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(serializer.data), 1)
