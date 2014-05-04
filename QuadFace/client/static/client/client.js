var clientModule = angular.module('client', ['google-maps', 'ngAnimate'])//The main directive on the site.

var isMobileDevice = function(){
	if(/Android|webOS|iPhoneiPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){//return true if mobile device(small screen)
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
			
			ws = new WebSocket('ws://10.0.1.13:8080/ws/comLink?subscribe-broadcast');
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
			
			ws = new WebSocket('ws://10.0.1.13:8080/ws/coords?subscribe-broadcast');
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
	
	var x = []; //dataPoints
	var y = [];
	var z = [];
	
	/* Below are all different datas displayed on the communication view. */
	$scope.xChart = new CanvasJS.Chart("xContainer",{
		title :{
			text: "x-angle"
		},		
		backgroundColor: "#CCCCCC",		
		data: [
		{
			name:'x',
			type: "spline",
			color:"#00FF00",
			dataPoints: x 
		}
		],
		axisY:{
	    	  title:"Angle"
	  	}, 
		axisX:{
	    	  title:"Time"
	  	},
  	});
	$scope.yChart = new CanvasJS.Chart("yContainer",{
		title :{
			text: "y-angle"
		},	
		backgroundColor: "#CCCCCC",			
		data: [
		{
			name:'y',
			type: "spline",
			color:"#FF0000",
			dataPoints: y 
		}
		],
		axisY:{
	  		title:"Angle"
		}, 
		axisX:{
		    title:"Time"
		},
	});
	$scope.zChart = new CanvasJS.Chart("zContainer",{
		title :{
			text: "z-angle"
		},		
		backgroundColor: "#CCCCCC",	
		data: [
		{
			name:'z',
			type: "spline",
			color:"#0000FF",
			dataPoints: z 
		}
		],
		axisY:{
	   		title:"Angle"
	  	}, 
		axisX:{
	    	title:"Time"
	  	},
  	});
	$scope.aChart = new CanvasJS.Chart("aContainer",{
		title :{
			text: "a-angle"
		},		
		backgroundColor: "#CCCCCC",	
		data: [
		{
			name:'a',
			type: "spline",
			color:"yellow",
			dataPoints: y 
		}
		],
		axisY:{
	   		title:"Angle"
	  	}, 
		axisX:{
	    	title:"Time"
	  	},
  	});
	$scope.bChart = new CanvasJS.Chart("bContainer",{
		title :{
			text: "b-angle"
		},		
		backgroundColor: "#CCCCCC",	
		data: [
		{
			name:'a',
			type: "spline",
			color:"orange",
			dataPoints: z 
		}
		],
		axisY:{
	   		title:"Angle"
	  	}, 
		axisX:{
	    	title:"Time"
	  	},
  	});
	/* End of communication view data */

	var xVal = 0;
	var dataLength = 20; //number of dataPoints visible at any point
	
	//If the sidplayed data is a dynamic chart, it is updated in this function. 
	$scope.updateChart = function (x_value, y_value, z_value) {

		x.push(
			{ x: xVal, y: x_value}
		);
		y.push(
			{ x: xVal, y: y_value}
		);
		z.push(
			{ x: xVal, y: z_value}
		);
		xVal = xVal + 0.5;
		if (x.length > dataLength)
		{
			x.shift();	
			y.shift();	
			z.shift();		
		}
		if ($scope.play){
			$scope.xChart.render();
			$scope.yChart.render();
			$scope.zChart.render();
			$scope.aChart.render();
			$scope.bChart.render();	
		}		
	};
	
	$scope.$on('websocket', function(){//Here the controller listens for new data on the websocket.
		result = graphService.message;
		$scope.updateChart(result[0].fields.x_angle,result[0].fields.y_angle,result[0].fields.z_angle);	//websocket data is single Json row of data.
	});
	
	$scope.$on('http', function(){//Here the controller listens for new data from HTTP
		x.length=0;
		y.length=0;
		z.length=0;
		xVal = 0;
		result = graphService.data;
		for (var i = result.length-1; i >= 0; i--){//HTTP data can be up to 20 rows of Json data, iteration ensued.
			$scope.updateChart(result[i].fields.x_angle,result[i].fields.y_angle,result[i].fields.z_angle);	
		}
		
	});
	
}

function SlideCtrl($scope, $timeout){
	/* Static images loaded from Django inte the clientview. These being displayed as a slideshow on the home page. */
	$scope.slides = [
		{image: DJANGO_STATIC_URL+'client/quadcopter/Abstract.jpg', description: 'Image 0'},
		{image: DJANGO_STATIC_URL+'client/quadcopter/Beach.jpg', description: 'Image 1'},
		{image: DJANGO_STATIC_URL+'client/quadcopter/Circles.jpg', description: 'Image 2'},
		{image: DJANGO_STATIC_URL+'client/quadcopter/Brushes.jpg', description: 'Image 3'},
		{image: DJANGO_STATIC_URL+'client/quadcopter/Blue Pond.jpg', description: 'Image 4'},
	];
	
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

