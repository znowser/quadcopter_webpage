from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist

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
	
def register(request):
	#get username and password .. from post data
	newUsername = request.POST.get('newUsername', '')
	newEmail = request.POST.get('newEmail', '')
	newPassword1 = request.POST.get('newPassword1', '')
	newPassword2 = request.POST.get('newPassword2', '')
	
	print("Trying to create user " + newUsername + " " + newEmail)
	
	if newUsername == '' or newEmail == '' or newPassword1 == '' or newPassword1 != newPassword2:
		return HttpResponse("Bad password.") 
	
	try:
		user = User.objects.get(username=newUsername)
	except User.DoesNotExist:
		newuser = User.objects.create_user(username=newUsername, email=newEmail, password=newPassword1)
		newuser.save()
		return HttpResponse("User created.")
		
	
	return HttpResponse("Username already exists.")
	