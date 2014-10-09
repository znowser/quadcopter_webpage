
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
			{image: DJANGO_STATIC_URL+'client/media/mobilepictures/mobile1.jpg', description: 'Image 0'},
			{image: DJANGO_STATIC_URL+'client/media/mobilepictures/mobile2.jpg', description: 'Image 1'},
			{image: DJANGO_STATIC_URL+'client/media/mobilepictures/mobile3.jpg', description: 'Image 2'},
			{image: DJANGO_STATIC_URL+'client/media/mobilepictures/mobile4.jpg', description: 'Image 3'},
			{image: DJANGO_STATIC_URL+'client/media/mobilepictures/mobile5.jpg', description: 'Image 4'},
		];
	
	} else {
		$scope.slides = [
		
			{image: DJANGO_STATIC_URL+'client/media/quadpictures/IMAG0011.jpg', type: 'img', id: 0},
			{image: DJANGO_STATIC_URL+'client/media/quadpictures/IMAG0012.jpg', type: 'img', id: 1},
			{image: DJANGO_STATIC_URL+'client/media/quadpictures/IMAG0013.jpg', type: 'img', id: 2},
			{image: DJANGO_STATIC_URL+'client/media/quadpictures/IMAG0014.jpg', type: 'img', id: 3},
			{image: DJANGO_STATIC_URL+'client/media/quadpictures/IMAG0015.jpg', type: 'img', id: 4},
		];
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