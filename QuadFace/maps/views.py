from django.http import HttpResponse
from django.template import RequestContext, loader
from django.shortcuts import render
from ws4redis.publisher import RedisPublisher
from django.core import serializers

from maps.models import coordinates

def index(request):
    coordinate = serializers.serialize('json', coordinates.objects.all().reverse().order_by('id')[:1])
    return HttpResponse(coordinate, content_type="application/json")
    
    
def update_web_sockets(request):
    coordinate = serializers.serialize('json', coordinates.objects.all().reverse().order_by('id')[:1])
    RedisPublisher(facility='coords', broadcast=True).publish_message(coordinate)
    return HttpResponse("")
