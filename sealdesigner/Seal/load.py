# -*- coding: utf-8 -*-
# coding=utf-8
from django.shortcuts import render_to_response


from views import adminskip, judgeadmin
from django.http import HttpResponse
from django.template import RequestContext
from Users.models import PricilegeType, Privilege,User
from Seal.models import News
import indexData



@judgeadmin
@adminskip
def adminindex(req):
    """
    后台首页
    """
    if 'name' in req.GET:
        userId = req.GET['userId']
        name = req.GET['name']
        return render_to_response('Seal/second/_index.html',{'userId': userId, 'name':name})
    return render_to_response('Seal/first/index.html')

@judgeadmin
@adminskip
def citylist(req):
    """
    地区列表界面
    """
    return render_to_response('Seal/first/citylist.html')


@judgeadmin
@adminskip
def fontAndColor(req):
    """
    字体和颜色配置界面
    :param req:
    :return:
    """
    return render_to_response('Seal/first/fontAndColor.html')

@judgeadmin
@adminskip
def formatEdit(req):
    """
    版式配置界面
    :param req:
    :return:
    """
    return render_to_response('Seal/first/formatEdit.html')


@judgeadmin
@adminskip
def stuffAdmin(req):
    """
    章材管理界面
    """
    return render_to_response('Seal/first/stuffAdmin.html')


@judgeadmin
@adminskip
def classification(req):
    """
    类别管理界面
    """
    return render_to_response('Seal/first/classification.html')


@judgeadmin
@adminskip
def package(req):
    """
    套餐管理界面
    """
    return render_to_response('Seal/first/package.html')


@judgeadmin
@adminskip
def data(req):
    """
    资料管理界面
    """
    return render_to_response('Seal/first/data.html')


@judgeadmin
@adminskip
def order(req):
    """
    订单管理界面
    """
    return render_to_response('Seal/first/order.html')


@judgeadmin
@adminskip
def coupon(req):
    """
    优惠券管理界面
    """
    pageNum = int(req.GET["pageNum"])
    pricilegeTypes = PricilegeType.objects.all().exclude(isShow=0).order_by("privilegeStart")   # 按照开始时间排序
    allPricilegeTypeTotal = len(pricilegeTypes)
    nowPage = (pageNum-1)*10  # 起始信息条数
    lastPage = nowPage+10
    pricilegeTypes = pricilegeTypes[nowPage:lastPage]   # 选出除了不显示（isShow=0）以外的优惠劵
    return render_to_response('Seal/first/coupon.html', {"pricilegeTypes": pricilegeTypes, "allPricilegeTypeTotal":allPricilegeTypeTotal, "page":pageNum})


@judgeadmin
@adminskip
def _coupon(req):
    """
    优惠券匹配用户界面
    """
    privilegeTypeId= req.GET["privilegeTypeId"]   # 获取一级界面传过来的参数
    privilegeType = PricilegeType.objects.get(privilegeTypeId=privilegeTypeId)
    privilegeName = privilegeType.privilegeName
    privilegePast = privilegeType.privilegePast.strftime('%Y/%m/%d %H:%M:%S')   # 优惠券过期时间转换
    privilegeStart = privilegeType.privilegeStart.strftime('%Y/%m/%d %H:%M:%S')
    privileges = Privilege.objects.filter(privilegeTypeId_id=privilegeTypeId)
    privilegeList = []
    if privileges.exists():
        userIdJson = []
        for privilege in privileges:
            userId = privilege.userId_id
            if userId in userIdJson:
                continue
            else:
                userIdJson.append(userId)
        for userId in userIdJson:
            privilegeJson = {}   # json用于放键值对
            used = 0
            noUsed = 0
            privilegeBelongUser = privileges.filter(userId_id=userId)
            for onePrivilege in privilegeBelongUser:
                if onePrivilege.isUsed:  # 布尔型，如果为真，执行if语句，为假，执行else
                    used = used +1
                else:
                    noUsed = noUsed + 1
            # if noUsed==0:   # 如果没有剩余的优惠劵，结束循环
            #     continue
            privilegeJson["used"] = str(used)
            privilegeJson["noUsed"] = str(noUsed)
            privilegeJson["userName"] = User.objects.get(userId=userId).userName  # 直接写，也可以分多步
            privilegeJson["privilegeStart"] = privilegeStart
            privilegeJson["privilegePast"] = privilegePast
            privilegeList.append(privilegeJson)
    return render_to_response("Seal/second/_coupon.html",{"privilegeList":privilegeList,"privilegeName":privilegeName})


@judgeadmin
@adminskip
def announcement(req):
    """
    公告管理管理界面
    """
    return render_to_response('Seal/first/announcement.html')


@judgeadmin
@adminskip
def manager(req):
    """
    管理员管理界面
    """
    return render_to_response('Seal/first/manager.html')


