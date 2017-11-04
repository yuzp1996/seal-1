# -*- coding: utf-8 -*-
# coding=utf-8
from django.shortcuts import render_to_response
from django.http import HttpResponse
from models import Administrator,IndexPicture
import os,base64
import time,uuid,urllib2
from PIL import Image
from django.views.decorators.csrf import csrf_exempt
import json
basePath=os.path.dirname(os.path.dirname(__file__))

@csrf_exempt
def getOnePictureInfo(req):
	"""
	图片信息
	:param req:
	:return:
	"""
	log=IndexPicture.objects.get(picId=req.POST['pictureid'])
	picturejson={}
	picturejson['picName']=log.picName
	picturejson['picPlace']=log.picPlace
	picturejson['pictureid']=log.picId
	picturejson['PicLink']=log.linkUrl
	picturejson['picUrl']=log.picUrl
	return HttpResponse(json.dumps(picturejson))

def picinfos(req):
    """
    首页与轮显背景图片信息
    :param req:
    :return:
    """
    try:
        picinfo = IndexPicture.objects.all()
        num = len(picinfo)
        page = int(req.POST["page"])
        nowInfo = (page-1)*10
        lastInfo = nowInfo+10
        picinfo = picinfo.order_by("-createTime")[nowInfo:lastInfo]
        if picinfo.exists():
            List = []
            for obj in picinfo:
                pictureinfor = {}
                pictureinfor["picId"] = obj.picId
                pictureinfor["picUrl"] = obj.picUrl
                pictureinfor["picName"] = obj.picName
                pictureinfor["linkUrl"] = obj.linkUrl
                pictureinfor["picPlace"] = obj.picPlace
                pictureinfor["createTime"] = obj.createTime.strftime('%Y/%m/%d %H:%M:%S')
                pictureinfor["adminId_id"] = obj.adminId_id
                pictureinfor["num"] = num
                List.append(pictureinfor)
            return HttpResponse(json.dumps(List))
        else:
            return HttpResponse(0)
    except Exception as err:
        print err

@csrf_exempt
def addOnePicture(request):
	"""
	增加图片
	:param request:
	:return:
	"""
	ret1=0
	try:
		ret=str(uuid.uuid1())
		if (request.POST['PutPlace']=='1'):
			rollpictureName="webStatic/img/ShoppingCart/index/logo/"+ret+".jpg"
		elif(request.POST['PutPlace']=='2'):
			rollpictureName="webStatic/img/ShoppingCart/index/advise/"+ret+".jpg"
		elif(request.POST['PutPlace']=='3'):
			rollpictureName="webStatic/img/ShoppingCart/index/banner/"+ret+".jpg"
		rollpicturePath=os.path.join(basePath,rollpictureName)
		reqfile = request.FILES['picfile']
		img = Image.open(reqfile)
		img.thumbnail((700,700),Image.ANTIALIAS)#对图片进行等比缩放
		img.save(rollpicturePath,"png")#保存图片
		ad=request.COOKIES.get('SealadminID','')
		log = Administrator.objects.get(adminId=ad)
		IndexPicture.objects.create(picId=ret,adminId=log,picUrl="/"+rollpictureName,picName=request.POST['PictureName'],linkUrl=request.POST['PicLink'],picPlace=request.POST['PutPlace'])
		ret1=1;
	finally:
		return HttpResponse(ret1)

@csrf_exempt
def deleteOnePicture(request):
	"""
	删除单个图片
	:param request:
	:return:
	"""
	ret=0
	try:
		IndexPicture.objects.filter(picId=request.POST['pictureid']).delete()
		id=request.POST['pictureid']
		place=request.POST['putPlace']
		if (place=='1'):
			rollpictureName="webStatic/img/ShoppingCart/index/logo/"+id+".jpg"
		elif(place=='2'):
			rollpictureName="webStatic/img/ShoppingCart/index/advise/"+id+".jpg"
		elif(place=='3'):
			rollpictureName="webStatic/img/ShoppingCart/index/banner/"+id+".jpg"
		rollpicturePath=os.path.join( rollpictureName )
		os.remove(rollpicturePath)#删除文件中的照片
		ret=1
	except Exception as err:
		print(err)
	finally:
		return HttpResponse(ret)

@csrf_exempt
def delefilepic(request):
	"""
	修改中删除文件中的图片
	:param request:
	:return:
	"""
	rollpictureName=request.POST['URL']
	realrollpictureName=rollpictureName[1:]
	rollpicturePath=os.path.join(basePath,realrollpictureName)
	os.remove(rollpicturePath)#删除文件中的照片
	return HttpResponse(1)




@csrf_exempt
def changeOnepicture(request):
	"""
	修改图片
	:param request:
	:return:
	"""
	ret=0
	reqflie = request.FILES.get('picfile',False)
	if reqflie!=False:
		ret1=str(uuid.uuid1())
		img = Image.open(reqflie)
		img.thumbnail((700,700),Image.ANTIALIAS)
		if (request.POST['PutPlace']=='1'):
			rollpictureName="webStatic/img/ShoppingCart/index/logo/"+ret1+".jpg"
		elif(request.POST['PutPlace']=='2'):
			rollpictureName="webStatic/img/ShoppingCart/index/advise/"+ret1+".jpg"
		elif(request.POST['PutPlace']=='3'):
			rollpictureName="webStatic/img/ShoppingCart/index/banner/"+ret1+".jpg"
		rollpicturePath=os.path.join(basePath,rollpictureName)
		img.save(rollpicturePath,"png")
		IndexPicture.objects.filter(picId=request.POST['pictureid']).update(picId=ret1,picUrl="/"+rollpictureName,picName=request.POST['PictureName'],linkUrl=request.POST['PicLink'],picPlace=request.POST['PutPlace'])
		ret=1
	#未选择新的图片
	else:
		IndexPicture.objects.filter(picId=request.POST['pictureid']).update(picName=request.POST['PictureName'],linkUrl=request.POST['PicLink'],picPlace=request.POST['PutPlace'])
		ret=2
	return HttpResponse(ret)



