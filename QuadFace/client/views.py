from django.http import HttpResponse
from django.template import RequestContext, loader
from django.shortcuts import render

# Create your views here.
def index(request):
    #data_for_graphs = QuadCopterData.objects.all().order_by('id')[:1000]
    context = {}
    return render(request, 'client/client.html', context)
    
