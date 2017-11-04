# -*- coding: utf-8 -*-
# coding=utf-8
import json
import os
import uuid
from PIL import Image

from django.db import transaction
from django.http import HttpResponse
basePath=os.path.dirname(os.path.dirname(__file__))

from models import User, Province, Area

def userSave(req):
    """
    保存用户修改信息
    :param request:
    :return:
    """
    try:
        with transaction.atomic():
            userId = req.COOKIES.get('userId', '')  # 从cookies获取用户id
            user = User.objects.get(userId=userId)
            if req.POST.has_key("password"):  # 判断post过来的值是否有这个键
                password = req.POST["password"]
                userPassWord = user.userPwd
                if password == userPassWord:
                    newPassword = req.POST["pwdChange1"]
                    user.userPwd = newPassword
                else:
                    return HttpResponse(2)  # 输入原密码不正确
            reqflie = req.FILES.get('userPicture',False)
            rollpictureName = ""
            if reqflie != False:
                ret1=str(uuid.uuid1())
                img = Image.open(reqflie)
                img.thumbnail((500,500),Image.ANTIALIAS)
                rollpictureName="webStatic/img/Users/userPicture/"+ret1+".jpg"
                rollpicturePath=os.path.join(basePath,rollpictureName)
                print rollpicturePath
                img.save(rollpicturePath, "png")
                user.userPic = "/" + rollpictureName
            user.userName = req.POST["userName"]
            print req.POST["sex"]
            if req.POST["sex"] == "1":
                user.sex = True
            else:
                user.sex = False
            print user.sex
            user.userEmail = req.POST["email"]
            user.userPhone = req.POST["userPhone"]
            user.areaId_id = str(req.POST["city"])
            user.save()
            User.objects.update(userSex=user.sex)  # 更新字段
            print user.sex
            return HttpResponse(1)
    except Exception as err:
        print err
        return HttpResponse(0)


def getUserInformation(req):
    """
    获取用户所有信息
    :param req:
    :return:
    """
    user = User.objects.get(userId=req.POST["userId"])
    List = []
    userInformation = {}
    userInformation["userName"] = user.userName
    userInformation["registerTime"] = user.registerTime.strftime('%Y/%m/%d %H:%M:%S')
    userInformation["userPic"] = user.userPic
    userInformation["userEmail"] = user.userEmail
    userInformation["userPhone"] = user.userPhone
    userInformation["userSex"] = user.userSex   # 直接把值传给js ,js进行判断
    area = Area.objects.filter(areaId=user.areaId_id)   # 获取地区列表信息
    if area.exists():  # 判断地区是否存在
        areaId = area[0].areaId  # 界面为下拉列表，直接传id即可
        provinceId = area[0].provinceId_id    # 获取省份列表信息
    else:
        areaId = 0
        provinceId = 0
    userInformation["areaId"] = areaId
    userInformation["provinceId"] = provinceId
    List.append(userInformation)
    return HttpResponse(json.dumps(List))


def getProvince(req):
    """
    获取父类省份列表
    :param req:
    :return:
    """
    province = Province.objects.all()
    if len(province) == 0:
        return HttpResponse(0)
    a = []
    for obj in province:
        provinceList = {"provinceId": obj.provinceId, "provinceName": obj.provinceName}
        a.append(provinceList)
    return HttpResponse(json.dumps(a))


def selectArea(req):
    """
    获取地区列表的所有值
    :param req:
    :return:
    """
    List = []
    area =Area.objects.filter(provinceId_id=req.POST["provinceId"])
    area =area.filter(isShow=1)
    if area.exists():
        for obj in area:
            areaList = {}
            areaList["areaId"] = obj.areaId
            areaList["areaName"] = obj.areaName
            List.append(areaList)
        return HttpResponse(json.dumps(List))
    else:
        return HttpResponse(0)


