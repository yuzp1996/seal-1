# -*- coding: utf-8 -*-
# coding=utf-8
import json, uuid
from django.http import HttpResponse
from Seal.models import SealClass, ParentMeterialClass, Company, Fonts,SealClassCompany,SealFont,Format,SealClassFormat,Material


def getSeal_ParentMeterialClass(req):
    """
    获取父类列表
    :param req:
    :return:
    """
    PM = ParentMeterialClass.objects.all()
    if len(PM) == 0:
        return HttpResponse(0)
    a = []
    for obj in PM:
        PMlist = {"parentClassId": obj.parentClassId, "parentName": obj.parentName}
        a.append(PMlist)
    return HttpResponse(json.dumps(a))


def getSealClass(req):
    """
    获取商品类别列表
    :param req:
    :return:
    """
    sealclass1=SealClass.objects.all()
    num = len(sealclass1)   # 获取符合条件的信息数
    page = int(req.POST["page"])  # 当前页数
    nowPage = (page-1)*10  # 起始信息条数
    lastPage = nowPage+10  # 最终信息条数
    sealclass = SealClass.objects.order_by("-createTime")[nowPage:lastPage]
    if req.POST.has_key("sealParentClassId"):
        sealclass = SealClass.objects.filter(parentClassId=req.POST["sealParentClassId"])
    if len(sealclass) == 0:
        return HttpResponse(0)
    a = []
    for obj in sealclass:
        sealclasslist = {}
        parentclass = ParentMeterialClass.objects.get(parentClassId=obj.parentClassId_id)
        sealclasslist["sealclassname"] = obj.className
        sealclasslist["sealclassid"] = obj.sealClassId
        sealclasslist["sealclassparent"] = parentclass.parentName
        sealclasslist["isShow"] = obj.isShow
        sealclasslist["num"] = num
        if obj.isShow == 1:
            sealclasslist["isShow"] = "是"
        else:
            sealclasslist["isShow"] = "否"
        a.append(sealclasslist)
    return HttpResponse(json.dumps(a))


def deleteSealClass(req):
    """
    删除商品类别
    :param req:
    :return:
    """
    try:
        sealClassId=req.POST["sealClassId"]
        sealClass=Material.objects.filter(sealClassId_id=sealClassId)
        if len(sealClass)==0:
            SealClass.objects.get(sealClassId=sealClassId).delete()
            return HttpResponse(1)
        return HttpResponse(0)
    except Exception as err:
        print err


# 以下是添加商品类别****************************



def getEnterpriseType(req):
    """
    获取公司列表
    :param req:
    :return:
    """
    ET = Company.objects.all()
    if len(ET) == 0:
        return HttpResponse(0)
    a = []
    for obj in ET:
        ETlist = {"companyId": obj.companyId, "companyName": obj.companyName}
        if obj.isShow == 1:
            a.append(ETlist)
    return HttpResponse(json.dumps(a))


def getfont1(req):
    """
    获取所有字体,选择默认字体
    :param req:
    :return:
    """
    fonts = Fonts.objects.all()
    if len(fonts) == 0:
        return HttpResponse(0)
    a = []
    for obj in fonts:
        fontslist = {"fontname": obj.fontName, "fontid": obj.fontId, "isShow": obj.isShow}
        if obj.isShow == 1:
            a.append(fontslist)
    return HttpResponse(json.dumps(a))


def getfont2(req):
    """
    获取配置字体列表
    :param req:
    :return:
    """
    fonts = Fonts.objects.all()
    if len(fonts) == 0:
        return HttpResponse(0)
    a = []
    for obj in fonts:
        fontslist = {"fontname": obj.fontName, "fontid": obj.fontId, "isShow": obj.isShow}
        if obj.isShow == 1:
            a.append(fontslist)
    return HttpResponse(json.dumps(a))


