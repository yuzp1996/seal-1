# -*- coding: utf-8 -*-
# coding=utf-8
from django.shortcuts import render_to_response
from django.http import HttpResponse, HttpResponseRedirect
from django.template import RequestContext
from form import UserForm
from models import Administrator
import os,base64,json
import time,uuid,urllib2
from PIL import Image
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
# from django_redis import get_redis_connection
from sealdesigner import settings
from django.core.cache import cache


def login(req):
    """
    管理员登陆视图
    :param req:
    :return:
    """
    if req.method == 'POST':
        uf = UserForm(req.POST)
        if uf.is_valid():
            # 获取表单用户密码
            username = uf.cleaned_data['username']
            password = uf.cleaned_data['password']
            yanzhengma = req.POST['Input_verify']
            if req.COOKIES.get('validate', '').upper() != yanzhengma.upper():
                return HttpResponse("<script type='text/javascript'>alert('验证码错误');window.location.href='login';</script>")
            # 获取的表单数据与数据库进行比较
            admin = Administrator.objects.filter(adminAccount=username)
            if admin.count() == 0:
                return HttpResponse("<script type='text/javascript'>alert('用户名不存在');window.location.href='login';</script>")
            if admin[0].adminPassword != password:
                # 比较失败，还在login
                return HttpResponse("<script type='text/javascript'>alert('用户名或密码错误');window.location.href='login';</script>")
            else:
                # 比较成功，跳转index
                response = HttpResponseRedirect('/Seal/adminindex')
                adminid=admin[0].adminId

                # 将adminid写入浏览器cookies
                response.set_cookie('SealadminID', adminid)
                return response
        else:
            return HttpResponse("<script type='text/javascript'>alert('用户名或密码不能为空！');window.location.href='login';</script>")
    else:
        uf = UserForm()
        return render_to_response('Seal/login.html', {'uf': uf})


def logout(req):
    """
    管理员退出
    """
    response = HttpResponse("<script type='text/javascript'>alert('管理员退出');window.location.href='login'</script>")
    #清理cookie里保存username
    response.delete_cookie('SealadminID' )
    return response


def judgeadmin(test):
    """
    判断是否登录，后台操作的全局判断，用作装饰器
    :param test:
    :return:
    """
    def infun(req, *args, **kwargs):
        if req.COOKIES.get('SealadminID','') == '':
            return HttpResponseRedirect('/Seal/login')
        else:
            adid = Administrator.objects.filter(adminId=req.COOKIES.get('SealadminID',''))
            if adid.count() == 0:
                return HttpResponse("<script type='text/javascript'>alert('该用户不存在');window.location.href='login';</script>")
            else:
                ret=test(req, *args, **kwargs)
                return ret
    return infun


def adminskip(func):
    """
    跳转异常装饰器
    """
    def infun(req, *args, **kwargs):
        basePath=os.path.dirname(os.path.dirname(__file__))
        logPath=os.path.join(basePath,"Seal/log/skip.txt")
        log_file = open(logPath,"a")
        try:
            ret=func(req, *args, **kwargs)
        except Exception as err:
            log_file.writelines(str(time.strftime('%Y/%m/%d %H:%M:%S'))+"\tview:"+func.__name__+"\nerror:["+str(err)+"]\ndoc:"+func.__doc__+"\n")
            return render_to_response('404.html')
        finally:
            log_file.close()
        return ret
    return infun


def adminselect(func):
    """
    查找异常装饰器
    """
    def infun(req, *args, **kwargs):
        basePath=os.path.dirname(os.path.dirname(__file__))
        logPath=os.path.join(basePath,"Seal/log/select.txt")
        log_file=open(logPath,"a")
        try:
            ret=func(req, *args, **kwargs)
        except Exception as err:
            log_file.writelines(str(time.strftime('%Y/%m/%d %H:%M:%S'))+"\tview:"+func.__name__+"\nerror:["+str(err)+"]\ndoc:"+func.__doc__+"\n")
            return render_to_response('404.html')
        finally:
            log_file.close()
        return ret
    return infun


