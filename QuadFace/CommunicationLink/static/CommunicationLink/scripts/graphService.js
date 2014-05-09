angular.module('client').factory('graphService', function($rootScope, $http){//Factory for controlling, websockets and JsonHTTP requests for graphs.
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