# Generated by Django 2.2.28 on 2023-05-02 20:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0019_auto_20230426_0217'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='is_stripe_complete',
            field=models.BooleanField(default=False, verbose_name='Is Stripe Complete'),
        ),
    ]