# -*- coding: utf-8 -*-
# coding=utf-8
import json, uuid
from django.http import HttpResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from Seal.models import Information, Administrator, News
import time
import datetime
import time
import datetime


# @adminskip


def GetAnnouncementList(req):
    # admin=Admin.objects.all()
    # Information.objects.create(informationId=5,adminId=admin[0],informationContent="informationContent",createTime="2016-1-1",informationType=5)
    List = []
    try:
        announcementList = Information.objects.all()
        if not announcementList.exists():
            InitInformationDB()
            announcementList = Information.objects.all()
        for obj in announcementList:
            item = {}
            if obj.informationType == 1:
                type = ["主页", "关于我们"]
            elif obj.informationType == 2:
                type = ["主页", "流程图"]
            elif obj.informationType == 3:
                type = ["主页", "广告"]
            elif obj.informationType == 4:
                type = ["关于我们", "企业信息"]
            elif obj.informationType == 5:
                type = ["关于我们", "联系我们"]
            elif obj.informationType == 6:
                type = ["关于我们", "常见问题及解答"]
            item["informationId"] = obj.informationId
            item["AnnouncementName"] = type[1]
            item["Place"] = type[0]
            item["CreateTime"] = str(obj.createTime)
            item["ADMIN"] = obj.adminId.adminAccount
            List.append(item)
        return HttpResponse(json.dumps(List))
    except Exception:
        return HttpResponse("None")


def GetSingleItem(req):
    if int(req.GET["informationId"]) > 6 | int(req.GET["informationId"]) < 1:
        return
    obj = Information.objects.get(informationId=req.GET["informationId"])
    item = {}
    if obj.informationType == 1:
        type = ["主页", "关于我们"]
    elif obj.informationType == 2:
        type = ["主页", "流程图"]
    elif obj.informationType == 3:
        type = ["主页", "广告"]
    elif obj.informationType == 4:
        type = ["关于我们", "企业信息"]
    elif obj.informationType == 5:
        type = ["关于我们", "联系我们"]
    elif obj.informationType == 6:
        type = ["关于我们", "常见问题及解答"]
    item["informationId"] = obj.informationId
    item["AnnouncementName"] = type[1]
    item["Place"] = type[0]
    item["CreateTime"] = str(obj.createTime)
    item["ADMIN"] = obj.adminId.adminAccount
    return HttpResponse(json.dumps(item))


def DisaplySingleItem(req):
    try:
        informationid = req.GET["informationId"]
        obj = Information.objects.get(informationId=informationid)
        if obj.informationType == 1:
            type = ["主页", "关于我们"]
        elif obj.informationType == 2:
            type = ["主页", "流程图"]
        elif obj.informationType == 3:
            type = ["主页", "广告"]
        elif obj.informationType == 4:
            type = ["关于我们", "企业信息"]
        elif obj.informationType == 5:
            type = ["关于我们", "联系我们"]
        elif obj.informationType == 6:
            type = ["关于我们", "常见问题及解答"]
        return render(req, 'Seal/second/_announcement.html',
                      {'createTime': str(obj.createTime), 'place': str(type[0]), 'title': str(type[1]),
                       'informationContent': obj.informationContent, 'informationId': obj.informationId})
    except Exception:
        return HttpResponse("None")


def SaveChange(req):
    try:
        informationid = req.POST["informationId"]
        informationContent = req.POST['informationContent']
        obj = Information.objects.get(informationId=informationid)
        obj.informationContent = informationContent
        obj.createTime = time.strftime("%Y-%m-%d %H:%M:%S",
                                       time.localtime())  # datetime.date.fromtimestamp(time.time())
        obj.save()
        return HttpResponse('修改成功')
    except Exception as error:
        print error
        return HttpResponse('未知错误')


def InitInformationDB():
    for item in range(1, 7):
        admin = Administrator.objects.all()
        Information.objects.create(informationId=item, adminId=admin[0],
                                   informationContent="informationContent", createTime=time.time(),
                                   informationType=item)


def addNews(req):
    try:
        changeId = req.POST["changeId"]
        newsId = uuid.uuid1()
        title = req.POST["title"]
        link = req.POST["link"]
        status = req.POST["status"]
        newsType = req.POST["newsType"]
        content = req.POST["content"]
        createTime = time.strftime("%Y-%m-%d", time.localtime())  # datetime.date.fromtimestamp(time.time())

        if changeId != "":
            news = News.objects.get(newsId =changeId )
            news.title = title
            news.link = req.POST["link"]
            news.status = req.POST["status"]
            news.newsType = req.POST["newsType"]
            news.content = req.POST["content"]
            news.save()
        else:
            obj = News(newsId= newsId,title=title,link=link,status=status, newsType=newsType,content=content ,createTime=createTime)
            obj.save()
        return HttpResponse(1)
    except Exception as error:
        print error
        return HttpResponse('未知错误')