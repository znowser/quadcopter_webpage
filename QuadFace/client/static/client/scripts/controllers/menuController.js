var MenuCtrl = angular.module('client').controller('MenuCtrl', function($scope, $http, graphService, mapService, loginService){
	 // ==== Help functions used only in this controller ====
	 $scope.hideAllViews = function(){
		$scope.welcome = false;
		$scope.communications = false;
		$scope.video = false;
		$scope.maps= false;
		$scope.loginView = false;
		$scope.controllerView = false;
		$scope.model = false;
	 }
	 
	 $scope.goToFrontPage = function(){
		//hide all views that are defined and check which one that shall be visible
		$scope.hideAllViews();
		$scope.welcome = true;
		graphService.setUpWebsockets('open');
		mapService.setUpMapWebsockets('close');//Since the user isen't watching map here no websockets needs to be open, close if open.
	}
	//=======================================================

	//set the front page to be the start page
	$scope.goToFrontPage();
	$scope.LoggedInControlData = "";
	//Drive/control tab, only visible for logged in users
	$scope.driveMenyItem = false;
	$scope.userLoggedIn = "Sign in";
	//init value for battery image
	$scope.batteryImage = {image: DJANGO_STATIC_URL + 'client/battery_status/battery_smallest_grey_100.png', description: '100%'};
	
	$scope.frameClass = "";//Some css classes differ wether mobile or desktop, these are set here. 
	$scope.ContentClass = "";
	
	//==== Check if the client is desktop or mobile ====
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
	//============================
	
	//Menu function, This function determine what page that shall be shown in the browser
	$scope.showContent = function(item) {
		if (item.localeCompare('welcome') == 0){//Welcome window
			$scope.goToFrontPage();
		}
		else if (item.localeCompare('communications') == 0){//Communications window
			//hide all views that are defined and check which one that shall be visible	
			$scope.hideAllViews();
			$scope.communications = true;
			graphService.getData();
			mapService.setUpMapWebsockets('close');
			graphService.setUpWebsockets('open');//Open the websocket for graphs
			
		}
		else if (item.localeCompare('video') == 0){//Video view
			//hide all views that are defined and check which one that shall be visible
			$scope.hideAllViews();
			$scope.video = true;
			graphService.setUpWebsockets('open');
			mapService.setUpMapWebsockets('close');
			
		}
		else if (item.localeCompare('maps') == 0){//map view
			//hide all views that are defined and check which one that shall be visible
			$scope.hideAllViews();
			$scope.maps= true;
			
			mapService.getLocation();
			graphService.setUpWebsockets('open');
			mapService.setUpMapWebsockets('open');//Open websocket for map
			
		}
		else if(item.localeCompare('model') == 0){
			$scope.hideAllViews();
			$scope.model = true;
			graphService.setUpWebsockets('open');
			mapService.setUpMapWebsockets('close');
		}
		//login view
		else if(item.localeCompare('login') == 0){
			if(loginService.userLoggedIn){
				$scope.driveMenyItem = false;
				$scope.loginView = false;
				loginService.userLoggedIn = false;
				$scope.userLoggedIn = "Sign in";
				//prevent that the button staying in pressed mode when moving it.
				$scope.hover5 = false;
				//redirect the newly logged out user to the front page.
				$scope.goToFrontPage();
				//send logout request to django
				//The request to django have no check for failure.
				$http({method: 'GET', url: '/auth/logout'});
				//TODO check if the data is actually sent.
			}
			else{
				$scope.loginView = true;
			}
		}
		
		else if(item.localeCompare('controllerView') == 0){
			$scope.hideAllViews();
			$scope.controllerView = true;
			//access logged in page, the login check is done on the server side by django.
			$http({method: 'GET', url: '/control/'}).
				success(function($data, $status, $headers, $config) {
					$scope.LoggedInControlData = $data;
				}).error(function($data, $status){
					alert($status);
				});
		}
	 };
	 
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

MenuCtrl.$inject = ['$scope', '$http','graphService', 'mapService', 'loginService'];

