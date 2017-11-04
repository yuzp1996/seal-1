# -*- coding: utf-8 -*-
# coding=utf-8
from django.http import HttpResponse
import json,Queue
from ShoppingCart.models import Order

waitTime = {}
GLOBAL_ADMIN ={}#会话队列

def newscome(req):
    """
    check if there are new order
    :param req:
    :return:
    """

    new = Order.objects.filter(orderState = 1)
    idused = req.POST["idused"]
    idnow = Order.objects.order_by('-id')[0].id
    number = len(new)

    # Just for waitting some time
    oldnum = 0
    waitTime[oldnum] = Queue.Queue()
    try:
        WT = waitTime[oldnum].get(timeout=1)
    except Exception as err:
        pass

    try:

        if idused==0:
            return HttpResponse(json.dumps({
                        "status": "first",
                        "result": number,
                        "idnow": idnow,
                }))
        else:
            if idnow != float(idused) and float(idused) != float(1.1):
                    #new order is coming
                    return HttpResponse(json.dumps({
                            "status": "new",
                            "result": number,
                            "idnow": idnow,
                    }))
            else:
                #no new order
                return HttpResponse(json.dumps({
                        "status": "no",
                        "idnow": idnow,
                }))

    except Exception as err:
        print(err)