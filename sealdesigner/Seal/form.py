# -*- coding: utf-8 -*-
# coding=utf-8
from django import forms


class UserForm(forms.Form):
    """
    管理员登陆表单
    """
    username = forms.CharField(label='用户名', max_length=100)
    password = forms.CharField(label="""密　码""", widget=forms.PasswordInput())