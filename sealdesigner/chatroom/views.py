# -*- coding: utf-8 -*-
# coding=utf-8
from django.shortcuts import render_to_response
from django.http import HttpResponse,HttpResponseRedirect
# from django.template import RequestContext
from Seal.models import Administrator
from Users.models import User
from django.core.cache import cache
# from django import forms
# from models import ServiceUser
import json,Queue,time
# from random import choice
from Users import views

GLOBAL_MQ ={}#会话队列
ONLINE_USER={}#在线用户
# class UserForm(forms.Form):
#     """
#     客服登陆表单
#     """
#     username = forms.CharField(label='用户名', max_length=100)
#     password = forms.CharField(label="""密　码""", widget=forms.PasswordInput())


# def login(req):
#     """
#     客服登录视图
#     :param request:
#     :return:
#     """
#     if req.method == 'POST':
#         uf = UserForm(req.POST)
#         if uf.is_valid():
#             # 获取表单用户密码
#             username = uf.cleaned_data['username']
#             password = uf.cleaned_data['password']
#         serviceUser = ServiceUser.objects.filter(serviceAccount=username)
#         if serviceUser.count() == 0:
#             return HttpResponse("<script type='text/javascript'>alert('用户名不存在');window.location.href='login';</script>")
#         if serviceUser[0].servicePassword != password:
#             return HttpResponse("<script type='text/javascript'>alert('用户名或密码错误');window.location.href='login';</script>")
#         else:
#             # 比较成功，跳转serviceUser
#             response = HttpResponseRedirect('/chatroom/index/')
#             serviceId=serviceUser[0].serviceId
#             # 将serviceId写入浏览器cookies
#             response.set_cookie('serviceId', serviceId)
#             return response
#     else:
#         uf = UserForm()
#         return render_to_response('serviceLogin.html',{'uf':uf},context_instance=RequestContext(req))

def index(req):
    serviceId=req.COOKIES.get('SealadminID','')
    serviceUser=Administrator.objects.get(adminId=serviceId)
    serviceuser=serviceUser.adminAccount
    cache.set(serviceId,json.dumps(serviceId))
    return render_to_response('serviceIndex.html',{'serviceuser':serviceuser,"serviceId":serviceId})

@views.judgeuser
@views.userskip
def contactservice(req):
    serviceId=req.GET["serviceId"]
    print serviceId
    service=Administrator.objects.get(adminId=serviceId)
    print service.adminAccount
    # service=Administrator.objects.all()
    # serviceId=service[0].adminId
    userId = req.COOKIES.get("userId","")
    user=User.objects.get(userId=userId)
    userName=user.userName
    return render_to_response('contactservice.html',{"userId":userId,"userName":userName,"serviceId":serviceId})


def selectService(req):
    #需要筛选所有的在线客服给用户
    List=[]
    List2=[]
    serviceuser=Administrator.objects.all()
    for obj in serviceuser:
        List.append(obj.adminId)
    online=cache.get_many(List)
    onlineuser=online.keys()

    return HttpResponse(json.dumps(onlineuser))


def loadContactList(req):
    """
    载入客户会话列表
    :param req:
    :return:
    """
    service=str(req.POST["serviceId"])
    List=[]
    if service in ONLINE_USER:
        load_user_nums =ONLINE_USER[service].qsize()
        if load_user_nums==0:
            try:
                userId=ONLINE_USER[service].get(timeout=60)
                orderList={}
                orderList["id"]=userId
                user=User.objects.get(userId=userId)
                orderList["name"]=user.userName
                List.append(orderList)
            except Exception as err:
                print ("err",err)
        for i in range(load_user_nums):
            orderList={}
            userId=ONLINE_USER[service].get()
            orderList["id"]=userId
            user=User.objects.get(userId=userId)
            orderList["name"]=user.userName
            List.append(orderList)
    else:
        ONLINE_USER[service]=Queue.Queue()
    return HttpResponse(json.dumps(List))


def sendMsg(req):
    if req.method=='POST':
        data = json.loads(req.POST.get("data"))
        send_to =data["to"]
        if send_to not in GLOBAL_MQ:
            GLOBAL_MQ[send_to] = Queue.Queue()
        data['timestamp']=time.strftime("%H:%M:%S", time.localtime())
        GLOBAL_MQ[send_to].put(data)
        return HttpResponse(GLOBAL_MQ[send_to].qsize())
    else:
        #from customer Care 's GetNewMsgs
        msg_lists=[]
        request_user=str(req.COOKIES.get('SealadminID',''))
        cache.expire(req.COOKIES.get('SealadminID',''),60)
        if request_user in GLOBAL_MQ:
            stored_msg_nums=GLOBAL_MQ[request_user].qsize()
            if stored_msg_nums==0:#no new msg
                try:
                    msg_lists.append(GLOBAL_MQ[request_user].get(timeout=15))
                except Exception as e:
                    # there print the err first
                    print ("err",e)
            for i in range(stored_msg_nums):
                msg_lists.append(GLOBAL_MQ[request_user].get())
        else:
            # creat a new queue
            GLOBAL_MQ[str(req.COOKIES.get('SealadminID',''))]=Queue.Queue()
        return HttpResponse(json.dumps(msg_lists))

def getMsg(req):
    msg_lists=[]
    request_user=str(req.POST["userId"])
    cache.expire(request_user,60)
    if request_user in GLOBAL_MQ:
        stored_msg_nums=GLOBAL_MQ[request_user].qsize()
        if stored_msg_nums==0:#no new msg
            try:
                msg_lists.append(GLOBAL_MQ[request_user].get(timeout=15))
            except Exception as e:
                # there print the err second
                print ("err",e)
        for i in range(stored_msg_nums):
            msg_lists.append(GLOBAL_MQ[request_user].get())
    else:
        # creat a new queue
        GLOBAL_MQ[str(req.POST["userId"])]=Queue.Queue()
    return HttpResponse(json.dumps(msg_lists))


def postUser(req):
    userId = req.POST["userId"]
    service = str(req.POST["serviceId"])
    if service in ONLINE_USER:
        ONLINE_USER[service].put(userId)
    else:
        ONLINE_USER[service]=Queue.Queue()
        ONLINE_USER[service].put(userId)
    return HttpResponse(ONLINE_USER[service].qsize())



































