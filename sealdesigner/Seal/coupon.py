
# -*- coding: utf-8 -*-
# coding=utf-8
import json
import uuid

from django.db import transaction
from django.http import HttpResponse
from Users.models import PricilegeType, Privilege



def getPage(req):
    """
    获取数据分页
    :param req:
    :return:
    """
    pricilegeType = PricilegeType.objects.all()
    num = len(pricilegeType)   # 获取符合条件的信息数
    page = int(req.POST["page"])  # 当前页数
    nowPage = (page-1)*10  # 起始信息条数
    lastPage = nowPage+10  # 最终信息条数
    pricilegeTypes = PricilegeType.objects.order_by("privilegeStart")[nowPage:lastPage]
    return HttpResponse(json.dumps(pricilegeTypes))

def savePrivilege (req):
    """
    保存添加的优惠劵
    :param req:
    :return:
    """
    try:
        with transaction.atomic():
            privilegeName = req.POST["privilegeName"]
            # PrivilegeName = PricilegeType.objects.filter(privilegeName=privilegeName)
            # 优惠劵不需要判断重复
            privilegePrice = req.POST["privilegePrice"]
            privilegeStart = req.POST["privilegeStart"]
            privilegePast = req.POST["privilegePast"]
            total = req.POST["total"]
            privilegeAll = req.POST["privilegeAll"]
            privilegeTypeId = uuid.uuid1()  # 给添加的优惠劵生成一个随机id
            pricilegeType = PricilegeType(privilegeTypeId=privilegeTypeId, total=total, privilegeName=privilegeName, privilegePrice=privilegePrice, privilegeAll=privilegeAll, privilegeStart=privilegeStart, privilegePast=privilegePast)
            pricilegeType.save()
            return HttpResponse(1)  # 保存成功
    except Exception as err:
        print err
        return HttpResponse(0)  # 保存失败，请重试

def privilegeDelete(req):
    """
    删除优惠劵
    :param req:
    :return:
    """
    try:
        with transaction.atomic():
            privilegeTypeId = req.POST["privilegeTypeId"]
            privilegeType = PricilegeType.objects.filter(privilegeTypeId=privilegeTypeId)
            if privilegeType.exists():
                privilegeType.delete()
                return HttpResponse(1)
    except Exception as err:
        print err
        return HttpResponse(0)  # 保存失败，请重试