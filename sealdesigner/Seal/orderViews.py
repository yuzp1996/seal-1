# -*- coding: utf-8 -*-
# coding=utf-8
import json
import time,datetime
from django.http import HttpResponse
from Seal.models import MaterialQuality,Format,Colors,Fonts,SealClass,Material,MaterialandQuality,Company,DataType,Statement,FormatInformation,SealClassFormat,PackagesType,Packages
from Users.models import Province, Area,User,Comments,Add,PricilegeType,Privilege
from ShoppingCart.models import Order,Trolley,Data,UploadData,Pay,Style,UserSummitInfo

def getLists(req):
    """
    获取订单
    :param req:
    :return:
    """
    List = []
    page = int(req.POST["page"])
    nowPage = (page-1)*15
    lastPage = nowPage+15
    orders = Order.objects.all().order_by('-orderDate')
    if req.POST.has_key("searchOrder"):
        searchOrder =req.POST["searchOrder"]
        orders = orders.filter(orderId=searchOrder)
        pageNum = len(orders)
        if pageNum==0:
            return HttpResponse(0)
    else:
        orderState = req.POST["orderState"]
        if req.POST.has_key("beginDate" and "lastDate"):
            if req.POST["beginDate"] and req.POST["lastDate"] is not None:
                beginDate = req.POST["beginDate"]
                beginDate = time.strptime(beginDate,"%Y-%m-%d")
                y, m, d = beginDate[0:3]
                beginDate=datetime.datetime(y, m, d)
                lastDate = req.POST["lastDate"]
                lastDate = time.strptime(lastDate,"%Y-%m-%d")
                y, m, d = lastDate[0:3]
                lastDate = datetime.datetime(y, m, d)
                if orderState!="12":
                    orders=orders.filter(orderState=orderState).filter(orderDate__range=[beginDate, lastDate])
                    pageNum = len(orders)
                    orders=orders.filter(orderState=orderState).filter(orderDate__range=[beginDate, lastDate])[nowPage:lastPage]
                else:
                    orders = orders.filter(orderDate__range=[beginDate, lastDate])
                    pageNum = len(orders)
                    orders = orders.filter(orderDate__range=[beginDate, lastDate])[nowPage:lastPage]
            else:
                if orderState=="12":
                    orders = orders[nowPage:lastPage]
                    pageNum = len(Order.objects.all())
                else:
                    orders = orders.filter(orderState=orderState)
                    pageNum =len(orders)
                    orders = orders.filter(orderState=orderState)[nowPage:lastPage]
        else:
            orders = orders[nowPage:lastPage]
            pageNum = len(Order.objects.all())
    for obj in orders:
        orderOne = {}
        orderOne["orderId"] = obj.orderId   # 账单编号
        if obj.isIvoice == 1:
            orderOne["isIvoice"] = "是"
        else :
            orderOne["isIvoice"] = "否"
        if obj.dateIsDeal==1:
            orderOne["dataIsDeal"]="是"
        else:
            orderOne["dataIsDeal"]="否"

        if obj.orderState==1:
            orderOne["orderState"]="待处理"
        elif obj.orderState==2:
            orderOne["orderState"]="审核中"
        elif obj.orderState==3:
            orderOne["orderState"]="交付制作"
        elif obj.orderState==4:
            orderOne["orderState"]="已发货"
        elif obj.orderState==5:
            orderOne["orderState"]="已收货"
        elif obj.orderState==6:
            orderOne["orderState"]="管理员取消订单"
        elif obj.orderState==-1:
            orderOne["orderState"]="打回修改"
        elif obj.orderState==0:
            orderOne["orderState"]="用户删除"
        elif obj.orderState==-2:
            orderOne["orderState"]="无效订单"
        elif obj.orderState==7:
            orderOne["orderState"]="用户取消订单"
        elif obj.orderState==8:
            orderOne["orderState"]="交易完成"
        elif obj.orderState==9:
            orderOne["orderState"]="等待退款"
        elif obj.orderState==10:
            orderOne["orderState"]="退款中"
        elif obj.orderState==11:
            orderOne["orderState"]="退款成功"
        orderOne["pageNum"] = pageNum
        orderOne["orderDate"] = str(obj.orderDate)
        orderOne["orderPrice"] = str(obj.payPrice)
        List.append(orderOne)
    return HttpResponse(json.dumps(List))

def getDetailmaterial(req):
    """
    获取订单中商品详情
    :param req:
    :return:
    """
    orderId=req.POST["orderId"]
    trolley=Trolley.objects.filter(orderId_id=orderId)

    if len(trolley)==0:
        return HttpResponse(0)
    List=[]
    for obj in trolley:
        detailOrder={}
        detailOrder["materialName"]= obj.materialId.materialName
        detailOrder["sealClassName"] = obj.materialId.sealClassId.className
        detailOrder["materialQualityName"] = MaterialandQuality.objects.get(materialId_id=obj.materialId).materialQualityId.materialQualityName
        detailOrder["materialPrice"] = str(obj.materialPrice)
        detailOrder["num"] = obj.number
        picture=obj.materialId.picture
        detailOrder["picture"] = picture
        detailOrder["parentClass"] = obj.materialId.sealClassId.parentClassId.parentClassId
        detailOrder["color"] = obj.colorId.colorName
        if obj.fontId is not None:
            detailOrder["font"] = obj.fontId.fontName
        else:
            detailOrder["font"] = '无'
        detailOrder["userId"] = obj.userId.userId
        if obj.userDataId is not None:
            detailOrder["userDataId"] = obj.userDataId.userDataId
        else:
            detailOrder["userDataId"] = '0'
        if obj.materialId.sealClassId.parentClassId.parentClassId == "3":
            detailOrder["content"] = "无"
        else:
            content = UserSummitInfo.objects.filter(trollerId_id=obj.trollerId)
            if content.exists():
                i=0
                contentList = {}  # 注意全局变量和局部变量的区别
                formatList = {}
                while i<len(content):
                    contentList[content[i].userSummitInfoId] =content[i].formatInformationId.informationName+":"+content[i].informationContent
                    # formatList[content[i].formatInformationId] =content[i].formatInformationId.informationName
                    i = i + 1
                # print contentList
                    # print formatList
                detailOrder["content"] = contentList  # 把商品名称封装成一条数据
        # print detailOrder["content"]
        List.append(detailOrder)
    return HttpResponse(json.dumps(List))


