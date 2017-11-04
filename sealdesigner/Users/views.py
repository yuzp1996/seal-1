# -*- coding: utf-8 -*-
# coding=utf-8

from django.shortcuts import render
# Create your views here.
from django.shortcuts import render, render_to_response
from django.http import HttpResponse, HttpResponseRedirect
from django.template import RequestContext
from django import forms
from form import UserForm
from models import User
from Seal.models import IndexPicture
import os, time
import uuid
import json
import datetime
import hashlib
import random
import smtplib
from email.mime.text import MIMEText
from django.db import transaction
from django.core.cache import cache


def userResetPassword(req):
    """
    找回密码
    :param req:
    :return:
    """
    if req.method == 'POST':
        userName = req.POST["userName"]
        yanzhengma = req.POST['Input_verify']
        if req.COOKIES.get('validate', '').upper() != yanzhengma.upper():
            return HttpResponse(0)
        user = User.objects.filter(userName=userName)
        # 获取的表单数据与数据库进行比较
        if user.count() == 0:
            return HttpResponse(2)
        else:
            # 判断邮箱是否存在 不存在返回 3
            email = user[0].userEmail
            first = email.split("@")[0][0:3]
            second = email.split("@")[1]
            email = first + "****@" + second
            if email == 0:
                return HttpResponse(3)
            return HttpResponse(email)  # 返回邮箱
    else:
        return render_to_response('Users/userresetpassword.html')


