# Generated by Django 2.2.28 on 2023-06-23 19:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0050_auto_20230622_0125'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usereventregistration',
            name='stripe_fee',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=8, verbose_name='Stripe Fee'),
        ),
    ]
