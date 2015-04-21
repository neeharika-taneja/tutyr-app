# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tutyr_app', '0009_auto_20150411_2011'),
    ]

    operations = [
        migrations.AddField(
            model_name='tutyr',
            name='email',
            field=models.CharField(max_length=250, null=True, blank=True),
        ),
    ]
