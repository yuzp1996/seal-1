import os
from sealdesigner.settings import STATICFILES_DIRS
from django.conf.urls import include, url
from ShoppingCart.load import index
from django.views.static import serve
urlpatterns = [
    url(r'^webStatic/(?P<path>.*)$',serve,{'document_root':STATICFILES_DIRS,'show_indexes':True}),
    url(r'^templates/(?P<path>.*)$',serve,{'document_root':os.path.join(os.path.dirname(__file__),'../templates').replace('\\','/'),'show_indexes':True}),
    url(r'^$', index),
    url(r'^Seal/',include('Seal.urls')),
    url(r'^ShoppingCart/',include('ShoppingCart.urls')),
    url(r'^Users/',include('Users.urls')),
    url(r'^chatroom/',include("chatroom.urls")),
]
