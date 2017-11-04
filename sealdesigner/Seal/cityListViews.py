# -*- coding: utf-8 -*-
# coding=utf-8
import json

from django.db import transaction
from django.http import HttpResponse
from Users.models import Province, Area

def getCityList(req):
    """
    打印地区列表
    :param req:
    :return:
    """
    areas = Area.objects.all()  # 获取所有的信息
    if req.POST.has_key("orderStr"):  # 判断是否为搜索
        areas = areas.filter(areaName=req.POST["orderStr"])
    num = len(areas)   # 获取符合条件的信息数
    page = int(req.POST["page"])  # 当前页数
    nowPage = (page-1)*10  # 起始信息条数
    lastPage = nowPage+10  # 最终信息条数
    areas = areas.order_by("-provinceId")[nowPage:lastPage]  # 取出符合当前页数的十条信息
    if areas.exists():
        List = []
        for obj in areas:
            areaslist = {}
            province = Province.objects.get(provinceId=obj.provinceId_id)  # 获取所在地区的省份，有条件的获取
            areaslist["provinceName"] = province.provinceName
            areaslist["areaName"] = obj.areaName
            areaslist["areaId"] = obj.areaId
            areaslist["num"] = num
            if obj.isShow == 1:
                areaslist["isShow"] = "是"
            else:
                areaslist["isShow"] = "否"
            List.append(areaslist)
        return HttpResponse(json.dumps(List))
    else:
        return  HttpResponse(0)


def addPlace(req):
    """
    添加新的地区
    :param req:
    :return:
    """
    try:
        with transaction.atomic():
            areaName = req.POST["addArea"]
            if req.POST["radioVal"] == '1':    #是否启用
                 isShow = True
            else:
                isShow = False
            if req.POST.has_key("provinceId"):    #是否是添加新的省份
                provinceId = req.POST["provinceId"]
            else :
                provinceName = req.POST["addProvince"]
                province = Province.objects.filter(provinceName=provinceName)
                if province.exists():
                    return HttpResponse(2) #当前省份已存在
                else :
                    provinces = Province.objects.all()
                    provinceNum = len(provinces)
                    provinceId = provinceNum+1
                    pro = Province(provinceId=provinceId,provinceName=provinceName,isShow=1)
                    pro.save()
            area = Area.objects.filter(areaName=areaName)
            if area.exists():
                for obj in area:
                    provinceArea = Province.objects.get(provinceId=obj.provinceId_id).provinceName
                    province = Province.objects.get(provinceId=provinceId).provinceName
                    if province == provinceArea:
                        return HttpResponse(3)  # 当前添加的地区已经存在
            areas = Area.objects.all()
            areaNum = len(areas)+1
            print(areaNum)
            area = Area(areaId=areaNum, areaName=areaName, isShow=isShow, provinceId_id=provinceId)
            area.save()
            return HttpResponse(1)
    except Exception as err:
        print err
        return HttpResponse(0)

def provinceList(req):
    """
    获取所有省份
    :param req:
    :return:
    """
    provinces = Province.objects.all()
    if len(provinces) == 0:
        return HttpResponse(0)
    List = []
    for obj in provinces:
        provincelist = {}
        provincelist["provinceName"] = obj.provinceName
        provincelist["provinceId"] = obj.provinceId
        List.append(provincelist)
    return HttpResponse(json.dumps(List))


def getArea(req):
    """
    获取某一个地区信息
    :param req:
    :return:
    """
    areaId = req.POST["areaId"]
    area = Area.objects.get(areaId=areaId)
    List  = []
    areaslist = {}
    areaslist["areaId"] = areaId
    areaslist["areaName"] = area.areaName
    areaslist["provinceId"] = area.provinceId_id
    areaslist["provinceName"] = area.provinceId.provinceName
    areaslist["isShow"] = area.isShow
    List.append(areaslist)
    return HttpResponse(json.dumps(List))


def changeArea(req):
    """
    保存修改的地区
    :param req:
    :return:
    """
    try:
        with transaction.atomic():
            provinceId = req.POST["provinceId"]
            print provinceId
            areaId = req.POST["areaId"]
            provinceName = req.POST["addProvince"]
            if req.POST["radioVal"] == '1':
                 isShow = True
            else:
                isShow = False
            areaName = req.POST["addArea"]
            area = Area.objects.get(areaId=areaId)
            if areaName != area.areaName:
                hasArea = Area.objects.filter(areaName=areaName)
                if hasArea.exists():
                    return HttpResponse(2)    # 当前地区存在
            province = Province.objects.get(provinceId=provinceId)
            if provinceName != province.provinceName:
                hasProvince = Province.objects.filter(provinceName=provinceName)
                if hasProvince.exists():
                    return HttpResponse(3)   # 当前省份存在
            area.isShow = isShow
            area.areaName = areaName
            province.provinceName = provinceName
            area.save()
            province.save()
        return HttpResponse(1)
    except Exception as err:
        print err
        return HttpResponse(0)


