#coding:utf-8

'''
        对应的model为（总计7个）：
        #用户资料  Data
        #上传附件库 UploadData
        #付款方式 Pay
        #样式 Style
        #购物车  Trolley
        #订单  Order
        #上传附件库  UploadData
        #用户提交信息表  UserSummitInfo
'''

from django.db import models
from Seal.models import Material,DataType,FormatInformation,PackagesType,Fonts,Colors, Company, Statement
from Users.models import User,Add,Privilege

# Create your models here.
#####################################
#用户资料  Data
class Data(models.Model):
    userDataId = models.CharField(max_length=36,primary_key=True)
    userId = models.ForeignKey(User)
    isShow = models.BooleanField(default=1)
    companyId = models.ForeignKey(Company)  # 不同企业对应不同的附件
    statementId = models.ForeignKey(Statement, blank=True, null=True)  # 不同重刻原因对应不同的附件
    createTime = models.DateTimeField(auto_now_add=True)  # 创建时间

##################################################
#上传附件库
class UploadData(models.Model):
    userDataId = models.ForeignKey(Data)
    dataTypeId = models.ForeignKey(DataType)
    upLoadUrl = models.CharField(max_length=200)
    upLoadTime = models.DateTimeField(auto_now_add=True)


####################################
#付款方式 Pay
class Pay(models.Model):
    payId = models.IntegerField(primary_key=True)
    payName = models.CharField(max_length=20)
    isShow = models.BooleanField(default=1)

##################################

##################################
#订单  Order
class Order(models.Model):
    orderId = models.CharField(max_length=36)  # 订单无主键  订单编号
    payId = models.ForeignKey(Pay,blank=True,null=True)
    addId = models.ForeignKey(Add)#邮寄地址
    userId = models.ForeignKey(User)#用户id
    privilegeId = models.ForeignKey(Privilege,blank=True,null=True)#优惠券id
    orderDate = models.DateTimeField(auto_now_add=True)#订单日期
    isPaid = models.BooleanField(default=0)#是否付款
    isIvoice = models.BooleanField(default=0)#是否开具发票
    logistics = models.CharField(max_length=36,blank=True, null=True)#物流单号
    invoiceHead = models.CharField(max_length=50, blank=True, null=True)#发票抬头
    orderRemark = models.TextField(blank=True, null=True) #客户订单备注
    invoiceDetail = models.CharField(max_length=20,blank=True, null=True)  # 发票明细
    responseMessage = models.TextField(blank=True, null=True) # 客服反馈信息
    expressNum = models.CharField(max_length=50,blank=True, null=True)#发货人员编号
    orderState = models.IntegerField()#订单状态
    payPrice = models.DecimalField(max_digits=20,decimal_places=2)  #最后支付价格
    changeDate = models.DateTimeField(auto_now=True)#管理员最新处理时间
    dateIsDeal = models.BooleanField(default=0)#资料是否审核

# 购物车  Trolley
class Trolley(models.Model):
    trollerId = models.CharField(max_length=36,primary_key=True)
    userDataId=models.ForeignKey(Data,blank=True,null=True)#资料表
    materialId=models.ForeignKey(Material)#商品表
    userId=models.ForeignKey(User)#用户表
    orderId_id=models.CharField(max_length=36, blank=True, null=True)  # 订单编号
    fontId=models.ForeignKey(Fonts,blank=True,null=True)#字体表
    colorId=models.ForeignKey(Colors,blank=True,null=True)#颜色表
    number=models.IntegerField()#数量
    materialPrice=models.DecimalField(max_digits=20,decimal_places=2)#商品价格
    buyData=models.DateTimeField(auto_now_add=True)#购买日期
    status=models.IntegerField(default=0)#当前加入状态
    isShow=models.BooleanField(default=1)#是否显示
    packageType=models.CharField(max_length=36, blank=True,null=True)#套餐类型
    singleMemo=models.CharField(max_length=200)#备注

###################################
#样式 Style
class Style(models.Model):
    styleId = models.CharField(max_length=36, primary_key=True)
    trollerId=models.ForeignKey(Trolley)#购物车
    stylePic = models.CharField(max_length=100) #样式生成效果图
    isShow = models.BooleanField(default=1)

##############################
#用户配置信息表  UserSummitInfo
class UserSummitInfo(models.Model):
    userSummitInfoId = models.CharField(max_length=36,primary_key=True)
    trollerId=models.ForeignKey(Trolley)#购物车表
    formatInformationId=models.ForeignKey(FormatInformation)#版式信息表
    informationContent=models.TextField()#信息内容




