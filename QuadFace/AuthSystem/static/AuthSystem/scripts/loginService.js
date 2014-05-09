
//login must be a factory because both the menu and the loginCtrl must split the variables
angular.module('client').factory('loginService', function($rootScope, $http){
	var loginService = {};
	loginService.userLoggedIn = false;
	loginService.loginStatus = "Not logged in";
	
	//login function
	loginService.submitlogin = function(loginUsername, loginPassword) {
		if (loginUsername && loginPassword){
			
			//asynchronously login request
			$http({ 
					method: 'POST', 
					url: '/auth/authentication/', 
					data: {'username': loginUsername, 'password': loginPassword },
					}).
			success(function($data, $status, $headers, $config) {
				loginService.loginStatus = $data;
				loginService.userLoggedIn = true;
				loginService.broadcastLoginResponse();
			}).error(function($data, $status){
				loginService.loginStatus = $data;
				loginService.broadcastLoginResponse();
			});
		}
	}
	
	loginService.broadcastLoginResponse = function(){
		$rootScope.$broadcast('loginResponse');
	}
	
	return loginService;	
});