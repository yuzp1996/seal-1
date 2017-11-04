# -*- coding: utf-8 -*-
# coding=utf-8
import json
import uuid
# from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
from django.http import HttpResponse
from models import MaterialQuality


def getMaterialList(req):
    """
    打印材质列表
    :param req:
    :return:
    """
    materials = MaterialQuality.objects.all()
    num = len(materials)   # 获取符合条件的信息数
    page = int(req.POST["page"])  # 当前页数
    nowPage = (page-1)*10  # 起始信息条数
    lastPage = nowPage+10  # 最终信息条数
    materials = materials.order_by("materialQualityId").order_by("-isShow")[nowPage:lastPage]  # 取出符合当前页数的十条信息
    if materials.exists():
        List = []
        for obj in materials:
            materialslist = {}
            materialslist["materialQualityId"] = obj.materialQualityId
            materialslist["materialQualityName"] = obj.materialQualityName
            materialslist["num"] = num
            if obj.isShow == 1:
                materialslist["isShow"] = "是"
            else:
                materialslist["isShow"] = "否"
            List.append(materialslist)
        return HttpResponse(json.dumps(List))
    else:
        return HttpResponse(0)

def getMaterial(req):
    """
    获取某一个材质信息
    :param req:
    :return:
    """
    materialQualityId = req.POST["materialQualityId"]
    material = MaterialQuality.objects.get(materialQualityId=materialQualityId)
    List  = []
    materialslist = {}
    materialslist["materialQualityId"] = material.materialQualityId           #把数据库相应字段赋给js传入的表格中的表头
    materialslist["materialQualityName"] = material.materialQualityName
    materialslist["isShow"] = material.isShow
    List.append(materialslist)
    return HttpResponse(json.dumps(List))

def addNewMaterial(req):
    """
    添加新的材质信息
    :param req:
    :return:
    """
    try:
        with transaction.atomic():
            materialQualityName = req.POST["materialName"]
            isShow = int(req.POST["radioVal"])
            material = MaterialQuality.objects.filter(materialQualityName=materialQualityName)
            if material.exists():  # 新添的材质也要加在下拉列表中
                return HttpResponse(0)       #新添的材质已存在
            else:  # 下拉列表中无相同材质名称则保存
                materialQualityId = uuid.uuid1()     #生成一个随机的材质Id
                mat = MaterialQuality(materialQualityId=materialQualityId,materialQualityName=materialQualityName,isShow=isShow)
                mat.save()
                return HttpResponse(1)       #保存新添材质名称
    except Exception as err:
        print err
        return HttpResponse(-1)

def deleteMaterial(req):
    """
    删除材质信息
    :param req:
    :return:
    """
    try:
        materialQualityId = req.POST['materialQualityId']
        d = MaterialQuality.objects.get(materialQualityId = materialQualityId)
        d.delete()
        return HttpResponse(1)
    except Exception as err:
        print err
        return HttpResponse(0)

def changeMaterial(req):
    """
    修改材质信息
    :param req:
    :return:
    """
    materialQualityId = req.POST["materialQualityId"]
    materialQualityName = req.POST["materialName"]
    if req.POST["radioVal"]=='1':       #修改是否启用的值
        isShow = True
    else:
        isShow = False
    material = MaterialQuality.objects.get(materialQualityId=materialQualityId)
    material.isShow = isShow
    try:
        hasmaterial=MaterialQuality.objects.filter(materialQualityName=materialQualityName, isShow=isShow)
        if hasmaterial.exists():             # 修改的材质已存在
            return HttpResponse(0)
        else:
            MaterialQuality.objects.filter(materialQualityId=materialQualityId).update(materialQualityName=materialQualityName, isShow=isShow)
            return HttpResponse(1)
    except Exception as err:
        print err
        return HttpResponse(-1)


