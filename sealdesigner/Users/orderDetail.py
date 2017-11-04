# -*- coding: utf-8 -*-
# coding=utf-8
from django.http import HttpResponse
from ShoppingCart.models import Order,Trolley
from Seal.models import Material,SealClass,Colors,Fonts,ParentMeterialClass
import json




def lookOrder(req):
    """
    订单详情信息
    :param req:
    :return:
    """
    orderId=req.POST["orderId"]
    order=Order.objects.get(orderId=orderId)
    List=[]
    trolley=Trolley.objects.filter(orderId_id=orderId)
    # if trolley.exists():
    #     i=0
    #     materialList={}
    #     while i<len(trolley):
    #         material = Material.objects.get(materialId=trolley[i].materialId_id)
    #         materialList[material.materialId]=material.materialName
    #         i=i+1
    #     orderList["materialName"]=materialList
    #     j=0
    #     sealClassList={}
    #     while j<len(trolley):
    #         material = Material.objects.get(materialId=trolley[i].materialId_id)
    #         sealClass = SealClass.objects.get(sealClassId=material.sealClassId_id)
    #         sealClassList[sealClass.sealClassId]=sealClass.className
    #         j=j+1
    #     orderList["sealName"]=sealClassList
    for obj in trolley:
        orderList={}
        orderList["trolleyId"]=obj.trollerId
        material=Material.objects.get(materialId=obj.materialId_id)
        orderList["materialName"]=material.materialName
        orderList["picture"]=material.picture
        orderList["num"]=obj.number
        orderList["prince"]=str(obj.materialPrice)
        sealClass = SealClass.objects.get(sealClassId=material.sealClassId_id)
        parentName =(ParentMeterialClass.objects.get(parentClassId=sealClass.parentClassId_id)).parentName
        orderList["parentName"]=parentName
        orderList["sealName"]=sealClass.className
        colors=Colors.objects.get(colorId=obj.colorId_id)
        orderList["color"]=colors.colorName
        if obj.fontId is not None:
            orderList["font"]=obj.fontId.fontName
        else:
            orderList["font"]="无"
        orderList["totalPrince"]=str(order.payPrice)
        orderList["createTime"]=str(order.orderDate)
        orderList["changeTime"]=str(order.changeDate)
        orderList["orderState"]=order.orderState
        orderList["payName"]=order.payId.payName
        orderList["responseMessage"]=order.responseMessage
        orderList["orderRemark"]=order.orderRemark
        if order.privilegeId is None:
            orderList["privilege"]="无"
        else:
            orderList["privilege"] = str(order.privilegeId.privilegeTypeId.privilegePrice)
        List.append(orderList)
    return HttpResponse(json.dumps(List))

def orderDetailAddress(req):
    """
    收货地址
    :param req:
    :return:
    """
    orderId=req.POST["orderId"]
    order=Order.objects.get(orderId=orderId)
    List=[]
    addList={}
    addList["addId"]=order.addId_id
    addList["addPeople"]=order.addId.addPeople
    addList["provinceName"]=order.addId.areaId.provinceId.provinceName
    addList["areaName"]=order.addId.areaId.areaName
    addList["addInfor"]=order.addId.addInfor
    addList["addPhone"]=order.addId.addPhone
    List.append(addList)
    return HttpResponse(json.dumps(List))

def takeGoods(req):
    orderId=req.POST["orderId"]
    order=Order.objects.filter(orderId=orderId)
    order.update(
        orderState=5
    )
    return HttpResponse(1)