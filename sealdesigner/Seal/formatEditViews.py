# -*- coding: utf-8 -*-
# coding=utf-8
import json
import os
import uuid

from django.db import transaction
from django.http import HttpResponse
from PIL import Image
from models import Format, FormatInformation, SealClass, SealClassFormat
from ShoppingCart.models import UserSummitInfo

basePath=os.path.dirname(os.path.dirname(__file__))


def getFormatEditList(req):
    """
    获取版式信息数据
    :param req:
    :return:
    """
    formats = Format.objects.all()
    num = len(formats)
    page = int(req.POST["page"])  # 当前页数
    nowPage = (page - 1) * 10  # 起始信息条数
    lastPage = nowPage + 10  # 最终信息条数
    formats = formats.order_by("-createTime")[nowPage:lastPage]
    if formats.exists():
        List = []
        for formatObj in formats:
            formatList = {}
            format = {}
            format["formatId"] = formatObj.formatId
            format["pictureUrl"] = formatObj.pictureUrl
            if formatObj.isShow:
                format["isShow"] = "是"
            else:
                format["isShow"] = "否"
            format["num"] = num
            formatList["format"] = format # {"":"","":"",}
            formatInformations = FormatInformation.objects.filter(formatId_id=formatObj.formatId)
            if formatInformations.exists():
                i = 0
                format["formatInformationNum"] = len(formatInformations)
                formatList["format"] = format
                while i < len(formatInformations):
                    formatInformationList = {}
                    formatInformationList["informationName"] = formatInformations[i].informationName
                    formatInformationIndex = "information" + str(i)
                    i = i + 1
                    formatList[formatInformationIndex] = formatInformationList
            List.append(formatList)
        return HttpResponse(json.dumps(List))
    else:
        return HttpResponse(0)


def formatSave(req):
    """
    新添一条版式信息
    :param req:
    :return:
    """
    try:
        with transaction.atomic():  # 事务的使用，包含的内容一旦出错，则保存的信息全部撤回
            formatId = str(uuid.uuid1())
            formatPictureUrl = "webStatic/img/admin/formatPic/"+formatId+".jpg"
            formatPicturePath = os.path.join(basePath, formatPictureUrl)
            reqfile = req.FILES['formatPictureUrl']
            img = Image.open(reqfile)
            img.thumbnail((500, 500), Image.ANTIALIAS)  # 对图片进行等比缩放
            img.save(formatPicturePath, "png")  # 保存图片
            if req.POST["isShowRadio"] == "1":
                isShow = True
            else:
                isShow = False
            format = Format(formatId=formatId,pictureUrl="/"+formatPictureUrl,isShow=isShow)
            format.save()
            i = 0
            while 1:  # 减去的是版式图片和是否显示的请求
                formatInformationIndex = "informationList" + str(i)
                informationMemoIndex = "informationMemo" + str(i)
                if req.POST.has_key(formatInformationIndex):
                    informationName = req.POST[formatInformationIndex]
                    formatInformationId=uuid.uuid1()
                    if req.POST.has_key(informationMemoIndex):  # 判断是否有信息备注
                        informationMemo = req.POST[informationMemoIndex]
                        formatInformation = FormatInformation(formatinformationId=formatInformationId, formatId_id=formatId,informationName=informationName,informationMemo=informationMemo)
                    else:
                        formatInformation = FormatInformation(formatinformationId=formatInformationId, formatId_id=formatId, informationName=informationName)
                    formatInformation.save()
                    i = i + 1

                else:
                    break
            return HttpResponse(1)
    except Exception as err:
        print err
        return HttpResponse(0)


def formatInfoOne(req):
    """
    查看一种版式
    :param req:
    :return:
    """
    format = Format.objects.get(formatId=req.POST["formatId"])
    List = []
    formatList = {}
    formatList["formatPictureUrl"] = format.pictureUrl
    formatList["formatId"] = format.formatId
    formatList["isShow"] = format.isShow
    List.append(formatList)
    formatInformations = FormatInformation.objects.filter(formatId_id=format.formatId)
    for obj in formatInformations:
        formatInformationList = {}
        formatInformationList["formatInformationId"] = obj.formatinformationId
        formatInformationList["informationName"] = obj.informationName
        if obj.informationMemo!=None:
            formatInformationList["informationMemo"] = obj.informationMemo
        List.append(formatInformationList)
    return HttpResponse(json.dumps(List))


