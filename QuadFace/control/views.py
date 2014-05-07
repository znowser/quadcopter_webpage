from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout

#TODO, shall recieve control data from the GUI and redirect it to the quadcopter
#@login_required(login_url='/auth/')
def controlPage(request):
	if request.user.is_authenticated():
		return HttpResponse("This text is only visible for logged in users. You should be proud of yourself!")
	else:
		return HttpResponse("Not logged in")