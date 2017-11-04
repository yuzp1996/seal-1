# -*- coding: utf-8 -*-
# coding=utf-8
from django.http import HttpResponse
from Seal.models import ParentMeterialClass, SealClass, MaterialQuality, Material,MaterialandQuality
import json, decimal,django.db.models.query


def seal_parent(req):
    """
    印章父类
    :param req:
    :return:
    """
    parent = ParentMeterialClass.objects.all()
    if parent.exists():
        c = []
        for obj in parent:
            a = {"parent2": obj.parentName, "parent1": obj.parentClassId}
            c.append(a)
        return HttpResponse(json.dumps(c))
    else:
        return HttpResponse(0)


def seal_son(req):
    """
    印章子类
    :param req:
    :return:
    """
    son = SealClass.objects.all()
    if son.exists():
        c = []
        for obj in son:
            a = {"son2": obj.className, "son1": obj.SealclassId}
            c.append(a)
        return HttpResponse(json.dumps(c))
    else:
        return HttpResponse(0)


def seal_materia(req):
    """
    印章材质
    :param req:
    :return:
    """
    materia = MaterialQuality.objects.all()
    if materia.exists():
        c = []
        for obj in materia:
            a = {"materia2": obj.materialQualityName, "materia1": obj.materialQualityId}
            c.append(a)
        return HttpResponse(json.dumps(c))
    else:
        return HttpResponse(0)



def sealClassChange(req):
    """
    点击商品分类 改变子类的值
    :param req:
    :return:
    """
    sealClass = SealClass.objects.filter(parentClassId=req.POST['select1id'])
    if sealClass.exists():
        c=[]
        for obj in sealClass:
            b={"id":obj.sealClassId,"name":obj.className}
            c.append(b)
        return HttpResponse(json.dumps(c))
    else:
        return HttpResponse(0)






# def choseShow(req):
#     """
#     对所确定的筛选条件进行筛选
#     :param req:
#     :return:
#     """
#     materials = Material.objects.all().order_by("-materialPrice")
#     if (req.POST['selected1']!="0" and req.POST['selected1']!="11"):
#         List = []
#         for sealclass in SealClass.objects.filter(parentClassId=req.POST['selected1']):#find the class the middle thing
#             List.extend(materials.filter(sealClassId_id=sealclass.sealClassId))# there  they will crash  and you will find it
#         materials = List
#         print("1 时的materials 是"+str(type(materials)))
#
#     if (req.POST['selected2']!="0"):
#          print("2 时的materials 是"+str(type(materials)))
#          materials = materials.filter(sealClassId=req.POST['selected2'])
#     if (req.POST['selected3']!="0"):
#         if (MaterialandQuality.objects.filter(materialQualityId=req.POST['selected3'])).exists():
#             tiaojian=MaterialandQuality.objects.filter(materialQualityId_id=req.POST['selected3'])
#             List = []
#             print("3 时的materials 是"+str(type(materials)))
#             for obj in tiaojian:
#                 List.extend(materials.filter(materialId = obj.materialId_id))//因为是list，所以不可以filter 这个是queryset的特性
#             materials=List
#
#         else:
#             materials={}
#     c=[]
#     for obj in materials:
#         b={"materialId":obj.materialId,"picUrl":obj.picture,"materialName":obj.materialName,"materialPrice":str(obj.materialPrice),"materialIntroduction":obj.materialIntroduction}
#         c.append(b)
#     return HttpResponse(json.dumps(c))



# def choseShow(req):
#     """
#     对所确定的筛选条件进行筛选
#     :param req:
#     :return:
#     """
#     materials = Material.objects.all().order_by("-materialPrice")
#     if (req.POST['selected1']!="0" and req.POST['selected1']!="11"):
#         List = []
#         for sealclass in SealClass.objects.filter(parentClassId=req.POST['selected1']):#find the class the middle thing
#             List.extend(materials.filter(sealClassId_id=sealclass.sealClassId))# there  they will crash  and you will find it
#         materials = List
#
#     if (req.POST['selected2']!="0"):
#          materials = materials.filter(sealClassId=req.POST['selected2'])
#     if (req.POST['selected3']!="0"):
#         if (MaterialandQuality.objects.filter(materialQualityId=req.POST['selected3'])).exists():
#             tiaojian=MaterialandQuality.objects.filter(materialQualityId_id=req.POST['selected3'])
#             List = []
#             for material1 in materials:
#                 for obj in tiaojian:
#                     if (material1.materialId == obj.materialId_id):
#                         List.extend(Material.objects.filter(materialId = material1.materialId ))
#             materials=List
#         else:
#             materials={}
#     c=[]
#     for obj in materials:
#         b={"materialId":obj.materialId,"picUrl":obj.picture,"materialName":obj.materialName,"materialPrice":str(obj.materialPrice),"materialIntroduction":obj.materialIntroduction}
#         c.append(b)
#     return HttpResponse(json.dumps(c))





