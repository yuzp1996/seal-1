# -*- coding: utf-8 -*-
# coding=utf-8
import json, uuid
from django.http import HttpResponse
from Seal.models import Fonts,Colors,Format


def getcolors(req):
    """
    获取所有颜色
    :param req:
    :return:
    """
    colors=Colors.objects.order_by("-createTime")
    if len(colors) == 0:
        return HttpResponse(0)
    a = []
    for obj in colors:
        colorslist = {"colorname": obj.colorName, "colorid": obj.colorId, "isShow": obj.isShow}
        if obj.isShow == 1:
            colorslist["isShow"] = "是"
        else:
            colorslist["isShow"] = "否"
        a.append(colorslist)
    return HttpResponse(json.dumps(a))


def addcolor(req):
    """
    添加颜色
    :param req:
    :return:
    """
    try:
        id = uuid.uuid1()
        colors = req.POST["colorname"]
        radioVal = req.POST["radioVal"]
        if radioVal == "1":
            radioVal = True
        else:
            radioVal = False
        col = Colors.objects.filter(colorName=colors)
        if col.exists():
            return HttpResponse(2)#重复添加
        else:
            Colors.objects.create(colorName=colors, colorId=id, isShow=radioVal)
        return HttpResponse(1)#添加成功
    except Exception as err:
        return HttpResponse(0)

def changecolor(req):
    """
    修改颜色
    :param req:
    :return:
    """
    colors = Colors.objects.get(colorId=req.POST["colorId"])
    a = []
    colorslist={}
    colorslist["colorid"] = colors.colorId
    colorslist["colorname"] = colors.colorName
    colorslist["isShow"] =colors.isShow
    a.append(colorslist)
    return HttpResponse(json.dumps(a))

def savechangecolor(req):
    """
    确认修改颜色
    :param req:
    :return:
    """
    try:
        colorId=req.POST["colorId"]
        colors = req.POST["colorname"]
        radioVal = req.POST["radioVal"]
        if radioVal == "1":
            radioVal = True
        else:
            radioVal = False
        col = Colors.objects.get(colorId=colorId)
        if col.colorName!=colors:
            hascolor=Colors.objects.filter(colorName=colors)
            if hascolor.exists():
                return HttpResponse(2)
            else:
                Colors.objects.filter(colorId=colorId).update(colorName=colors, isShow=radioVal)
        else:
            Colors.objects.filter(colorId=colorId).update(colorName=colors, isShow=radioVal)
        return HttpResponse(1)
    except Exception as err:
        return HttpResponse(0)


def getfonts(req):
    """
    获取所有字体
    :param req:
    :return:
    """
    fonts=Fonts.objects.order_by("-createTime")
    if len(fonts) == 0:
        return HttpResponse(0)
    a = []
    for obj in fonts:
        fontslist = {"fontname": obj.fontName, "fontid": obj.fontId, "isShow": obj.isShow}
        if obj.isShow == 1:
            fontslist["isShow"] = "是"
        else:
            fontslist["isShow"] = "否"
        a.append(fontslist)
    return HttpResponse(json.dumps(a))


def addfont(req):
    """
    添加字体
    :param req:
    :return:
    """
    try:
        id = uuid.uuid1()
        fonts = req.POST["fontname"]
        radioVal = req.POST["radioVal"]
        if radioVal =="1":
            radioVal = True
        else:
            radioVal = False
        fon = Fonts.objects.filter(fontName=fonts)
        if fon.exists():
            return HttpResponse(2)#重复添加
        else:
            Fonts.objects.create(fontName=fonts, fontId=id, isShow=radioVal)
        return HttpResponse(1)#添加成功
    except Exception as err:
        return HttpResponse(0)


def changefont(req):
    """
    修改字体
    :param req:
    :return:
    """
    fonts = Fonts.objects.get(fontId=req.POST["fontId"])
    a = []
    fontslist={}
    fontslist["fontId"] = fonts.fontId
    fontslist["fontname"] = fonts.fontName
    fontslist["isShow"] = fonts.isShow
    a.append(fontslist)
    return HttpResponse(json.dumps(a))

def savechangefont(req):
    """
    确认修改字体
    :param req:
    :return:
    """
    try:
        fontId=req.POST["fontId"]
        fonts = req.POST["fontname"]
        radioVal = req.POST["radioVal"]
        if radioVal == "1":
            radioVal = True
        else:
            radioVal = False
        font = Fonts.objects.get(fontId=fontId)
        if font.fontName!=fonts:
            hasfont=Fonts.objects.filter(fontName=fonts)
            if hasfont.exists():
                return HttpResponse(2)
            else:
                Fonts.objects.filter(fontId=fontId).update(fontName=fonts, isShow=radioVal)
        else:
           Fonts.objects.filter(fontId=fontId).update(fontName=fonts, isShow=radioVal)
        return HttpResponse(1)
    except Exception as err:
        return HttpResponse(0)