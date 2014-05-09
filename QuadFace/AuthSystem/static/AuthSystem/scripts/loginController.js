var loginCtrl = angular.module('client').controller('loginCtrl', function($scope, loginService, $http) {
	$scope.submitlogin = function(){
		loginService.submitlogin($scope.loginUsername, $scope.loginPassword);
	};
	
	$scope.$on('loginResponse', function(){
		$scope.loginStatus = loginService.loginStatus;
	});
});
loginCtrl.$inject = ['$scope', 'loginService', '$http'];