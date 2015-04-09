# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tutyr_app', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='tutyr',
            name='user',
        ),
        migrations.AddField(
            model_name='tutyr',
            name='profileimage',
            field=models.FileField(null=True, upload_to=b'profileimages/'),
        ),
        migrations.AlterField(
            model_name='tutyr',
            name='hourlyrate',
            field=models.DecimalField(max_digits=10, decimal_places=5),
        ),
        migrations.AlterField(
            model_name='tutyr',
            name='latitude',
            field=models.DecimalField(max_digits=10, decimal_places=5),
        ),
        migrations.AlterField(
            model_name='tutyr',
            name='longitude',
            field=models.DecimalField(max_digits=10, decimal_places=5),
        ),
        migrations.AlterField(
            model_name='tutyr',
            name='rating',
            field=models.DecimalField(max_digits=10, decimal_places=5),
        ),
    ]
