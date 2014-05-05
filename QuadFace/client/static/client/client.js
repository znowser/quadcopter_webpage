var clientModule = angular.module('client', ['google-maps', 'ngAnimate'])//The main directive on the site.

var isMobileDevice = function(){
	if(/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){//return true if mobile device(small screen)
		return true;
	} else {
		return false;
	}
}
clientModule.factory('graphService', function($rootScope, $http){//Factory for controlling, websockets and JsonHTTP requests for graphs.
	var graphService = {};
	graphService.message = '';
	graphService.data = '';
	graphService.set = false;
	var ws = null;
	
	graphService.setUpWebsockets = function(openClose) {//websockets
		
		if (!graphService.set && openClose.localeCompare('open') == 0){
			
			ws = new WebSocket('ws://192.168.0.186:8080/ws/comLink?subscribe-broadcast');
			ws.onopen = function() {
		    	console.log("websocket connected");
				graphService.set = true;
			};
			ws.onmessage = function(e) {
				result = JSON.parse(e.data);//Json data
				graphService.message = result;
				graphService.wsBroadcast();
			};
			ws.onerror = function(e) {
		    	console.error(e);
			};
			ws.onclose = function(e) {
				console.log("connection closed");
				graphService.set = false;
			} 
		} else {
			if (openClose.localeCompare('close') == 0 && graphService.set){//If someone with a open websocket leaves the tab the connection is closed to save unecessary traffic
				ws.close();
			}
		}
	};
	
	graphService.getData = function(openClose) {//HTTP request, getting Json as response
		$http({method: 'GET', url: '/communication'}).
			success(function(data, status, headers, config) {
					graphService.data = data;
					graphService.httpBroadcast();
			}).
			error(function(data, status, headers, config) {
			});
	}
	
	graphService.wsBroadcast = function(){//Sending out websocket data to the correct controller
		$rootScope.$broadcast('websocket');
	};
	
	graphService.httpBroadcast = function(){//sending out HTTP data to the correct controller
		$rootScope.$broadcast('http');
	};
	
	return graphService;
});


clientModule.factory('mapService', function($rootScope, $http){//Factory for websockets and JsonHTTP for map coordinates.
	var mapService = {};
	mapService.message = '';
	mapService.data = '';
	mapService.set = false;
	var ws = null;
	
	mapService.setUpMapWebsockets = function(openClose) {//Setting up websockets for map coordinates
		
		if (!mapService.set && openClose.localeCompare('open') == 0){
			
			ws = new WebSocket('ws://192.168.0.186:8080/ws/coords?subscribe-broadcast');
			ws.onopen = function() {
		    	console.log("websocket connected");
				mapService.set = true;
			};
			ws.onmessage = function(e) {
				result = JSON.parse(e.data);//Data is Json
				mapService.message = result;
				mapService.wsLocationBroadcast();
			};
			ws.onerror = function(e) {
		    	console.error(e);
			};
			ws.onclose = function(e) {
				console.log("connection closed");
				mapService.set = false;
			} 
		} else {
			if (openClose.localeCompare('close') == 0 && mapService.set){//If someone with a open websocket leaves the tab the connection is closed to save unecessary traffic
				ws.close();
			}
		}
	};
	
	mapService.getLocation = function(){//JsonHTTP request to 
		$http({method: 'GET', url: '/maps'}).
			success(function(data, status, headers, config) {
					mapService.data = data;
					mapService.httpLocationBroadcast();
			}).
			error(function(data, status, headers, config) {
			});
	};
	
	mapService.wsLocationBroadcast = function(){//sending websocketdata to correct principal.
		$rootScope.$broadcast('websocketLocation');
	}
	
	mapService.httpLocationBroadcast = function(){//Sending HTTP data to correct receiver.
		$rootScope.$broadcast('httpLocation');
	}
	
	return mapService;
});

function MapCtrl($scope, mapService, $http){
	$scope.quadPosition = {};
	$scope.map = {
	    center: {//Coodinates are center of map(Linköping)
	        latitude: 58.40721748,
	        longitude: 15.57939143
	    },
	    zoom: 16
	};

	
	$scope.$on('httpLocation', function(){
		result = mapService.data;
		console.log(result);
		$scope.quadPosition.latitude = result[0].fields.latitude;//Updating position on map.
		$scope.quadPosition.longitude = result[0].fields.longitude;
	});
	$scope.$on('websocketLocation', function(){
		result = mapService.message;
		$scope.quadPosition.latitude = result[0].fields.latitude;//Updating position on map.
		$scope.quadPosition.longitude = result[0].fields.longitude;
	});
	
}

