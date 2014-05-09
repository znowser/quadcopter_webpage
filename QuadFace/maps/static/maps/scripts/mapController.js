var isMobileDevice = function(){
	if(/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){//return true if mobile device(small screen)
		return true;
	} else {
		return false;
	}
}

var MapCtrl = angular.module('client').controller('MapCtrl', function($scope, mapService, $http, $timeout, geolocation){
	$scope.quadPosition = {};//Quadcopter position, get this data from server
	$scope.mobilePosition = {};//mobile device position, this data is polled from the mobile device user.
	$scope.map = {
	    center: {//Coodinates are center of map(Linköping)
	        latitude: 58.40721748,
	        longitude: 15.57939143
	    },
	    zoom: 16
	};
	
	$scope.left = false;
	$scope.setView = function(){//Function that changes view when enlarging map
		if (!isMobileDevice()){
			$scope.left= ! $scope.left;
		}	
	}
	
	$scope.$on('httpLocation', function(){
		result = mapService.data;
		$scope.quadPosition.latitude = result[0].fields.latitude;//Updating position on map.
		$scope.quadPosition.longitude = result[0].fields.longitude;
	});
	$scope.$on('websocketLocation', function(){
		result = mapService.message;
		$scope.quadPosition.latitude = result[0].fields.latitude;//Updating position on map.
		$scope.quadPosition.longitude = result[0].fields.longitude;
	});
	
	$scope.intervalFunction = function(){
		$timeout(function() {
				geolocation.getLocation().then(function(data){//poll for mobile device coordinates, paint on map
			      $scope.mobilePosition.latitude = data.coords.latitude;
				  $scope.mobilePosition.longitude = data.coords.longitude; 
			    });
			$scope.intervalFunction();
		}, 4000)
	};
	geolocation.getLocation().then(function(data){//poll for mobile device coordinates, paint on map
      $scope.mobilePosition.latitude = data.coords.latitude;
	  $scope.mobilePosition.longitude = data.coords.longitude; 
    });
	$scope.intervalFunction();
	

	
});
MapCtrl.$inject = ['$scope', 'mapService', '$http', '$timeout', 'geolocation'];