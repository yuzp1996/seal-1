# -*- coding: utf-8 -*-
# coding=utf-8

from django.conf.urls import url
import views
from load import userDetails, receiptAddress, personalCenter,trolley,_trolley,myOrder,orderEvaluate,contactservice
from ShopAddress import shopAddresssub, optionProvince, optionArea, getAddressList,getAddress, changeAddress, deleteAddress
from OrderData import getOrderInfo, getOrdershow,getOrdershowyifu,getOrdershowdaifu
from userDetails import selectArea, getProvince, getUserInformation, userSave
from personalCenter import getUserInfor, getOrders
from nav import logout, getUserName
from myOrder import getOrderList,deleteOrder,cancelOrder,getMaterialInformation,addComment
from orderDetail import lookOrder,orderDetailAddress,takeGoods


urlpatterns = [
    url(r'^userLogin$', views.userLogin),
    url(r'^userlogout$', views.userlogout),
    url(r'^userRegister$', views.userRegister),
    url(r'^userResetPassword$', views.userResetPassword),
    url(r'^emailgetvaliate$', views.emailgetvaliate),
    url(r'^userResetPassword2$',views.userResetPassword2),
    url(r'^ResetPasswordFinnal$',views.ResetPasswordFinnal),
    url(r'^securityAccess$',views.securityAccess),
    url(r'^imgShow$', views.imgShow),
    url(r'^getOrderInfo$', getOrderInfo),
    url(r'^getOrdershow$', getOrdershow),
    url(r'^getOrdershowyifu$',getOrdershowyifu), 
    url(r'^getOrdershowdaifu$',getOrdershowdaifu),
    #url(r'^shopAddresssub$',shopAddresssub),
    url(r'^getAddressList$',getAddressList),
    url(r'^getAddress$',getAddress),
    url(r'^changeAddress$',changeAddress),
    url(r'^deleteAddress$',deleteAddress),
    url(r'^shopAddresssub$',shopAddresssub),
    url(r'^optionProvince$',optionProvince),
    url(r'^optionArea$',optionArea),
    url(r'^logout$', logout),
    url(r'^uerInfoInTop$',views.uerInfoInTop),


    # 用户信息详情
    url(r'^userDetails$', userDetails),
    url(r'^selectArea$', selectArea),
    url(r'^getProvince$', getProvince),
    url(r'^getUserInformation$', getUserInformation),
    url(r'^getUserName$', getUserName),
    url(r'^userSave$', userSave),

    # 用户中心
    url(r'^receiptAddress$', receiptAddress),

    # 个人中心
    url(r'^personalCenter$', personalCenter),
    url(r'^getUserInfor$', getUserInfor),
    url(r'^getOrders$', getOrders),

    #购物车
    url(r'^trolley$', trolley),
    url(r'^_trolley$', _trolley),
    # 用户订单
    url(r'^myOrder$', myOrder),
    url(r'^orderEvaluate$', orderEvaluate),
    url(r'^getOrderList$',getOrderList),
    url(r'^deleteOrder$',deleteOrder),
    url(r'^cancelOrder$',cancelOrder),
    url(r'^lookOrder$',lookOrder),
    url(r'^orderDetailAddress$',orderDetailAddress),
    url(r'^getMaterialInformation$',getMaterialInformation),
    url(r'^takeGoods$',takeGoods),
    url(r'^addComment$',addComment),

    url(r'^contactservice', contactservice),
]
