from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout

def logoutUser(request):
	if request.user.is_authenticated():
		logout(request)
	return HttpResponse("ok")
	
def isLoggedin(request):
	if request.user.is_authenticated():
		return HttpResponse("true")
	else:
		return HttpResponse("false")
 
def authentication(request):
	#get username and password from post data
	username = request.POST.get('username', '')
	password = request.POST.get('password', '')
	response = ""
		
	user = authenticate(username=username, password=password)
	if user is not None:
		# the password verified for the user
		if user.is_active:
			login(request, user)
			response =  "ok"
		else:
			response = "Account has been disabled!"
	else:
		response = "The username/password was incorrect."
	
	return HttpResponse(response)