def getOneFormatInformationId(req):
    """
    生成一条36位的Id
    """
    formatInformationId = uuid.uuid1()
    return HttpResponse(formatInformationId)


def changeFormatInfo(req):
    """
    修改板式信息
    :param req:
    :return:
    """
    # format = Format.objects.filter(formatId=req.POST["formatId"])
    # if format.exists():
    #
    try:
        with transaction.atomic():
            reqfile = req.FILES.get('formatPictureUrl', False)
            formatId = req.POST["formatId"]
            if req.POST["isShowRadio"]=="1":
                isShow = True
            else:
                isShow = False
            if reqfile != False:  # 判断本次修改是否修改图片
                id = str(uuid.uuid1())
                formatPictureUrl = "webStatic/img/admin/formatPic/" + id + ".jpg"
                formatPicturePath = os.path.join(basePath, formatPictureUrl)
                # reqfile = req.FILES['formatPictureUrl']
                img = Image.open(reqfile)
                img.thumbnail((500, 500), Image.ANTIALIAS)  # 对图片进行等比缩放
                img.save(formatPicturePath, "png")  # 保存图片
                Format.objects.filter(formatId=formatId).update(pictureUrl="/" + formatPictureUrl,isShow=isShow)
            else:
                Format.objects.filter(formatId=formatId).update(isShow=isShow)
            i = 0  # 控制循环的变量
            while 1:
                formatInformationIndex = "informationAndMemo" + str(i)  # 拼接索引
                if req.POST.has_key(formatInformationIndex):
                    informationAndMemo = req.POST[formatInformationIndex]
                    informationAndMemoList = informationAndMemo.split(",")  # 指定分隔符“,”对字符串进行切片
                    formatInformationId = informationAndMemoList[0]
                    informationName = informationAndMemoList[1]
                    informationMemo = informationAndMemoList[2]
                    formatInformation = FormatInformation(formatinformationId=formatInformationId,formatId_id=formatId, informationName=informationName,informationMemo=informationMemo)
                    formatInformation.save()
                    i = i + 1
                else:
                    break
            return HttpResponse(1)
    except Exception as err:
        print err
        return HttpResponse(0)




def deleteFormat(req):
    """
    删除一个板式
    :param req:
    :return:
    """
    try:
        with transaction.atomic():
            formatId = req.POST["formatId"]
            formatIsUsed = SealClass.objects.filter(formatId_id=formatId)
            if formatIsUsed.exists():
                return HttpResponse(2)  # 该版式已经被使用
            formatIsUsed = SealClassFormat.objects.filter(formatId_id=formatId)
            if formatIsUsed.exists():
                return HttpResponse(2)  # 该版式已经被使用
            format = Format.objects.filter(formatId=formatId)
            formatInformation = FormatInformation.objects.filter(formatId_id=formatId)
            if formatInformation.exists():  # 判断这条板式的配置信息是否被使用
                for obj in formatInformation:
                    formatInformationId = obj.formatinformationId
                    userSummitInfo = UserSummitInfo.objects.filter(formatInformationId_id=formatInformationId)
                    if userSummitInfo.exists():
                        return HttpResponse(2)  # 该版式信息被使用
            format.delete()
            return HttpResponse(1)  # 删除成功
    except Exception as err:
        print err
        return HttpResponse(0)  # 删除失败


def deleteFormatInfomation(req):
    """
    删除板式的一条配置信息
    :param req:
    :return:
    """
    try:
        formatInformationId = req.POST["formatInformationId"]
        userSummitInfo = UserSummitInfo.objects.filter(formatInformationId_id=formatInformationId)
        if userSummitInfo.exists():
            return HttpResponse(2)  # 该版式信息被使用
        formatInformation = FormatInformation.objects.filter(formatinformationId=formatInformationId)
        formatInformation.delete()
        return HttpResponse(1)  # 删除成功
    except Exception as err:
        print err
        return HttpResponse(0)  # 删除失败
