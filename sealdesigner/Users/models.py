#coding:utf-8
'''
        对应的model为（总计7个）：
        省份：Province
        区域：Area
        用户表：User
        评论：Comments
        收货地址：Add
        优惠券类型：PrivilegeType
        优惠券：Privilege
'''

from django.db import models
from Seal.models import Material
# Create your models here.

##########################################################
#省份 Province
class Province(models.Model):
    provinceId = models.CharField(max_length=10, primary_key=True)
    provinceName = models.CharField(max_length=20) #省份名称
    isShow = models.BooleanField(default=1) #是否启用

##########################################################
#地区 Area
class Area(models.Model):
    areaId = models.CharField(max_length=10, primary_key=True)
    provinceId = models.ForeignKey(Province) #所属省份
    areaName = models.CharField(max_length=20) #地区名称
    isShow = models.BooleanField(default=1) #是否启用

##########################################################
#用户 User
class User(models.Model):
    userId = models.CharField(max_length=36, primary_key=True)
    areaId = models.ForeignKey(Area,blank=True, null=True) #用户所属地区
    userName = models.CharField(max_length=11) #用户名称
    userPwd = models.CharField(max_length=90) #用户密码
    registerTime = models.DateTimeField(auto_now_add=True) #用户注册时间
    remark = models.TextField(blank=True, null=True)  #备注
    isShow = models.BooleanField(default=1) #是否启用
    loginTime = models.DateTimeField(auto_now_add=True,blank=True, null=True) #最近一次登录时间
    userPic = models.CharField(max_length=200, blank=True, null=True) #用户照片
    userEmail = models.CharField(max_length=50,blank=True, null=True) #邮箱
    userPhone = models.CharField(max_length=20,blank=True, null=True)#联系电话
    userSex = models.BooleanField(default=1)

###########################################################
#用户评论 Comments
class Comments(models.Model):
    commentId = models.CharField(max_length=36, primary_key=True)
    materialId = models.ForeignKey(Material) #商品
    trollerId = models.CharField(max_length=36)#购物车
    userId = models.ForeignKey(User)  #用户
    commentContent = models.TextField()  #评论内容
    isCheck = models.BooleanField(default=0)  #是否审核
    isShow = models.BooleanField(default=0)  #是否启用
    createTime = models.DateTimeField(auto_now_add=True)  #评论时间

############################################################
#收货地址 Add
class Add(models.Model):
    addId = models.CharField(max_length=36, primary_key=True)
    userId = models.ForeignKey(User) #用户
    areaId = models.ForeignKey(Area) #区域
    addInfor = models.CharField(max_length=200) #收货详细地址
    isShow = models.BooleanField()  #是否启用
    isDefault = models.BooleanField()  #是否是默认地址
    addPeople = models.CharField(max_length=20)  #收货联系人
    addPhone = models.CharField(max_length=20)  #联系电话
    createTime = models.DateTimeField(auto_now_add=True)  # 创建时间

##############################################################
#优惠券类型 PricilegeType
class PricilegeType(models.Model):
    privilegeTypeId = models.CharField(max_length=36, primary_key=True)
    privilegeName = models.CharField(max_length=12) #优惠券名称
    privilegePrice = models.DecimalField(max_digits=20, decimal_places=2) #优惠价格
    privilegeAll = models.DecimalField(max_digits=20, decimal_places=2, blank=True, null=True) #优惠券使用需满足的最低消费总价
    isShow = models.BooleanField(default=1) #是否启用
    privilegePast = models.DateTimeField(blank=True, null=True)  #过期时间
    privilegeStart = models.DateTimeField(blank=True,null=True)  #优惠券开始时间
    total = models.IntegerField(default=100)

################################################################
#优惠券   Privilege
class Privilege(models.Model):
    privilegeId = models.CharField(max_length=36, primary_key=True)
    userId = models.ForeignKey(User,null=True,blank=True) #所属用户
    privilegeTypeId = models.ForeignKey(PricilegeType) #优惠券类型
    isUsed = models.BooleanField(default=0) #是否已经使用



