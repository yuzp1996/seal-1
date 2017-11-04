# -*- coding: utf-8 -*-
# coding=utf-8
import json, uuid,Queue,time
from django.http import HttpResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from models import Information, Administrator
from Users.models import User
from django.core.cache import cache

GLOBAL_MQ ={}
ONLINE_USER={}


def selectService(req):
    #需要筛选所有的在线客服给用户
    List=[]
    serviceUser = Administrator.objects.all()
    for obj in serviceUser:
        List.append(obj.adminId)
    print List
    adminlist=cache.get_many(List)
    servicerkeys=adminlist.keys()
    if len(servicerkeys)==0:
        return HttpResponse(0)
    else:
        return HttpResponse(json.dumps(servicerkeys))



def loadContactList(req):
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
                orderList["name"]=user.user.username
                print("get hou")
                List.append(orderList)
            except Exception as err:
                print ("err",err)
        for i in range(load_user_nums):
            orderList={}
            userId=ONLINE_USER[service].get()
            orderList["id"]=userId
            user=User.objects.get(userId=userId)
            orderList["name"]=user.user.username
            List.append(orderList)
    else:
        print "null--"
        ONLINE_USER[service]=Queue.Queue()
    return HttpResponse(json.dumps(List))


def sendMsg(req):
    if req.method=='POST':
        print req.POST["data"]
        data = json.loads(req.POST.get("data"))
        send_to =data["to"]
        if send_to not in GLOBAL_MQ:
            GLOBAL_MQ[send_to] = Queue.Queue()
        data['timestamp']=time.strftime("%H:%M:%S", time.localtime())
        GLOBAL_MQ[send_to].put(data)
        return HttpResponse(GLOBAL_MQ[send_to].qsize())
    else:
        msg_lists=[]
        request_user=str(req.COOKIES.get('serviceId',''))
        print request_user
        print (GLOBAL_MQ,request_user)
        if request_user in GLOBAL_MQ:
            print GLOBAL_MQ
            stored_msg_nums=GLOBAL_MQ[request_user].qsize()
            if stored_msg_nums==0:#no new msg
                try:
                    msg_lists.append(GLOBAL_MQ[request_user].get(timeout=15))
                except Exception as e:
                    print ("err",e)
            for i in range(stored_msg_nums):
                msg_lists.append(GLOBAL_MQ[request_user].get())
        else:
            # creat a new queue
            GLOBAL_MQ[str(req.COOKIES.get('serviceId',''))]=Queue.Queue()
        return HttpResponse(json.dumps(msg_lists))

def getMsg(req):
    msg_lists=[]
    request_user=str(req.user.id)
    print request_user
    print (GLOBAL_MQ,request_user)
    if request_user in GLOBAL_MQ:
        print GLOBAL_MQ
        print("hehe")
        stored_msg_nums=GLOBAL_MQ[request_user].qsize()
        if stored_msg_nums==0:#no new msg
            try:
                msg_lists.append(GLOBAL_MQ[request_user].get(timeout=15))
            except Exception as e:
                print ("err",e)
        for i in range(stored_msg_nums):
            msg_lists.append(GLOBAL_MQ[request_user].get())
    else:
        # creat a new queue
        GLOBAL_MQ[str(req.user.id)]=Queue.Queue()
    return HttpResponse(json.dumps(msg_lists))


def postUser(req):
    userId = req.POST["userId"]
    print userId
    service = str(req.POST["serviceId"])
    if service in ONLINE_USER:
        ONLINE_USER[service].put(userId)
    else:
        ONLINE_USER[service] = Queue.Queue()
        print("7777")
        ONLINE_USER[service].put(userId)
    return HttpResponse(ONLINE_USER[service].qsize())