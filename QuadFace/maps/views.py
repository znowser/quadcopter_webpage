from django.http import HttpResponse
from django.template import RequestContext, loader
from django.shortcuts import render
from ws4redis.publisher import RedisPublisher
from django.core import serializers

from maps.models import coordinates

#from CommunicationLink.models import QuadCopterData

def index(request):
    coordinates = serializers.serialize('json', coordinates.objects.all().reverse().order_by('id')[:1])
    return HttpResponse(coordinates, content_type="application/json")
    
    
def update_web_sockets(request):
    coordinates = serializers.serialize('json', Qcoordinates.objects.all().reverse().order_by('id')[:1])
    RedisPublisher(facility='coords', broadcast=True).publish_message(coordinates)
    return HttpResponse("")
