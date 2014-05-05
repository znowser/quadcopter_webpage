from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout

def loginSite(request):
	context = {}
	return render(request, 'AuthSystem/login.html', context)
 
def logoutUser(request):
	logout(request)
	return HttpResponse("Ok")
 
def authentication(request):
	#print request.body
	#data = simplejson.loads( request.raw_post_data )
	username = request.POST['username']
	password = request.POST['password']
	response = ""
	
	#print username + " " + password
	user = authenticate(username=username, password=password)
	if user is not None:
		response = "Logged in"
		# the password verified for the user
		if user.is_active:
			login(request, user)
			response =  "User is valid, active and authenticated"
		else:
			response = "The password is valid, but the account has been disabled!"
	else:
		response = "The username and password were incorrect."
	
	return HttpResponse(response)
	
@login_required(login_url='/auth/')
def loginTest(request):
	context = {}
	return render(request, 'AuthSystem/tete.html', context)