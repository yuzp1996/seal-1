# -*- coding:utf-8 -*-
# coding=utf-8
import json, uuid
import os
from django.db import transaction
from django.http import HttpResponse
from models import Trolley,Data,UploadData,UserSummitInfo
from Seal.models import Material,SealClass,ParentMeterialClass,MaterialQuality,Fonts,Colors,Company,FormatInformation,DataType,Format,SealClassFormat
from Users.models import User
from ShoppingCart.models import Order
from django.views.decorators.csrf import csrf_exempt
from sealdesigner.settings import MEDIA_ROOT

basePath=os.path.dirname(os.path.dirname(__file__))

@csrf_exempt
def TrolleyInfo(req):
    """
    获得购物车的信息
    :param req:
    :return:
    """
    userId=User.objects.get(userName=req.POST['userName'])
    trolley = Trolley.objects.filter(userId=userId)
    trolley = trolley.filter(isShow=1)
    trolley = trolley.filter(status=1)
    num = len(trolley)
    page = int(req.POST["page"])
    nowInfo = (page-1)*5
    lastInfo = nowInfo+5
    trolley = trolley.order_by("-buyData")[nowInfo:lastInfo]
    a=[]
    for obj in trolley:
        sealClass=SealClass.objects.get(sealClassId=Material.objects.get( materialId=obj.materialId_id).sealClassId_id)
        materialName=Material.objects.get( materialId=obj.materialId_id).materialName
        pictureUrl = Material.objects.get( materialId=obj.materialId_id).picture
        parentName =(ParentMeterialClass.objects.get(parentClassId=sealClass.parentClassId_id)).parentName
        amount=obj.number*obj.materialPrice

        if obj.materialId.sealClassId.parentClassId_id == '3':  # 商品父类为其他时，则无上传附件
            stop = 0
        else:
            data=Data.objects.get(userDataId=obj.userDataId_id)
            upLoadData= UploadData.objects.filter(userDataId=data.userDataId)#已上传附件信息
            LenLoadData = len(upLoadData)#已上传附件个数
            dataType = DataType.objects.filter(companyId=data.companyId_id)#附件类型 应该上传的附件
            LenDataType = len(dataType)#应该上传附件个数
            stateDataType=DataType.objects.filter(statementId=data.statementId_id)#声明时应该上传的附件
            lenStateDataType=len(stateDataType)#声明时应该上传的附件长度
            allnum = lenStateDataType+LenDataType#总应上传
            if (allnum > LenLoadData):
                stop = 1
            else:
                stop = 0
        b={"trolleyId":obj.trollerId,"number":obj.number,"stop":stop,"parentName":parentName,"num":num,"amount":str(amount),"status":obj.status,"materialName":materialName,"pictureUrl":pictureUrl}
        a.append(b)
    return HttpResponse(json.dumps(a))



