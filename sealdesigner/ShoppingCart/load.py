# -*- coding: utf-8 -*-
# coding=utf-8
import threading
import time, datetime
import uuid

from django.shortcuts import render_to_response
from django.http import HttpResponse, HttpResponseRedirect
from django.template import RequestContext
# from Seal.models import ParentMeterialClass, Sealclass, MaterialQuality,Information
from Seal.models import Information, Administrator, Material, SealClass, IndexPicture, News
# from Seal.AnnouncementView import InitInformationDB
import json
from django.http import HttpResponse
from django.shortcuts import render
from Users.views import userskip,judgeuser

from ShoppingCart.models import Trolley
from Users.models import Privilege, PricilegeType
from django.db import transaction

@judgeuser
@userskip
def submitOrder(req):
    """
    提交订单
    :param req:
    :return:
    """
    try:
        trollers = []
        userId = req.COOKIES.get('userId')
        price = 0
        trollerId = req.GET["trollerId"]
        trollerIdArray = trollerId.split("!")
        for trolleyOneId in trollerIdArray:
            troller = Trolley.objects.get(trollerId=trolleyOneId)
            price = price + troller.materialPrice
            # if troller.userId_i
            # d==userId:
            trollers.append(troller)
        privilegeList = Privilege.objects.filter(userId_id=userId)
        privileges = []  # 优惠券
        for privilege in privilegeList:
            if privilege.isUsed:
                continue
            if privilege.privilegeTypeId.privilegeAll<=price and privilege.privilegeTypeId.isShow:
                nowTime = datetime.datetime.now()
                if privilege.privilegeTypeId.privilegePast> nowTime and privilege.privilegeTypeId.privilegeStart< nowTime:
                    privileges.append(privilege)
        return render_to_response('ShoppingCart/submitOrder/submitOrder.html',{"trollers":trollers, "privileges":privileges})
    except Exception as err:
        print err
        return HttpResponse("<script type='text/javascript'>alert('系统出现异常，请重新选择！');javascript:history.go(-1);</script>")


@judgeuser
@userskip
def sellseal(req):
    """
    印章
    :param req:
    :return:
    """
    return render_to_response('ShoppingCart/schedule.html')

@judgeuser
@userskip
def trolley(req):
    """
    购物车一级页面
    :param req:
    :return:
    """
    return render_to_response('Users/first/trolley.html')

@judgeuser
@userskip
def personalCenter(req):
    """
    购物车一级页面
    :param req:
    :return:
    """
    return render_to_response('Users/first/personalCenter.html')


def modeldown(req):
    """
    模板页面
    :param req:
    :return:
    """
    return render_to_response('Users/modeldown.html')



def seallist(req):
    """
    内联框架
    商品图片
    :param req:
    :return:
    """
    if 'materialsId' in  req.GET:
        return render_to_response('ShoppingCart/seallist.html',{"materialsId":req.GET['materialsId']})
    else:
        return render_to_response('ShoppingCart/seallist.html')

@judgeuser
@userskip
def configureSeal(req):
    """
    章材配置
   :param req:
    :return:
    """
    try:
        sealId = req.GET["sealId"]
        seal = Material.objects.get(materialId=sealId)
        if seal.sealClassId.parentClassId_id=="3":
            return render_to_response('ShoppingCart/submitOrder/submitOrder.html',{"materialId":sealId})
        if seal.isShow==1:
            return render_to_response('ShoppingCart/configureSeal.html',{"sealId":sealId})
        else:
            return HttpResponse("<script type='text/javascript'>alert('该商品已下架，请重新选择！');javascript:history.go(-1);</script>")
    except Exception as err:
        print err
        return HttpResponse("<script type='text/javascript'>alert('系统出现异常，请重新选择！');javascript:history.go(-1);</script>")


# 关于我们框架
def aboutUs(req):
    """
    关于我们首页：企业介绍
    :param req:
    :return:
    """
    try:
        announcementList = Information.objects.all()
        if not announcementList.exists():
            for item in range(1, 7):
                admin = Administrator.objects.all()
                Information.objects.create(informationId=item, adminId=admin[0], informationContent="暂无内容",
                                           createTime=time.time(), informationType=item)
        aboutUs = Information.objects.get(informationId='4')
        return render(req, "ShoppingCart/aboutUs/aboutUs.html",
                      {'AboutUs': aboutUs.informationContent,})
    except Exception as err:
        print err
    return render_to_response('ShoppingCart/aboutUs/aboutUs.html')


