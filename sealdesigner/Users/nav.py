# -*- coding: utf-8 -*-
# coding=utf-8
import json

from django.db import transaction
from django.http import HttpResponse
from models import User


def logout(req):
    """
    用户退出
    """
    response = HttpResponse("<script type='text/javascript'>alert('用户已退出');window.location.href='userLogin'</script>")
    #清理cookie里保存username
    response.delete_cookie('userId' )
    return response

def getUserName(req):
    """
    通过cookie中用户id 获取用户的帐号
    :param req:
    :return:
    """
    userId=req.COOKIES.get('userId','')   # 后台获取
    user = User.objects.get(userId=userId)
    return HttpResponse(user.userName)