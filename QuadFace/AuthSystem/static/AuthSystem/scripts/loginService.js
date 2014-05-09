
//login must be a factory because both the menu and the loginCtrl must split the variables
angular.module('client').factory('loginService', function($rootScope, $http){
	var loginService = {};
	loginService.userLoggedIn = false;
	loginService.loginStatus = "Not logged in";
	
	//functions that check if the user is logged in. Needs to be done if the user is logged in and pressed update (F5) in the browser.
	loginService.isLoggedin = function(){
		//asynchronously login check
			$http({ 
					method: 'GET', 
					url: '/auth/isLoggedin', 
				}).
			success(function($data, $status, $headers, $config) {
				//check if user is logged in
				//Django sends true if the user already is logged in.
				loginService.performLogin("", $data.localeCompare("true") == 0);
			})
	};
	
	//login function
	loginService.submitlogin = function(loginUsername, loginPassword) {
		if (loginUsername && loginPassword){
			
			//asynchronously login request
			$http({ 
					method: 'POST', 
					url: '/auth/', 
					data: {'username': loginUsername, 'password': loginPassword },
					}).
			success(function($data, $status, $headers, $config) {
				//Django sends ok if the login was successful
				loginService.performLogin($data, $data.localeCompare("ok") == 0);
			}).error(function($data, $status){
				alert("Error code from server: " + $status);
			});
		}
	};
	
	//help login function that sets all the angular variables to logged in
	//if log_in is true, the user is being logged in.
	loginService.performLogin = function(log_in_message, log_in){
			loginService.userLoggedIn = log_in;
			loginService.loginStatus = log_in_message;
			//broadcast the loggin attempt
			$rootScope.$broadcast('loginResponse');
	};
	
	return loginService;	
});