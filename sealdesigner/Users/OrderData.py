# -*- coding: utf-8 -*-
# coding=utf-8

import json
from django.shortcuts import render_to_response
from django.http import HttpResponse, HttpResponseRedirect
from django.template import RequestContext
from django.db.models import Q
from ShoppingCart.models import Order
from Seal.models import DataType
from ShoppingCart.models import Trolley
from ShoppingCart.models import Pay
from Users.models import User
def getOrderInfo(req):
	"""
	取出所有订单的信息
	:param req:
	:return:
	"""
	try:

		order = Order.objects.filter(userId=1)
		List=[]
		for obj in order:
			# word = {}
			# word["materialName"] = obj.
			# word["materialName"] = obj.materialId.materialName
			# word["price"] = str(obj.materialId.materialPrice)
			# word["payName"] = obj.orderId.payId.payName
			# word["orderDate"] = obj.orderId.orderDate.strftime('%Y/%m/%d %H:%M:%S')

			List.append(word)
			return HttpResponse(json.dumps(List))
		else:
			return HttpResponse(0)
	except Exception as err:
		print err

def getOrdershow(req):
	"""
	根据不同显示需求显示收获货订单信息
	:param req:
	:return:
	"""
	try:
		orders = Order.objects.filter(isPaid=1)
		if orders.exists():
			List = []
			for obj in orders:
				word = {}
				word["orderId"] = obj.orderId
				word["orderDate"] = obj.orderDate.strftime('%Y/%m/%d %H:%M:%S')
				word["responseMessage"] = obj.responseMessage
				word["invoiceHead"] = str(obj.isPaid)
				word["isDeliver"] = obj.isDeliver
				if obj.logistics==0:
					word["logistics"] = str("网上购物")
				else:
					word["logistics"] = str("现金付款")

				word["isPaid"] = str("已收货")

				List.append(word)
			return HttpResponse(json.dumps(List))
		else:
			return HttpResponse(0)
	except Exception as err:
		print err

def getOrdershowyifu(req):
	"""
	根据不同显示需求显示已付款订单信息
	:param req:
	:return:
	"""
	try:
		orders = Order.objects.filter(isPaid=2)
		if orders.exists():
			List = []
			for obj in orders:
				word = {}
				word["orderId"] = obj.orderId
				word["orderDate"] = obj.orderDate.strftime('%Y/%m/%d %H:%M:%S')
				word["responseMessage"] = obj.responseMessage
				word["invoiceHead"] = str(obj.isPaid)
				word["isDeliver"] = obj.isDeliver
				if obj.logistics==0:
					word["logistics"] = str("网上购物")
				else:
					word["logistics"] = str("现金付款")

				word["isPaid"] = str("已付款")
				List.append(word)
			return HttpResponse(json.dumps(List))
		else:
			return HttpResponse(0)


	except Exception as err:
		print err

def getOrdershowdaifu(req):
	"""
	根据不同显示需求显示已付款订单信息
	:param req:
	:return:
	"""
	try:
		orders = Order.objects.filter(isPaid=0)
		if orders.exists():
			List = []
			for obj in orders:
				word = {}
				word["orderId"] = obj.orderId
				word["orderDate"] = obj.orderDate.strftime('%Y/%m/%d %H:%M:%S')
				word["responseMessage"] = obj.responseMessage
				word["invoiceHead"] = str(obj.isPaid)
				word["isDeliver"] = obj.isDeliver
				if obj.logistics==0:
					word["logistics"] = str("网上购物")
				else:
					word["logistics"] = str("现金付款")

				word["isPaid"] = str("待付款")
				List.append(word)
			return HttpResponse(json.dumps(List))
		else:
			return HttpResponse(0)


	except Exception as err:
		print err
# def xingming (req):
# 	"""
# 	取出用户姓名
#     :param req:
# 	:return:
# 	"""
# 	try:
#
#
#
#
#
#
# 	except Exception as err:
# 		print err