def adminupdate(func):
    """
    增删改异常装饰器
    """
    def infun(req, *args, **kwargs):
        basePath=os.path.dirname(os.path.dirname(__file__))
        logPath=os.path.join(basePath,"Seal/log/update.txt")
        log_file=open(logPath,"a")
        try:
            ret=func(req, *args, **kwargs)
        except Exception as err:
            log_file.writelines(str(time.strftime('%Y/%m/%d %H:%M:%S'))+"\tview:" + func.__name__+"\nerror:["+str(err) + "]\ndoc:"+func.__doc__+"\n")
            return render_to_response('404.html')
        finally:
            log_file.close()
        return ret
    return infun

#以下为ueditor使用的视图
basePath=os.path.dirname(os.path.dirname(__file__))
logPath=os.path.join(basePath,"log/indexviewError.txt")

def __myuploadfile(fileObj, source_pictitle, source_filename,fileorpic='pic'):
    """ 一个公用的上传文件的处理 """
    myresponse=""
    if fileObj:
        print fileObj.name
        filename = fileObj.name#.decode('utf-8', 'ignore')
        fileExt = filename.split('.')[1]
        file_name = str(uuid.uuid1())
        subfolder = time.strftime("%Y%m")
        if not os.path.exists(settings.MEDIA_ROOT + subfolder):
            os.makedirs(settings.MEDIA_ROOT + subfolder)
        path = str(subfolder + '/' + file_name + '.' + fileExt)

        if fileExt.lower() in ('jpg', 'jpeg', 'bmp', 'gif', 'png',"rar" ,"doc" ,"docx","zip","pdf","txt","swf","wmv"):

            phisypath = settings.MEDIA_ROOT + path
            destination = open(phisypath, 'wb+')
            for chunk in fileObj.chunks():
                destination.write(chunk)
            destination.close()

            if fileorpic=='pic':
                if fileExt.lower() in ('jpg', 'jpeg', 'bmp', 'gif', 'png'):
                    im = Image.open(phisypath)
                    im.thumbnail((720, 720))
                    im.save(phisypath)

            real_url = '/webStatic/upload/' + subfolder + '/' + file_name + '.' + fileExt
            myresponse = "{'original':'%s','url':'%s','title':'%s','state':'%s'}" % (source_filename, real_url, source_pictitle, 'SUCCESS')
    return myresponse

def listdir(path,filelist):
    """ 递归 得到所有图片文件信息 """
    phisypath = settings.MEDIA_ROOT
    if os.path.isfile(path):
        return '[]'
    allFiles=os.listdir(path)
    retlist=[]
    for cfile in allFiles:
        fileinfo={}
        filepath=(path+os.path.sep+cfile).replace("\\","/").replace('//','/')

        if os.path.isdir(filepath):
            listdir(filepath,filelist)
        else:
            if cfile.endswith('.gif') or cfile.endswith('.png') or cfile.endswith('.jpg') or cfile.endswith('.bmp'):
               filelist.append(filepath.replace(phisypath,'/webStatic/upload/').replace("//","/"))

@csrf_exempt
def ueditor_ImgUp(request):
    """ 上传图片 """
    fileObj = request.FILES.get('upfile', None)
    source_pictitle = request.POST.get('pictitle','')
    source_filename = request.POST.get('fileName','')
    response = HttpResponse()
    myresponse = __myuploadfile(fileObj, source_pictitle, source_filename,'pic')
    response.write(myresponse)
    return response

@csrf_exempt
def ueditor_FileUp(request):
    """ 上传文件 """
    fileObj = request.FILES.get('upfile', None)
    source_pictitle = request.POST.get('pictitle','')
    source_filename = request.POST.get('fileName','')
    response = HttpResponse()
    myresponse = __myuploadfile(fileObj, source_pictitle, source_filename,'file')
    response.write(myresponse)
    return response

