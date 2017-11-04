# -*- coding: utf-8 -*-
# coding=utf-8
import json, uuid
import os
from decimal import Decimal as D
from django.db import transaction
from django.http import HttpResponse
from django.shortcuts import render_to_response
from Seal.models import Material, SealClassFormat, Format, SealFont, SealColor, Colors, Fonts, SealClassCompany, Company, MaterialQuality, MaterialandQuality, FormatInformation, DataType, Statement
from ShoppingCart.models import Data, UploadData, Trolley, UserSummitInfo, Style
from Users.models import User
from sealdesigner.settings import MEDIA_ROOT


def getSealInfo(req):
    """
    获取商品一些相关信息
    :param req:
    :return:
    """
    try:
        sealId = req.POST["sealId"]
        seal = Material.objects.get(materialId=sealId)
        List = []
        sealInfo = {}

        sealInfoBase = {}  # 商品的基本信息
        sealInfoBase["sealpictureUrl"] = seal.picture  # 图片链接
        sealInfoBase["sealClassName"] = seal.sealClassId.className  # 类型
        sealInfoBase["sealParentClassName"] = seal.sealClassId.parentClassId.parentName  # 父类
        sealInfoBase["sealIntroduction"] = seal.materialIntroduction  # 简介
        sealInfoBase["sealcolorId"] = seal.colorId_id# 默认颜色ID
        sealInfoBase["sealcolorName"] = seal.colorId.colorName# 默认颜色名称
        materialQuality = MaterialandQuality.objects.filter(materialId_id=sealId)
        sealInfoBase["SealMaterialQuality"] = MaterialQuality.objects.get(materialQualityId=materialQuality[0].materialQualityId_id).materialQualityName  # 材质
        sealInfo["sealInfoBase"] = sealInfoBase

        usedFromat = SealClassFormat.objects.filter(sealClassId_id=seal.sealClassId_id)
        sealFormart = {}  # 商品的板式信息
        if usedFromat.exists():
            for obj in usedFromat:
                format = Format.objects.get(formatId=obj.formatId_id)
                if format.isShow==1:
                    sealFormart[format.formatId] = format.pictureUrl
            sealInfo["sealFormart"] = sealFormart
        sealColor = {}  # 商品颜色信息
        #sealColor[seal.colorId_id] = seal.colorId.colorName  # 默认颜色
        if seal.isColor==1:#如果颜色可配置
            usedClolr = SealColor.objects.filter(materialId_id=sealId)
            if usedClolr.exists():
                for obj in usedClolr:
                    color = Colors.objects.get(colorId=obj.colorId_id)
                    if color.isShow==1:
                        sealColor[color.colorId] = color.colorName
        sealInfo["color"] = sealColor

        sealFont = {}  # 字体配置信息
        sealFont[seal.sealClassId.fontId_id] = seal.sealClassId.fontId.fontName
        if seal.sealClassId.isfont==1:
            usedFont = SealFont.objects.filter(sealClassId_id=seal.sealClassId_id)
            if usedFont.exists():
                i=1
                for obj in usedFont:
                    font = Fonts.objects.get(fontId=obj.fontId_id)
                    if font.isShow == 1:
                        sealFont[font.fontId] = font.fontName
        sealInfo["font"] = sealFont
        List.append(sealInfo)
        return HttpResponse(json.dumps(List))
    except Exception as err:
        print err
        return HttpResponse(0)  # "<script type='text/javascript'>alert('系统出现异常，请重新选择！');javascript:history.go(-1);</script>"


def sealUsedCompany(req):
    """
    根据商品Id获取企业类型
    :param req:
    :return:
    """
    try:
        sealId = req.POST["sealId"]
        seal = Material.objects.get(materialId=sealId)
        List = []
        if seal.sealClassId.parentClassId_id == "2":
            sealClassCompanys =  SealClassCompany.objects.filter(sealClassId_id=seal.sealClassId_id)
            for sealClassCompany in sealClassCompanys:
                usedCompany = Company.objects.filter(companyId=sealClassCompany.companyId_id)
                sealCompany = {}  # 企业信息
                if usedCompany.exists():
                    for obj in usedCompany:
                        company = Company.objects.get(companyId=obj.companyId)
                        if company.isShow==1:
                            sealCompany[company.companyId] = company.companyName
                    List.append(sealCompany)
            return  HttpResponse(json.dumps(List))
        return HttpResponse(0)
    except Exception as err:
        print err
        return HttpResponse(0)


def getFormatInfor(req):
    """
    根据板式的id获取该条板式的配置信息
    :param req:
    :return:
    """
    format = Format.objects.get(formatId=req.POST["formatId"])
    List = []
    formatInformations = FormatInformation.objects.filter(formatId_id=format.formatId)
    for obj in formatInformations:
        formatInformationList = {}
        formatInformationList["formatInformationId"] = obj.formatinformationId
        formatInformationList["informationName"] = obj.informationName
        if obj.informationMemo!=None:
            formatInformationList["informationMemo"] = obj.informationMemo
        List.append(formatInformationList)
    return HttpResponse(json.dumps(List))


def getCompanyInfo(req):
    """
    查看一条企业类型
    :param req:
    :return:
    """
    company = Company.objects.get(companyId=req.POST["companyId"])
    List = []
    datatypeList = DataType.objects.filter(companyId_id=company.companyId)
    for obj in datatypeList:
        dataTypeInfoList = {}
        dataTypeInfoList["dataTypeId"] = obj.dataTypeId
        dataTypeInfoList["dataName"] = obj.dataName
        List.append(dataTypeInfoList)
    return HttpResponse(json.dumps(List))


