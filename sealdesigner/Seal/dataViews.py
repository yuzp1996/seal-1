
# -*- coding: utf-8 -*-
# coding=utf-8
import json
import os,base64
from PIL import Image
from django.shortcuts import render_to_response
from django.db import transaction
from django.http import HttpResponse,request
from django.views.decorators.csrf import csrf_exempt
from models import Material,Administrator,ParentMeterialClass,SealClass,MaterialQuality,MaterialandQuality,Colors,SealColor
from ShoppingCart.models import Trolley
from Users.models import Comments

import time,uuid,urllib2
basePath = os.path.dirname(os.path.dirname(__file__))

@csrf_exempt
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


@csrf_exempt
def getChapter(req):
    """
    获取章材类别
    :param req:
    :return:
    """
    PMC = ParentMeterialClass.objects.all()
    if PMC.exists():
        List = []
        for obj in PMC:
            word = {}
            word["id"] = obj.parentClassId
            word["name"]=obj.parentName
            word["is"]=obj.isShow
            List.append(word)
        return  HttpResponse(json.dumps(List))
    else:
        return HttpResponse(0)


@csrf_exempt
def getColor(req):
    """
    获得商品颜色
    :param req:
    :return:
    """

    colors=Colors.objects.all()
    if colors.exists():
        List=[]
        for obj in colors:
            word={}
            word['id'] = obj.colorId
            word['name'] = obj.colorName
            word['createTime'] = obj.createTime.strftime('%Y/%m/%d %H:%M:%S')
            word['isShow'] = obj.isShow
            List.append(word)
        return HttpResponse(json.dumps(List))
    else:
        return HttpResponse(0)



@csrf_exempt
def getCommodity(req):
    """
    获取商品类别

    :param req:
    :return:
    """
    SC = SealClass.objects.all()
    if SC.exists():
        List = []
        for obj in SC:
            word = {}
            word['father'] = obj.parentClassId.parentName
            word["id"] = obj.sealClassId
            word["name"]=obj.className
            word["is"]=obj.isShow
            List.append(word)
        return HttpResponse(json.dumps(List))
    else:
        return HttpResponse(0)

@csrf_exempt
def getCommodityOne(req):
    """
    获取商品类别

    :param req:
    :return:
    """
    SC = SealClass.objects.filter(parentClassId=req.POST['commChapter'])
    if SC.exists():
        List = []
        for obj in SC:
            word = {}
            word['father'] = obj.parentClassId.parentName
            word["id"] = obj.sealClassId
            word["name"]=obj.className
            word["is"]=obj.isShow
            List.append(word)
        return HttpResponse(json.dumps(List))
    else:
        return HttpResponse(0)


@csrf_exempt
def getMaterials(req):
    """
       获取材质
    :param req:
    :return:
    """
    MQ = MaterialQuality.objects.all()
    try:
        if MQ.exists():
            List = []
            for obj in MQ:
                word = {}
                word["id"] = obj.materialQualityId
                word["name"]=obj.materialQualityName
                word["is"]=obj.isShow
                List.append(word)
            return HttpResponse(json.dumps(List))
        else:
            return HttpResponse(0)

    except Exception as err:
        print(err)
    return HttpResponse(0)


