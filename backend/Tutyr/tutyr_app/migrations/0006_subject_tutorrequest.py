# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tutyr_app', '0005_tutyr_profile_pic'),
    ]

    operations = [
        migrations.CreateModel(
            name='Subject',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('subject_id', models.IntegerField()),
                ('name', models.CharField(max_length=250)),
                ('description', models.CharField(max_length=250)),
            ],
        ),
        migrations.CreateModel(
            name='TutorRequest',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('request_id', models.IntegerField()),
                ('requesting_user', models.IntegerField()),
                ('requested_user', models.IntegerField()),
                ('comments', models.CharField(max_length=250)),
                ('status', models.IntegerField()),
                ('request_time', models.DateTimeField()),
                ('session_start_time', models.DateTimeField()),
                ('session_end_time', models.DateTimeField()),
                ('session_rating', models.IntegerField()),
            ],
        ),
    ]
