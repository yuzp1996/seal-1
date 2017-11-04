
# -*- coding: utf-8 -*-
# coding=utf-8
import json
import uuid

from django.db import transaction
from django.http import HttpResponse
from models import Company, DataType

def companyList(req):
    """
    读取所有的企业类型
    :param req:
    :return:
    """
    company = Company.objects.all()         # 定义company变量来获取Companya中的所有对象
    List = []                               # 定义数组
    if company.exists():                   # exists()是一个判断变量company是否存在的方法
        for obj in company:                # 遍历company中的所有对象
            companyList = {}               # 定义companyList字典
            companyList["companyId"] = obj.companyId   # 打印企业类型表
            companyList["companyName"] = obj.companyName
            companyList["isShow"] = obj.isShow
            List.append(companyList)                          # 在List追加companyList的每一个值
        return HttpResponse(json.dumps(List))                  # 把List转化为json字符串
    else:
        return HttpResponse(0)


def datatypeList(req):
    """
    读取信息列表
    :param req:
    :return:
    """
    company = Company.objects.all()
    if req.POST.has_key("companyId"):  # 判断是否存在这个键
        company = company.filter(companyId=req.POST["companyId"])
    num = len(company)   # 获取符合条件的信息数
    page = int(req.POST["page"])  # 当前页数
    nowPage = (page-1)*10  # 起始信息条数
    lastPage = nowPage+10  # 最终信息条数
    company = company.order_by("-createTime")[nowPage:lastPage]
    List = []
    if company.exists():
        for companyObj in company:
            companyInfoList = {}  # 定义一个字典{}，[]为列表
            companyList = {}
            companyList["companyName"] = companyObj.companyName
            companyList["companyId"] = companyObj.companyId
            companyList["num"] = num
            if companyObj.isShow:
                companyList["isShow"] = "是"
            else:
                companyList["isShow"] = "否"
            companyInfoList["company"] = companyList  # 定义company键的值为companyList字典
            dataType = DataType.objects.filter(companyId_id=companyObj.companyId)
            if dataType.exists():
                i=0
                while i<len(dataType):
                    datatypeList = {}
                    datatypeList["dataName"] = dataType[i].dataName
                    dataTypeInfoList = "dataTypeInfoList"+str(i)
                    i = i +1
                    companyInfoList[dataTypeInfoList] = datatypeList
            List.append(companyInfoList)
        return HttpResponse(json.dumps(List))
    else:
        return HttpResponse(0)


def enterpriseInfoSave(req):
    """
    企业信息保存！
    :param req:
    :return:
    """
    enterpriseType = req.POST["enterpriseType"]
    enterprise = Company.objects.filter(companyName=enterpriseType)
    if req.POST["radioVal"]=="1":
        isShow = True
    else:
        isShow = False
    if enterprise.exists():
        return HttpResponse(2)
    companyId = uuid.uuid1()   # 生成36位随机数
    try:
        with transaction.atomic():  # 事务的使用，包含的内容一旦出错，则保存的信息全部撤回
            company = Company(companyId=companyId, companyName=enterpriseType, isShow=isShow)
            company.save()
            i = 0
            while i < len(req.POST)-2:
                enterpriseInfoNum = "enterprise"+str(i)
                enterpriseInfo = req.POST[enterpriseInfoNum]
                dataType = DataType(dataTypeId=uuid.uuid1(), companyId_id=companyId, dataName=enterpriseInfo)
                dataType.save()
                i=i+1
                print enterpriseInfo
            return HttpResponse(1)
    except Exception as err:
        print err
        return HttpResponse(0)


def dataTypeInfoOne(req):
    """
    查看一条企业类型
    :param req:
    :return:
    """
    company = Company.objects.get(companyId=req.POST["companyId"])
    List = []
    companyList = {}
    companyList["companyName"] = company.companyName
    companyList["companyId"] = company.companyId
    companyList["isShow"] = company.isShow
    List.append(companyList)
    datatypeList = DataType.objects.filter(companyId_id=company.companyId)
    for obj in datatypeList:
        dataTypeInfoList = {}
        dataTypeInfoList["dataTypeId"] = obj.dataTypeId
        dataTypeInfoList["dataName"] = obj.dataName
        List.append(dataTypeInfoList)
    print json.dumps(List)
    return HttpResponse(json.dumps(List))


def dataTypeOneDelete(req):
    """
    删除一条企业的附件信息！
    :param req:
    :return:
    """
    dataType = DataType.objects.filter(dataTypeId=req.POST["dataTypeId"])
    try:
        if dataType.exists():
            dataType.delete()
            return HttpResponse(1)
        else:
            return HttpResponse(2) # 附件信息不存在，刷新后操作！
    except Exception as err:
        return HttpResponse(0)  # 删除失败，请稍候重试！


def companyOneDelete(req):
    """
    删除企业类型！
    :param req:
    :return:
    """
    company = Company.objects.filter(companyId=req.POST["companyId"])
    try :
        with transaction.atomic():
            if company.exists():
                datatypeList = DataType.objects.filter(companyId_id=req.POST["companyId"])
                datatypeList.delete()  # 先删除属于该企业的附件信息
                company.delete() # 删除该企业类型！
                return HttpResponse(1)
            else:
                return HttpResponse(2) # 企业类型不存在，刷新后再操作
    except Exception as err:
        print err
        return HttpResponse(0)  # 删除失败，请重试

def getOneDataTypeId(req):
    """
    生成一条36位的Id
    """
    dataTypeId = uuid.uuid1()
    return HttpResponse(dataTypeId)


def changeCompanyInfo(req):
    """
    修改企业类型及信息！
    :param req:
    :return:
    """
    try:
        with transaction.atomic():
            companyName = req.POST["companyName"]
            companyId = req.POST["companyId"]

            companyNameHas = Company.objects.filter(companyName=companyName)
            if companyNameHas.exists():
                if (companyNameHas[0].companyId != companyId):
                    return HttpResponse(2) # 当前企业类型已存在
            company = Company.objects.get(companyId=companyId)
            company.companyName = companyName

            if req.POST["radioVal"]=="1":
                isShow = True
            else:
                isShow = False

            company.isShow = isShow
            company.save()

            i = 0
            postLength = (len(req.POST)-3)/2
            if (len(req.POST)-3)%2==0:
                postLength = postLength
            else:
                postLength = postLength+1
            print postLength
            while i < postLength:  # 请求的总长度除去 企业类型名称和id 的 和 是否启用的请求
                enterpriseInfoNum = "enterprise"+str(i)
                dataTypeId = "dataTypeId"+str(i)
                dataTypeName = req.POST[enterpriseInfoNum]
                dataTypeId = req.POST[dataTypeId]
                dataType = DataType.objects.filter(dataTypeId=dataTypeId)
                if dataType.exists():
                    dataType.update(dataName=dataTypeName)
                else:
                    dataType = DataType(dataTypeId=dataTypeId, dataName=dataTypeName, companyId_id=companyId)
                    dataType.save()
                i=i+1
            return HttpResponse(1)
    except Exception as err:
        print err
        return HttpResponse(0)  # 修改失败，请重试