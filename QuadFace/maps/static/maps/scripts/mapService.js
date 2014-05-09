angular.module('client').factory('mapService', function($rootScope, $http){//Factory for websockets and JsonHTTP for map coordinates.
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
