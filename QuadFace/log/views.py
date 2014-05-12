from django.http import HttpResponse
from django.template import RequestContext, loader
from django.shortcuts import render
from ws4redis.publisher import RedisPublisher
from django.core import serializers

from log.models import logData

def index(request):
    log_messages = serializers.serialize('json', logData.objects.all().reverse().order_by('id')[:20])
    return HttpResponse(log_messages, content_type="application/json")

def update_web_sockets(request):
    log_messages = serializers.serialize('json', logData.objects.all().reverse().order_by('id')[:1])
    RedisPublisher(facility='log', broadcast=True).publish_message(log_messages)
    return HttpResponse("")
