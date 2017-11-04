# coding:utf-8
# 对应的model为（总计20个）：
#公告表   Information
#首页图片  IndexPicture


from django.db import models

##########################################
#新闻
class News(models.Model):
    newsId = models.CharField(max_length=36,primary_key=True)
    title = models.CharField(max_length=50)
    content = models.TextField(blank=True,null=True) #公告内容
    link = models.CharField(max_length=200,blank=True,null=True)
    status = models.BooleanField(default=1)  # 1发布  0暂存
    newsType = models.BooleanField(default=1)  # 1站内  0站外
    createTime = models.DateTimeField(auto_now_add=True)    #创建时间

##########################################
#商品父类
class ParentMeterialClass(models.Model):
    parentClassId = models.CharField(max_length=10,primary_key=True)
    parentName = models.CharField(max_length=20) #商品父类名称
    isShow = models.BooleanField(default=1)      #是否启用

##########################################
#材质
class MaterialQuality(models.Model):
    materialQualityId = models.CharField(max_length=36, primary_key=True)
    materialQualityName = models.CharField(max_length=20)       #材质名称
    isShow = models.BooleanField(default=1) #是否启用
    createTime = models.DateTimeField(auto_now_add=True)  # 创建时间

###############################################
#版式表
class Format(models.Model):
    formatId = models.CharField(max_length=36, primary_key=True)
    pictureUrl = models.CharField(max_length=100)     #版式图
    createTime = models.DateTimeField(auto_now_add=True)  # 创建时间
    isShow = models.BooleanField(default=1)  # 是否启用


##############################################
#颜色表
class Colors(models.Model):
    colorId = models.CharField(max_length=36, primary_key=True)
    colorName = models.CharField(max_length=32) #颜色名称
    createTime = models.DateTimeField(auto_now_add=True)  # 创建时间
    isShow = models.BooleanField(default=1)

###############################################
#字体表
class Fonts(models.Model):
    fontId = models.CharField(max_length=36,primary_key=True)
    fontName = models.CharField(max_length=32)  #使用字体名称
    createTime = models.DateTimeField(auto_now_add=True)  # 创建时间
    isShow = models.BooleanField(default=1)
#################################################
#商品类型表
class SealClass(models.Model):
    sealClassId = models.CharField(max_length=36,primary_key=True)
    parentClassId = models.ForeignKey(ParentMeterialClass)#商品类型所属父类
    className = models.CharField(max_length=20) #商品类型名称
    formatId = models.ForeignKey(Format,blank=True,null=True)
    fontId = models.ForeignKey(Fonts,blank=True,null=True)
    isfont = models.BooleanField(default=0)      #是否配置字体
    isShow = models.BooleanField(default=1)      #是否启用
    isformat = models.BooleanField(default=0)  #是否配置板式
    createTime = models.DateTimeField(auto_now_add=True)  # 创建时间


##################################################
#商品表
class Material(models.Model):
    materialId = models.CharField(max_length=36, primary_key=True)
    sealClassId = models.ForeignKey(SealClass)  #所属商品类
    materialName = models.CharField(max_length=50)  #商品名称
    colorId = models.ForeignKey(Colors, blank=True, null=True)
    materialPrice = models.DecimalField(max_digits=20, decimal_places=2) #商品价格
    materialRemainder = models.IntegerField(blank=True, null=True)   #商品库存/余量
    sales = models.IntegerField(blank=True, null=True)   #销量
    materialIntroduction = models.TextField(blank=True, null=True)   #商品介绍
    isSecommendation = models.BooleanField(default=1)  #是否推荐
    isShow = models.BooleanField(default=1)  #是否启用
    isColor = models.BooleanField(default=0) #是否配置颜色
    picture = models.CharField(max_length=300, default=0, blank=True, null=True)    #商品图片
    createTime = models.DateTimeField(auto_now_add=True)  # 创建时间
    materialInfo = models.TextField(blank=True, null=True)  # 商品详细信息

    def __unicode__(self):
        return self.materialName


##########################################
#商品材质表（中间表）
class MaterialandQuality(models.Model):
    materialQualityId=models.ForeignKey(MaterialQuality)
    materialId = models.ForeignKey(Material)


##########################################
#企业类型表
class Company(models.Model):
    companyId = models.CharField(max_length=36,primary_key=True)
    companyName = models.CharField(max_length=50)
    isShow = models.BooleanField(default=1)
    createTime = models.DateTimeField(auto_now_add=True)  # 创建时间