@csrf_exempt
def materialMinuteInfo(req):
    """
    购物车二级页面商品详情
    :param req:
    :return:
    """
    trolley = Trolley.objects.get(trollerId=req.POST['trolleyId'])
    mateClass = req.POST['mateClass']
    try:
        if(mateClass=="3"):
            #其他类
            material = Material.objects.get(materialId=trolley.materialId_id)
            picture=material.picture
            ParentMeterialClassName=ParentMeterialClass.objects.get(parentClassId=SealClass.objects.get(sealClassId=material.sealClassId_id).parentClassId_id).parentName#父类名称
            colorName=Colors.objects.get(colorId=trolley.colorId_id).colorName
            colorId=Colors.objects.get(colorId=trolley.colorId_id).colorId
            SealClassName = SealClass.objects.get(sealClassId=material.sealClassId_id).className
            trolleyMinuteInfo = {}
            trolleyMinuteInfo['SealClassName']=SealClassName
            trolleyMinuteInfo['materialName']=material.materialName#商品名称
            trolleyMinuteInfo['number']= trolley.number#数量
            trolleyMinuteInfo['amount']=str(trolley.number*trolley.materialPrice)#总额
            trolleyMinuteInfo['price'] = str(trolley.materialPrice)#单价
            trolleyMinuteInfo['materialIntroduction']=material.materialIntroduction#简介
            trolleyMinuteInfo['colorName']=colorName#颜色名称
            trolleyMinuteInfo['colorId']=colorId
            trolleyMinuteInfo['picture']=picture#商品图片
            trolleyMinuteInfo['sealClass']=ParentMeterialClassName+"   "+SealClassName#类型
            trolleyMinuteInfo['materialId']=material.materialId#商品ID
            return HttpResponse(json.dumps(trolleyMinuteInfo))
        elif(mateClass=='2'):#公章
            material = Material.objects.get(materialId=trolley.materialId_id)
            picture=material.picture
            SealClassName = SealClass.objects.get(sealClassId=material.sealClassId_id).className
            # MaterialQualityName=MaterialQuality.objects.get(materialQualityId=trolley.materialId_id).materialQualityName
            fontName=Fonts.objects.get(fontId=trolley.fontId_id).fontName
            ParentMeterialClassName=ParentMeterialClass.objects.get(parentClassId=SealClass.objects.get(sealClassId=material.sealClassId_id).parentClassId_id).parentName#父类名称
            colorName=Colors.objects.get(colorId=trolley.colorId_id).colorName
            colorId=Colors.objects.get(colorId=trolley.colorId_id).colorId
            data=Data.objects.get(userDataId=trolley.userDataId_id)
            if (Company.objects.filter(companyId=data.companyId_id).exists()):
                company=Company.objects.get(companyId=data.companyId_id).companyName
            informationContent=UserSummitInfo.objects.filter(trollerId=req.POST['trolleyId'])#板式配置信息内容
            samplePictureUrl=Format.objects.get(formatId=FormatInformation.objects.get(formatinformationId=informationContent[0].formatInformationId_id).formatId_id).pictureUrl
            leninformationContent=len(informationContent)
            upLoadData= UploadData.objects.filter(userDataId=data.userDataId)#已上传附件信息
            LenLoadData = len(upLoadData)#已上传附件个数
            dataType = DataType.objects.filter(companyId=data.companyId)#附件类型 应该上传的附件
            LenDataType = len(dataType)#应该上传附件个数
            stateDataType=DataType.objects.filter(statementId=data.statementId_id)#声明时应该上传的附件
            lenStateDataType=len(stateDataType)#声明时应该上传的附件长度
            trolleyMinuteInfo = {}

            s=0
            while(s<leninformationContent):
                time=str(s)
                print time

                trolleyMinuteInfo['informationContentName'+time+'']=FormatInformation.objects.get(formatinformationId=informationContent[s].formatInformationId_id).informationName
                trolleyMinuteInfo['informationContent'+time+'']=informationContent[s].informationContent#版式配置信息内容
                trolleyMinuteInfo['informationContentID'+time+'']=informationContent[s].userSummitInfoId#版式配置信息ID
                s=s+1
            b=0
            while(b<lenStateDataType):
                time=str(b)
                trolleyMinuteInfo['stateDataType'+time+'']=stateDataType[b].dataName#二次刻章声明时应该上传的附件名称
                trolleyMinuteInfo['stateDataTypeId'+time+'']=stateDataType[b].dataTypeId#二次刻章应上传的附件的ID
                data=upLoadData.filter(dataTypeId_id=stateDataType[b].dataTypeId)
                if data.exists():
                    trolleyMinuteInfo['stateIsUpload'+time+'']=1#声明的资料已经上传
                    trolleyMinuteInfo['supLoadData'+time+'']=upLoadData.filter(dataTypeId=stateDataType[b].dataTypeId)[0].upLoadUrl#已上传附件URL

                else:
                    trolleyMinuteInfo['stateIsUpload'+time+'']=0#声明的资料没上传
                b=b+1
            a=0
            while(a<LenDataType):
                time=str(a)
                trolleyMinuteInfo['dataType'+time+'']=dataType[a].dataName#首次刻章应该上传附件名称
                trolleyMinuteInfo['dataTypeId'+time+'']=dataType[a].dataTypeId#首次刻章应该上传附件的Id
                data=upLoadData.filter(dataTypeId_id=dataType[a].dataTypeId)
                if data.exists():
                    trolleyMinuteInfo['isUpload'+time+'']=1#已上传为1
                    # trolleyMinuteInfo['upLoadDataType'+time+'']=upLoadData[a].dataTypeId_id#已上传附件类型
                    trolleyMinuteInfo['fupLoadData'+time+'']=upLoadData.filter(dataTypeId=dataType[a].dataTypeId)[0].upLoadUrl#已上传附件URL
                else:
                     trolleyMinuteInfo['isUpload'+time+'']=0#未上传为0
                a=a+1
            trolleyMinuteInfo['sealClass']=ParentMeterialClassName+"   "+SealClassName#类型
            trolleyMinuteInfo['LenLoadData']=LenLoadData#附件个数
            trolleyMinuteInfo['materialName']=material.materialName#商品名称
            trolleyMinuteInfo['number']= trolley.number#数量
            trolleyMinuteInfo['sealClass']=SealClassName#类型
            # trolleyMinuteInfo['materialQualityName']=MaterialQualityName#材质名称
            trolleyMinuteInfo['amount']=str(trolley.number*trolley.materialPrice)#总额
            trolleyMinuteInfo['price'] = str(trolley.materialPrice)#单价
            trolleyMinuteInfo['materialIntroduction']=material.materialIntroduction#简介
            trolleyMinuteInfo['fontName']=fontName#字体
            trolleyMinuteInfo['colorName']=colorName#颜色名称
            trolleyMinuteInfo['picture']=picture#商品图片
            trolleyMinuteInfo['company']=company#企业类型
            trolleyMinuteInfo['colorId']=colorId
            trolleyMinuteInfo['fontId']=trolley.fontId_id
            trolleyMinuteInfo['LenDataType']=LenDataType#应上传附件数量
            trolleyMinuteInfo['lenStateDataType']=lenStateDataType#声明时应该加入附件数量
            trolleyMinuteInfo["samplePictureUrl"]=samplePictureUrl#版试图片
            trolleyMinuteInfo['materialId']=material.materialId#商品ID
            trolleyMinuteInfo["leninformationContent"]=leninformationContent
            return HttpResponse(json.dumps(trolleyMinuteInfo))
        elif (mateClass=='1'):#个人章
            material = Material.objects.get(materialId=trolley.materialId_id)
            picture=material.picture
            SealClassName = SealClass.objects.get(sealClassId=material.sealClassId_id).className
            fontName=Fonts.objects.get(fontId=trolley.fontId_id).fontName
            ParentMeterialClassName=ParentMeterialClass.objects.get(parentClassId=SealClass.objects.get(sealClassId=material.sealClassId_id).parentClassId_id).parentName#父类名称
            colorName=Colors.objects.get(colorId=trolley.colorId_id).colorName
            colorId=Colors.objects.get(colorId=trolley.colorId_id).colorId
            informationContent=UserSummitInfo.objects.filter(trollerId = req.POST['trolleyId'])#板式配置信息内容
            leninformationContent=len(informationContent)
            samplePictureUrl=Format.objects.get(formatId=FormatInformation.objects.get(formatinformationId=informationContent[0].formatInformationId_id).formatId_id).pictureUrl
            trolleyMinuteInfo = {}
            s=0
            while(s<leninformationContent):
                time=str(s)
                trolleyMinuteInfo['informationContentName'+time+'']=FormatInformation.objects.get(formatinformationId=informationContent[s].formatInformationId_id).informationName
                trolleyMinuteInfo['informationContent'+time+'']=informationContent[s].informationContent#二次刻章声明时应该上传的附件名称
                trolleyMinuteInfo['informationContentID'+time+'']=informationContent[s].userSummitInfoId#版式配置信息ID
                s=s+1
            trolleyMinuteInfo['sealClass']=ParentMeterialClassName+"   "+SealClassName#类型
            trolleyMinuteInfo['materialName']=material.materialName#商品名称
            trolleyMinuteInfo['number']= trolley.number#数量
            trolleyMinuteInfo['sealClass']=SealClassName#类型
            trolleyMinuteInfo['amount']=str(trolley.number*trolley.materialPrice)#总额
            trolleyMinuteInfo['price'] = str(trolley.materialPrice)#单价
            trolleyMinuteInfo['materialIntroduction']=material.materialIntroduction#简介
            trolleyMinuteInfo['fontName']=fontName#字体
            trolleyMinuteInfo['fontId']=trolley.fontId_id#字体id
            trolleyMinuteInfo['colorName']=colorName#颜色名称
            trolleyMinuteInfo['picture']=picture#商品图片
            trolleyMinuteInfo['colorId']=colorId
            trolleyMinuteInfo["samplePictureUrl"]=samplePictureUrl#版式图片
            trolleyMinuteInfo['leninformationContent']=leninformationContent#配置信息的个数
            trolleyMinuteInfo['materialId']=material.materialId#商品ID
            return HttpResponse(json.dumps(trolleyMinuteInfo))
    except Exception as err:
        print(err)




























       #
       # cursor = connection.cursor()
       #  goBusNum = cursor.execute("SELECT busNumInfoId,routeName,startTime FROM busnuminfo,route WHERE busnuminfo.routeId=route.routeId AND direction='01' ORDER BY startTime")
       #  goBus = cursor.fetchmany(goBusNum)
       #  town = []
       #               cursor.execute("""
       #                          SELECT byBusDate,direction,status,classification,bybustimeinfoid ,reasonid,staffnum,reserveInforId,busNum,seatNum
       #                          FROM oldraserveinfor
       #                          WHERE not status = 2 AND staffNum= '%s' AND byBusDate = '%s' ORDER BY byBusDate,status DESC
       #                          """ % (search, time))
