from django.conf.urls import patterns, url
from AuthSystem import views


urlpatterns = patterns('',
	url(r'^$', views.authentication, name='auth'),
	url(r'^logout/', views.logoutUser, name='logoutUser'),
	url(r'^isLoggedin/', views.isLoggedin, name='isLoggedin'),
)