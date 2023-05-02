from rest_framework import serializers
from django.contrib.auth import get_user_model
from push_notifications.models import GCMDevice
from users.models import BankAccount, Withdrawal
User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "name", "profile_picture"]


class GCMDeviceSerializer(serializers.ModelSerializer):

    class Meta:
        model = GCMDevice
        fields = ("id", "registration_id", "device_id",)


class BankAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankAccount
        fields = ['account_number', 'routing_number', 'account_type']



class WithdrawalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Withdrawal
        fields = ['id', 'payout_id', 'amount', 'currency', 'timestamp']
        read_only_fields = ['id', 'payout_id', 'amount', 'currency', 'timestamp']


class StripeAccountRegisteredAddressSerializer(serializers.Serializer):

    city = serializers.CharField()
    country = serializers.CharField(max_length=2, required=False)
    line1 = serializers.CharField()
    line2 = serializers.CharField(required=False)
    postal_code = serializers.CharField()
    state = serializers.CharField()


class CompleteAccountStripeSerializer(serializers.Serializer):

    first_name = serializers.CharField()
    last_name = serializers.CharField()
    ssn_last_4 = serializers.CharField()
    phone = serializers.CharField()
    dob = serializers.DateField()
    address = StripeAccountRegisteredAddressSerializer()
