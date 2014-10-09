from django.http import HttpResponse
from django.template import RequestContext, loader
from django.shortcuts import render
from ws4redis.publisher import RedisPublisher
#from ws4redis.redis_store import RedisMessage
from django.core import serializers

from CommunicationLink.models import QuadCopterData


def index(request):
    data_for_graphs = serializers.serialize('json', QuadCopterData.objects.all().reverse().order_by('id')[:20])
    return HttpResponse(data_for_graphs, content_type="application/json")
    
def clear_data(request):
    QuadCopterData.objects.all().delete()
    return HttpResponse("")
    
def add_data(request, cell1, cell2, cell3, engine1, engine2, engine3, engine4, temp, alt, roll, pitch, yaw):
    if cell1 < 0:
        cell1 = 0
    if cell2 < 0:
        cell2 = 0
    if cell3 < 0:
        cell3 = 0
    q = QuadCopterData(BatteryCell1=cell1,BatteryCell2=cell2,BatteryCell3=cell3,
    Engine1=engine1, Engine2=engine2, Engine3=engine3, Engine4=engine4, 
    Temperature=float(temp), Altitude=float(alt), Roll=float(roll), Pitch=float(pitch), Yaw=float(yaw))
    q.save()
    data_for_graphs = serializers.serialize('json', QuadCopterData.objects.all().reverse().order_by('id')[:1])
    #RedisPublisher(facility='comLink', broadcast=True).publish_message(RedisMessage(data_for_graphs))
    RedisPublisher(facility='comLink', broadcast=True).publish_message(data_for_graphs)
    return HttpResponse("")
    