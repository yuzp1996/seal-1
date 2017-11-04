# -*- coding: utf-8 -*-
# coding=utf-8
from django.http import HttpResponse,HttpResponseRedirect
from models import Add,User,Province,Area
from django.db import transaction
import  json,uuid

def optionProvince(request):
    """
    收货地址：获取下拉列表省份值
    :param request:
    :return:
    """
    province=Province.objects.all()
    if province.exists():
        List=[]
        for obj in province:
            provinceList={}
            if(obj.isShow):
                provinceList["provinceName"]=obj.provinceName
                provinceList["provinceId"]=obj.provinceId
            List.append(provinceList)
        return HttpResponse(json.dumps(List))
    else:
        return HttpResponse(0)

def optionArea(request):
    """
     获取地区下拉列表值
    :param request:
    :return:
    """
    List=[]
    area=Area.objects.filter(provinceId_id=request.POST["provinceId"])
    if area.exists():
        for obj in area:
            areaList={}
            areaList["areaName"]=obj.areaName
            areaList["areaId"]=obj.areaId
            List.append(areaList)
        return HttpResponse(json.dumps(List))
    else:
        return HttpResponse(0)


def shopAddresssub(request):
    """
    添加收货地址
    :param request:
    :return:
    """
    try:
        with transaction.atomic():
            userId = request.COOKIES.get('userId','')
            areaId = request.POST.get('areaId')
            addPeople = request.POST.get('addPeople')
            addInfor = request.POST.get('addInfor')
            addPhone = request.POST.get('addPhone')
            isDefault = request.POST.get('isDefault')
            add=Add.objects.filter(
                areaId_id=areaId,
                addPeople=addPeople,
                addInfor=addInfor,
                addPhone=addPhone,
                isShow=True
            )
            if add.exists():
                return HttpResponse(2)
            if isDefault=="1":
                isDefault=True
                add=Add.objects.filter(isDefault=True)
                if add.exists():
                     add.update(isDefault=False)
            else:
                isDefault=False
            add = Add(
                addId=uuid.uuid1(),
                userId_id=userId,
                areaId_id=areaId,
                addPeople=addPeople,
                addInfor=addInfor,
                addPhone=addPhone,
                isDefault=isDefault,
                isShow=True,
            )
            add.save()
            return  HttpResponse(1)
    except Exception as err:
        return HttpResponse(0)


def getAddressList(request):
    """
    打印收货地址表
    :param request:
    :return:
    """
    List = []
    userId=request.COOKIES.get("userId","")
    adds = Add.objects.filter(userId_id=userId,isShow=True).order_by("-isDefault")
    for obj in adds:
        addressList = {}
        addressList["addId"] = obj.addId
        addressList["addPeople"] = obj.addPeople
        province = Province.objects.get(provinceId=obj.areaId.provinceId_id)
        addressList["provinceName"] = province.provinceName
        area = Area.objects.get(areaId=obj.areaId_id)
        addressList["areaName"] = area.areaName
        addressList["addInfor"] = obj.addInfor
        addressList["addPhone"] = obj.addPhone
        addressList["isDefault"] = obj.isDefault
        List.append(addressList)
    return HttpResponse(json.dumps(List))


def getAddress(requset):
    """
    获取某一个地址的信息
    :param requset:
    :return:
    """
    addId=requset.POST["addId"]
    add=Add.objects.get(addId=addId)
    List=[]
    addressList={}
    addressList["provinceId"]=add.areaId.provinceId_id
    addressList["areaId"]=add.areaId_id
    addressList["addInfor"]=add.addInfor
    addressList["addPeople"]=add.addPeople
    addressList["addPhone"]=add.addPhone
    addressList["isDefault"]=add.isDefault
    List.append(addressList)
    return HttpResponse(json.dumps(List))


def changeAddress(requset):
    """
    保存修改的地址
    :param requset:
    :return:
    """
    try:
        with transaction.atomic():
            addId = requset.POST["addId"]
            areaId = requset.POST["areaId"]
            addPeople = requset.POST["addPeople"]
            addInfor = requset.POST["addInfor"]
            addPhone = requset.POST["addPhone"]
            isDefault = requset.POST["isDefault"]
            if isDefault=="1":
                isDefault=True
                add=Add.objects.filter(isDefault=True)
                if add.exists():
                    add.update(isDefault=False)
            else:
                isDefault=False
            add=Add.objects.filter(addId=addId)
            add.update(
                areaId_id=areaId,
                addInfor=addInfor,
                addPeople=addPeople,
                addPhone=addPhone,
                isDefault=isDefault,
            )
            return HttpResponse(1)
    except Exception as err:
        return HttpResponse(0)



def deleteAddress(request):
    """
    把用户想要删除的收货地址的启用项 设为 不启用
    :param request:
    :return:
    """
    try:
        with transaction.atomic():
            addId = request.POST["addId"]
            add = Add.objects.filter(addId=addId)
            add.update(isShow=False)
            return HttpResponse(1)
    except Exception as err:
        return HttpResponse(0)











