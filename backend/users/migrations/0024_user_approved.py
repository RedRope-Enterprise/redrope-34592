# Generated by Django 2.2.28 on 2023-05-25 21:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0023_userwallet'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='approved',
            field=models.BooleanField(default=True, verbose_name='Approved'),
        ),
    ]
