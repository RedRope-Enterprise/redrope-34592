# Generated by Django 2.2.28 on 2023-04-25 01:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0040_event_venue_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='notification_type',
            field=models.CharField(blank=True, max_length=50, null=True, verbose_name='Notification Type'),
        ),
    ]
