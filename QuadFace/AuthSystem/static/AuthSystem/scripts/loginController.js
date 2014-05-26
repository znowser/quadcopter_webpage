var loginCtrl = angular.module('client').controller('loginCtrl', function($scope, loginService, $http) {
	$scope.submitlogin = function(){
		loginService.submitlogin($scope.loginUsername, $scope.loginPassword);
		$scope.loginPassword = "";
	};
	
	$scope.submitRegister = function(){
		loginService.submitRegister($scope.newUsername, $scope.newEmail, $scope.newPassword1, $scope.newPassword2);
		$scope.newPassword1 = "";
		$scope.newPassword2 = "";
	};
	
	$scope.$on('loginResponse', function(){
		//Show only a text message if the login failed.
		var response = loginService.loginStatus;
		if(response.localeCompare('ok') == 0)
			$scope.loginStatus = " ";
		else
			$scope.loginStatus = response;
	});
	
	$scope.$on('registerResponse', function(){
		$scope.loginStatus = loginService.loginStatus;
	});
	
	
	//functions that check if the user is logged in. Needs to be done if the user is logged in and pressed update (F5) in the browser.
	//Executed only once on load of the page.
	loginService.isLoggedin(); 
});

loginCtrl.$inject = ['$scope', 'loginService', '$http'];