# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tutyr_app', '0011_auto_20150424_2108'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tutyr',
            name='latitude',
            field=models.DecimalField(null=True, max_digits=10, decimal_places=5, blank=True),
        ),
        migrations.AlterField(
            model_name='tutyr',
            name='longitude',
            field=models.DecimalField(null=True, max_digits=10, decimal_places=5, blank=True),
        ),
    ]
