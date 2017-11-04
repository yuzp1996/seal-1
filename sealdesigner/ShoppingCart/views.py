# coding=utf-8
from validate import create_validate_code
import StringIO
import os, base64
from django.shortcuts import render_to_response
from django.http import HttpResponse, HttpResponseRedirect
from django.template import RequestContext
from Seal.models import ParentMeterialClass



def validate(req):
    """
    获取验证码存入cookies
    :param req:
    :return:
    """
    mstream = StringIO.StringIO()
    validate_code = create_validate_code()
    img = validate_code[0]
    img.save(mstream, "GIF")
    response = HttpResponse(base64.b64encode(mstream.getvalue()))
    response.set_cookie('validate', validate_code[1])
    return response


def  seal_parent(req):
    """
    印章父类
    :param req:
    :return:
    """
    parent=ParentMeterialClass.objects.get(parentClassId=3)
    parentname=parent.parentName
    return HttpResponse(parentname)







