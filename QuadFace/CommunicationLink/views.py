from django.http import HttpResponse
from django.template import RequestContext, loader
from django.shortcuts import render
from ws4redis.publisher import RedisPublisher
from django.core import serializers

from CommunicationLink.models import QuadCopterData

#from CommunicationLink.models import QuadCopterData

def index(request):
    data_for_graphs = serializers.serialize('json', QuadCopterData.objects.all().reverse().order_by('id')[:20])
    return HttpResponse(data_for_graphs, content_type="application/json")
    
    
def update_web_sockets(request):
    data_for_graphs = serializers.serialize('json', QuadCopterData.objects.all().reverse().order_by('id')[:1])
    RedisPublisher(facility='comLink', broadcast=True).publish_message(data_for_graphs)
    return HttpResponse("")
