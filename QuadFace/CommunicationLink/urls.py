from django.conf.urls import patterns, url

from CommunicationLink import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url(r'clearData', views.clear_data, name='clear_data'),
    url(r'addData/([0-9]+|-[0-9]+)/([0-9]+|-[0-9]+)/([0-9]+|-[0-9]+)/([0-9]+)/([0-9]+)/([0-9]+)/([0-9]+)/([0-9]+)/([0-9]+)/([0-9]+|-[0-9]+)/([0-9]+|-[0-9]+)/([0-9]+|-[0-9]+)/', views.add_data, name='add_data'),
)