@csrf_exempt
def commodityAdd(req):
    """
    添加商品
    :param req:
    :return:
    """
    try:
        with transaction.atomic():
            print "start"
            ret1=0
            materName = Material.objects.filter(materialName=req.POST['commName'])
            if materName.exists():
                ret1=11
            else:
                ret=str(uuid.uuid1())
                rollPictureName="webStatic/img/admin/materialPic/"+ret+".jpg"
                rollPicturePath=os.path.join(basePath,rollPictureName)
                reqFile = req.FILES['choFile']
                img = Image.open(reqFile)
                img.thumbnail((500,500),Image.ANTIALIAS)#对图片进行等比缩放
                img.save(rollPicturePath,"png")#保存图片
                id = uuid.uuid1()#商品id
                number=len(req.POST['colorAdd'].replace(',',''))#可配置颜色处理开始
                number1=number/36
                number2=1
                list=[]
                Fruit={}
                start=0
                end=start+36
                while(number2<=number1):
                    string=req.POST['colorAdd'].replace(',','')[start:end]
                    Fruit[number2]=string
                    number2=number2+1
                    start=end
                    end=start+36
                list.append(Fruit)#可配置颜色处理结束
                name = req.POST['commName']
                commClass = req.POST['commClass']#类型
                commStuff = req.POST['commStuff']#材质
                price = req.POST['commPrice']
                colorId = req.POST['commColor']#商品颜色
                commCount = req.POST['commCount']#库存
                introduce = req.POST['commIntro']
                isSecommendation = req.POST['commIsRecommend']
                materialInfo = req.POST['materialinfo']
                if isSecommendation == '1':
                    isSecommendation = True
                else:
                    isSecommendation = False
                isShow = req.POST['commIsUse']
                if isShow == '1':
                    isShow = True
                else:
                    isShow = False
                if req.POST['ifChose']=='1':
                    ifChose=1
                else:
                    ifChose=0
                Material.objects.create(materialId=id,sealClassId_id=commClass,isColor=ifChose,colorId_id=colorId,isSecommendation=isSecommendation,picture="/"+rollPictureName,isShow=isShow,materialName=name,materialPrice=price,materialRemainder=commCount,materialIntroduction=introduce,materialInfo=materialInfo)
                materialIdInstance = Material.objects.get(materialId = id)
                quality = MaterialQuality.objects.get(materialQualityId=commStuff)
                MaterialandQuality.objects.create(materialId=materialIdInstance,materialQualityId=quality)
                if req.POST['ifChose']=='1':
                    time=1#初始化循环次数
                    while (time<=len(Fruit.keys())):
                        ColorsInstance = Colors.objects.get(colorId=Fruit[time])
                        SealColor.objects.create(materialId=materialIdInstance,colorId=ColorsInstance)
                        time=time+1
                ret1 = 1
    except Exception as err:
        print(err)
        ret1 = 0
    return HttpResponse(ret1)

def imgupload(request):

    try:
        ret=str(uuid.uuid1())
        rollPictureName="webStatic/upload/201702/"+ret+".jpg"
        rollPicturePath=os.path.join(basePath,rollPictureName)
        file = request.FILES["myFileName"]
        if file == None:
            result = r"error|未成功获取文件，上传失败"
            return HttpResponse(result)
        else:
            img = Image.open(file)
            img.thumbnail((500,500),Image.ANTIALIAS)#对图片进行等比缩放
            img.save(rollPicturePath,"png")#保存图片
            print rollPicturePath
            return HttpResponse("/webStatic/upload/201702/" +ret+".jpg")
    except Exception as err:
        print err


@csrf_exempt
def getGoods(req):
    """
    商品管理
    获取商品列表
    :param req:
    :return:
    """
    Mt = Material.objects.all()
    num = len(Mt)
    page = int(req.POST["page"])
    nowInfo = (page-1)*15
    lastInfo = nowInfo+15
    Mt = Mt.order_by("-createTime")[nowInfo:lastInfo]
    if Mt.count==0:
        return HttpResponse(0)
    if Mt.exists():
        List = []
        for obj in Mt:
                word = {}
                word["id"] = obj.materialId
                word["name"]=obj.materialName
                word["chapter"] = obj.sealClassId.className
                word["price"] = str(obj.materialPrice)
                word["remainder"] = str(obj.materialRemainder)
                word["introduce"] = obj.materialIntroduction
                word["is"] = obj.isShow
                word["num"] = num
                word["picture"] = obj.picture
                word["isSecommendation"] = obj.isSecommendation
                quality = MaterialQuality.objects.get(materialQualityId=(MaterialandQuality.objects.get(materialId=obj.materialId).materialQualityId_id))
                word["quality"] = quality.materialQualityName
                List.append(word)
        return HttpResponse(json.dumps(List))
    else:
        return HttpResponse(1)
    # except Exception as err:
    #         print err