def getFormatPicture(req):
    """
    获取版式信息数据
    :param req:
    :return:
    """
    formats = Format.objects.all()
    formats = formats.order_by("-createTime")
    if formats.exists():
        List = []
        for formatObj in formats:
            format = {}
            format["formatId"] = formatObj.formatId
            format["pictureUrl"] = formatObj.pictureUrl
            if formatObj.isShow == 1:
                List.append(format)
        return HttpResponse(json.dumps(List))
    else:
        return HttpResponse(0)



def addSealClass(req):
    """
    添加商品类别
    :param req:
    :return:
    """
    className = req.POST["classname"]
    sealParentClass =req.POST["parentclassclass"]
    str1 = req.POST["str1"]
    defaultFont = req.POST["defaultFont"]
    isconfigfont = req.POST["isconfigfont"]
    radioVal = req.POST["radioVal"]
    str2 = req.POST["str2"]
    str3 = req.POST["str3"]
    isformat = req.POST["isformat"]
    classid = uuid.uuid1()
    if radioVal == "1":
         radioVal = True
    else:
         radioVal = False
    if isconfigfont =="1":
        isconfigfont=True
    else:
        isconfigfont = False
    if isformat=="1":
        isformat=True
    else:
        isformat=False
    sealclass = SealClass.objects.filter(className=className)
    if sealclass.exists():
            return HttpResponse(2)#重复添加
    else:
        SealClass.objects.create(
            className=className,
            sealClassId=classid,
            parentClassId_id=sealParentClass,
            isfont=isconfigfont,
            isShow=radioVal,
            isformat=isformat
        )
    print defaultFont
    if defaultFont!="0":
        a=SealClass.objects.get(sealClassId=classid)
        a.fontId_id=defaultFont
        a.save()
    if sealParentClass=="2":
        print(1)
        arr1 = str1.split(',')
        del arr1[0]
        for i in arr1:
            SealClassCompany.objects.create(sealClassId_id=classid,companyId_id=i)
    if isconfigfont==1:
        arr2 = str2.split(',')
        del arr2[0]
        for i in arr2:
                SealFont.objects.create(sealClassId_id=classid,fontId_id=i)
    if isformat==1:
        arr3 = str3.split(',')
        del arr3[0]
        for i in arr3:
            SealClassFormat.objects.create(sealClassId_id=classid,formatId_id=i)
    return HttpResponse(1)


#以下是商品类型详情页


def getBasicData(req):
    """
    获取基本商品类型信息
    :param req:
    :return:
    """
    sealclass = SealClass.objects.filter(sealClassId=req.POST["sealClassId"])
    if len(sealclass) == 0:
        return HttpResponse(0)
    List = []
    for obj in sealclass:
        a = {}
        if obj.fontId is None:
            a["fontName"]=0
        else:
            a["fontName"] = obj.fontId.fontName          #第一种方法
        a["className"] = obj.className
        a["parentName"] =obj.parentClassId.parentName           #第二种方法
        a["fontId"] = obj.fontId_id
        a["isfont"]= obj.isfont
        a["isformat"] = obj.isformat
        a["isShow"] =obj.isShow
        List.append(a)
    return HttpResponse(json.dumps(List))


def getLeftCompany(req):
    """
    获取左边（选择）的企业
    :param req:
    :return:
    """
    leftcompany = SealClassCompany.objects.filter(sealClassId_id = req.POST["sealClassId"])
    if len(leftcompany)==0:
        return HttpResponse(0)
    List=[]
    num = 0
    try:
        for obj in leftcompany:
            num+=1
            a={}
            a["companyId"] = obj.companyId_id
            a["companyName"] = obj.companyId.companyName
            List.append(a)
    except Exception as err:
        print err
    return HttpResponse(json.dumps(List))


def getRightCompany(req):
    """
    获取右边（未选择）的企业
    :param req:
    :return:
    """
    rightcompany = SealClassCompany.objects.filter(sealClassId_id = req.POST["sealClassId"])
    List=[]
    a=[]
    for obj1 in rightcompany:
        a.append(obj1.companyId_id)
    company2=Company.objects.exclude(companyId__in=a)
    for obj2 in company2:
        b={}
        b["companyId"] = obj2.companyId
        b["companyName"] = obj2.companyName
        List.append(b)
    return HttpResponse(json.dumps(List))


