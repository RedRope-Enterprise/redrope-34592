# Generated by Django 2.2.28 on 2022-09-22 23:52

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0037_auto_20220922_2349'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='usereventregistration',
            name='transaction_id',
        ),
    ]
