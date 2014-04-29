from django.conf.urls import patterns, url

from maps import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url(r'updateSockets', views.update_web_sockets, name='update_web_sockets'),

)