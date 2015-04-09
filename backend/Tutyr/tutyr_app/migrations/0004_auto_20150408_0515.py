# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tutyr_app', '0003_auto_20150408_0026'),
    ]

    operations = [
        migrations.RenameField(
            model_name='tutyr',
            old_name='fabeook_id',
            new_name='facebook_id',
        ),
        migrations.RemoveField(
            model_name='tutyr',
            name='profile_image',
        ),
    ]