###########################################
#非首次刻章声明
class Statement(models.Model):
    statementId = models.CharField(max_length=36,primary_key=True)
    statementContent = models.CharField(max_length=100)
    isShow = models.BooleanField(default=1)
    createTime = models.DateTimeField(auto_now_add=True)  # 创建时间


############################################
#附件类型
class DataType(models.Model):
    dataTypeId = models.CharField(max_length=36,primary_key=True)
    companyId = models.ForeignKey(Company,blank=True, null=True) #不同企业对应不同的附件
    statementId = models.ForeignKey(Statement,blank=True, null=True) #不同重刻原因对应不同的附件
    sealClassId = models.ForeignKey(SealClass,blank=True, null=True)
    dataName = models.CharField(max_length=100) #附件名称


#################################################
#版式信息表
class FormatInformation(models.Model):
    formatinformationId = models.CharField(max_length=36, primary_key=True)
    formatId = models.ForeignKey(Format)    #版式表
    informationName = models.CharField(max_length=100)#信息名称
    informationMemo = models.CharField(max_length=100,blank=True, null=True)#版式备注


##################################################
#类型和版式信息表(中间表)
class SealClassFormat(models.Model):
    formatId = models.ForeignKey(Format)    #版式表
    sealClassId = models.ForeignKey(SealClass)
    createTime = models.DateTimeField(auto_now_add=True)  # 创建时间


##########################################
#套餐
class PackagesType(models.Model):
    pakTypeld = models.CharField(max_length=36,primary_key=True)
    pakTypeName = models.CharField(max_length=36) #套餐名称
    isShow = models.BooleanField(default=1)  #是否启用
    pakTypePrice = models.DecimalField(max_digits=20, decimal_places=2) #套餐价格
    pakTypeRema = models.TextField(blank=True, null=True)#备注
    createTime = models.DateTimeField(auto_now_add=True)  # 创建时间


###################################################
#套餐明细
class Packages(models.Model):
    pakId = models.CharField(max_length=36, primary_key=True)
    pakTypeld = models.ForeignKey(PackagesType) #套餐类型表


###################################################
#管理员表
class Administrator(models.Model):
    adminId = models.CharField(max_length=36,primary_key=True)
    adminAccount = models.CharField(max_length=32)  #管理员名称
    adminPassword = models.CharField(max_length=32) #管理员密码
    createssTime = models.DateTimeField(auto_now_add=True)  #创建时间
    power=models.IntegerField(default=0)#权限


#################################################
#公告表
class Information(models.Model):
    informationId = models.CharField(max_length=36, primary_key=True)
    adminId = models.ForeignKey(Administrator)  #管理员
    informationContent = models.TextField() #公告内容
    createTime = models.DateTimeField(auto_now_add=True)    #创建时间
    informationType = models.IntegerField()   #公告内容所属类型/板块

################################################
#首页图片
class IndexPicture(models.Model):
    picId = models.CharField(max_length=36, primary_key=True)
    adminId = models.ForeignKey(Administrator)
    picUrl = models.CharField(max_length=300,default=0)#图片存放位置
    picName = models.CharField(max_length=36) #图片标题/名称
    linkUrl = models.CharField(max_length=300,blank=True,null=True)#点击图片链接地址
    picPlace = models.IntegerField()    #图片显示位置
    createTime = models.DateTimeField(auto_now_add=True)    #图片上传时间

################################################
#管理员日志
class Amdinlog(models.Model):
    logId=models.CharField(max_length=36,primary_key=True)
    adminId = models.ForeignKey(Administrator)
    admincontent = models.CharField(max_length=200)

#################################################
#类型商品关系表
class SealMaterial(models.Model):
    sealClassId = models.ForeignKey(SealClass)
    materialId = models.ForeignKey(Material)


#商品类别和配置字体库
class SealFont(models.Model):
    sealClassId = models.ForeignKey(SealClass)
    fontId = models.ForeignKey(Fonts)

#商品类型和企业类型关系表
class SealClassCompany(models.Model):
    sealClassId = models.ForeignKey(SealClass)
    companyId = models.ForeignKey(Company)

#商品和配置颜色库
class SealColor(models.Model):
    materialId = models.ForeignKey(Material)
    colorId = models.ForeignKey(Colors)
