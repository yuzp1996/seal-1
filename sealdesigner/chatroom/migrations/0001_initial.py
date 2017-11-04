# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ServiceUser',
            fields=[
                ('serviceId', models.CharField(max_length=36, serialize=False, primary_key=True)),
                ('serviceAccount', models.CharField(max_length=32)),
                ('servicePassword', models.CharField(max_length=32)),
                ('createssTime', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
