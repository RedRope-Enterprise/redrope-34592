# Generated by Django 2.2.28 on 2023-04-26 00:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0017_withdrawal'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='stripe_connect_account_id',
            field=models.CharField(blank=True, max_length=100, null=True, verbose_name='Stripe Connect Account IB'),
        ),
    ]
