from rest_framework import serializers


class CardDataSerializer(serializers.Serializer):
    name = serializers.CharField(required=False)
    card_number = serializers.CharField(required=False)
    expiry_date = serializers.CharField(required=False)


class CardSerializer(serializers.Serializer):
    card_id = serializers.CharField()
    card_data = CardDataSerializer()


class CustomerCardTokenSerializer(serializers.Serializer):
    token = serializers.CharField()