def getDetailPeople(req):
    """
    获取收货人详情
    :param req:
    :return:
    """
    orderId=req.POST["orderId"]
    trolley=Trolley.objects.filter(orderId_id=orderId)
    if len(trolley)==0:
        return HttpResponse(0)
    List=[]
    for obj in trolley:
        detailOrder={}
        detailOrder["addProvinceName"] = Order.objects.filter(orderId=obj.orderId_id)[0].addId.areaId.provinceId.provinceName
        detailOrder["addAreaName"] =Order.objects.filter(orderId=obj.orderId_id)[0].addId.areaId.areaName
        detailOrder["addInfor"] = Order.objects.filter(orderId=obj.orderId_id)[0].addId.addInfor
        detailOrder["addPeople"] = Order.objects.filter(orderId=obj.orderId_id)[0].addId.addPeople
        detailOrder["addPhone"] = Order.objects.filter(orderId=obj.orderId_id)[0].addId.addPhone
        List.append(detailOrder)
        break
    return HttpResponse(json.dumps(List))


def getDetailOrder(req):
    """
    获取订单信息
    :param req:
    :return:
    """
    orderId=req.POST["orderId"]
    order=Order.objects.filter(orderId=orderId)
    if len(order)==0:
        return HttpResponse(0)
    List=[]
    for obj in order:
        detailOrder={}
        detailOrder["createtime"] = str(obj.orderDate)
        detailOrder["changeDate"] = str(obj.changeDate)
        if obj.privilegeId is None:
            detailOrder["privilege"] = "无"
        else:detailOrder["privilege"] = str(obj.privilegeId.privilegeTypeId.privilegePrice)
        detailOrder["payPrice"] = str(obj.payPrice)
        detailOrder["pay"] = obj.payId.payName
        if obj.orderState!=0:
            detailOrder["orderState"] = obj.orderState
        else:
            detailOrder["orderState"] = obj.orderState
        if obj.isIvoice==0:
            detailOrder["isIvoice"] = "否"
        elif obj.isIvoice==1:
            detailOrder["isIvoice"] = "是"
            detailOrder["invoiceHead"] = obj.invoiceHead
            detailOrder["invoiceDetail"] = obj.invoiceDetail
        if obj.orderRemark  is not None:
            detailOrder["singleMemo"] = obj.orderRemark
        else:
            detailOrder["singleMemo"]="无"
        List.append(detailOrder)
    return HttpResponse(json.dumps(List))


def getLink(req):
    """
    下载所需用户上传资料
    :param req:
    :return:
    """
    link = UploadData.objects.filter(userDataId_id=req.POST["userDataId"])
    if link.count()==0:
        return HttpResponse(0)
    List=[]
    for obj in link:
        linkList={}
        linkList["userId"] = Order.objects.get(orderId=req.POST["orderId"]).userId.userId
        url=obj.upLoadUrl
        arr=url.split("/")
        last=arr[-1]
        linkList["link"] = last
        List.append(linkList)
    return HttpResponse(json.dumps(List))


def changeState(req):
    """
    修改订单状态
    :param req:
    :return:
    """
    orderId=req.POST["orderId"]
    orderState=req.POST["state"]
    now = time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time()))
    Order.objects.filter(orderId=orderId).update(orderState=orderState,changeDate=now)
    return HttpResponse(1)


def savemessage(req):
    """
    添加物流单号，管理员备注等
    :param req:
    :return:
    """


    if req.POST["logistics"] is not None:
        # order = Order.objects.filter(logistics=req.POST["logistics"])
        #
        # if len(order)>0:
        #     return HttpResponse(0)
        # else:
        Order.objects.filter(orderId=req.POST["orderId"]).update(logistics=req.POST["logistics"])
    if req.POST["express"] is not None:
        Order.objects.filter(orderId=req.POST["orderId"]).update(expressNum=req.POST["express"])
    if req.POST["responseMessage"] is not None:
        Order.objects.filter(orderId=req.POST["orderId"]).update(responseMessage=req.POST["responseMessage"])
    else:
        pass
    return HttpResponse(1)


def getresponse(req):
    """
    获取管理员备注
    :param req:
    :return:
    """
    order = Order.objects.filter(orderId=req.POST["orderId"])
    List=[]
    for obj in order:
        responseMessage={}
        responseMessage["responseMessage"] = obj.responseMessage
        List.append(responseMessage)
    return HttpResponse(json.dumps(List))