@judgeadmin
@adminskip
def managerclass(req):
    """
    管理员类别管理界面
    """
    return render_to_response('Seal/first/managerclass.html')


@judgeadmin
@adminskip
def log(req):
    """
    日志管理界面
    """
    return render_to_response('Seal/first/log.html')


@judgeadmin
@adminskip
def _order(req):
    """
    订单详情界面
    """
    return render_to_response('Seal/second/_order.html')


@judgeadmin
@adminskip
def _manager(req):
    """
    添加管理员
    """
    return render_to_response('Seal/second/_manager.html')


@judgeadmin
@adminskip
def _classification(req):
    """
    添加类别
    """
    return render_to_response('Seal/second/_classification.html')


@judgeadmin
@adminskip
def EterpriseType(req):
    """
    企业类型管理
    """
    return render_to_response('Seal/first/EnterpriseType.html')



@judgeadmin
@adminskip
def Sealstatement(req):
    """
    非首次刻章声明
    """
    return render_to_response('Seal/first/Sealstatement.html')

@judgeadmin
@adminskip
def _index(req):
    """
    客户详细信息界面
    """
    return render_to_response('Seal/second/_index.html')

@judgeadmin
@adminskip
def _order(req):
    """
    订单详情界面
    """
    return render_to_response('Seal/second/_order.html')


@judgeadmin
@adminskip
def _manager(req):
    """
    添加管理员
    """
    return render_to_response('Seal/second/_manager.html')

@judgeadmin
@adminskip
def _classification(req):
    """
    添加类别
    """
    return render_to_response('Seal/second/_classification.html')

@judgeadmin
@adminskip
def fontandcolor(req):
    """
    商品基础数据
    """
    return render_to_response('Seal/first/fontandcolor.html')


@judgeadmin
@adminskip
def Sealstatement(req):
    """
    非首次刻章声明
    """
    return render_to_response('Seal/first/Sealstatement.html')

def _announcement(req):
    if req.POST.has_key("name"):
        return render_to_response('Seal/first/log.html')
    return render_to_response("Seal/second/_announcement.html")


@judgeadmin
@adminskip
def newsLists(req):
    """
    新闻列表界面
    """
    if "deleteId" in req.GET:
        deleteId = req.GET["deleteId"]
        news = News.objects.get(newsId = deleteId)
        news.delete()
        return HttpResponse(""
                     "<script>"
                     "alert('删除成功');"
                     "window.location.href = '/Seal/newsLists';"
                     "</script>"
                     "")
    newsLists = News.objects.all().order_by("-createTime")
    return render_to_response("Seal/first/newsLists.html", {"newsLists": newsLists})


@judgeadmin
@adminskip
def newsManagement(req):
    """
    新闻管理界面
    """
    if "changeId" in req.GET:
        changeId = req.GET["changeId"]
        news = News.objects.get(newsId = changeId)
        return render_to_response("Seal/first/newsManagement.html",{"news": news})
    else:
        return render_to_response("Seal/first/newsManagement.html")


@judgeadmin
@adminskip
def pictureShow(req):
    """
    展示图片管理界面
    """
    return render_to_response("Seal/first/pictureshow.html")



@judgeadmin
@adminskip
def _pictureshow(req):
    """
    展示图片管理界面
    """


@judgeadmin
@adminskip
def pictureAdd(req):
    """
    图片添加页面
    :param req:
    :return:
    """
    return render_to_response("Seal/second/_pictureshow.html")

@judgeadmin
@adminskip
def _data(req):
    """
    商品管理二级界面
    """
    return render_to_response("Seal/second/_data.html")

@judgeadmin
@adminskip
def _classdetail(req):
    """
    商品类别详细信息界面
    """
    return render_to_response("Seal/second/_classdetail.html")

@judgeadmin
@adminskip
def inFor(req):
      """
      用于商品详情与修改的跳转
      :param req:
      :return:
      """
      if req.GET["way"]=="look":
          return render_to_response('Seal/second/_data.html',{"action":"look","mateId":req.GET['id']})
      if req.GET["way"]=="change":
          return render_to_response('Seal/second/_data.html',{"action":"change","mateId":req.GET['id'],"pictureUrl":req.GET['pictureUrl']})


@judgeadmin
@adminskip
def dingxiang(request):
    """
    定向到图片信息页面
    :param request:
    :return:
    """
    if request.GET['way']=='look':
        return render_to_response('Seal/second/_pictureshow.html',{"action":"look","pictureid":request.GET['id']})
    if request.GET['way']=='change':
        return render_to_response('Seal/second/_pictureshow.html',{"action":"change","pictureid":request.GET['id'],"picUrl":request.GET['URL']})


@judgeadmin
@adminskip
def serviceindex(req):
    """
    客服聊天界面
    """
    return render_to_response('Seal/serviceIndex.html')




