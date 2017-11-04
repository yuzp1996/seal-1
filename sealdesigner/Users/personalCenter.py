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
from ShoppingCart.models import Trolley, Order
from Seal.models import Material



def getOrders(req):
    """
    获取用户订单
    :param req:
    :return:
    """
    userId = req.COOKIES.get('userId', '')  # 从cookies获取用户id
    OrderList = Order.objects.filter(userId_id=userId).order_by("-orderDate")[:5]  # 不科学的userId
    List = []
    for orders in OrderList:
        userOrders = {}
        userOrders["payPrice"] = str(orders.payPrice)   # 把价钱转化为字符串格式
        orderState = orders.orderState    # 判断订单的状态
        if orderState == 0:             # 商品已删除，没有数据，直接过滤掉
            continue
        if orderState == -1:            # 状态是整数，引号内为字符串
            orderState = "返回修改"
        if orderState == 1:
            orderState = "等待接单"     # 状态唯一
        if orderState == 2:
            orderState = "资料审核"
        if orderState == 3:
            orderState = "交付制作"
        if orderState == 4:
            orderState = "待收货"
        if orderState == 5:
            orderState = "已收货"
        if orderState == 6:
            orderState = "管理员取消"
        if orderState == 7:
            continue        #用户取消的订单 不显示
        if orderState == 8:
            orderState = "交易完成"
        if orderState == 9:
            orderState = "请求退款"
        if orderState == 10:
            orderState = "退款中"
        if orderState == 11:
            orderState = "退款成功"
        if orderState == -2:
            orderState = "未完成在线支付"

        userOrders["orderState"] = orderState   # 订单状态
        userOrders["orderDate"] = orders.orderDate.strftime('%Y/%m/%d %H:%M:%S')  # 时间格式的转化
        userOrders["orderId"] = orders.orderId
        trolley = Trolley.objects.filter(orderId_id=orders.orderId)   # 连表查询
        # filter取出的值为列表（多个）；get只匹配一个，如果有多个符合条件，会进行覆盖式选择
        if trolley.exists():
            i=0
            materialList = {}  # 注意全局变量和局部变量的区别
            while i<len(trolley):
                material = Material.objects.get(materialId=trolley[i].materialId_id)  # filter循环取变量的方式
                materialList[material.materialId] = material.materialName
                i = i + 1
            userOrders["materialName"] = materialList  # 把商品名称封装成一条数据
        List.append(userOrders)
    return HttpResponse(json.dumps(List))







def getUserInfor(req):
    """
    获取用户信息
    :param req:
    :return:
    """
    user = User.objects.get(userId=req.POST["userId"])
    List = []
    userInformation = {}
    userInformation["userName"] = user.userName
    userInformation["userPhone"] = user.userPhone
    userInformation["userPic"] = user.userPic
    area = Area.objects.filter(areaId=user.areaId_id)   # 获取地区列表信息
    if area.exists():  # 判断地区是否存在
        areaName = area[0].areaName
        province = Province.objects.filter(provinceId=area[0].provinceId_id )
        provinceName = province[0].provinceName
    else:
        areaName = ""
        provinceName = ""
    userInformation["area"] = provinceName+ areaName
    List.append(userInformation)
    return HttpResponse(json.dumps(List))