# -*- coding: utf-8 -*-
# coding=utf-8
import json, uuid
import threading
import time
import datetime
from django.http import HttpResponse, HttpResponseRedirect
from Users.models import Add, User, Province, Area, Privilege
from ShoppingCart.models import Order, Trolley, Pay
from django.db import transaction




def userAddressList(request):
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

def submitOrder_AddressList(request):
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

threadLock = threading.Lock()  # 获得锁


def saveOrder(req):
    """
    生成流水单号，并保存订单
    :param req:
    :return:
    """
    threadLock.acquire()  # 加锁
    try:
        with transaction.atomic():
            userId = req.COOKIES.get("userId")
            addId = req.POST["addId"]  # 收获地址Id
            payId = req.POST["payId"]  # 支付方式
            payPrice = req.POST["payPrice"]  # 用户实际支付的价钱

            ##########################################################
            ###生成流水单号
            ##########################################################
            newOrderTime = datetime.datetime.now().strftime('%Y%m%d')  # 订单时间，年月日
            orderPrefix = 'YZ'  # 订单前缀
            orders = Order.objects.all().order_by('-id')  # 可以将id改为创建的时间，以时间排序
            if orders.exists():
                oldOrderNO = orders[0].orderId  # 取出最近的订单编号
                oldorderMantissa = int(oldOrderNO[-5:])  # 最近订单最后五位流水号
                # orderPrefix = str(oldOrderNum)[0:2]  # 订单前缀
                newOrderMantissa = str(oldorderMantissa + 1).zfill(5)  # 不足五位补起
                newOrderNo = orderPrefix + newOrderTime + newOrderMantissa  # 生成的订单编号例如 YZ2016062300012
            else:
                newOrderNo = orderPrefix + newOrderTime + '00001'  # 第一个订单
            #########流水单号结束
            order = Order(orderId=newOrderNo,userId_id=userId, addId_id=addId, orderState="1", payId_id=payId,isIvoice=0,payPrice=payPrice)
            order.save()
            if req.POST["isInvoice"]=="1":
                invoiceHead = req.POST["invoiceHead"]
                invoiceDetail = req.POST["isInvoiceDetails"]
                order.isIvoice = 1
                order.invoiceHead = invoiceHead
                order.invoiceDetail = invoiceDetail
            if req.POST.has_key("privilegeId"):
                privilegeId = req.POST["privilegeId"]
                order.privilegeId_id = privilegeId
                privilege = Privilege.objects.filter(privilegeId=privilegeId)
                privilege.update(isUsed=True)  # 该张优惠券设置为已使用！
            if req.POST["orderRemark"]!="":
                order.orderRemark = req.POST["orderRemark"]  # 用户备注
            order.save()
            trollerId = req.POST["trollerId"]
            trollerIdArray = trollerId.split("!")
            for trollerOneId in trollerIdArray:
                troller = Trolley.objects.get(trollerId=trollerOneId)
                troller.status = 2  # 已下单购买
                troller.orderId_id = newOrderNo  # 将订单id插入该次购买的购物车中
                troller.save()
            result = 1
    except Exception as err:
        print err
        result = 0
    finally:
        threadLock.release()  # 解除锁
        return HttpResponse(result)

def getPayStyle(req):
    """
    获取付款方式
    :param req:
    :return:
    """
    pay = Pay.objects.all()
    List = []
    for obj in pay:
        if obj.isShow:
            payList = {}
            payList["payId"] = obj.payId
            payList["payName"] = obj.payName
            List.append(payList)
    return HttpResponse(json.dumps(List))



