# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tutyr_app', '0010_tutyr_email'),
    ]

    operations = [
        migrations.CreateModel(
            name='Rating',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('rating', models.IntegerField()),
                ('comments', models.CharField(max_length=250)),
                ('fbID_from', models.CharField(max_length=250)),
                ('fbID_to', models.CharField(max_length=250)),
            ],
        ),
        migrations.RemoveField(
            model_name='subject',
            name='subject_id',
        ),
        migrations.RemoveField(
            model_name='tutorrequest',
            name='request_id',
        ),
        migrations.RemoveField(
            model_name='tutorrequest',
            name='request_time',
        ),
        migrations.RemoveField(
            model_name='tutorrequest',
            name='requested_user',
        ),
        migrations.RemoveField(
            model_name='tutorrequest',
            name='requesting_user',
        ),
        migrations.RemoveField(
            model_name='tutorrequest',
            name='session_end_time',
        ),
        migrations.RemoveField(
            model_name='tutorrequest',
            name='session_rating',
        ),
        migrations.RemoveField(
            model_name='tutorrequest',
            name='session_start_time',
        ),
        migrations.AddField(
            model_name='tutorrequest',
            name='location_comments',
            field=models.CharField(max_length=250, blank=True),
        ),
        migrations.AddField(
            model_name='tutorrequest',
            name='location_latitude',
            field=models.DecimalField(null=True, max_digits=10, decimal_places=10, blank=True),
        ),
        migrations.AddField(
            model_name='tutorrequest',
            name='location_longitude',
            field=models.DecimalField(null=True, max_digits=10, decimal_places=10, blank=True),
        ),
        migrations.AddField(
            model_name='tutorrequest',
            name='session_end',
            field=models.DateTimeField(null=True, blank=True),
        ),
        migrations.AddField(
            model_name='tutorrequest',
            name='session_start',
            field=models.DateTimeField(null=True, blank=True),
        ),
        migrations.AddField(
            model_name='tutorrequest',
            name='timestamp',
            field=models.DateTimeField(null=True),
        ),
        migrations.AddField(
            model_name='tutorrequest',
            name='tutor_from',
            field=models.CharField(max_length=250, null=True),
        ),
        migrations.AddField(
            model_name='tutorrequest',
            name='tutor_to',
            field=models.CharField(max_length=250, null=True),
        ),
        migrations.AlterField(
            model_name='tutorrequest',
            name='comments',
            field=models.CharField(max_length=250, null=True),
        ),
        migrations.AlterField(
            model_name='tutyr',
            name='latitude',
            field=models.DecimalField(null=True, max_digits=10, decimal_places=10, blank=True),
        ),
        migrations.AlterField(
            model_name='tutyr',
            name='longitude',
            field=models.DecimalField(null=True, max_digits=10, decimal_places=10, blank=True),
        ),
    ]
