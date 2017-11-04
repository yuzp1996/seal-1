# -*- coding: utf-8 -*-
# coding=utf-8

import os
from django.conf.urls import url
from sealdesigner.settings import STATICFILES_DIRS
from views import validate
from sellseal import seal_parent, seal_son, seal_materia,sealClassChange,choseShow,materialSearch,searchMaterials
from submitOrder import submitOrder_AddressList, saveOrder, getPayStyle, userAddressList
from load import index,sellseal,seallist,modeldown,aboutUs,contactUs,solutionProblem,productDetails, submitOrder, configureSeal, TrolleyInfoLoadTwo,uploadDoc,\
    _trolleyInfoLoad, indexPicture, privilege,trolley,personalCenter, newsContent, newsList, getNewsList
from productDetail import lookMaterial, getMaterialColor, submitSeal, getCommentList
from trolleyViews import TrolleyInfo,materialMinuteInfo,changeOfShoppingCart,ShoppingUploadFile,deleteShoppingCart,changeOfShoppingCart,getMateClass,dataIsUpload
import configureSealViews



urlpatterns = {
    url(r'^index$', index),
    url(r'^validate$', validate),
    #商品列表
    url(r'^sellseal$', sellseal),
    url(r'^seallist$', seallist),
    url(r'^configureSeal$', configureSeal),
    url(r'^seal_parent$', seal_parent),
    url(r'^seal_son$', seal_son),
    url(r'^materialSearch$',materialSearch),
    url(r'^seal_materia$', seal_materia),
    url(r'^searchMaterials$', searchMaterials),
    url(r'^getNewsList$', getNewsList),

    # 关于我们
    url(r'^aboutUs$', aboutUs),
    url(r'^contactUs$', contactUs),
    url(r'^solutionProblem', solutionProblem),
    url(r'^newsContent$', newsContent),
    url(r'^newsList$', newsList),

    # 购物车页面跳转
    url(r'^trolley', trolley),
    url(r'^personalCenter', personalCenter),
    # 首页轮播展示
    url(r'^indexPicture$',indexPicture),
    ############
    #优惠劵
    url(r'^privilege$', privilege),

    url(r'^sealClassChange$',sealClassChange),
    url(r'^seal_materia$',seal_materia),
    url(r'^choseShow$',choseShow),

    url(r'^submitOrder$', submitOrder),
    url(r'^productDetails$',productDetails),
    # 商品详情
    url(r'^getMaterialColor$',getMaterialColor),
    url(r'^lookMaterial$',lookMaterial),
    url(r'^submitSeal$',submitSeal),
    url(r'^getCommentList$',getCommentList),
    #  提交订单
    url(r'^submitOrder_AddressList$',submitOrder_AddressList),
    url(r'^saveOrder$', saveOrder),
    url(r'^getPayStyle$', getPayStyle),
    url(r'^userAddressList$',userAddressList),
    # 配置章材
    url(r'^getSealInfo$',configureSealViews.getSealInfo),
    url(r'^sealUsedCompany$', configureSealViews.sealUsedCompany),
    url(r'^getFormatInfor$', configureSealViews.getFormatInfor),
    url(r'^getCompanyInfo$', configureSealViews.getCompanyInfo),
    url(r'^getStatementList$', configureSealViews.getStatementList),
    url(r'^getStatementInfo$', configureSealViews.getStatementInfo),
    url(r'^uploadFile$', configureSealViews.uploadFile),
    url(r'^upload$', uploadDoc),
    url(r'^saveTrolley$', configureSealViews.saveTrolley),
    #购物车
    url(r'^TrolleyInfo$',TrolleyInfo),
    url(r'^_trolleyInfoLoad$',_trolleyInfoLoad),
    url(r'^TrolleyInfoLoadTwo$',TrolleyInfoLoadTwo),
    url(r'^materialMinuteInfo$',materialMinuteInfo),
    url(r'^changeOfShoppingCart$',changeOfShoppingCart),
    url(r'^ShoppingUploadFile$',ShoppingUploadFile),
    url(r'^deleteShoppingCart$',deleteShoppingCart),
    url(r'^getMateClass$',getMateClass),
    url(r'^dataIsUpload$',dataIsUpload),

    url(r'^modeldown$',modeldown),

}