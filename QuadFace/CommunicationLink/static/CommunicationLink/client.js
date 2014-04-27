angular.module('quadcopter', ['ngRoute'])

.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      controller:'DataCtrl',
    })
    .otherwise({
      redirectTo:'/'
    });
})

.controller('DataCtrl', function($scope){
	

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

	
	var ws = new WebSocket('ws://127.0.0.1:8080/ws/comLink?subscribe-broadcast');
	ws.onopen = function() {
	    console.log("websocket connected");
	};
	ws.onmessage = function(e) {
		result = JSON.parse(e.data);
		$scope.updateChart(result[0].fields.x_angle,result[0].fields.y_angle,result[0].fields.z_angle);

	};
	ws.onerror = function(e) {
	    console.error(e);
	 };
	ws.onclose = function(e) {
	    console.log("connection closed");
	 }
	function send_message(msg) {
	    ws.send(msg);
	 }
	 
				
	
})


