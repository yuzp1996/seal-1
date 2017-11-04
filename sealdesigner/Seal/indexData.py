# -*- coding: utf-8 -*-
# coding=utf-8
import json

from django.db import transaction
from django.http import HttpResponse
from Users.models import User, Province, Area, Add
from models import Administrator
from Seal.models import IndexPicture
from ShoppingCart.models import Trolley, Order
from Seal.models import Material, SealClass


def _indexGetOrders(req):
    """
    获取用户订单
    :param req:
    :return:
    """
    userId = req.POST['userId']
    OrderList = Order.objects.filter(userId_id=userId)
    List = []
    for orders in OrderList:
        userOrders = {}
        userOrders["orderDate"] = orders.orderDate.strftime('%Y/%m/%d %H:%M:%S')  # 时间格式的转化
        orderState = orders.orderState    # 判断订单的状态
        if orderState == 0:             # 商品已被用户删除
            orderState = "用户删除"
        if orderState == -1:            # 状态是整数，引号内为字符串
            orderState = "打回修改"
        if orderState == 1:
            orderState = "未处理"     # 状态唯一
        if orderState == 2:
            orderState = "审核中"
        if orderState == 3:
            orderState = "交付制作"
        if orderState == 4:
            orderState = "已发货"
        if orderState == 5:
            orderState = "已收货"
        if orderState == 6:
            orderState = "取消订单"
        if orderState == 7:
            orderState = "用户取消"
        if orderState == 8:
            orderState = "交易完成"
        if orderState == 9:
            orderState = "等待退款"
        if orderState == 10:
            orderState = "同意退款"
        if orderState == 11:
            orderState = "退款成功"
        userOrders["orderState"] = orderState   # 订单状态
        userOrders["payPrice"] = str(orders.payPrice)   # 把价钱转化为字符串格式
        userOrders["orderId"] = orders.orderId
        isPaid = orders.isPaid
        if isPaid == 0:
            isPaid = "未付款"
        if isPaid == 1:
            isPaid = "已付款"
        userOrders["isPaid"] = isPaid  # 是否付款
        trolley = Trolley.objects.filter(orderId_id=orders.orderId)   # 连表查询
        # filter取出的值为列表（多个）；get只匹配一个，如果有多个符合条件，会进行覆盖式选择
        if trolley.exists():
            i=0
            materialList = {}  # 注意全局变量和局部变量的区别
            while i<len(trolley):
                material = Material.objects.get(materialId=trolley[i].materialId_id)  # filter循环取变量的方式
                sealClass = SealClass.objects.get(sealClassId=material.sealClassId_id)  # 查询商品类型
                materialList[sealClass.sealClassId] = sealClass.className
                i = i + 1
            userOrders["className"] = materialList  # 把商品名称封装成一条数据
        List.append(userOrders)
    return HttpResponse(json.dumps(List))


def getAdminName(req):
    """
    通过cookie中管理员id 获取管理员的帐号
    :param req:
    :return:
    """
    adminId=req.COOKIES.get('SealadminID','')
    provinceList = {}
    adminAccount = Administrator.objects.get(adminId=adminId)
    provinceList["adminAccount"] = adminAccount.adminAccount
    return HttpResponse(provinceList["adminAccount"])


def selectProvince(req):
    """
    基础数据首页获取省份选项所有值
    :param req:
    :return:
    """
    province = Province.objects.all()
    if province.exists():
        List = []
        for obj in province:
            provinceList = {}
            if (obj.isShow):
                provinceList["provinceName"] = obj.provinceName
                provinceList["provinceId"] = obj.provinceId
            List.append(provinceList)
        return HttpResponse(json.dumps(List))
    else:
        return HttpResponse(0)


def selectArea(req):
    """
    获取下拉列表地区的所有值
    :param req:
    :return:
    """
    List = []
    area =Area.objects.filter(provinceId_id=req.POST["provinceId"])
    if area.exists():
        for obj in area:
            areaList = {}
            areaList["areaId"] = obj.areaId
            areaList["areaName"] = obj.areaName
            List.append(areaList)
        return HttpResponse(json.dumps(List))
    else:
        return HttpResponse(0)


