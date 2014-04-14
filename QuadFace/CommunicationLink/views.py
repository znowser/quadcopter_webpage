from django.http import HttpResponse
from django.template import RequestContext, loader
from django.shortcuts import render
from ws4redis.publisher import RedisPublisher

from CommunicationLink.models import QuadCopterData

#from CommunicationLink.models import QuadCopterData

def index(request):
    data_for_graphs = QuadCopterData.objects.all().order_by('id')[:1000]
    context = {'data_for_graphs': data_for_graphs}
    return render(request, 'CommunicationLink/index.html', context)
    
    
def update_web_sockets(request):
    print("Du hittade det");
    RedisPublisher(facility='comLink', broadcast=True).publish_message('Hello everybody')
    return HttpResponse("")