# 新闻内容页
def newsContent(req):
    """
    新闻内容页
    :param req:
    :return:
    """
    newsId = req.GET["newsId"]
    oneNew = News.objects.get(newsId=newsId)
    return render_to_response('ShoppingCart/news/newsContent.html', {"oneNew": oneNew})


def newsList(req):
    """
    新闻列表页
    :param req:
    :return:
    """
    # 新闻
    news = News.objects.filter(status=1).order_by("-createTime")
    total = len(news)  # 获取符合条件的信息数
    if "page" in req.GET:
        page = int(req.GET["page"])  # 当前页数
    else:
        page = 1
    nowPage = (page - 1) * 15  # 起始信息条数
    lastPage = nowPage + 15  # 最终信息条数
    newsList = news.order_by("-createTime")[nowPage:lastPage]
    return render_to_response('ShoppingCart/news/newsList.html',{"newsList": newsList, "total": total})


def contactUs(req):
    """
    联系我们
    :param req:
    :return:
    """
    try:
        announcementList = Information.objects.all()
        if not announcementList.exists():
            for item in range(1, 7):
                admin = Administrator.objects.all()
                Information.objects.create(informationId=item, adminId=admin[0], informationContent="暂无内容",
                                           createTime=time.time(), informationType=item)
        contactUs = Information.objects.get(informationId='5')
        return render(req, "ShoppingCart/aboutUs/contactUs.html",
                      {'ContactUs': contactUs.informationContent,})
    except Exception as err:
        print err
    return render_to_response("ShoppingCart/aboutUs/contactUs.html")

def solutionProblem(req):
    """
    常见问题解决
    :param req:
    :return:
    """
    try:
        announcementList = Information.objects.all()
        if not announcementList.exists():
            for item in range(1, 7):
                admin = Administrator.objects.all()
                Information.objects.create(informationId=item, adminId=admin[0], informationContent="暂无内容",
                                           createTime=time.time(), informationType=item)
        solutionProblem = Information.objects.get(informationId='6')
        return render(req, "ShoppingCart/aboutUs/solutionProblem.html",
                      {'SolutionProblem': solutionProblem.informationContent,})
    except Exception as err:
        print err
    return render_to_response("ShoppingCart/aboutUs/solutionProblem.html")


def index(req):
    """
    网站首页
    :param req:
    :return:
    """
    try:
        # 优惠劵
        pricilegeType = PricilegeType.objects.filter(isShow=1).order_by("privilegeStart")
        pricilegeTypes = []
        pricilegeNum = 0

        if pricilegeType.exists():
            pricilegeNum = 0
            for pricilegeType in pricilegeType:
                nowTime = datetime.datetime.now()
                if pricilegeType.privilegePast > nowTime and pricilegeType.total > 0 and pricilegeType.isShow:   # 过期或优惠劵领取完的不再显示
                    pricilegeTypeList = {}
                    pricilegeTypeList["privilegePrice"] = str(int(pricilegeType.privilegePrice))
                    pricilegeTypeList["privilegeAll"] = str(int(pricilegeType.privilegeAll))
                    pricilegeTypeList["privilegeStart"] = pricilegeType.privilegeStart.strftime('%m/%d')
                    pricilegeTypeList["privilegePast"] = pricilegeType.privilegePast.strftime('%m/%d')
                    pricilegeTypeList["privilegeTypeId"] = pricilegeType.privilegeTypeId
                    pricilegeTypes.append(pricilegeTypeList)
                    pricilegeNum += 1
                    # if pricilegeNum>=4:   # 设置只获取4张优惠劵
                    #     break
        pricilegeLength = pricilegeNum   # 优惠劵个数
        # 优惠劵结束
        material = Material.objects.filter(isSecommendation=True).order_by("-createTime")
        material1 = []
        material2 = []
        for item in SealClass.objects.filter(parentClassId_id=1):
            material1.extend(material.filter(sealClassId=item))
        for item in SealClass.objects.filter(parentClassId_id=2):
            material2.extend(material.filter(sealClassId=item))
        material1 = material1[:5]
        material2 = material2[:5]

        announcementList = Information.objects.all()
        if not announcementList.exists():
            for item in range(1, 7):
                admin = Administrator.objects.all()
                Information.objects.create(informationId=item, adminId=admin[0], informationContent="暂无内容",
                                           createTime=time.time(), informationType=item)
        homeAboutUs = Information.objects.get(informationId='1')
        homeFlowChart = Information.objects.get(informationId='2')
        HomeAD = Information.objects.get(informationId='3')

        if pricilegeLength > 4:   # 优惠劵大于4时
            return render(req, "ShoppingCart/index.html",
                      {'HomeAboutUs': homeAboutUs.informationContent,
                       'homeFlowChart': homeFlowChart.informationContent,
                       'HomeAD': HomeAD.informationContent,
                       "material1":material1,
                       "material2":material2,
                       "pricilegeTypes":pricilegeTypes,
                       "pricilegeLength":pricilegeLength
                       })
        else:    # 优惠劵小于4时
            return render(req, "ShoppingCart/index.html",
                          {'HomeAboutUs': homeAboutUs.informationContent,
                           'homeFlowChart': homeFlowChart.informationContent,
                           'HomeAD': HomeAD.informationContent,
                           "material1":material1,
                           "material2":material2,
                           "pricilegeTypes":pricilegeTypes
                           })
    except Exception as err:
        print err
        return render_to_response("ShoppingCart/index.html")