def picinfo(req):
    """
    首页与轮显背景图片信息
    :param req:
    :return:
    """
    try:
        List = []
        picinfo = IndexPicture.objects.all()
        if picinfo.exists():
            for obj in picinfo:
                pictureinfor = {}
                pictureinfor["picId"] = obj.picId
                pictureinfor["picUrl"] = obj.picUrl
                pictureinfor["picName"] = obj.picName
                pictureinfor["linkUrl"] = obj.linkUrl
                pictureinfor["picPlace"] = obj.picPlace
                pictureinfor["createTime"] = obj.createTime.strftime('%Y/%m/%d %H:%M:%S')
                pictureinfor["adminId_id"] = obj.adminId_id
                List.append(pictureinfor)
                return HttpResponse(json.dumps(List))
        else:
                return HttpResponse(0)
    except Exception as err:
        print err





def orderBy(req):
    """
    按照不同方式排序，并取出十条数据
    :param req:
    :return:
    """

    users = User.objects.all()
    page = int(req.POST["page"])
    nowPage = (page-1)*10
    lastPage = nowPage+10
    if req.POST.has_key("userName"):
        users = users.filter(userName=req.POST["userName"])
    if req.POST.has_key("areaId"):
        users = users.filter(areaId=req.POST["areaId"])
    pageNum = len(users)
    byCondition = req.POST["orderByCondition"]
    users = users.order_by(byCondition)[nowPage:lastPage]
    if users.exists():
        List = []
        for obj in users:
            word = {}
            word["userId"] = obj.userId
            word["name"] = obj.userName
            area=Area.objects.filter(areaId=obj.areaId_id)  # 获取用户所在的地区
            if area.exists():
                province = Province.objects.get(provinceId=area[0].provinceId_id)  # 获取所在地区的省份
                word["city"] = province.provinceName + area[0].areaName
            else:
                word["city"] = "暂无地区信息"
            word["registerTime"] = obj.registerTime.strftime('%Y/%m/%d %H:%M:%S')
            word["lastTime"] = obj.loginTime.strftime('%Y/%m/%d %H:%M:%S')
            if obj.isShow == 1:
                word["isShow"] = str("否")
            else:
                word["isShow"] = str("是")
            word["pageNum"] = pageNum
            List.append(word)
        return HttpResponse(json.dumps(List))
    else:
        return HttpResponse(0)


def lookUser(req):
    """
    查看当前用户的详细信息
    :param req:
    :return:
    """
    try:
        user = User.objects.get(userId=req.POST["userId"])
        userAdd = Add.objects.filter(userId=user.userId).order_by("-isDefault")
        userInfo = []
        userItem = {}
        userItem["userId"] = user.userId
        userItem["name"] = user.userName
        area=Area.objects.filter(areaId=user.areaId_id)  # 获取用户所在的地区
        if area.exists():
            province = Province.objects.get(provinceId=area[0].provinceId_id)  # 获取所在地区的省份
            userItem["city"] = province.provinceName + area[0].areaName
        else:
            userItem["city"] = "暂无地区信息"
        userItem["registerTime"] = user.registerTime.strftime('%Y/%m/%d %H:%M:%S')
        userItem["lastTime"] = user.loginTime.strftime('%Y/%m/%d %H:%M:%S')
        userItem["isShow"] = user.isShow
        userItem["userPhone"] = user.userPhone
        userItem["userPwd"] = user.userPwd
        userItem["userPic"] = user.userPic
        userItem["remark"] = user.remark
        userItem["userEmail"] = user.userEmail
        userInfo.append(userItem)

        if userAdd.exists():
            for add in userAdd:
                userAddItem = {}
                userAddItem["userAddId"] = add.addId
                userAddItem["userAddPeople"] = add.addPeople
                area=Area.objects.get(areaId=add.areaId_id)  # 获取用户所在的地区
                province = Province.objects.get(provinceId=area.provinceId_id)  # 获取所在地区的省份
                userAddItem["userAddInfor"] = province.provinceName + area.areaName+add.addInfor
                userAddItem["userAddPhone"] = add.addPhone
                userAddItem["userAddDefault"] = str(add.isDefault)
                userAddItem["userAddShow"] = str(add.isShow)
                userInfo.append(userAddItem)
        return HttpResponse(json.dumps(userInfo))
    except Exception as err:
        return HttpResponse(0)


def userInfoSave(req):
    try:
        with transaction.atomic():  # 事务的使用
            user = User.objects.filter(userId=req.POST["userId"])
            isShow = req.POST["isShow"]
            if isShow=="1":
                isShow = True
            else:
                isShow = False
            user.update(isShow=isShow, remark=req.POST["remark"])
            # user.update(userPwd=req.POST["userPwd"],isShow=isShow, remark=req.POST["remark"])
            return HttpResponse(1)
    except Exception as err:
        print err
        return HttpResponse(0)