def choseShow(req):
    """
    对所确定的筛选条件进行筛选
    :param req:
    :return:
    """
    materials = Material.objects.all().order_by("-createTime")
    if (req.POST['selected1']!="0" and req.POST['selected1']!="11"):
        List = []
        for sealclass in SealClass.objects.filter(parentClassId=req.POST['selected1']):#find the class the middle thing
            List.extend(materials.filter(sealClassId_id=sealclass.sealClassId))# there  they will crash  and you will find it
        materials = List
    if (req.POST['selected2']!="0"):
        if type(materials)==django.db.models.query.QuerySet:
            materials = materials.filter(sealClassId=req.POST['selected2'])
        else:
            List = []
            if type(materials)== list:
                for obj in materials:
                    if obj.sealClassId_id == req.POST['selected2']:
                        List.extend(Material.objects.filter(materialId = obj.materialId ))
                materials=List
            else:
                pass
    if (req.POST['selected3']!="0"):
        if (MaterialandQuality.objects.filter(materialQualityId=req.POST['selected3'])).exists():
            tiaojian=MaterialandQuality.objects.filter(materialQualityId_id=req.POST['selected3'])
            List = []
            if (type(materials) == list or type(materials) == django.db.models.query.QuerySet):
                for material1 in materials:
                    for obj in tiaojian:
                        if (material1.materialId == obj.materialId_id):
                            List.extend(Material.objects.filter(materialId = material1.materialId ))
            materials=List
        else:
            materials={}
    c=[]
    if (type(materials) == list or type(materials) == django.db.models.query.QuerySet):
        for obj in materials:
            b={"materialId":obj.materialId,"picUrl":obj.picture,"materialName":obj.materialName,"materialPrice":str(obj.materialPrice),"materialIntroduction":obj.materialIntroduction}
            c.append(b)
    return HttpResponse(json.dumps(c))


def materialSearch(req):
    """
    根据输入的数据匹配相应商品 返回商品的ID
    :param req:
    :return:
    """
    searchText=req.POST['searchText']
    material=Material.objects.filter(materialName__contains=searchText)
    materialId=[]
    if material.exists():
        for obj in material:
            materialId.append(obj.materialId)
    else:
        materialId='noSuchThing'
    return HttpResponse(materialId)


# def searchMaterials(req):
#     """
#     根据得来的商品ID列出相应的商品信息
#     :param req:
#     :return:
#     """
#     try:
#         materialId=req.POST['materialsId']
#         num=len(materialId)/36
#         # materialId=materialId[:36]
#         start=0
#         end=36
#         if end<len(materialId):
#             end+=36
#             start+=36
#             MaterialId=materialId[]
#
#
#
#
#             print materialId
#         materials=Material.objects.get(materialId=materialId)
#
#
#
#         List=[]
#         for obj in materials:
#             b={"materialId":obj.materialId,"picUrl":obj.picture,"materialName":obj.materialName,"materialPrice":str(obj.materialPrice),"materialIntroduction":obj.materialIntroduction}
#             List.append(b)
#         return HttpResponse(json.dumps(List))
#     except Exception as err:
#         print err
#
#
#

def searchMaterials(req):
    """
    根据得来的商品ID列出相应的商品信息
    :param req:
    :return:
    """
    try:

        materialId=req.POST['materialsId']
        if materialId!="noSuchThing":

            num=len(materialId)/36
            start=0
            end=36
            time=1
            materials=[]
            while time<=num:
                if end<=len(materialId):
                    MaterialId=materialId[start:end]
                    materials.append(Material.objects.get(materialId=MaterialId))
                    end+=36
                    start+=36
                time+=1
            List=[]
            for obj in materials:
                b={"materialId":obj.materialId,"picUrl":obj.picture,"materialName":obj.materialName,"materialPrice":str(obj.materialPrice),"materialIntroduction":obj.materialIntroduction}
                List.append(b)
            return HttpResponse(json.dumps(List))
        else:
            return HttpResponse("noSuchThing")
    except Exception as err:
        print err