def getLeftFont(req):
    """
    获取左边（选择）的字体
    :param req:
    :return:
    """
    leftfont = SealFont.objects.filter(sealClassId_id = req.POST["sealClassId"])
    if len(leftfont)==0:
        return HttpResponse(0)
    List=[]
    for obj in leftfont:
        a={}
        a["fontId"] = obj.fontId_id
        a["fontName"] = obj.fontId.fontName
        List.append(a)
    return HttpResponse(json.dumps(List))


def getRightFont(req):
    """
    获取右边（未选择）的企业
    :param req:
    :return:
    """
    rightfont = SealFont.objects.filter(sealClassId_id = req.POST["sealClassId"])
    List=[]
    a=[]
    for obj1 in rightfont:
        a.append(obj1.fontId_id)
    font2=Fonts.objects.exclude(fontId__in=a)
    for obj2 in font2:
        b={}
        b["fontId"] = obj2.fontId
        b["fontName"] = obj2.fontName
        List.append(b)
    return HttpResponse(json.dumps(List))


def getFormatPicture1(req):
    """
    获取已经选中的版式
    :param req:
    :return:
    """
    format = SealClassFormat.objects.filter(sealClassId_id=req.POST["sealClassId"])
    List=[]
    for obj in format:
        a={"formatId":obj.formatId_id}
        List.append(a)
    return HttpResponse(json.dumps(List))



def saveBasicData(req):
    """
    保存商品类型基本信息
    :param req:
    :return:
    """
    try:
        sealclass=SealClass.objects.get(sealClassId=req.POST["sealClassId"])
        sealClassName=req.POST["sealClassName"]
        choosefontid=req.POST["choosefontid"]
        fontShow=req.POST["fontShow"]
        formatShow=req.POST["formatShow"]
        isShow=req.POST["isShow"]
        if fontShow == "1":
            fontShow = True
        else:
            fontShow = False
        if formatShow =="1":
            formatShow=True
        else:
            formatShow = False
        if isShow=="1":
            isShow=True
        else:
            isShow=False
        sealclass2=SealClass.objects.exclude(sealClassId=req.POST["sealClassId"]).filter(className=sealClassName)
        if len(sealclass2)!=0:
            return HttpResponse(2)
        else:
            sealclass.className =sealClassName
            font=Fonts.objects.get(fontId=choosefontid)
            sealclass.fontId = font
            sealclass.isfont = fontShow
            sealclass.isShow = isShow
            sealclass.isformat = formatShow
            sealclass.save()
        return HttpResponse(1)
    except Exception as err:
        print err
        return HttpResponse(0)

def saveCompany(req):
    """
    保存企业
    :param req:
    :return:
    """
    sealClassId=req.POST["sealClassId"]
    SealClassCompany.objects.filter(sealClassId=sealClassId).delete()
    str1=req.POST["str1"]
    arr1=str1.split(",")
    del arr1[0]
    for i in arr1:
        SealClassCompany.objects.create(sealClassId_id=sealClassId,companyId_id=i)
    return HttpResponse(1)

def saveFont(req):
    """
    保存企业
    :param req:
    :return:
    """
    sealClassId=req.POST["sealClassId"]
    SealFont.objects.filter(sealClassId=sealClassId).delete()
    str2=req.POST["str2"]
    arr2=str2.split(",")
    del arr2[0]
    for i in arr2:
        SealFont.objects.create(sealClassId_id=sealClassId,fontId_id=i)
    return HttpResponse(1)


def saveFormat(req):
    """
    保存版式
    :param req:
    :return:
    """
    sealClassId=req.POST["sealClassId"]
    SealClassFormat.objects.filter(sealClassId=sealClassId).delete()
    str3=req.POST["str3"]
    arr3=str3.split(",")
    del arr3[0]
    for i in arr3:
        SealClassFormat.objects.create(sealClassId_id=sealClassId,formatId_id=i)
    return HttpResponse(1)





