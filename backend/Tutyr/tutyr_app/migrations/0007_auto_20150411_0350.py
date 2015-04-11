# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tutyr_app', '0006_subject_tutorrequest'),
    ]

    operations = [
        migrations.AddField(
            model_name='tutyr',
            name='subjects',
            field=models.ManyToManyField(to='tutyr_app.Subject'),
        ),
        migrations.AlterField(
            model_name='tutyr',
            name='hourly_rate',
            field=models.DecimalField(max_digits=10, decimal_places=2),
        ),
        migrations.AlterField(
            model_name='tutyr',
            name='rating',
            field=models.DecimalField(max_digits=10, decimal_places=2),
        ),
    ]
