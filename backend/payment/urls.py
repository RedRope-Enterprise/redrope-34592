from django.urls import path, include
from payment.views import CardsAPIView

app_name = "payment"

urlpatterns = [
    path("cards/", CardsAPIView.as_view(), name="saved_cards"),
]
