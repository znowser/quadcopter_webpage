from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', include('client.urls')),
    url(r'^stream/', include('VideoStream.urls')),
    url(r'^maps/', include('maps.urls')),
    url(r'^communication/', include('CommunicationLink.urls')),
    url(r'^auth/', include('AuthSystem.urls')),
    url(r'^admin/', include(admin.site.urls)),
	url(r'^control/', include("control.urls")),
)