# def dataIsUpload(req):
#     """
#     判断上传文件是否上传完整   完整为0
#     :param req:
#     :return:
#     """
#     try:
#         trolleyId = req.POST['trolleyId']
#
#
#
#         # cursor = connection.cursor()
#         # cursor.execute("SELECT userDataId_id FROM shoppingcart_trolley WHERE trollerId = '%s'" % trolleyId)
#         # userdataId = cursor.fetchone()
#         # for i in userdataId:
#         #     print(i)
#
#
#         trolley = Trolley.objects.get(trollerId = req.POST['trolleyId'])
#         mateClass = req.POST['mateClass']
#         if(mateClass=='2'):#公章
#
#             #
#             # cursor = connection.cursor()
#             # Datas = cursor.execute("SELECT isShow FROM shoppingcart_data WHERE userdataId=trolley.userDataId_id")
#             # data = cursor.fetchmany(Datas)
#             # print(data)
#
#
#             data=Data.objects.get(userDataId=trolley.userDataId_id)
#
#
#             upLoadData= UploadData.objects.filter(userDataId=data.userDataId)#已上传附件信息
#
#
#             dataType = DataType.objects.filter(companyId=data.companyId)#附件类型 应该上传的附件
#             LenDataType = len(dataType)#应该上传附件个数
#
#
#             stateDataType=DataType.objects.filter(statementId=data.statementId_id)#声明时应该上传的附件
#             lenStateDataType=len(stateDataType)#声明时应该上传的附件长度
#
#
#             trolleyMinuteInfo = {}
#             b=0
#             while(b<lenStateDataType):
#                 time=str(b)
#                 data=upLoadData.filter(dataTypeId_id=stateDataType[b].dataTypeId)
#                 if data.exists():
#                     trolleyMinuteInfo['stateIsUpload'+time+'']=0#声明的资料已经上传
#                 else:
#                     trolleyMinuteInfo['stateIsUpload'+time+'']=1#声明的资料没上传
#                 b=b+1
#
#
#             a = 0
#             while(a<LenDataType):
#                 time=str(a)
#                 data=upLoadData.filter(dataTypeId_id=dataType[a].dataTypeId)
#                 if data.exists():
#                     trolleyMinuteInfo['isUpload'+time+'']=0#已上传
#                 else:
#                      trolleyMinuteInfo['isUpload'+time+'']=1#未上传为0
#                 a=a+1
#             return HttpResponse(json.dumps(trolleyMinuteInfo))
#     except Exception as err:
#         print(err)



