def post_email(email, option):
    """
    发送email方法，参数说明
    email：邮箱地址
    option: 用户进行的操作,例如：找回密码
    :param req:
    :return:
    """
    mail_from = "indianol@126.com"
    mail_passwd = "wuhen941127123"
    mail_host = "smtp.126.com"
    six = "".join(random.sample(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'], 6))
    print six
    content = """<html><p>您好，您正在进行"""\
              + option + """操作，切勿将验证码泄露于他人，15分钟内有效。
                   验证码：<B>""" \
              + six + """</B>【印递安】</p>
                   </html>"""
    msg = MIMEText(content, _subtype='html', _charset='utf8')
    msg['Subject'] = option
    msg['From'] = mail_from
    msg['To'] = email
    try:
        cache.set(email, " ")
        cache.delete(email)
        cache.set(email, six, timeout=900)
        smtp = smtplib.SMTP()  # 创建实例
        smtp.connect(mail_host)  # 连接邮箱服务器
        smtp.login(mail_from, mail_passwd)  # 登录邮箱 使用专属于第三方密码
        smtp.sendmail(mail_from, email, msg.as_string())  # 发送邮件
        smtp.close()
        return 1
    except Exception, err:
        print err
        return 0

def emailgetvaliate(req):
    """
    点击按钮发送验证码到用户邮箱
    :param req:
    :return:
    """
    try:
        if req.POST.has_key("emailOption"):
            email = req.POST["email"]
            return HttpResponse(post_email(email,"用户注册"))
        username = req.POST["username"]
        user = User.objects.filter(userName=username)
        if len(user) == 0:
            return HttpResponse(2)  # 用户不存在，请重新输入
        return HttpResponse(post_email(user[0].userEmail, "找回密码"))
    except Exception, err:
        print err
        return HttpResponse(0)


def match_validate(email,validateonline):
    """
    匹配验证码方法：
    参数：
    邮箱：email
    验证码：validateonline

    :return:
    """
    validate = cache.get(email)
    if validate == validateonline:
        return 1
    else:
        return 0

def userResetPassword2(req):
    """
    第二步重置密码
    :param req:
    :return:
    """
    username = req.POST["username"]
    valiateonline = req.POST["valiate"]
    user = User.objects.get(userName=username)
    if user is not None:
        return HttpResponse(match_validate(user.userEmail, valiateonline))

def securityAccess(req):
    """
    获取验证码，验证第三步操作安全性
    :param req:
    :return:
    """
    userName = req.POST["username"]
    user = User.objects.filter(userName=userName)
    userId = user[0].userId
    macthCode = "".join(random.sample(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'], 8))
    print macthCode
    try:
        print userId
        cache.set(userId, macthCode, timeout=900)
        return HttpResponse(macthCode)
    except Exception, err:
        print err
        return 0


def ResetPasswordFinnal(req):
    """
    第三步重置密码
    :param req:
    :return:
    """
    username = req.POST["userName"]
    password = req.POST["password"]
    passWord = hashlib.sha256(password).hexdigest()  # 登陆密码加密第二次
    securityCode = req.POST["securityAccess"]
    user = User.objects.filter(userName=username)
    userId = user[0].userId
    if(match_validate(userId, securityCode)):
        user = User.objects.filter(userName=username)
        if user is not None:
            user.update(userPwd=passWord)
            return HttpResponse(1)
        else:
            return HttpResponse(0)
    else:
        return HttpResponse(2)


def userRegister(req):
    """
    用户注册
    :param req:
    :return:
    """
    if req.method == 'POST':
        userName = req.POST["userName"]
        user = User.objects.filter(userName=userName)
        if user.count() > 0:
            return HttpResponse(2)
        email = req.POST["email"]
        hasEmail = User.objects.filter(userEmail=email)
        if hasEmail.count() > 0:
            return HttpResponse(4)
        passWord = req.POST["passWord"]
        passWord = hashlib.sha256(passWord).hexdigest()  # 密码加密
        yanzhengma = req.POST['Input_verify']
        if match_validate(email,yanzhengma)==0:  #调用验证接口
            return HttpResponse(3)
        userId = uuid.uuid1()
        try:
            userSave = User(userId=userId, userName=userName, userPwd=passWord, userEmail=email)
            userSave.save()
            return HttpResponse(1)
        except Exception as err:
            return HttpResponse(0)
    else:
        return render_to_response('Users/userregister.html')


def userLogin(req):
    """
    客户登陆视图
    :param req:
    :return:
    """
    if req.method == 'POST':
        userName = req.POST["userName"]
        password = req.POST['passWord']
        yanzhengma = req.POST['Input_verify']
        if userName == "" or password == "" or yanzhengma == "":
            return HttpResponse(0)
        if req.COOKIES.get('validate', '').upper() != yanzhengma.upper():
            return HttpResponse(2)
        user = User.objects.filter(userName=userName)
        # 获取的表单数据与数据库进行比较
        if user.count() == 0:
            return HttpResponse(3)
        password = hashlib.sha256(password).hexdigest()
        if user[0].userPwd != password:
            # 比较失败，还在login
            return HttpResponse(4)
        if user[0].isShow:
            # 比较成功，跳转index
            user.update(loginTime=datetime.datetime.now().strftime("%Y-%m-%d %H:%I:%S"))
            userid = user[0].userId
            response = HttpResponse(1)
            # 将username写入浏览器cookies
            response.set_cookie('userId', userid)
            return response
        else:
            return HttpResponse(5)
    else:
        register = False
        if 'register' in req.GET:
            register = True
        return render_to_response('Users/userlogin.html', {"register": register})


def userlogout(req):
    """user
    用户登出
    """
    response = HttpResponse(
        "<script type='text/javascript'>alert('用户退出');window.location.href='/Users/userLogin'</script>")
    # 清理cookie里保存userId
    response.delete_cookie('userId')
    return response


def imgShow(req):
    """
    首页图片加载
    """
    picture = IndexPicture.objects.all()
    List = []
    for obj in picture:
        pictureList = {}
        pictureList["picUrl"] = obj.picUrl
        pictureList["picPlace"] = obj.picPlace
        List.append(pictureList)
    return HttpResponse(json.dumps(List))


def uerInfoInTop(req):
    """
    判断用户是否登录，若登录，在在网页的顶部，将用户名和个人中心显示
    :param req:
    :return:
    """
    userId = req.COOKIES.get('userId', '')
    if userId != '':
        user = User.objects.filter(userId=userId)
        userName = user[0].userName
        return HttpResponse(userName)
    else:
        return HttpResponse(0)


def judgeuser(test):
    """
    判断用户是否登录，后台操作的全局判断，用作装饰器
    :param test:
    :return:
    """

    def infun(req, *args, **kwargs):
        if req.COOKIES.get('userId', '') == '':
            return HttpResponse("<script type='text/javascript'>window.location.href='/Users/userLogin';</script>")
        else:
            userid = User.objects.filter(userId=req.COOKIES.get('userId', ''))
            if userid.count() == 0:
                return HttpResponse(
                    "<script type='text/javascript'>alert('该用户不存在');window.location.href='/Users/userLogin';</script>")
            else:
                ret = test(req, *args, **kwargs)
                return ret

    return infun


def userskip(func):
    """
    跳转异常装饰器
    """

    def infun(req, *args, **kwargs):
        basePath = os.path.dirname(os.path.dirname(__file__))
        logPath = os.path.join(basePath, "Users/log/skip.txt")
        log_file = open(logPath, "a")
        try:
            ret = func(req, *args, **kwargs)
        except Exception as err:
            log_file.writelines(str(time.strftime('%Y/%m/%d %H:%M:%S')) + "\tview:" + func.__name__ + "\nerror:[" + str(
                err) + "]\ndoc:" + func.__doc__ + "\n")
            return render_to_response('404.html')
        finally:
            log_file.close()
        return ret

    return infun


def userselect(func):
    """
    查找异常装饰器
    """

    def infun(req, *args, **kwargs):
        basePath = os.path.dirname(os.path.dirname(__file__))
        logPath = os.path.join(basePath, "Users/log/select.txt")
        log_file = open(logPath, "a")
        try:
            ret = func(req, *args, **kwargs)
        except Exception as err:
            log_file.writelines(str(time.strftime('%Y/%m/%d %H:%M:%S')) + "\tview:" + func.__name__ + "\nerror:[" + str(
                err) + "]\ndoc:" + func.__doc__ + "\n")
            return render_to_response('404.html')
        finally:
            log_file.close()
        return ret

    return infun


def userupdate(func):
    """
    增删改异常装饰器
    """

    def infun(req, *args, **kwargs):
        basePath = os.path.dirname(os.path.dirname(__file__))
        logPath = os.path.join(basePath, "Users/log/update.txt")
        log_file = open(logPath, "a")
        try:
            ret = func(req, *args, **kwargs)
        except Exception as err:
            log_file.writelines(str(time.strftime('%Y/%m/%d %H:%M:%S')) + "\tview:" + func.__name__ + "\nerror:[" + str(
                err) + "]\ndoc:" + func.__doc__ + "\n")
            return render_to_response('404.html')
        finally:
            log_file.close()
        return ret

    return infun
