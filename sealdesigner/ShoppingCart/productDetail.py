# -*- coding: utf-8 -*-
# coding=utf-8
from django.http import HttpResponse
from Seal.models import Material, SealClass, SealColor, Colors
from ShoppingCart.models import Trolley
from Users.models import Comments, User
from Users.views import userskip,judgeuser
import json, uuid
from django.db import transaction
def lookMaterial(req):
    """
    查看商品详情信息

    :param req:
    :return:
    """
    try:
        material = Material.objects.get(materialId=req.POST["materialId"])
        sealclass = SealClass.objects.get(sealClassId=material.sealClassId_id)
        List=[]
        materialInfor = {}
        materialInfor["className"]=sealclass.className
        materialInfor["parentClassId"]=material.sealClassId.parentClassId_id
        materialInfor["materialName"] = material.materialName
        materialInfor["materialPrice"] = str(material.materialPrice)
        materialInfor["materialRemainder"] = material.materialRemainder
        materialInfor["materialIntroduction"] = material.materialIntroduction
        materialInfor["picture"] = material.picture
        materialInfor["materialInfo"] = material.materialInfo
        List.append(materialInfor)
        return HttpResponse(json.dumps(List))
    except Exception as err:
        print err
        return HttpResponse(0)


def getMaterialColor(req):
    """
    获取颜色
    :param req:
    :return:
    """
    List=[]
    materialId=req.POST["materialId"]
    material=Material.objects.get(materialId=materialId)
    if material.isColor:
        usedColor=SealColor.objects.filter(materialId_id=materialId)
        if usedColor.exists():
            for obj in usedColor:
                materialColor1={}
                color=Colors.objects.get(colorId=obj.colorId_id)
                if color.isShow:
                    materialColor1["isColor"]=material.isColor
                    materialColor1["colorId"]=color.colorId
                    materialColor1["colorName"]=color.colorName
            materialColor2={}
            materialColor2["isColor"]=material.isColor
            materialColor2["colorId"]=material.colorId_id
            materialColor2["colorName"]=material.colorId.colorName
            # materialColor=dict(materialColor1,**materialColor2)
            materialColor=dict(materialColor1.items()+materialColor2.items())
            List.append(materialColor)
        else:
            materialColor={}
            # materialColor["isColor"]=material.isColor
            materialColor["isColor"]=False
            materialColor["colorId"]=material.colorId_id
            materialColor["colorName"]=material.colorId.colorName
            List.append(materialColor)

    else:
        materialColor={}
        materialColor["isColor"]=material.isColor
        materialColor["colorId"]=material.colorId_id
        materialColor["colorName"]=material.colorId.colorName
        List.append(materialColor)
    return HttpResponse(json.dumps(List))



def submitSeal(req):
    """
    其他类商品用户选择是生成一个初始的订单
    :param req:
    :return:
    """
    try:
        with transaction.atomic():
            if req.COOKIES.get("userId","")=="":
                return HttpResponse(2)
            userId=req.COOKIES.get("userId","")
            print userId
            materialId=req.POST["materialId"]
            material=Material.objects.get(materialId=materialId)
            prince=material.materialPrice
            number=req.POST["number"]
            colorId=req.POST["colorId"]
            troId=uuid.uuid1()
            trolley=Trolley(
                trollerId=troId,
                materialId_id=materialId,
                userId_id=userId,
                materialPrice=prince,
                number=number,
                colorId_id=colorId,
                status=1,
                isShow=True
            )
            trolley.save()
            List=[]
            trollerId={}
            trollerId["trollerId"]=str(troId) #使uuid可串行化
            List.append(trollerId)
            return HttpResponse(json.dumps(List))
            # return HttpResponse(8)
    except Exception as err:
        print err
        return HttpResponse(0)

def getCommentList(req):
    """
    获取该商品的所有评论
    :param req:
    :return:
    """
    materialId=req.POST["materialId"]
    comment = Comments.objects.filter(materialId_id=materialId,isCheck=True)
    num = len(comment)#获取评论总条数
    page = int(req.POST["page"])#当前页数
    startPage = (page-1)*10
    lastPage = startPage+10
    comment = comment.order_by("-createTime")[startPage:lastPage]
    List=[]
    if comment.exists():
        for obj in comment:
            commentList={}
            # print obj.isCheck
            # if obj.isCheck:
                # user=User.objects.get(userId=obj.userId_id)
                # commentList["userName"]=user.userName
                # commentList["userPic"]=user.userPic
            commentList["num"]=num
            commentList["commentContent"]=obj.commentContent
            commentList["createTime"]=obj.createTime.strftime('%Y/%m/%d %H:%M:%S')
            List.append(commentList)

        return  HttpResponse(json.dumps(List))
    else:
        return HttpResponse(1)



