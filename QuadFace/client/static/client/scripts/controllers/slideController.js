
var isMobileDevice = function(){
	if(/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){//return true if mobile device(small screen)
		return true;
	} else {
		return false;
	}
}

angular.module('client').controller('SlideCtrl', function($scope, $timeout){
	
	$scope.left=false;

	$scope.setView = function(){
		if (!isMobileDevice()){
			$scope.left= ! $scope.left;
		}
		
	}
	$scope.mobile = false;
	if (isMobileDevice()){
		$scope.mobile = true;
		//Images hade different sizes depending on mobile or desktop.
		$scope.slides = [
			{image: DJANGO_STATIC_URL+'client/quadcopter/mobile1.jpg', description: 'Image 0'},
			{image: DJANGO_STATIC_URL+'client/quadcopter/mobile2.jpg', description: 'Image 1'},
			{image: DJANGO_STATIC_URL+'client/quadcopter/mobile3.jpg', description: 'Image 2'},
			{image: DJANGO_STATIC_URL+'client/quadcopter/mobile4.jpg', description: 'Image 3'},
			{image: DJANGO_STATIC_URL+'client/quadcopter/mobile5.jpg', description: 'Image 4'},
		];
	
	} else {
		$scope.slides = [
		
			{image: DJANGO_STATIC_URL+'client/quadcopter/IMAG0011.jpg', description: 'Image 0'},
			{image: DJANGO_STATIC_URL+'client/quadcopter/IMAG0012.jpg', description: 'Image 1'},
			{image: DJANGO_STATIC_URL+'client/quadcopter/IMAG0013.jpg', description: 'Image 2'},
			{image: DJANGO_STATIC_URL+'client/quadcopter/IMAG0014.jpg', description: 'Image 3'},
			{image: DJANGO_STATIC_URL+'client/quadcopter/IMAG0015.jpg', description: 'Image 4'},
		];
		console.log("slides");
	}
	/* Static images loaded from Django inte the clientview. These being displayed as a slideshow on the home page. */
	
	
	$scope.currentIndex = 0;
	

	$scope.setCurrentSlideIndex = function (index) {
	     $scope.currentIndex = index;
	};
			
	$scope.isCurrentSlideIndex = function (index) {
		return $scope.currentIndex === index;
	};
	
	
	
	//Update which slide to show every 4:th second.
	$scope.intervalFunction = function(){
		$timeout(function() {
			$scope.currentIndex++;
			if ($scope.currentIndex >= $scope.slides.length){
				$scope.currentIndex = 0;
			}
			$scope.intervalFunction();
		}, 4000)
	};
	$scope.intervalFunction();
});