# Generated by Django 2.2.28 on 2022-08-03 01:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0032_usereventregistration_payment_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='usereventregistration',
            name='payment_intent_id',
            field=models.CharField(blank=True, max_length=50, null=True, verbose_name='Payment Intent ID'),
        ),
    ]
