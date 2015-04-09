# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tutyr_app', '0002_auto_20150408_0018'),
    ]

    operations = [
        migrations.RenameField(
            model_name='tutyr',
            old_name='hourlyrate',
            new_name='hourly_rate',
        ),
        migrations.RenameField(
            model_name='tutyr',
            old_name='profileimage',
            new_name='profile_image',
        ),
        migrations.RenameField(
            model_name='tutyr',
            old_name='realname',
            new_name='real_name',
        ),
    ]
