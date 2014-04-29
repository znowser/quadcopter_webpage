var clientModule = angular.module('client', ['ngRoute', 'google-maps'])

clientModule.factory('graphService', function($rootScope, $http){
	var graphService = {};
	graphService.message = '';
	graphService.data = '';
	graphService.set = false;
	var ws = null;
	
	graphService.setUpWebsockets = function(openClose) {
		
		if (!graphService.set && openClose.localeCompare('open') == 0){
			
			ws = new WebSocket('ws://127.0.0.1:8080/ws/comLink?subscribe-broadcast');
			ws.onopen = function() {
		    	console.log("websocket connected");
				graphService.set = true;
			};
			ws.onmessage = function(e) {
				//console.log(e.data);
				result = JSON.parse(e.data);
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
			if (openClose.localeCompare('close') == 0 && graphService.set){
				ws.close();
			}
		}
	};
	
	graphService.getData = function(openClose) {
		$http({method: 'GET', url: '/communication'}).
			success(function(data, status, headers, config) {
					graphService.data = data;
					graphService.httpBroadcast();
			}).
			error(function(data, status, headers, config) {
			});
	}
	
	graphService.wsBroadcast = function(){
		$rootScope.$broadcast('websocket');
	};
	
	graphService.httpBroadcast = function(){
		$rootScope.$broadcast('http');
	};
	
	return graphService;
});


clientModule.factory('mapService', function($rootScope, $http){
	var mapService = {};
	mapService.message = '';
	mapService.data = '';
	mapService.set = false;
	var ws = null;
	
	mapService.setUpMapWebsockets = function(openClose) {
		
		if (!mapService.set && openClose.localeCompare('open') == 0){
			
			ws = new WebSocket('ws://127.0.0.1:8080/ws/coords?subscribe-broadcast');
			ws.onopen = function() {
		    	console.log("websocket connected");
				mapService.set = true;
			};
			ws.onmessage = function(e) {
				//console.log(e.data);
				result = JSON.parse(e.data);
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
			if (openClose.localeCompare('close') == 0 && mapService.set){
				ws.close();
			}
		}
	};
	
	mapService.getLocation = function(){
		$http({method: 'GET', url: '/maps'}).
			success(function(data, status, headers, config) {
					mapService.data = data;
					mapService.httpLocationBroadcast();
			}).
			error(function(data, status, headers, config) {
			});
	};
	
	mapService.wsLocationBroadcast = function(){
		$rootScope.$broadcast('websocketLocation');
	}
	
	mapService.httpLocationBroadcast = function(){
		$rootScope.$broadcast('httpLocation');
	}
	
	return mapService;
});

function MapCtrl($scope, mapService){
	console.log("kartor");
	$scope.map = {
	    center: {
	        latitude: 58.40721748,
	        longitude: 15.57939143
	    },
	    zoom: 16
	};
	$scope.quadPosition = {};
	
	$scope.$on('httpLocation', function(){
		result = mapService.data;
		$scope.quadPosition.latitude = result[0].fields.latitude;
		$scope.quadPosition.longitude = result[0].fields.longitude;
	});
	$scope.$on('websocketLocation', function(){
		console.log(mapService.message);
		result = mapService.message;
		$scope.quadPosition.latitude = result[0].fields.latitude;
		$scope.quadPosition.longitude = result[0].fields.longitude;
	});
}

function MenuCtrl($scope, graphService, mapService){
	$scope.welcome = true;
	$scope.communications = false;
	$scope.video = false;
	$scope.maps = false;
	
	$scope.showContent = function(item) {
		if (item.localeCompare('welcome') == 0){
			$scope.welcome = true;
			$scope.communications = false;
			$scope.video = false;
			$scope.maps = false;
			graphService.setUpWebsockets('close');
			mapService.setUpMapWebsockets('close');
			
		}
		if (item.localeCompare('communications') == 0){
			$scope.welcome = false;
			$scope.communications = true;
			$scope.video = false;
			$scope.maps= false;
			graphService.getData();
			graphService.setUpWebsockets('open');
			mapService.setUpMapWebsockets('close');
			
			
			
		}
		if (item.localeCompare('video') == 0){
			$scope.welcome = false;
			$scope.communications = false;
			$scope.video = true;
			$scope.maps= false;
			graphService.setUpWebsockets('close');
			mapService.setUpMapWebsockets('close');
			
		}
		if (item.localeCompare('maps') == 0){
			$scope.welcome = false;
			$scope.communications = false;
			$scope.video = false;
			$scope.maps= true;
			mapService.getLocation();
			graphService.setUpWebsockets('close');
			mapService.setUpMapWebsockets('open');
			
		}
	    
	 };
	
		
	
}

function GraphCtrl($scope, graphService){
	

	var x = []; // dataPoints
	var y = [];
	var z = [];

	$scope.xChart = new CanvasJS.Chart("xContainer",{
		title :{
			text: "x-angle"
		},			
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

	var xVal = 0;
	var dataLength = 20; // number of dataPoints visible at any point

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
		$scope.xChart.render();
		$scope.yChart.render();
		$scope.zChart.render();
						
	};

	/*$http({method: 'GET', url: '/communication'}).
		success(function(data, status, headers, config) {
			for (var i = data.length-1; i >= 0; i--){
				$scope.updateChart(data[i].fields.x_angle, data[i].fields.y_angle, data[i].fields.z_angle);
				console.log(data[i].fields.y_angle);
				console.log(i);
			}
		}).
		error(function(data, status, headers, config) {
		});*/
		
	$scope.$on('websocket', function(){
		result = graphService.message;
		$scope.updateChart(result[0].fields.x_angle,result[0].fields.y_angle,result[0].fields.z_angle);	
	});
	
	$scope.$on('http', function(){
		x.length=0;
		y.length=0;
		z.length=0;
		xVal = 0;
		result = graphService.data;
		for (var i = result.length-1; i >= 0; i--){
			$scope.updateChart(result[i].fields.x_angle,result[i].fields.y_angle,result[i].fields.z_angle);	
		}
		
	});
		
			
	
}

MenuCtrl.$inject = ['$scope', 'graphService', 'mapService'];
GraphCtrl.$inject = ['$scope', 'graphService'];
MapCtrl.$inject = ['$scope', 'mapService'];

