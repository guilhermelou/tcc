# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2017-05-17 21:31
from __future__ import unicode_literals

import django.contrib.postgres.fields.jsonb
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rainfall', '0010_station_null_days_array_str'),
    ]

    operations = [
        migrations.AddField(
            model_name='station',
            name='uni_scale',
            field=django.contrib.postgres.fields.jsonb.JSONField(default={}),
            preserve_default=False,
        ),
    ]