@csrf_exempt
def getMaterInfor(req):
    """
    用于显示商品信息
    :param req:
    :return:
    """
    log = Material.objects.get(materialId=req.POST['mateId'])
    quality = MaterialQuality.objects.get(materialQualityId=(MaterialandQuality.objects.get(materialId=req.POST['mateId']).materialQualityId_id))
    sealParentClass = ParentMeterialClass.objects.get(parentClassId=SealClass.objects.get(sealClassId=Material.objects.get(materialId=req.POST['mateId']).sealClassId_id).parentClassId_id)
    colors= SealColor.objects.filter(materialId=req.POST['mateId'])
    materialJson={}
    if colors.exists():
        isNo=1
        times = len(colors)
        materialJson['times'] = times
        i=1
        while(i<=times):
            colorAll=Colors.objects.all()
            if colorAll.exists():
                for obj in colorAll:
                   colorId=obj.colorId
                   colors1=SealColor.objects.filter(materialId=req.POST['mateId'],colorId = colorId)
                   if colors1.exists():
                       colors11=SealColor.objects.get(materialId=req.POST['mateId'],colorId = colorId)
                       numtime=str(i)
                       materialJson['color'+numtime+'']=colors11.colorId_id
                       i+=1
    else:
        isNo=0
    materialJson['materialName']=log.materialName
    materialJson['materialPrice']=str(log.materialPrice)
    materialJson['materialRemainder'] =log.materialRemainder
    materialJson['materialIntroduction'] = log.materialIntroduction
    materialJson['isSecommendation'] = log.isSecommendation
    materialJson['isShow'] = log.isShow
    materialJson['picture'] = log.picture
    materialJson['sealClassName'] = SealClass.objects.get(sealClassId=log.sealClassId_id).className
    materialJson['sealClassId'] =SealClass.objects.get(sealClassId=log.sealClassId_id).sealClassId
    materialJson['commStuff'] = quality.materialQualityName
    materialJson['commStuffId'] = quality.materialQualityId
    materialJson['sealParentClassName'] = sealParentClass.parentClassId
    materialJson['commColor'] = log.colorId_id
    materialJson['isNo'] = isNo
    materialJson['materialInfo'] = log.materialInfo
    return HttpResponse(json.dumps(materialJson))


@csrf_exempt
def colorColor(req):
    """
    配置颜色
    :param req:
    :return:
    """
    colors= SealColor.objects.filter(materialId=req.POST['materialId'])
    materialJson={}
    if colors.exists():
        times = len(colors)
        materialJson['times'] = times
        i=1
        while(i<=times):
            colorAll=Colors.objects.all()
            if colorAll.exists():
                for obj in colorAll:
                   colorId=obj.colorId
                   colors1=SealColor.objects.filter(materialId=req.POST['materialId'],colorId = colorId)
                   if colors1.exists():
                       colors11=SealColor.objects.get(materialId=req.POST['materialId'],colorId = colorId)
                       numtime=str(i)
                       materialJson['color'+numtime+'']=colors11.colorId_id
                       materialJson['colorName'+numtime+'']=Colors.objects.get(colorId=colors11.colorId_id).colorName
                       i+=1
    return HttpResponse(json.dumps(materialJson))


