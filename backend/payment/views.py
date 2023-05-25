import stripe
from django.conf import settings
from rest_framework import status
from django.shortcuts import render
from rest_framework import exceptions
from rest_framework.views import APIView
from rest_framework.response import Response
from payment.serializers import CustomerCardTokenSerializer, CardSerializer

# Create your views here.

stripe.api_key = settings.STRIPE_SECRET_KEY


class CardsAPIView(APIView):
    def get(self, request, format=None):
        try:
            if request.user.stripe_customer_id is None:
                raise exceptions.NotFound("No cards saved.")

            cards = stripe.Customer.list_sources(
                request.user.stripe_customer_id,
                object="card",
                limit=5,
            )
            return Response(cards)
        except Exception as e:
            print(e)
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        serializer = CustomerCardTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            user = request.user
            if user.stripe_customer_id is None:

                customer = stripe.Customer.create(
                    email=user.email, source=serializer.data.get("token")
                )

                user.stripe_customer_id = customer.id
                user.save()
            else:
                # customer = stripe.Customer.retrieve(user.stripe_customer_id)
                # customer.sources.create(source=serializer.data.get("token"))
                stripe.Customer.create_source(
                    user.stripe_customer_id, source=serializer.data.get("token")
                )

            return Response("success", status=status.HTTP_201_CREATED)
        except Exception as e:
            raise exceptions.ValidationError({"error": e})

    # Update User Cards
    def put(self, request):
        serializer = CardSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            """
            Payload structure from the client

            card_id: card_id
            card_data: {
                "name": "Jenny Rosen",
                "expiry": "02/24"
                }

            Format for Stipe API
            (
                customer_id,
                card_id,
                **data
            )
            """
            user = request.user
            update_card = stripe.Customer.modify_source(
                user.stripe_customer_id,
                serializer.data.get("card_id"),
                **serializer.data.get("card_data"),
            )
            return Response("success")
        except Exception as e:
            raise exceptions.ValidationError({"error": e})

    def delete(self, request):
        card_id = request.data.get("card_id")
        try:
            if card_id == None:
                raise Exception("Card ID is required")

            delete_card = stripe.Customer.delete_source(
                request.user.stripe_customer_id,
                card_id,
            )
            return Response("success", status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            raise exceptions.ValidationError({"error": e})
