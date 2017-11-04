# -*- coding: utf-8 -*-
# coding=utf-8
from django.http import HttpResponse
from ShoppingCart.models import Order,Pay,Trolley
from Seal.models import Material,Colors
from Users.models import Comments
import json,uuid
from django.db import transaction



def getOrderList(req):
    """
    打印订单列表
    :param req:
    :return:
    """
    userId = req.COOKIES.get("userId","")
    if req.POST["orderState"] != "0":
        orders=Order.objects.filter(userId_id=userId,orderState=req.POST["orderState"]).order_by("-orderDate")
    else:
        orders=Order.objects.filter(userId_id=userId).exclude(orderState=0).exclude(orderState=7).exclude(orderState=6).order_by("-orderDate")
    if orders.exists():
        page = int(req.POST["page"])
        nowPage = (page-1)*5
        lastPage = nowPage+5
        Num = len(orders)
        order = orders[nowPage:lastPage]
        List=[]
        for obj in order:
            orderList={}
            orderList["orderId"]=obj.orderId
            orderList["pageNum"]=Num
            orderList["isPaid"]=obj.isPaid
            orderList["orderDate"]=obj.orderDate.strftime('%Y-%m-%d')
            orderList["orderState"]=obj.orderState
            orderList["payPrice"]=str(obj.payPrice)
            pay=Pay.objects.get(payId=obj.payId_id)
            orderList["payName"]=pay.payName
            trolley=Trolley.objects.filter(orderId_id=obj.orderId)
            if trolley.exists():
                i=0
                listOne=[]
                while i<len(trolley):
                    materialList={}
                    materialList["trollerId"]=trolley[i].trollerId
                    materialList["number"]=str(trolley[0].number)
                    material = Material.objects.get(materialId=trolley[i].materialId_id)
                    materialList["materialName"]=material.materialName
                    materialList["materialId"]=material.materialId
                    materialList["payPrice"]=str(material.materialPrice)
                    comment=Comments.objects.filter(materialId_id=material.materialId,userId_id=userId,trollerId=trolley[i].trollerId)
                    if comment.exists():
                        materialList["isComment"]=True
                    else:
                        materialList["isComment"]=False
                    materialList["picture"]=material.picture
                    colors=Colors.objects.get(colorId=trolley[i].colorId_id)
                    materialList["color"]=colors.colorName
                    if trolley[i].fontId is not None:
                        materialList["font"]=trolley[i].fontId.fontName
                    else:
                        materialList["font"]="无"
                    i=i+1
                    listOne.append(materialList)
                orderList["material"]=listOne
            List.append(orderList)
        return HttpResponse(json.dumps(List))
    else:
        return HttpResponse(0)


def deleteOrder(req):
    """
    假删除用户订单
    :param req:
    :return:
    """
    try:
        with transaction.atomic():
            userId=req.COOKIES.get("userId","")
            orderId=req.POST["orderId"]
            print orderId
            order=Order.objects.filter(userId_id=userId,orderId=orderId)
            order.update(orderState=0)
            return HttpResponse(1)
    except Exception as err:
        return HttpResponse(0)




def cancelOrder(req):
    """
    用户取消订单
    :param req:
    :return:
    """
    try:
        with transaction.atomic():
            userId=req.COOKIES.get("userId","")
            orderId=req.POST["orderId"]
            order=Order.objects.filter(userId_id=userId,orderId=orderId)
            for obj in order:
                pay=Pay.objects.get(payId=obj.payId_id)
            if (pay.payName==u'在线支付'):
                order.update(orderState=9)
            else:
                order.update(orderState=7)
            return HttpResponse(1)
    except Exception as err:
        print err
        return HttpResponse(0)


def getMaterialInformation(req):
    """
    获取所评价的商品信息
    :param req:
    :return:
    """
    materialId=req.POST["materialId"]
    trollerId=req.POST["trollerId"]
    userId=req.COOKIES.get("userId","")
    List=[]
    orderList={}
    material=Material.objects.get(materialId=materialId)
    orderList["materialId"]=materialId
    orderList["materialName"]=material.materialName
    orderList["picture"]=material.picture
    comment=Comments.objects.filter(materialId_id=materialId,userId_id=userId,trollerId=trollerId)
    if comment.exists():
        for obj in comment:
            orderList["commentContent"]=obj.commentContent
        orderList["isComment"]=True
    else:
        orderList["isComment"]=False
    List.append(orderList)
    return HttpResponse(json.dumps(List))

def addComment(req):
    """
    添加评论
    :param req:
    :return:
    """
    try:
        with transaction.atomic():
            userId=req.COOKIES.get("userId","")
            materialId=req.POST["materialId"]
            trollerId=req.POST["trollerId"]
            commentContent=req.POST["commentContent"]
            comment=Comments(
                commentId=uuid.uuid1(),
                materialId_id=materialId,
                userId_id=userId,
                trollerId=trollerId,
                commentContent=commentContent,
                isCheck=True,
                isShow=True,
            )
            comment.save()
            return HttpResponse(1)
    except Exception as err:
        return HttpResponse(0)