@csrf_exempt
def ueditor_getRemoteImage(request):
    print request
    """ 把远程的图抓到本地,爬图 """
    file_name = str(uuid.uuid1())
    subfolder = time.strftime("%Y%m")
    if not os.path.exists(settings.MEDIA_ROOT + subfolder):
        os.makedirs(settings.MEDIA_ROOT + subfolder)
    #====get request params=================================
	urls = str(request.POST.get("upfile"))
    urllist=urls.split("ue_separate_ue")
    outlist=[]
    #====request params end=================================
    fileType = [".gif" , ".png" , ".jpg" , ".jpeg" , ".bmp"]
    for url in urllist:
        fileExt=""
        for suffix in fileType:
            if url.endswith(suffix):
                fileExt=suffix
                break
        if fileExt=='':
            continue
        else:
            path = str(subfolder + '/' + file_name + '.' + fileExt)
            phisypath = settings.MEDIA_ROOT + path
            piccontent= urllib2.urlopen(url).read()
            picfile=open(phisypath,'wb')
            picfile.write(piccontent)
            picfile.close()
            outlist.append('/webStatic/upload/' + subfolder + '/' + file_name + '.' + fileExt)
    outlist="ue_separate_ue".join(outlist)

    response=HttpResponse()
    myresponse="{'url':'%s','tip':'%s','srcUrl':'%s'}" % (outlist,'成功',urls)
    response.write(myresponse)
    return response

@csrf_exempt
def ueditor_getMovie(request):
    """ 获取视频数据的地址 """
    content ="";
    searchkey = request.POST.get("searchKey");
    videotype = request.POST.get("videoType");
    try:
        url = "http://api.tudou.com/v3/gw?method=item.search&appKey=myKey&format=json&kw="+ searchkey+"&pageNo=1&pageSize=20&channelId="+videotype+"&inDays=7&media=v&sort=s";
        content=urllib2.urlopen(url).read()
    except Exception,e:
        pass
    response=HttpResponse()
    response.write(content);
    return response

@csrf_exempt
def ueditor_imageManager(request):
    """ 图片在线管理  """
    filelist=[]
    phisypath = settings.MEDIA_ROOT
    listdir(phisypath,filelist)
    imgStr="ue_separate_ue".join(filelist)
    response=HttpResponse()
    response.write(imgStr)
    return response

@csrf_exempt
def ueditor_ScrawUp(request):
    """ 涂鸦文件,处理 """
    print request
    param = request.POST.get("action",'')
    fileType = [".gif" , ".png" , ".jpg" , ".jpeg" , ".bmp"];

    if  param=='tmpImg':
        fileObj = request.FILES.get('upfile', None)
        source_pictitle = request.POST.get('pictitle','')
        source_filename = request.POST.get('fileName','')
        response = HttpResponse()
        myresponse = __myuploadfile(fileObj, source_pictitle, source_filename,'pic')
        myresponsedict=dict(myresponse)
        url=myresponsedict.get('url','')
        response.write("<script>parent.ue_callback('%s','%s')</script>" %(url,'SUCCESS'))
        return response
    else:
        #========================base64上传的文件=======================
        base64Data = request.POST.get('content','')
        subfolder = time.strftime("%Y%m")
        if not os.path.exists(settings.MEDIA_ROOT + subfolder):
            os.makedirs(settings.MEDIA_ROOT + subfolder)
        file_name = str(uuid.uuid1())
        path = str(subfolder + '/' + file_name + '.' + 'png')
        phisypath = settings.MEDIA_ROOT + path
        f=open(phisypath,'wb+')
        f.write(base64.decodestring(base64Data))
        f.close()
        response=HttpResponse()
        response.write("{'url':'%s',state:'%s'}" % ('/webStatic/upload/' + subfolder + '/' + file_name + '.' + 'png','SUCCESS'));
        return response
