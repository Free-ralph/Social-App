# Generated by Django 3.2.15 on 2022-12-05 12:13

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0025_alter_profile_author'),
        ('chat', '0006_notifications_seen'),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='receiver_Profile',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='received_messages', to='backend.profile'),
        ),
        migrations.AlterField(
            model_name='message',
            name='profile',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='sent_messages', to='backend.profile'),
        ),
    ]
