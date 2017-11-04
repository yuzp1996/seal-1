from django.conf.urls import include, url

import views
urlpatterns = [
    # url(r'login/$',views.login),
    url(r'index/$',views.index),
    url(r'contactservice/$',views.contactservice),
    url(r'loadContactList/$',views.loadContactList),
    url(r'sendMsg/$',views.sendMsg),
    url(r'getMsg/$',views.getMsg),
    url(r'postUser/$',views.postUser),
    url(r'selectService/$',views.selectService),

]