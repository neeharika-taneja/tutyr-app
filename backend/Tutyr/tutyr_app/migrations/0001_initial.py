# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Tutyr',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('fabeook_id', models.CharField(max_length=250)),
                ('realname', models.CharField(max_length=250)),
                ('registration_date', models.DateTimeField()),
                ('bio1', models.CharField(max_length=250)),
                ('bio2', models.CharField(max_length=250)),
                ('bio3', models.CharField(max_length=250)),
                ('rating', models.IntegerField()),
                ('latitude', models.DecimalField(max_digits=10, decimal_places=10)),
                ('longitude', models.DecimalField(max_digits=10, decimal_places=10)),
                ('hourlyrate', models.DecimalField(max_digits=10, decimal_places=10)),
                ('user', models.OneToOneField(related_name='getTutyr', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
