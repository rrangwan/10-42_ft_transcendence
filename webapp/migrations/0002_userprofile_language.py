# Generated by Django 3.2.25 on 2024-05-03 18:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='language',
            field=models.CharField(choices=[('en', 'English'), ('ar', 'العربية'), ('es', 'Español'), ('ru', 'Русский'), ('hi', 'हिन्दी')], default='en', max_length=2),
        ),
    ]