def dataIsUpload(req):
    """
    判断上传文件是否上传完整   完整为0
    :param req:
    :return:
    """
    try:

        trolley = Trolley.objects.get(trollerId =req.POST['trolleyId'])
        mateClass = req.POST['mateClass']
        if(mateClass=='2'):#公章
            data=Data.objects.get(userDataId=trolley.userDataId_id)


            upLoadData= UploadData.objects.filter(userDataId=data.userDataId)#已上传附件信息


            dataType = DataType.objects.filter(companyId=data.companyId)#附件类型 应该上传的附件
            LenDataType = len(dataType)#应该上传附件个数


            stateDataType=DataType.objects.filter(statementId=data.statementId_id)#声明时应该上传的附件
            lenStateDataType=len(stateDataType)#声明时应该上传的附件长度


            trolleyMinuteInfo = {}
            b=0
            while(b<lenStateDataType):
                time=str(b)
                data=upLoadData.filter(dataTypeId_id=stateDataType[b].dataTypeId)
                if data.exists():
                    trolleyMinuteInfo['stateIsUpload'+time+'']=0#声明的资料已经上传
                else:
                    trolleyMinuteInfo['stateIsUpload'+time+'']=1#声明的资料没上传
                b=b+1


            a = 0
            while(a<LenDataType):
                time=str(a)
                data=upLoadData.filter(dataTypeId_id=dataType[a].dataTypeId)
                if data.exists():
                    trolleyMinuteInfo['isUpload'+time+'']=0#已上传
                else:
                     trolleyMinuteInfo['isUpload'+time+'']=1#未上传为0
                a=a+1
            return HttpResponse(json.dumps(trolleyMinuteInfo))
    except Exception as err:
        print(err)





