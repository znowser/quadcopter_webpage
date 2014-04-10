from django.http import HttpResponse
from django.template import RequestContext, loader

from CommunicationLink.models import QuadCopterData

def index(request):
    #anyData = Poll.objects.order_by('-pub_date')[:5]
    #template = loader.get_template('polls/index.html')
    #context = RequestContext(request, {
    #    'latest_poll_list': latest_poll_list,
    ##})
    return HttpResponse("TEST")
