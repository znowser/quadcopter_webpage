from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    url(r'^$', include('client.urls')),
    # url(r'^blog/', include('blog.urls')),
	url(r'^stream/', include('VideoStream.urls')),
    url(r'^map/', include('maps.urls')),
	url(r'^communication/', include('CommunicationLink.urls')),
    url(r'^admin/', include(admin.site.urls)),
)
