# -*- coding: utf-8 -*-
# coding=utf-8

from django.conf.urls import url
from views import login, logout,ueditor_ImgUp,ueditor_FileUp,ueditor_getRemoteImage,ueditor_ScrawUp,ueditor_getMovie,ueditor_imageManager
from load import adminindex, stuffAdmin, citylist, classification, package, data, order, coupon, announcement, manager, managerclass, log, _announcement, _order, _manager, fontandcolor, EterpriseType, Sealstatement, _classification,_coupon,pictureShow,_pictureshow,\
    _index, formatEdit, fontAndColor,pictureAdd,_data,_classdetail,inFor,dingxiang,serviceindex, newsManagement, newsLists
from indexData import selectProvince, selectArea, orderBy, getAdminName, lookUser,picinfo,userInfoSave, _indexGetOrders
from cityListViews import getCityList, addPlace, provinceList, getArea, changeArea
from orderViews import getLists,getDetailmaterial,getLink,getDetailPeople,getDetailOrder,changeState,savemessage,getresponse
from enterpriseTypeViews import companyList, datatypeList, enterpriseInfoSave, dataTypeInfoOne, dataTypeOneDelete, companyOneDelete, getOneDataTypeId, changeCompanyInfo
from sealStatementViews import statementDataTypeList, oneStatementDelete, statementList, sealStatementInfoSave, sealStatementInfoOne, getOneStatementId, changeStatementInfo, statementOneDelete
#优惠劵管理
from coupon import savePrivilege, privilegeDelete, getPage
# 材质管理
from stuffAdminViews import getMaterialList, getMaterial, addNewMaterial, deleteMaterial, changeMaterial
from AnnouncementView import GetAnnouncementList,GetSingleItem,DisaplySingleItem,SaveChange, addNews
from pictureViews import getOnePictureInfo,picinfos,addOnePicture,deleteOnePicture,changeOnepicture,delefilepic
from fontandcolor import getcolors, addcolor, changecolor, savechangecolor, getfonts, addfont, changefont,savechangefont
from classification import getSealClass, getSeal_ParentMeterialClass, getEnterpriseType, getfont1,getfont2,addSealClass,getFormatPicture,getBasicData,getLeftCompany,getRightCompany,getLeftFont,getRightFont,saveBasicData,saveCompany,saveFont,getFormatPicture1,saveFormat,deleteSealClass
from dataViews import imgupload,getAdminName,getChapter,getCommodity,getMaterials,commodityAdd,getGoods,getMaterInfor,materialChange,deleteOneMaterialPicture,getCommodityOne,getColor,deleteMaterials,colorColor
from formatEditViews import getFormatEditList, formatSave, formatInfoOne, getOneFormatInformationId, changeFormatInfo, deleteFormat, deleteFormatInfomation
from chatroom import postUser,selectService,loadContactList,sendMsg,getMsg
from news import newscome
urlpatterns = [
    #new order come
    url(r'^newscome$', newscome),
    url(r'^imgupload$', imgupload),
    url(r'^login$', login),
    url(r'^adminindex$', adminindex),
    url(r'^logout$', logout),
    url(r'^citylist$', citylist),
    url(r'^fontAndColor$',fontAndColor),
    url(r'^formatEdit$',formatEdit),
    url(r'^classification$', classification),
    url(r'^package$', package),
    # url(r'^medium$', medium),
    url(r'^data$', data),
    url(r'^order$', order),
    url(r'^coupon$', coupon),
    url(r'^announcement', announcement),
    url(r'^manager$', manager),
    url(r'^managerclass$', managerclass),
    url(r'^citylist$', citylist),
    url(r'^log$', log),
    url(r'^stuffAdmin$', stuffAdmin),
    url(r'^_data',_data),
    url(r'^inFor$',inFor),
    url(r'^dingxiang',dingxiang),


    #客户列表
    url(r'^selectProvince', selectProvince),
    url(r'^selectArea', selectArea),
    url(r'^orderBy', orderBy),
    url(r'^getAdminName', getAdminName),
    url(r'^lookUser',lookUser),
    url(r'^userInfoSave',userInfoSave),

    #客户详细信息
    url(r'^_index$',_index),
    url(r'^_indexGetOrders$',_indexGetOrders),

    #百度UI
    url(r'^ueditor_imgup$',ueditor_ImgUp),
    url(r'^ueditor_fileup$',ueditor_FileUp),
    url(r'^ueditor_getRemoteImage$',ueditor_getRemoteImage),
    url(r'^ueditor_scrawlUp$',ueditor_ScrawUp),
    url(r'^ueditor_getMovie$',ueditor_getMovie),
    url(r'^ueditor_imageManager$',ueditor_imageManager),

    #地区列表
    url(r'^getCityList',getCityList),
    url(r'^addPlace',addPlace),
    url(r'^provinceList',provinceList),
    url(r'^getArea',getArea),
    url(r'^changeArea',changeArea),
    # 订单管理
    url(r'^getLists$',getLists),
    url(r'^getDetailmaterial$',getDetailmaterial),
    url(r'^getDetailPeople$',getDetailPeople),
    url(r'^getLink$',getLink),
    url(r'^getDetailOrder$',getDetailOrder),
    # url(r'^lookOrder',lookOrder),
    url(r'^changeState$',changeState),
    url(r'^savemessage$',savemessage),
    url(r'^getresponse$',getresponse),

    # 企业类型
    url(r'^companyList$', companyList),
    url(r'^datatypeList$', datatypeList),
    url(r'^enterpriseInfoSave$', enterpriseInfoSave),
    url(r'^dataTypeInfoOne$', dataTypeInfoOne),
    url(r'^companyOneDelete$', companyOneDelete),
    url(r'^dataTypeOneDelete$', dataTypeOneDelete),
    url(r'^getOneDataTypeId$', getOneDataTypeId),
    url(r'^changeCompanyInfo$', changeCompanyInfo),

    #二次刻章声明
    url(r'^statementDataTypeList', statementDataTypeList),
    url(r'^statementList$', statementList),
    url(r'^sealStatementInfoSave$', sealStatementInfoSave),
    url(r'^sealStatementInfoOne$',sealStatementInfoOne),
    url(r'^getOneStatementId$', getOneStatementId),
    url(r'^changeStatementInfo$', changeStatementInfo),
    url(r'^statementOneDelete$', statementOneDelete),
    url(r'^oneStatementDelete$', oneStatementDelete),

    ##########################################################################
    url(r'^getSeal_ParentMeterialClass$', getSeal_ParentMeterialClass),
    url(r'^getSealClass$', getSealClass),
    url(r'^getEnterpriseType$',getEnterpriseType),
    url(r'^getfont1$',getfont1),
    url(r'^getfont2$',getfont2),
    url(r'^addSealClass$',addSealClass),
    url(r'^getFormatPicture$',getFormatPicture),
    url(r'^getBasicData$',getBasicData),
    url(r'^getLeftCompany$',getLeftCompany),
    url(r'^getRightCompany$',getRightCompany),
    url(r'^getLeftFont$',getLeftFont),
    url(r'^getRightFont$',getRightFont),
    url(r'^saveBasicData$',saveBasicData),
    url(r'^saveCompany$',saveCompany),
    url(r'^saveFont$',saveFont),
    url(r'^getFormatPicture1$',getFormatPicture1),
    url(r'^saveFormat$',saveFormat),
    url('^deleteSealClass',deleteSealClass),


    #材质管理
    url(r'^getMaterialList',getMaterialList),
    url(r'^getMaterial$',getMaterial),
    url(r'^addNewMaterial$',addNewMaterial),
    url(r'^deleteMaterial$',deleteMaterial),
    url(r'^changeMaterial$',changeMaterial),

    #公告管理
    url(r'^GetAnnouncementList',GetAnnouncementList),
    url(r'^_announcement', DisaplySingleItem),
    url(r'^GetSingleItem',GetSingleItem),
    url(r'^SaveChange',SaveChange),
    url(r'^EterpriseType',EterpriseType),
    url(r'^Sealstatement',Sealstatement),
    url(r'^_classification',_classification),
    url(r'^_classdetail',_classdetail),
    url(r'^addNews$',addNews),

    #字体和颜色配置
    url(r'^fontandcolor$',fontandcolor),
    url(r'^getcolors$',getcolors),
    url(r'^addcolor$',addcolor),
    url(r'^getfonts$',getfonts),
    url(r'^addfont$',addfont),
    url(r'^changecolor$',changecolor),
    url(r'^savechangecolor$',savechangecolor),
    url(r'^changefont$',changefont),
    url(r'^savechangefont$',savechangefont),


    #优惠券管理
    url(r'^_coupon', _coupon),
    url(r'^savePrivilege', savePrivilege),
    url(r'^privilegeDelete$', privilegeDelete),
    url(r'^getPage$', getPage),

    #展示图片管理
    url(r'^_pictureshow',_pictureshow),
    url(r'^pictureShow',pictureShow),
    url(r'^picinfos',picinfos),
    url(r'^getOnePictureInfo$',getOnePictureInfo),
    url(r'^addOnePicture$',addOnePicture),
    url(r'^deleteOnePicture$',deleteOnePicture),
    url(r'^changeOnepicture$',changeOnepicture),
    url(r'^pictureAdd$',pictureAdd),
    url(r'^delefilepic$',delefilepic),
    #订单管理
    url(r'^_order',_order),

    #系统管理
    url(r'^_manager',_manager),

    #商品管理
    url(r'^_data',_data),
    url(r'^getAdminName$',getAdminName),
    url(r'^getChapter$',getChapter),
    url(r'^getCommodity$',getCommodity),
    url(r'^getMaterial$',getMaterial),
    url(r'^commodityAdd$',commodityAdd),
    url(r'^getGoods$',getGoods),
    url(r'^getMaterInfor$',getMaterInfor),
    url(r'^materialChange$',materialChange),
    url(r'^deleteOneMaterialPicture$',deleteOneMaterialPicture),
    url(r'^getCommodityOne$',getCommodityOne),
    url(r'^getColor$',getColor),
    url(r'^deleteMaterial$',deleteMaterial),

    #版式管理 formatSave, formatInfoOne, getOneFormatInformationId
    url(r'^getFormatEditList$', getFormatEditList),
    url(r'^formatSave$', formatSave),
    url(r'^formatInfoOne$', formatInfoOne),
    url(r'^getOneFormatInformationId$', getOneFormatInformationId),
    url(r'^changeFormatInfo$', changeFormatInfo),
    url(r'^deleteFormat$', deleteFormat),
    url(r'^deleteFormatInfomation$', deleteFormatInfomation),



    url(r'^getChapter',getChapter),
    url(r'^getCommodity',getCommodity),
    url(r'^commodityAdd',commodityAdd),
    url(r'^getGoods',getGoods),
    url(r'^getMaterInfor',getMaterInfor),
    url(r'^materialChange',materialChange),
    url(r'^deleteOneMaterialPicture',deleteOneMaterialPicture),
    url(r'^getCommodityOne',getCommodityOne),
    url(r'^_data',_data),
    url(r'^getChapter$',getChapter),
    url(r'^getCommodity$',getCommodity),
    url(r'^commodityAdd$',commodityAdd),
    url(r'^getGoods$',getGoods),
    url(r'^getMaterInfor$',getMaterInfor),
    url(r'^materialChange$',materialChange),
    url(r'^deleteOneMaterialPicture$',deleteOneMaterialPicture),
    url(r'^getCommodityOne$',getCommodityOne),
    url(r'^getColor$',getColor),
    url(r'^getMaterials$',getMaterials),
    url(r'^deleteMaterials$',deleteMaterials),
    url(r'^colorColor$',colorColor),
    url(r'^getBasicData$',getBasicData),

    url(r'^newsManagement$', newsManagement),
    url(r'^newsLists$', newsLists),

    # #在线聊天实现
    # url(r'postUser/$',postUser),
    # url(r'^selectService$',selectService),
    # url(r'loadContactList/$',loadContactList),
    # url(r'sendMsg/$',sendMsg),
    # url(r'getMsg/$',getMsg),
    # url(r'serviceindex/$',serviceindex),


]
