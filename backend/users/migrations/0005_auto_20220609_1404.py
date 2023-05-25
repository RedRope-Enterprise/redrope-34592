# Generated by Django 2.2.28 on 2022-06-09 14:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_auto_20220531_1441'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='business_name',
            field=models.CharField(blank=True, max_length=100, null=True, verbose_name='Business name'),
        ),
        migrations.AddField(
            model_name='user',
            name='business_reg_no',
            field=models.CharField(blank=True, max_length=100, null=True, verbose_name='Business registration number'),
        ),
        migrations.AddField(
            model_name='user',
            name='event_planner',
            field=models.BooleanField(default=False, verbose_name='Event planner'),
        ),
    ]
