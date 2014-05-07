from django.conf.urls import patterns, url
from control import views


urlpatterns = patterns('',
	url(r'^$', views.controlPage, name='controlPage'),
)