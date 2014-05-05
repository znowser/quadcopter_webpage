from django.conf.urls import patterns, url
from AuthSystem import views


urlpatterns = patterns('',
	url(r'^authentication/', views.authentication, name='authentication'),
	url(r'^loginTest', views.loginTest),
	url(r'^$', views.loginSite, name='loginSite'),
)