def getNewsList(req):
    """
    获取新闻列表
    :param req: 
    :return: 
    """
    # 新闻
    news = News.objects.filter(status=1).order_by("-createTime")
    List = []
    for item in news:
        oneNew = {}
        oneNew["newsId"] = item.newsId
        oneNew["title"] = item.title
        oneNew["link"] = item.link
        oneNew["createTime"] = item.createTime.strftime('%Y-%m-%d')
        if item.newsType:
            oneNew["newsType"] = 1
        else:
            oneNew["newsType"] = 0
        List.append(oneNew)
    return HttpResponse(json.dumps(List))



threadLock = threading.Lock()  # 获得锁
def privilege(req):
    """
    用户领取优惠劵
    :param req:
    :return:
    """
    threadLock.acquire()  # 加锁
    try:
        with transaction.atomic():
            if req.COOKIES.has_key("userId"):
                userId = req.COOKIES.get("userId")
                privilegeTypeId = req.POST["privilegeTypeId"]
                privilege = Privilege.objects.filter(privilegeTypeId_id=privilegeTypeId).filter(userId_id=userId)
                if privilege.exists():
                    threadLock.release()  # 解除锁
                    return HttpResponse(3)
                pricilegeType = PricilegeType.objects.get(privilegeTypeId=privilegeTypeId)
                if pricilegeType.total != 0:
                    pricilegeType.total = pricilegeType.total-1
                    pricilegeType.save()
                else:
                    threadLock.release()  # 解除锁
                    return HttpResponse(2)
                privilegeId = uuid.uuid1()  # 给添加的优惠劵生成一天随机id
                userId = req.COOKIES.get("userId")
                privilege = Privilege(privilegeId=privilegeId, userId_id=userId, privilegeTypeId_id=privilegeTypeId)
                privilege.save()
                 # 优惠劵领取成功
                threadLock.release()  # 解除锁
                return HttpResponse(1)
            else:
                threadLock.release()  # 解除锁
                return HttpResponse(4)
    except Exception as err:
        print err
        return HttpResponse(0)





def indexPicture(req):
    """
    首页轮播图片展示
    :param req:
    :return:
    """
    List = []
    indexPictures = IndexPicture.objects.filter(picPlace=3).order_by("-createTime")[:3]
    for indexPicture in indexPictures:
        indexPictureList = {}
        indexPictureList["picUrl"] = indexPicture.picUrl
        List.append(indexPictureList)
    return HttpResponse(json.dumps(List))

def productDetails(req):
    """
    商品详情页
    :param req:
    :return:
    """
    materialId= req.GET["materialId"]
    material = Material.objects.get(materialId=materialId)
    parentClassId=material.sealClassId.parentClassId_id
    return render_to_response("ShoppingCart/productDetails.html",{"materialId":materialId,"parentClassId":parentClassId})

def uploadDoc(req):
    """
    用户文件上传测试
    :return:
    """
    return render_to_response("ShoppingCart/文件上传测试.html")

def _trolleyInfoLoad(req):
    """
    order购物车详情页
    :param req:
    :return:
    """
    if 'orderState' not in req.GET:
        trolleyId=req.GET['trolleyId']
        return render_to_response("Users/second/_trolley.html",{'trolleyId':trolleyId,'orderState':1})
    if 'orderState' in req.GET:
        trolleyId=req.GET['trolleyId']
        orderState=req.GET['orderState']
        return render_to_response("Users/second/_trolley.html",{'trolleyId':trolleyId,'orderState':orderState})

def TrolleyInfoLoadTwo(req):
    """
    购物车详情页
    :param req:
    :return:
    """
    trolleyId=req.GET['trolleyId']
    comeFrom=req.GET['comeFrom']
    print 1234
    return render_to_response("Users/second/_trolley.html",{'trolleyId':trolleyId,'comeFrom':comeFrom})