function MenuCtrl($scope, graphService, mapService){
	$scope.welcome = true;
	$scope.communications = false;
	$scope.video = false;
	$scope.maps = false;
	$scope.login = false;
	
	$scope.userLoggedIn = "Log in";
	
	$scope.frameClass = "";//Some css classes differ wether mobile or desktop, these are set here. 
	$scope.ContentClass = "";
	$scope.mobile = false;
	if (isMobileDevice()){
		$scope.contentClass = "contentMobile";
		$scope.frameClass = "frameMobile";
		$scope.mobile = true;
	} else {
		$scope.contentClass = "contentLeft";
		$scope.frameClass = "frame";
		$scope.mobile = false;
	}
	
	$scope.showContent = function(item) {//Menu function
		if (item.localeCompare('welcome') == 0){//Welcome window
			$scope.welcome = true;
			$scope.communications = false;
			$scope.video = false;
			$scope.maps = false;
			graphService.setUpWebsockets('close');//Since the user isen't watching neither graphs or map here no websockets needs to be open, close if open.
			mapService.setUpMapWebsockets('close');
			
		}
		if (item.localeCompare('communications') == 0){//Communications window
			$scope.welcome = false;
			$scope.communications = true;
			$scope.video = false;
			$scope.maps= false;
			graphService.getData();
			mapService.setUpMapWebsockets('close');
			graphService.setUpWebsockets('open');//Open the websocket for graphs
			
		}
		if (item.localeCompare('video') == 0){//Video view
			$scope.welcome = false;
			$scope.communications = false;
			$scope.video = true;
			$scope.maps= false;
			graphService.setUpWebsockets('close');
			mapService.setUpMapWebsockets('close');
			
		}
		if (item.localeCompare('maps') == 0){//map view
			$scope.welcome = false;
			$scope.communications = false;
			$scope.video = false;
			$scope.maps= true;
			mapService.getLocation();
			graphService.setUpWebsockets('close');
			mapService.setUpMapWebsockets('open');//Open websocket for map
			
		}
		//login view
		if(item.localeCompate('login') == 0){
			alert("helo");
			$scope.userLoggedIn = "Log out";
		}
	 };
	
		
	
}