def changeOfShoppingCart(req):
    """
    修改购物车相关信息
    :param req:
    :return:
    """
    try:
        if(req.POST['sealClass'])=="3":#其他
            trolleyObject=Trolley.objects.filter(trollerId=req.POST['trolleyId'])
            if (req.POST["orderStatus"] == "-1"):
                trolleyObject.update(number=req.POST['number'], colorId=req.POST['colorId'],status = 1)
            else:
                trolleyObject.update(number=req.POST['number'],colorId=req.POST['colorId'])

            return  HttpResponse(1)
        else:
            if (req.POST['sealClass'])=="1":#个人章
                trolleyObject=Trolley.objects.filter(trollerId=req.POST['trolleyId'])
                if (req.POST['colorId']!="null"):
                    trolleyObject.update(number=req.POST['sealNum'],colorId=req.POST['colorId'],fontId=req.POST['fontId'])
                str=(req.POST['str'])
                column = str.split(",")
                num=req.POST['num']
                num=int(num)
                i=0
                if (req.POST["orderStatus"] == "-1"):
                    orderobj = Order.objects.get(orderId=Trolley.objects.get(trollerId=req.POST['trolleyId']).orderId_id)
                    orderobj.orderState = 1
                    orderobj.save()
                while(i<num*2-1):
                    UserSummitInfo.objects.filter(userSummitInfoId=column[i+1]).update(informationContent=column[i])#修改用户填写的印章信息
                    i=i+2
                return HttpResponse(1)
            else:
                if(req.POST['sealClass'])=="2":#公章
                    trolleyObject=Trolley.objects.filter(trollerId=req.POST['trolleyId'])
                    if (req.POST['colorId']!="null"):
                        trolleyObject.update(colorId=req.POST['colorId'],fontId=req.POST['fontId'])
                    str=(req.POST['str'])
                    column = str.split(",")
                    num=req.POST['num']
                    num=int(num)
                    i=0
                    if (req.POST["orderStatus"] == "-1"):
                        orderobj = Order.objects.get(orderId=Trolley.objects.get(trollerId=req.POST['trolleyId']).orderId_id)
                        orderobj.orderState = 1
                        orderobj.save()
                    while(i<num*2-1):
                        UserSummitInfo.objects.filter(userSummitInfoId=column[i+1]).update(informationContent=column[i])#修改用户填写的印章信息
                        i=i+2
                    return HttpResponse(1)
    except Exception as err:
        print(err)






