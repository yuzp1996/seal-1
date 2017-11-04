# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-10-23 20:53
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('Seal', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Add',
            fields=[
                ('addId', models.CharField(max_length=36, primary_key=True, serialize=False)),
                ('addInfor', models.CharField(max_length=200)),
                ('isShow', models.BooleanField()),
                ('isDefault', models.BooleanField()),
                ('addPeople', models.CharField(max_length=20)),
                ('addPhone', models.CharField(max_length=20)),
                ('createTime', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Area',
            fields=[
                ('areaId', models.CharField(max_length=10, primary_key=True, serialize=False)),
                ('areaName', models.CharField(max_length=20)),
                ('isShow', models.BooleanField(default=1)),
            ],
        ),
        migrations.CreateModel(
            name='Comments',
            fields=[
                ('commentId', models.CharField(max_length=36, primary_key=True, serialize=False)),
                ('trollerId', models.CharField(max_length=36)),
                ('commentContent', models.TextField()),
                ('isCheck', models.BooleanField(default=0)),
                ('isShow', models.BooleanField(default=0)),
                ('createTime', models.DateTimeField(auto_now_add=True)),
                ('materialId', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Seal.Material')),
            ],
        ),
        migrations.CreateModel(
            name='PricilegeType',
            fields=[
                ('privilegeTypeId', models.CharField(max_length=36, primary_key=True, serialize=False)),
                ('privilegeName', models.CharField(max_length=12)),
                ('privilegePrice', models.DecimalField(decimal_places=2, max_digits=20)),
                ('privilegeAll', models.DecimalField(blank=True, decimal_places=2, max_digits=20, null=True)),
                ('isShow', models.BooleanField(default=1)),
                ('privilegePast', models.DateTimeField(blank=True, null=True)),
                ('privilegeStart', models.DateTimeField(blank=True, null=True)),
                ('total', models.IntegerField(default=100)),
            ],
        ),
        migrations.CreateModel(
            name='Privilege',
            fields=[
                ('privilegeId', models.CharField(max_length=36, primary_key=True, serialize=False)),
                ('isUsed', models.BooleanField(default=0)),
                ('privilegeTypeId', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Users.PricilegeType')),
            ],
        ),
        migrations.CreateModel(
            name='Province',
            fields=[
                ('provinceId', models.CharField(max_length=10, primary_key=True, serialize=False)),
                ('provinceName', models.CharField(max_length=20)),
                ('isShow', models.BooleanField(default=1)),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('userId', models.CharField(max_length=36, primary_key=True, serialize=False)),
                ('userName', models.CharField(max_length=11)),
                ('userPwd', models.CharField(max_length=90)),
                ('registerTime', models.DateTimeField(auto_now_add=True)),
                ('remark', models.TextField(blank=True, null=True)),
                ('isShow', models.BooleanField(default=1)),
                ('loginTime', models.DateTimeField(auto_now_add=True, null=True)),
                ('userPic', models.CharField(blank=True, max_length=200, null=True)),
                ('userEmail', models.CharField(blank=True, max_length=50, null=True)),
                ('userPhone', models.CharField(blank=True, max_length=20, null=True)),
                ('userSex', models.BooleanField(default=1)),
                ('areaId', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='Users.Area')),
            ],
        ),
        migrations.AddField(
            model_name='privilege',
            name='userId',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='Users.User'),
        ),
        migrations.AddField(
            model_name='comments',
            name='userId',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Users.User'),
        ),
        migrations.AddField(
            model_name='area',
            name='provinceId',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Users.Province'),
        ),
        migrations.AddField(
            model_name='add',
            name='areaId',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Users.Area'),
        ),
        migrations.AddField(
            model_name='add',
            name='userId',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Users.User'),
        ),
    ]