function GraphCtrl($scope, graphService){
	
	$scope.xAngle = true;//booleans for what data to be displayed.
	$scope.yAngle = true;
	$scope.zAngle = true;
	$scope.aAngle = true;
	$scope.bAngle = true;
	$scope.play = true;
	$scope.setGraphVisability = function(var1){
		var1 = ! var1;
	};
	$scope.setPlayPause = function(){//Pause or play data stream.
		$scope.play = ! $scope.play;
	};
	
	var battery = []; //dataPoints
	var engines = [];
	var temp = [];
	var alt = [];
	
	/* Below are all different datas displayed on the communication view. */
	$scope.batteryChart = new CanvasJS.Chart("batteryContainer",{
		title :{
			text: "Battery levels"
		},		
		backgroundColor: "#CCCCCC",		
		data: [
		{
			name:'battery',
			type: "column",
			color:"#006400",
			dataPoints: battery 
		}
		],
		axisY:{
	    	  title:"%"
	  	}, 
  	});
	
	$scope.engineChart = new CanvasJS.Chart("engineContainer",{
		title :{
			text: "Engine load"
		},	
		backgroundColor: "#CCCCCC",			
		data: [
		{
			name:'engines',
			type: "column",
			color:"#8A0707",
			dataPoints: engines 
		}
		],
		axisY:{
	  		title:"Load"
		}, 

	});
	
	$scope.tempChart = new CanvasJS.Chart("temperatureContainer",{
			title :{
				text: "Temperature"
			},		
			backgroundColor: "#CCCCCC",		
			data: [
			{
				name:'temp',
				type: "spline",
				color:"#999900",
				dataPoints: temp 
			}
			],
			axisY:{
		    	  suffix:"°C"
		  	}, 
	  	});
		
	$scope.altChart = new CanvasJS.Chart("altitudeContainer",{
		title :{
			text: "Altitude"
		},		
		backgroundColor: "#CCCCCC",	
		data: [
		{
			name:'alt',
			type: "spline",
			color:"#000080",
			dataPoints: alt
		}
		],
		axisY:{
	   		suffix:"m"
	  	}, 
  	});
	/* End of communication view data */

	var xVal = 0;
	var dataLength = 20; //number of dataPoints visible at any point
	
	//If the sidplayed data is a dynamic chart, it is updated in this function. 
	$scope.updateColumnChart = function (c1, c2, c3, e1, e2, e3, e4) {
		for (var i = 0; i < battery.length; i++){
			battery.shift();
			engines.shift();
		}
		
		battery.push({ label: "Cell1", y: c1});
		battery.push({ label: "Cell2", y: c2});
		battery.push({ label: "Cell3", y: c3});
		battery.push({ label: "Total", y: ((c1+c2+c3)/3)});
		
		engines.push({ label: "Engine1", y: e1});
		engines.push({ label: "Engine2", y: e2});
		engines.push({ label: "Engine3", y: e3});
		engines.push({ label: "Engine4", y: e4});

		if ($scope.play){
			$scope.batteryChart.render();
			$scope.engineChart.render();
		}		
	};
	
	$scope.updateChart = function (x_value, y_value) {
		var x1 = +x_value;
		var y1 = +y_value;
		
		temp.push(
			{ x: xVal, y: x1}
		);
		alt.push(
			{ x: xVal, y: y1}
		);

		xVal = xVal + 0.5;
		if (temp.length > dataLength)
		{
			temp.shift();	
			alt.shift();	
	
		}
		if ($scope.play){
			$scope.tempChart.render();
			$scope.altChart.render();
		}		
	};
	
	
	$scope.$on('websocket', function(){//Here the controller listens for new data on the websocket.
		result = graphService.message;
		$scope.updateColumnChart(result[0].fields.BatteryCell1,result[0].fields.BatteryCell2,result[0].fields.BatteryCell3,
			result[0].fields.Engine1,result[0].fields.Engine2,result[0].fields.Engine3, result[0].fields.Engine4);	//websocket data is single Json row of data.
		$scope.updateChart(result[0].fields.Temperature, result[0].fields.Altitude);
	});
	
	$scope.$on('http', function(){//Here the controller listens for new data from HTTP
		battery.length=0;
		engines.length=0;
		temp.length=0;
		alt.length=0;
		xVal = 0;
		
		result = graphService.data;
		//console.log("http");
		$scope.updateColumnChart(result[result.length-1].fields.BatteryCell1,result[result.length-1].fields.BatteryCell2,
			result[result.length-1].fields.BatteryCell3, result[result.length-1].fields.Engine1,result[result.length-1].fields.Engine2,
			result[result.length-1].fields.Engine3, result[result.length-1].fields.Engine4);
			
		for (var i = result.length-1; i >= 0; i--){//HTTP data can be up to 20 rows of Json data, iteration ensued.
			$scope.updateChart(result[i].fields.Temperature,result[i].fields.Altitude);	
		}
		
	});
	
}

function SlideCtrl($scope, $timeout){
	$scope.mobile = false;
	if (isMobileDevice()){
		$scope.mobile = true;
		$scope.slides = [];
	
	} else {
		$scope.slides = [
			{image: DJANGO_STATIC_URL+'client/quadcopter/Abstract.jpg', description: 'Image 0'},
			{image: DJANGO_STATIC_URL+'client/quadcopter/Beach.jpg', description: 'Image 1'},
			{image: DJANGO_STATIC_URL+'client/quadcopter/Circles.jpg', description: 'Image 2'},
			{image: DJANGO_STATIC_URL+'client/quadcopter/Brushes.jpg', description: 'Image 3'},
			{image: DJANGO_STATIC_URL+'client/quadcopter/Blue Pond.jpg', description: 'Image 4'},
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
}


MenuCtrl.$inject = ['$scope', 'graphService', 'mapService'];
GraphCtrl.$inject = ['$scope', 'graphService'];
MapCtrl.$inject = ['$scope', 'mapService', '$http'];

