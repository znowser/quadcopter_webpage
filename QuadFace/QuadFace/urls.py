from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'QuadFace.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
	url(r'^stream/', include('VideoStream.urls')),
	url(r'^communication/', include('CommunicationLink.urls')),
    url(r'^admin/', include(admin.site.urls)),
)
