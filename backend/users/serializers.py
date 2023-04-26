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