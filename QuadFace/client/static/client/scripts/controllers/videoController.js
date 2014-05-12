angular.module('client').controller('VideoCtrl', function ($scope){
	$scope.left = false;
	$scope.setView = function(){
		if (!isMobileDevice()){
			$scope.left= ! $scope.left;
			
		}		
	}

});