@csrf_exempt
def materialChange(req):
    """
    用于商品修改
    :param req:
    :return:
    """
    ret=0
    try:
        with transaction.atomic():
            materName = Material.objects.filter(materialName=req.POST['commName'])
            materiallen = len(materName)
            materalNowName = Material.objects.get(materialId=req.POST['mateId']).materialName
            if (materalNowName==req.POST['commName'] or materiallen<1):
                # 如果名字不重复
                name = req.POST['commName']
                commClass = req.POST['commClass']  # 类型
                commStuff = req.POST['commStuff']  # 材质
                price = req.POST['commPrice']
                commCount = req.POST['commCount']#库存
                introduce = req.POST['commIntro']
                colorId = req.POST['commColor']#商品颜色
                reqflie = req.FILES.get('choFile',False)
                materialinfo = req.POST['materialinfo']
                PIC=1
                if reqflie!=False:
                    number=str(uuid.uuid1())
                    rollPictureName="webStatic/img/admin/materialPic/"+number+".jpg"
                    rollPicturePath=os.path.join(basePath,rollPictureName)
                    reqFile = req.FILES['choFile']
                    img = Image.open(reqFile)
                    img.thumbnail((500,500),Image.ANTIALIAS)#对图片进行等比缩放
                    img.save(rollPicturePath,"png")#保存图片
                    Material.objects.filter(materialId=req.POST['mateId']).update(picture="/"+rollPictureName)
                    PIC=2
                isSecommendation = req.POST['commIsRecommend']
                if isSecommendation == '1':
                    isSecommendation = True
                else:
                    isSecommendation = False
                isShow = req.POST['commIsUse']
                if isShow == '1':
                    isShow = True
                else:
                    isShow = False
                number=len(req.POST['colorAdd'].replace(',',''))
                number1=number/36
                number2=1
                list=[]
                Fruit={}
                start=0
                end=start+36
                while(number2<=number1):
                    string=req.POST['colorAdd'].replace(',','')[start:end]
                    Fruit[number2]=string
                    number2=number2+1
                    start=end
                    end=start+36
                list.append(Fruit)
                if req.POST['ifChose']=='1':
                    ifChose=1
                else:
                    ifChose=0
                Material.objects.filter(materialId=req.POST['mateId']).update(sealClassId_id=commClass,isColor=ifChose,colorId_id=colorId,isSecommendation=isSecommendation,isShow=isShow,materialName=name,materialPrice=price,materialRemainder=commCount,materialIntroduction=introduce,materialInfo=materialinfo)
                materialIdInstance = Material.objects.get(materialId = req.POST['mateId'])
                quality = MaterialQuality.objects.get(materialQualityId=commStuff)
                MaterialandQuality.objects.filter(materialId=materialIdInstance).update(materialQualityId=quality)
                color=Colors.objects.all()
                for obj in color:
                     aa=SealColor.objects.filter(materialId=materialIdInstance,colorId_id=obj.colorId)
                     if aa.exists():
                        SealColor.objects.get(materialId=materialIdInstance,colorId_id=obj.colorId).delete()
                if req.POST['ifChose']=='1':
                    time=1
                    while (time<=len(Fruit.keys())):
                        ColorsInstance = Colors.objects.get(colorId=Fruit[time])
                        SealColor.objects.create(materialId=materialIdInstance,colorId=ColorsInstance)
                        time=time+1
                ret=1+PIC
            else:
                if materiallen==1:
                   ret=111

    except Exception as err:
        print(err)
    return HttpResponse(ret)


@csrf_exempt
def deleteOneMaterialPicture(request):
    """
    删除文件中的图片文件
    :param request:
    :return:
    """
    rollpictureName=request.POST['pictureUrl']
    realrollpictureName=rollpictureName[1:]
    rollpicturePath=os.path.join(basePath,realrollpictureName)
    os.remove(rollpicturePath)#删除文件中的照片
    return HttpResponse()

@csrf_exempt
def deleteMaterials(req):
    """
    删除商品
    :param req:
    :return:
    """
    ret=0
    materialId=req.POST['mateId']
    comments=Comments.objects.filter(materialId=materialId)
    trolley = Trolley.objects.filter(materialId=materialId)
    if comments.exists():
        ret=1
        if trolley.exists():
            ret=1
    else:
        Material.objects.get(materialId=materialId).delete()
    return HttpResponse(ret)
