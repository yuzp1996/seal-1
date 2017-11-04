# -*- coding: utf-8 -*-
# coding=utf-8
from django import forms


class UserForm(forms.Form):
    """
    用户登陆表单
    """
    username = forms.CharField(label='用户名', max_length=100 )
    password = forms.CharField(label="""密　码""", widget=forms.PasswordInput(),initial='密码')
    passwordsure = forms.CharField(label='确认密码', widget=forms.PasswordInput())