# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tutyr_app', '0007_auto_20150411_0350'),
    ]

    operations = [
        migrations.AddField(
            model_name='tutyr',
            name='tutor_mode',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='tutyr',
            name='latitude',
            field=models.DecimalField(max_digits=10, decimal_places=5, blank=True),
        ),
        migrations.AlterField(
            model_name='tutyr',
            name='longitude',
            field=models.DecimalField(max_digits=10, decimal_places=5, blank=True),
        ),
        migrations.AlterField(
            model_name='tutyr',
            name='subjects',
            field=models.ManyToManyField(to='tutyr_app.Subject', blank=True),
        ),
    ]
