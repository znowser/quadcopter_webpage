from django.conf.urls import patterns, url

from CommunicationLink import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),

)