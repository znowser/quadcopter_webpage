var isMobileDevice = function(){
	if(/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){//return true if mobile device(small screen)
		return true;
	} else {
		return false;
	}
}

angular.module('client').controller('VideoCtrl', function ($scope){
	$scope.left = false;
	$scope.setView = function(){
		if (!isMobileDevice()){
			$scope.left= ! $scope.left;
			
		}		
	}

});