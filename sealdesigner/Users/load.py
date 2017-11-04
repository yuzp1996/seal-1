# -*- coding: utf-8 -*-
# coding=utf-8
from django.shortcuts import render_to_response
import time, datetime
from models import User
from views import userskip,judgeuser
from ShoppingCart.models import Trolley, Order
from models import Privilege, PricilegeType


@judgeuser
@userskip
def userindex(req):
    """
    主页首页      ../templates/Seal/first/index.html     Users/infor/infor main.html
    """
    return render_to_response('Users/infor/infor myorder.html ')

@judgeuser
@userskip

@judgeuser
@userskip
def userDetails(req):
    """
    个人资料
    :param req:
    :return:
    """
    return render_to_response('Users/first/userDetails.html')



@judgeuser
@userskip
def receiptAddress(req):
    """
    收货地址管理
    :param req:
    :return:
    """
    return render_to_response('Users/first/receiptAddress.html')


@judgeuser
@userskip
def personalCenter(req):
    """
    个人中心
    :param req:
    :return:
    """
    trollers = []
    userId = req.COOKIES.get('userId')  # cookies获取数据
    troller = Trolley.objects.filter(userId_id=userId).filter(status=1).filter(isShow=1).order_by("-buyData")[:5]
    trollers.extend(troller)
    pricilegeTypes =[]
    privilege = Privilege.objects.filter(userId_id=userId).filter(isUsed=0)
    if privilege.exists():
        i = 0
        while i < len(privilege):
            pricilegeTypeList = {}   # 局部变量，不能放在循环外面，否则循环的时候，同一个键的值会被覆盖
            pricilegeTypeId = privilege[i].privilegeTypeId_id
            pricilegeType = PricilegeType.objects.get(privilegeTypeId=pricilegeTypeId)
            nowTime = datetime.datetime.now()
            if pricilegeType.privilegePast > nowTime and pricilegeType.isShow:    # 没有过期且isShow=1
                pricilegeTypeList["privilegePrice"] = str(int(pricilegeType.privilegePrice))
                pricilegeTypeList["privilegeAll"] = str(int(pricilegeType.privilegeAll))
                pricilegeTypeList["privilegeStart"] = pricilegeType.privilegeStart.strftime('%m/%d')
                pricilegeTypeList["privilegePast"] = pricilegeType.privilegePast.strftime('%m/%d')
                pricilegeTypeList["privilegeTypeId"] = pricilegeType.privilegeTypeId
                pricilegeTypes.append(pricilegeTypeList)
            i = i+1
    length = len(privilege)
    if length > 4:
        return render_to_response('Users/first/personalCenter.html', {"length": length, "trollers": trollers, "pricilegeType": pricilegeTypes})
    else:
        return render_to_response('Users/first/personalCenter.html', {"trollers": trollers, "pricilegeType": pricilegeTypes})


@judgeuser
@userskip
def trolley(req):
    """
    购物车
    :param req:
    :return:
    """
    return render_to_response('Users/first/trolley.html')

@judgeuser
@userskip
def _trolley(req):
    """
    购物车二级界面
    :param req:
    :return:
    """
    return render_to_response('Users/second/_trolley.html')

@judgeuser
@userskip
def myOrder(req):
    """
    用户订单
    :param req:
    :return:
    """
    if 'orderId' in req.GET:
        orderId=req.GET['orderId']
        # orderState=req.GET['orderState'] add it after 'orderId':orderId
        return render_to_response('Users/second/orderDetails.html', {'orderId':orderId})
    else:
        return render_to_response('Users/second/myOrder.html')

@judgeuser
@userskip
def orderEvaluate(req):
    """
    订单评价
    :param req:
    :return:
    """
    # if 'materialId' in req.GET:
    materialId=req.GET['materialId']
    trollerId=req.GET['trollerId']
    return render_to_response('Users/second/orderEvaluate.html',{'materialId':materialId,'trollerId':trollerId})


@judgeuser
@userskip
def contactservice(req):
    """
    用户和客服聊天
    :param req:
    :return:
    """
    return render_to_response('Users/contactservice.html')


