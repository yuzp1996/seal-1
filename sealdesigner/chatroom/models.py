# coding:utf-8
from django.db import models

# Create your models here.
#客服表
# class ServiceUser(models.Model):
#     serviceId = models.CharField(max_length=36,primary_key=True)
#     serviceAccount = models.CharField(max_length=32)  #客服名称
#     servicePassword = models.CharField(max_length=32) #客服密码
#     createssTime = models.DateTimeField(auto_now_add=True)  #创建时间
#     # power=models.IntegerField(default=0)#权限
#     def __unicode__(self):
#         return self.serviceAccount

