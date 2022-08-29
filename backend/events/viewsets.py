from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from events.serializers import (
    EventListSerializer,
    EventDetailsSerializer,
    RegisterEventSerializer,
    BottleServiceSerializer,
    FavoriteEventSerializer,
    CategorySerializer,
    InterestSerializer,
    MyEventSerializer,
    ReserveSerializer,
    ConfirmReservationSerializer,
    GoingEventSerializer,
)
from home.models import (
    Event,
    BottleService,
    FavoriteEvent,
    Interest,
    Category,
    UserEventRegistration,
)
import stripe
from django.conf import settings
from rest_framework import status
from rest_framework import filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import (
    CreateModelMixin,
    ListModelMixin,
    UpdateModelMixin,
    DestroyModelMixin,
)
from django_filters.rest_framework import DjangoFilterBackend
from utils.custom_permissions import (
    IsOwnerAndReadOnly,
    IsEventPlannerOrReadOnly,
    IsEventPlanner,
)
from rest_framework.permissions import IsAuthenticated
from utils.custom_filters import filter_events_with_get_param
from users.serializers import UserSerializer

stripe.api_key = settings.STRIPE_SECRET_KEY


# Create your views here.


class EventViewset(ModelViewSet):
    serializer_class = EventListSerializer
    permission_classes = (IsAuthenticated, IsEventPlannerOrReadOnly, IsOwnerAndReadOnly)
    queryset = Event.objects.all().order_by("-id")
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = [
        "title",
        "desc",
        "location",
        "price",
        "date",
        "images",
        "categories",
    ]
    # filterset_fields = ["title",]

    def get_serializer_class(self):
        if self.action == "list":
            return EventListSerializer
        if self.action == "retrieve":
            return EventDetailsSerializer
        return EventListSerializer

    def get_queryset(self):
        # queryset = (
        #     self.filter_queryset(self.queryset)
        #     .filter(categories__in=self.request.user.interests.all())
        #     .distinct()
        # )
        queryset = self.queryset
        if not self.request.user.event_planner:
            queryset = self.queryset.filter(active=True)

        queryset = filter_events_with_get_param(queryset, self.request)
        return queryset

    @action(methods=["get"], detail=True)
    def going(self, request, pk=None):
        """Retieve users going for an event"""

        try:
            going = self.get_object().going.all()
            page = self.paginate_queryset(going)
            if page is not None:
                serializer = GoingEventSerializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            serializer = GoingEventSerializer(going, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(methods=["get"], detail=False, url_path="my-events")
    def my_events(self, request):
        if request.user.event_planner:
            try:
                """Retrieve events created by user"""
                user_events = self.get_queryset().filter(user=request.user)

                page = self.paginate_queryset(user_events)
                if page is not None:
                    serializer = self.get_serializer(
                        page, context={"request": request}, many=True
                    )
                    return self.get_paginated_response(serializer.data)
                serializer = self.get_serializer(
                    user_events, context={"request": request}, many=True
                )
                return Response(serializer.data)
            except Exception as e:
                return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            """Retrieve events interested in or booked by user"""

            try:
                my_events = UserEventRegistration.objects.filter(user=request.user)
                page = self.paginate_queryset(my_events)
                if page is not None:
                    serializer = MyEventSerializer(
                        page, context={"request": request}, many=True
                    )
                    return self.get_paginated_response(serializer.data)
                serializer = MyEventSerializer(
                    my_events, context={"request": request}, many=True
                )
                return Response(serializer.data)
            except Exception as e:
                return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(
        methods=["get"],
        detail=False,
        permission_classes=[
            IsEventPlanner,
        ],
        url_path="my-bookings",
    )
    def my_bookings(self, request):
        """Retrieve events enrolled by user"""

        try:
            my_bookings = UserEventRegistration.objects.filter(
                event__user=request.user, reserved=True
            )
            page = self.paginate_queryset(my_bookings)
            if page is not None:
                serializer = MyEventSerializer(
                    page, context={"request": request}, many=True
                )
                return self.get_paginated_response(serializer.data)
            serializer = MyEventSerializer(
                my_bookings, context={"request": request}, many=True
            )
            return Response(serializer.data)
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(
        methods=["put"],
        detail=True,
        permission_classes=[IsEventPlanner, IsOwnerAndReadOnly],
        url_path="activate-deactivate",
    )
    def activate_deactivate(self, request, pk):
        """activate-deactivate event"""

        try:
            event = self.get_object()
            event.active = not event.active
            event.save()
            return Response({"active": event.active})
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(
        methods=["delete"],
        detail=True,
        permission_classes=[
            IsEventPlanner,
            IsOwnerAndReadOnly,
        ],
    )
    def delete(self, request, pk):
        """delete event"""

        try:
            self.get_object().delete()
            return Response("success", status=status.HTTP_204_NO_CONTENT)

        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RegisterEventViewset(CreateModelMixin, UpdateModelMixin, GenericViewSet):
    serializer_class = RegisterEventSerializer

    def perform_create(self, serializer):
        return serializer.save(user=self.request.user)


class BottleServiceViewset(ModelViewSet):
    serializer_class = BottleServiceSerializer
    permission_classes = (IsAuthenticated, IsOwnerAndReadOnly)
    queryset = BottleService.objects.all()
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = [
        "name",
    ]

    def perform_create(self, serializer):
        return serializer.save(user=self.request.user)


class FavoriteEventViewset(CreateModelMixin, DestroyModelMixin, GenericViewSet):
    serializer_class = FavoriteEventSerializer
    permission_classes = (IsAuthenticated, IsOwnerAndReadOnly)
    queryset = FavoriteEvent.objects.all()

    def perform_create(self, serializer):
        return serializer.save(user=self.request.user)


class CategoryViewSet(ListModelMixin, GenericViewSet):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()


class InterestViewSet(ListModelMixin, GenericViewSet):
    serializer_class = InterestSerializer
    queryset = Interest.objects.all()


class ConfirmReservationViewset(APIView):

    http_method_names = ["post"]

    def post(self, request):
        serializer = ConfirmReservationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:

            # Collect post data
            payment_intent_id = serializer.data.get("payment_intent_id")

            check_payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)

            if check_payment_intent.status == "succeeded":
                obj = UserEventRegistration.objects.filter(
                    payment_intent_id=payment_intent_id
                ).update(
                    reserved=True,
                    transaction_id=check_payment_intent.charges.data[
                        0
                    ].balance_transaction,
                    payment_status="succeeded",
                )
                return Response(check_payment_intent.status, status=status.HTTP_200_OK)
            return Response("Payment not confirmed", status=status.HTTP_403_FORBIDDEN)
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PaymentIntentViewset(APIView):

    http_method_names = ["post"]

    def post(self, request):
        serializer = ReserveSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            # Collect post data
            event = Event.objects.get(pk=serializer.data.get("event"))
            bottle_service = BottleService.objects.get(
                pk=serializer.data.get("bottle_service")
            )
            attendees = serializer.data.get("attendee")
            # card = serializer.data.get("chargeable_card")
            # percentage = int(serializer.data.get("percentage_upfront"))

            total_amount = attendees * bottle_service.price

            # Calculate the amount to pay based on the percentage provided
            # amount_to_pay = (percentage * total_amount) / 100
            # amount_to_balance = total_amount - amount_to_pay
            amount_to_balance = total_amount - 50

            payment_intent = stripe.PaymentIntent.create(
                amount=settings.RESERVATION_UPFRONT_AMOUNT,
                currency="usd",
                description="Payment for event reservation",
            )

            # if charge_card.status == "succeeded":
            obj, created = UserEventRegistration.objects.update_or_create(
                user=request.user,
                event=event,
                defaults={
                    "bottle_service": bottle_service,
                    "attendee": attendees,
                    # "reserved": True,
                    "amount_paid": payment_intent.amount,
                    "amount_left": amount_to_balance,
                    "payment_intent_id": payment_intent.id,
                    # "transaction_id": charge_card.balance_transaction,
                    "payment_status": "requires_payment_method",
                },
            )
            # res = {
            #     "status": charge_card.status,
            #     "amount_paid": charge_card.amount,
            #     "transaction_id": charge_card.balance_transaction,
            # }
            return Response(payment_intent, status=status.HTTP_200_OK)
            # elif charge_card.status == "pending":
            #     obj, created = UserEventRegistration.objects.update_or_create(
            #         user=request.user,
            #         event=event,
            #         defaults={
            #             "bottle_service": bottle_service,
            #             "attendee": attendees,
            #             "amount_paid": charge_card.amount,
            #             "amount_left": amount_to_balance,
            #             "transaction_id": charge_card.balance_transaction,
            #             "payment_status": "pending",
            #         },
            #     )

            #     res = {
            #         "status": charge_card.status,
            #         "amount": charge_card.amount,
            #         "transaction_id": charge_card.balance_transaction,
            #     }
            #     return Response(res, status=status.HTTP_200_OK)
            # elif charge_card.status == "failed":
            #     obj, created = UserEventRegistration.objects.update_or_create(
            #         user=request.user,
            #         event=event,
            #         defaults={
            #             "bottle_service": bottle_service,
            #             "attendee": attendees,
            #             "amount_paid": charge_card.amount,
            #             "amount_left": amount_to_balance,
            #             "transaction_id": charge_card.balance_transaction,
            #             "payment_status": "failed",
            #         },
            #     )

            #     res = {
            #         "status": charge_card.status,
            #         "message": charge_card.failure_message,
            #         "transaction_id": charge_card.failure_balance_transaction,
            #     }
            #     return Response(res, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
