# -*- coding: utf-8 -*-
# coding=utf-8
import json
import uuid

from django.db import transaction
from django.http import HttpResponse
from models import DataType, Statement



# 非首次刻章声明
def statementList(req):
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



def statementDataTypeList(req):
    """
    读取二次刻章声明信息
    :param req:
    :return:
    """
    statement = Statement.objects.all()  # 取出声明表中所有信息
    if req.POST.has_key("statementId"):  # 判断是否为搜索
        statement = statement.filter(statementId=req.POST["statementId"])
    num = len(statement)   # 获取符合条件的信息数
    page = int(req.POST["page"])  # 当前页数
    nowPage = (page-1)*10  # 起始信息条数
    lastPage = nowPage+10  # 最终信息条数
    statement = statement.order_by("-createTime")[nowPage:lastPage]   # 排序
    List = []
    if statement.exists():
        for statementObj in statement:
            statementList = {}
            statementInfoList = {}
            statementList["statementId"] = statementObj.statementId
            statementList["isShow"] = statementObj.isShow
            statementList["statementName"] = statementObj.statementContent
            statementList["num"] = num
            if statementObj.isShow:
                statementList["isShow"] = "是"
            else:
                statementList["isShow"] = "否"
            statementInfoList["statement"] = statementList
            dataType = DataType.objects.filter(statementId_id=statementObj.statementId)  # 用外键查找所有附件
            if dataType.exists():
                i=0
                while i<len(dataType):
                    datatypeList = {}
                    datatypeList["dataName"] = dataType[i].dataName
                    dataTypeInfoList = "dataTypeInfoList"+str(i)
                    i = i +1
                    statementInfoList[dataTypeInfoList] = datatypeList
            List.append(statementInfoList)     # 对齐方式很重要！！！！！！！！！！！
        return HttpResponse(json.dumps(List))
    else:
        return HttpResponse(0)

# 触发遮罩窗体
def sealStatementInfoSave(req):
    """
    添加刻章信息保存！
    :param req:
    :return:
    """
    sealStatementInput = req.POST["sealStatementInput"]
    statementContent = Statement.objects.filter(statementContent=sealStatementInput)
    # isShow = bool(req.POST["radioVal"])
    if req.POST["radioVal"] == "1":
        isShow = True
    else:
        isShow = False
    if statementContent.exists():
        return HttpResponse(2)
    statementId = uuid.uuid1()   # 生成36位随机数
    try:
        with transaction.atomic():  # 事务的使用，包含的内容一旦出错，则保存的信息全部撤回
            statement = Statement(statementId = statementId, statementContent = sealStatementInput, isShow = isShow)
            statement.save()
            i = 0
            while i < len(req.POST)-2:   #附件长度
                dataNameNum = "dataName"+str(i)
                statementInfo = req.POST[dataNameNum]
                dataType = DataType(dataTypeId=uuid.uuid1(), statementId_id=statementId, dataName=statementInfo)
                dataType.save()
                i=i+1
            return HttpResponse(1)
    except Exception as err:
        return HttpResponse(0)

def getOneStatementId(req):
    """
    查看时给附件生成一条36位的Id
    """
    dataTypeId = uuid.uuid1()
    return HttpResponse(dataTypeId)

def statementOneDelete(req):
    """
    删除一条声明的附件信息！
    :param req:
    :return:
    """
    dataType = DataType.objects.filter(dataTypeId=req.POST["dataTypeId"])
    try:
        if dataType.exists():
            dataType.delete()
            return HttpResponse(1)
        else:
            return HttpResponse(2)  # 附件信息不存在，刷新后操作！
    except Exception as err:
        return HttpResponse(0)  # 删除失败，请稍候重试！

def sealStatementInfoOne(req):
    """
    查看一条声明信息
    :param req:
    :return:
    """
    statement = Statement.objects.get(statementId=req.POST["statementId"])
    List = []
    statementList = {}
    statementList["statementName"] = statement.statementContent
    statementList["statementId"] = statement.statementId
    statementList["isShow"] = statement.isShow
    List.append(statementList)
    datatypeList = DataType.objects.filter(statementId_id=statement.statementId)
    for obj in datatypeList:
        dataTypeInfoList = {}
        dataTypeInfoList["dataTypeId"] = obj.dataTypeId
        dataTypeInfoList["dataName"] = obj.dataName
        List.append(dataTypeInfoList)
    return HttpResponse(json.dumps(List))

def oneStatementDelete(req):
    """
    删除刻章声明
    :param req:
    :return:
    """
    statement = Statement.objects.filter(statementId=req.POST["statementId"])
    try:
        with transaction.atomic():
            if statement.exists():
                datatypeList = DataType.objects.filter(statementId_id=req.POST["statementId"])
                datatypeList.delete()  # 先删除属于该声明的附件信息
                statement.delete()  # 删除该刻章声明
                return HttpResponse(1)
            else:
                return HttpResponse(2)  # 刻章声明不存在，刷新后再操作
    except Exception as err:
        print err
        return HttpResponse(0)  # 删除失败，请重试

def changeStatementInfo(req):
    """
    保存修改的声明信息
    :param req:
    :return:
    """
    # try:
    #     with transaction.atomic():
    statementName = req.POST["statementName"]
    statementId = req.POST["statementId"]
    statementNameHas = Statement.objects.filter(statementContent=statementName)
    if statementNameHas.exists():
        if (statementNameHas[0].statementId != statementId):
            return HttpResponse(2)  # 当前刻章声明已存在
    statement = Statement.objects.get(statementId=statementId)
    statement.statementContent = statementName
    if req.POST["radioVal"] == "1":
        isShow = True
    else:
        isShow = False
    statement.isShow = isShow
    statement.save()

    i = 0
    postLength = (len(req.POST)-3)/2
    if (len(req.POST)-3)%2 == 0:
        postLength = postLength
    else:
        postLength = postLength+1
    while i < postLength:  # 请求的总长度除去 企业类型名称和id 的 和 是否启用的请求
        enterpriseInfoNum = "dataName"+str(i)
        dataTypeId = "dataTypeId"+str(i)
        dataTypeName = req.POST[enterpriseInfoNum]
        dataTypeId = req.POST[dataTypeId]
        dataType = DataType.objects.filter(dataTypeId=dataTypeId)
        if dataType.exists():
            dataType.update(dataName=dataTypeName)
        else:
            dataType = DataType(dataTypeId=dataTypeId, dataName=dataTypeName, statementId_id=statementId)
            dataType.save()
        i=i+1
    return HttpResponse(1)
    # except Exception as err:
    #     print err
    #     return HttpResponse(0)  # 删除失败，请重试
