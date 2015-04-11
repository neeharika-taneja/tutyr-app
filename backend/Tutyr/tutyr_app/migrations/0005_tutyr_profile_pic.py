# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tutyr_app', '0004_auto_20150408_0515'),
    ]

    operations = [
        migrations.AddField(
            model_name='tutyr',
            name='profile_pic',
            field=models.CharField(default='', max_length=250),
            preserve_default=False,
        ),
    ]