@csrf_exempt
def deleteShoppingCart(req):
    """
    删除购物车
    :param req:
    :return:
    """
    ret=0
    try:
        ID=req.POST['firstShoppingId'].replace('!','')
        time=len(ID)/36
        sta=0
        end=36
        iterration=0
        while(iterration<=time):
            ID[sta:end]
            trolley = Trolley.objects.filter(trollerId=ID[sta:end])
            trolley.update(isShow=0)
            sta+=36
            end+=36
            iterration+=1
        ret=1
    except Exception as err:
        print err
    finally:
        return HttpResponse(ret)




def  ShoppingUploadFile(req):
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
            dataTypeId = req.POST["dataTypeId"][:36]#把相对应的无论什么附件的id都传给后面 公司还是声明都是一个datatypeid要存入upload
            if req.POST["userDataId"] != "":#如果进行修改附件行为 则删除原先的附件 判断是否存在这个文件夹
                usedUploadData=UploadData.objects.filter(userDataId=req.POST["userDataId"],dataTypeId=req.POST["dataTypeId"][:36])
                usedUploadData.delete()
                Url=req.POST["dataTypeId"][36:]
                if Url!="undefined":
                    #删除文件的python代码
                    rollpictureName=Url
                    realrollpictureName=rollpictureName
                    rollpicturePath=os.path.join(basePath,realrollpictureName)
                    os.remove(rollpicturePath)#删除文件中的照片
            uploadData = UploadData(userDataId_id=userDataId,dataTypeId_id=dataTypeId,upLoadUrl=filePath)  # 该路径为绝对路径！不行！
            uploadData.save()
            return HttpResponse(userDataId)
    except Exception as err:
        print err
        return HttpResponse(0)




def getMateClass(req):
    """
    得到类型信息 其实远不止这些 就是这么叼
    :param req:
    :return:
    """
    trolleyId=req.POST['trolleyId']
    trolley=Trolley.objects.get(trollerId=trolleyId)
    materialId=trolley.materialId_id
    sealClassId=Material.objects.get(materialId=materialId).sealClassId_id
    parentClass=SealClass.objects.get(sealClassId=sealClassId).parentClassId_id
    if parentClass=='3':#如果是其他类
        ret=3
    elif parentClass=='2':#如果为公章
        ret=2
    elif parentClass=='1':#如果为个人章
        ret=1
    trolleyMinuteInfo={}
    if (Data.objects.filter(userDataId=trolley.userDataId_id).exists()):
        data=Data.objects.get(userDataId=trolley.userDataId_id)
        trolleyMinuteInfo['userDataId']=trolley.userDataId_id
        if (Company.objects.filter(companyId=data.companyId_id).exists()):
            company=Company.objects.get(companyId=data.companyId_id).companyId
            trolleyMinuteInfo['company']=company
    trolleyMinuteInfo['class']=ret
    return HttpResponse(json.dumps(trolleyMinuteInfo))