def getStatementList(req):
    """
    刻章声明下拉列表
    :param req:
    :return:
    """
    statement = Statement.objects.all()
    List = []
    if statement.exists():
        for obj in statement:
            statementList = {}
            statementList["statementId"] = obj.statementId
            statementList["statementContent"] = obj.statementContent
            List.append(statementList)
        return HttpResponse(json.dumps(List))                  # 把List转化为json字符串
    else:
        return HttpResponse(0)


def getStatementInfo(req):
    """
    查看一条声明信息
    :param req:
    :return:
    """
    statement = Statement.objects.get(statementId=req.POST["statementId"])
    List = []
    datatypeList = DataType.objects.filter(statementId_id=statement.statementId)
    for obj in datatypeList:
        dataTypeInfoList = {}
        dataTypeInfoList["dataTypeId"] = obj.dataTypeId
        dataTypeInfoList["dataName"] = obj.dataName
        List.append(dataTypeInfoList)
    return HttpResponse(json.dumps(List))

def saveTrolley(req):
    """
    将商品加入购物车进行保存
    :param req:
    :return:
    """
    try:
        with transaction.atomic():
            trollerId = uuid.uuid1()
            userId = req.COOKIES.get('userId', '')  # 从cookies获取用户id
            fontId = req.POST["fontId"]  # 字体
            colorId = req.POST["colorId"]  # 颜色
            number = req.POST["number"]  # 数量
            materialId = req.POST["materialId"]  # 商品id
            materialPrice = Material.objects.get(materialId=materialId).materialPrice * D(number)
            trolley = Trolley(trollerId=trollerId, userId_id=userId, materialId_id=materialId,fontId_id=fontId, colorId_id=colorId, number=number, materialPrice=materialPrice,status=1)
            trolley.save()
            companyId = req.POST["companyId"]  # 公司企业
            if companyId !=0:  # 如果企业类型不为空，则为公章
                userDataId = req.POST["userDataId"]  # 资料id
                if userDataId == "":  # 创建新的资料库数据
                    userDataId = uuid.uuid1()
                    data = Data(userDataId=userDataId, userId_id=userId, companyId_id=companyId)
                    data.save()
                statementId = req.POST["statementId"]
                if statementId != 0:  # 判断声明是否存在，存在则需要保存
                    data = Data.objects.get(userDataId=userDataId)
                    data.statementId_id = statementId
                    data.save()
                trolley.userDataId_id = userDataId
                trolley.save()

            styleId = req.POST["styleId"]
            stylePic = req.POST["stylePic"]
            style = Style(styleId=styleId,stylePic=stylePic,trollerId_id=trollerId)  # 保存样式
            style.save()
            i = 0
            while 1:  # 保存配置信息
                formatInformationIndex = "information" + str(i)  # 拼接索引
                if req.POST.has_key(formatInformationIndex):
                    information = req.POST[formatInformationIndex]
                    informationList = information.split(",")  # 指定分隔符“,”对字符串进行切片
                    formatInformationId = informationList[0]  # 配置的板式信息id
                    informationContent = informationList[1]  # 用户填写的内容
                    userSummitInfoId = uuid.uuid1()
                    userSummitInfo = UserSummitInfo(userSummitInfoId=userSummitInfoId, trollerId_id=trollerId,
                                                       formatInformationId_id=formatInformationId, informationContent=informationContent)
                    userSummitInfo.save()
                    i = i + 1
                else:
                    break

            return HttpResponse(trollerId)
    except Exception as err:
        print err
        return HttpResponse(0)


def  uploadFile(req):
    """
    上传附件资料
    :param req:
    :return:
    """
    try:
        with transaction.atomic():
            userId = req.COOKIES.get('userId', '')  # 从cookies获取用户id
            companyId = req.POST["companyId"]
            if req.POST["userDataId"] == "":  # 创建新的资料库数据
                userDataId = uuid.uuid1()
                data = Data(userDataId=userDataId, userId_id=userId, companyId_id=companyId)
                data.save()
            else:
                userDataId = req.POST["userDataId"]
            statementId = req.POST["statementId"]
            if statementId==0:  # 判断声明是否存在，存在则需要保存
                statementId = statementId
                data = Data.objects.get(userDataId=userDataId)
                data.statementId_id = statementId
                data.save()

            file = req.FILES.get('file', None)  # 文件储存
            ################################################################################
            ###注意下面各种路径的写法
            ################################################################################
            folderPath = os.path.join(MEDIA_ROOT, userId)  # 以用户id命名的文件夹的路径
            folderPath = folderPath + "/"  # 将用户上传的文件放在该目录下！
            if os.path.exists(folderPath):  # 判断要储存文件的文件夹是否存在
                pass
            else:
                os.mkdir(folderPath)  # 创建文件夹
            fileType = file.name.split(".")[-1]
            fileName = str(uuid.uuid1()) + "." +fileType
            filePath = folderPath + fileName
            with open(filePath, 'wb+') as destination:  # 将文件上传的服务器
                for chunk in file.chunks():
                    destination.write(chunk)
                destination.close()
            dataTypeId = req.POST["dataTypeId"]
            uploadData = UploadData(userDataId_id=userDataId,dataTypeId_id=dataTypeId,upLoadUrl=filePath)
            uploadData.save()
            # returnFruit = "1,"+userDataId
            return HttpResponse(userDataId)
    except Exception as err:
        print err
        return HttpResponse(0)



