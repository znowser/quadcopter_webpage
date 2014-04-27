from django.http import HttpResponse
from django.template import RequestContext, loader
from django.shortcuts import render
from ws4redis.publisher import RedisPublisher
from django.core import serializers

from CommunicationLink.models import QuadCopterData

#from CommunicationLink.models import QuadCopterData

def index(request):
    #data_for_graphs = QuadCopterData.objects.all().order_by('id')[:1000]
    context = {}
    return render(request, 'CommunicationLink/index.html', context)
    
    
def update_web_sockets(request):
    print("Du hittade det");
    data_for_graphs = serializers.serialize('json', QuadCopterData.objects.all().reverse().order_by('id')[:1])
    #data_for_graphs = data_for_graphs.replace("[", "{").replace("]", "}"); 
    print(data_for_graphs)
    RedisPublisher(facility='comLink', broadcast=True).publish_message(data_for_graphs)
    return HttpResponse("")
