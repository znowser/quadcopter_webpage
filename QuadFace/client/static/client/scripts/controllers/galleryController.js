angular.module('client').controller('GalleryCtrl', function($scope, $timeout){
	$scope.left=false;

		
	$scope.mobile = false;
	if (!isMobileDevice()){
		//Images hade different sizes depending on mobile or desktop.
		$scope.galleries = [
			{id: 1, gall: [
				{media: DJANGO_STATIC_URL+'client/media/quadpictures/IMAG0011.jpg', type: 'img', id: 0},
				{media: DJANGO_STATIC_URL+'client/media/quadpictures/IMAG0012.jpg', type: 'img', id: 1},
				{media: DJANGO_STATIC_URL+'client/media/quadpictures/IMAG0013.jpg', type: 'img', id: 2},
				{media: DJANGO_STATIC_URL+'client/media/quadpictures/IMAG0014.jpg', type: 'img', id: 3},
				{media: DJANGO_STATIC_URL+'client/media/quadpictures/IMAG0015.jpg', type: 'img', id: 4},
			]},
		
			{id: 2, gall: [
				{media: DJANGO_STATIC_URL+'client/media/quadpictures/IMAG0011.jpg', type: 'img', id: 0},
				{media: DJANGO_STATIC_URL+'client/media/failedflights/VIDEO0006.mp4', type: 'video', id: 0},
				{media: DJANGO_STATIC_URL+'client/media/failedflights/VIDEO0007.mp4', type: 'video', id: 1},
			]}
		];
		
	}
	
	
});