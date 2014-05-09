var isMobileDevice = function(){
	if(/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){//return true if mobile device(small screen)
		return true;
	} else {
		return false;
	}
}

var MenuCtrl = angular.module('client').controller('MenuCtrl', function($scope, graphService, mapService, loginService){
	$scope.welcome = true;
	$scope.communications = false;
	$scope.video = false;
	$scope.maps = false;
	$scope.login = false;
	
	//Drive/control tab, only visible for logged in users
	$scope.driveMenyItem = false;
	
	//init value for battery image
	$scope.batteryImage = {image: DJANGO_STATIC_URL + 'client/battery_status/battery_smallest_grey_100.png', description: '100%'};
	
	$scope.userLoggedIn = "Sign in";
	$scope.frameClass = "";//Some css classes differ wether mobile or desktop, these are set here. 
	$scope.ContentClass = "";
	
	$scope.mobile = false;
	if (isMobileDevice()){
		$scope.contentClass = "contentBig";
		$scope.frameClass = "frameBig";
		$scope.mobile = true;
	} else {
		$scope.contentClass = "contentLeft";
		$scope.frameClass = "frame";
		$scope.mobile = false;
	}
	
	$scope.showContent = function(item) {//Menu function
		if (item.localeCompare('welcome') == 0){//Welcome window
			$scope.goToFrontPage();
		}
		if (item.localeCompare('communications') == 0){//Communications window
			//hide all views that are defined and check which one that shall be visible	
			$scope.hideAllViews();
			$scope.communications = true;
			graphService.getData();
			mapService.setUpMapWebsockets('close');
			graphService.setUpWebsockets('open');//Open the websocket for graphs
			
		}
		if (item.localeCompare('video') == 0){//Video view
			//hide all views that are defined and check which one that shall be visible
			$scope.hideAllViews();
			$scope.video = true;
			graphService.setUpWebsockets('open');
			mapService.setUpMapWebsockets('close');
			
		}
		if (item.localeCompare('maps') == 0){//map view
			//hide all views that are defined and check which one that shall be visible
			$scope.hideAllViews();
			$scope.maps= true;
			
			mapService.getLocation();
			graphService.setUpWebsockets('open');
			mapService.setUpMapWebsockets('open');//Open websocket for map
			
		}
		//login view
		if(item.localeCompare('login') == 0){
			if(loginService.userLoggedIn){
				$scope.driveMenyItem = false;
				$scope.loginView = false;
				loginService.userLoggedIn = false;
				$scope.userLoggedIn = "Sign in";
				//prevent that the button staying in pressed mode when moving it.
				$scope.hover5 = false;
				//redirect the newly logged out user to the front page.
				$scope.goToFrontPage();
			}
			else{
				$scope.loginView = true;
			}
		}
		
		if(item.localeCompare('controller') == 0){
			$scope.hideAllViews();
			$scope.controller = true;
		}
	 };
	 
	 $scope.hideAllViews = function(){
		$scope.welcome = false;
		$scope.communications = false;
		$scope.video = false;
		$scope.maps= false;
		$scope.loginView = false;
	 }
	 
	 $scope.goToFrontPage = function(){
		//hide all views that are defined and check which one that shall be visible
		$scope.hideAllViews();
		$scope.welcome = true;
		graphService.setUpWebsockets('open');
		mapService.setUpMapWebsockets('close');//Since the user isen't watching map here no websockets needs to be open, close if open.
	}
	 
	 //listen if the login was successful and update GUI if that was the case.
	$scope.$on('loginResponse', function(){
		//if the login was successful loginService.userLoggedIn is true.
		if(loginService.userLoggedIn){
			$scope.driveMenyItem = true;
			$scope.loginView = false;
			$scope.userLoggedIn = "Sign out";
		}
	});
	 
	 //listener for the updating of the battery icon in the menu
 	$scope.$on('websocket', function(){
			result = graphService.message;	

			$scope.battery = ((result[0].fields.BatteryCell1 + result[0].fields.BatteryCell2 + result[0].fields.BatteryCell3)/3).toFixed(2);
			if($scope.battery > 75)
				{$scope.batteryImage = {image: DJANGO_STATIC_URL + 'client/battery_status/battery_smallest_grey_100.png', description: '100% battery'};}
			else if($scope.battery > 50)
				{$scope.batteryImage = {image: DJANGO_STATIC_URL + 'client/battery_status/battery_smallest_grey_75.png', description: '75% battery'};}
			else if($scope.battery > 25)
				{$scope.batteryImage = {image: DJANGO_STATIC_URL + 'client/battery_status/battery_smallest_grey_50.png', description: '50% battery'};}
			else
				{$scope.batteryImage = {image: DJANGO_STATIC_URL + 'client/battery_status/battery_smallest_grey_25.png', description: '25% battery'};}
		});
});

MenuCtrl.$inject = ['$scope', 'graphService', 'mapService', 'loginService'];

