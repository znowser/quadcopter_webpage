var GraphCtrl = angular.module('client').controller('GraphCtrl', function($scope, graphService, $timeout){	

	$scope.left=false;

	$scope.setView = function(){
		$scope.left= ! $scope.left;
		
	}
	
	$scope.batteryShow = true;//booleans for what data to be displayed.
	$scope.engineShow = true;
	$scope.temperatureShow = true;
	$scope.altitudeShow = true;
	
	$scope.playBattery = true;
	$scope.playEngine = true;
	$scope.playTemp = true;
	$scope.playAlt = true;
	$scope.play = true;
	
	
	$scope.resizeCharts = function(){
		$scope.batteryChart.render();
		$scope.batteryLargeChart.render();
		$scope.engineChart.render();
		$scope.engineLargeChart.render();
		$scope.tempChart.render();
		$scope.tempLargeChart.render();
		$scope.altChart.render();
		$scope.altLargeChart.render();
	}
	
	
	
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
	var displayEngine = [];
	var displayBattery = [];
	
	/*---------- Below are all different datas displayed on the communication view.---------------------------------------------------- */
	//------------------------------Battery----------------------------
	
	$scope.batteryChart = new CanvasJS.Chart("batteryContainer",{
		title :{
			text: "Battery levels",
			fontColor: "#3B6AA0",
			fontFamily: "lucida grande",
			
			fontSize:16
		},		
		backgroundColor: "#F2F2F2",		
		data: [
		{
			name:'battery',
			click: function(e){ 
				var output = "";
				var k = 1;
				for (var i = displayBattery.length-1; i > 0; i--){
					output += displayBattery[i].label + ": " + displayBattery[i].y + " ";
					if (k % 4 == 0){
						output += "\n";
					}
					k++;
				}
				alert(output);
			    $scope.playBattery = ! $scope.playBattery;
			},
			type: "column",
			color:"#006400",
			dataPoints: battery 
		}
		],
		axisY:{
	    	  title:"%",
			  minimum: 0,
			  maximum: 100,
			titleFontFamily: "lucida grande",
			titleFontColor: "#3B6AA0",
			titleFontSize:14
	  	}, 
  	});
	$scope.batteryLargeChart = new CanvasJS.Chart("batteryLargeContainer",{
		title :{
			text: "Battery levels",
			fontFamily: "lucida grande",
			
			fontSize:16,
			fontColor: "#3B6AA0"
		},		
		backgroundColor: "#F2F2F2",		
		data: [
		{
			name:'battery',
			click: function(e){ 
				var output = "";
				var k = 1;
				for (var i = displayBattery.length-1; i > 0; i--){
					output += displayBattery[i].label + ": " + displayBattery[i].y + " ";
					if (k % 4 == 0){
						output += "\n";
					}
					k++;
				}
				alert(output);
			    $scope.playBattery = ! $scope.playBattery;
			},
			type: "column",
			color:"#006400",
			dataPoints: battery 
		}
		],
		axisY:{
	    	  title:"%",
			  minimum: 0,
			  maximum: 100,
			titleFontFamily: "lucida grande",
			titleFontColor: "#3B6AA0",
			titleFontSize:14
	  	}, 
  	});
	
	//------------------------------Engine----------------------------
	$scope.engineChart = new CanvasJS.Chart("engineContainer",{
		title :{
			text: "Engine load",
			fontFamily: "lucida grande",
			
			fontSize:16,
			fontColor: "#3B6AA0"
		},	
		backgroundColor: "#F2F2F2",			
		data: [
		{
			name:'engines',
			click: function(e){ 
				var output = "";
				var k = 1;
				for (var i = displayEngine.length-1; i > 0; i--){
					output += displayEngine[i].label + ": " + displayEngine[i].y + " ";
					if (k % 4 == 0){
						output += "\n";
					}
					k++;
				}
				alert(output);
			    $scope.playEngine = ! $scope.playEngine;
			},
			type: "column",
			color:"#8A0707",
			dataPoints: engines 
		}
		],
		axisY:{
	  		title:"Load",
			  minimum: 0,
			  maximum: 100,
			titleFontFamily: "lucida grande",
			titleFontColor: "#3B6AA0",
			titleFontSize:14
		}, 

	});
	$scope.engineLargeChart = new CanvasJS.Chart("engineLargeContainer",{
		title :{
			text: "Engine load",
			fontFamily: "lucida grande",
			
			fontSize:16,
			fontColor: "#3B6AA0"
		},	
		backgroundColor: "#F2F2F2",			
		data: [
		{
			name:'engines',
			click: function(e){ 
				var output = "";
				var k = 1;
				for (var i = displayEngine.length-1; i > 0; i--){
					output += displayEngine[i].label + ": " + displayEngine[i].y + " ";
					if (k % 4 == 0){
						output += "\n";
					}
					k++;
				}
				alert(output);
			    $scope.playEngine = ! $scope.playEngine;
			},
			type: "column",
			color:"#8A0707",
			dataPoints: engines 
		}
		],
		axisY:{
	  		title:"Load",
			  minimum: 0,
			  maximum: 100,
			titleFontFamily: "lucida grande",
			titleFontColor: "#3B6AA0",
			titleFontSize:14
		}, 

	});
	
	//------------------------------Temp----------------------------
	$scope.tempChart = new CanvasJS.Chart("temperatureContainer",{
		title :{
			text: "Temperature",
			fontFamily: "lucida grande",
			
			fontSize:16,
			fontColor: "#3B6AA0"
		},		
		backgroundColor: "#F2F2F2",		
		data: [
		{
			name:'temp',
			click: function(e){ 
				var output = "";
				var k = 1;
				for (var i = temp.length-1; i > 0; i--){
					output += i + ": " + temp[i].y + " ";
					if (k % 4 == 0){
						output += "\n";
					}
					k++;
				}
				alert(output);
			    $scope.playTemp = ! $scope.playTemp;
			},
			type: "spline",
			color:"#999900",
			dataPoints: temp 
		}
		],
		axisY:{
		   	  suffix:"°C",
			  minimum: 10,
			  maximum: 40
		 }, 
	});
	$scope.tempLargeChart = new CanvasJS.Chart("temperatureLargeContainer",{
			title :{
				text: "Temperature",
				fontFamily: "lucida grande",
			
				fontSize:16,
			fontColor: "#3B6AA0"
			},		
			backgroundColor: "#F2F2F2",		
			data: [
			{
				name:'temp',
				click: function(e){ 
					var output = "";
					var k = 1;
					for (var i = temp.length-1; i > 0; i--){
						output += i + ": " + temp[i].y + " ";
						if (k % 4 == 0){
							output += "\n";
						}
						k++;
					}
					alert(output);
				    $scope.playTemp = ! $scope.playTemp;
				},
				type: "spline",
				color:"#999900",
				dataPoints: temp 
			}
			],
			axisY:{
		    	  suffix:"°C",
			 	  minimum: 10,
			 	  maximum: 40
		  	}, 
	  	});
	
	//------------------------------Altitude----------------------------
	$scope.altChart = new CanvasJS.Chart("altitudeContainer",{
		title :{
			text: "Altitude",
			fontFamily: "lucida grande",
			
			fontSize:16,
			fontColor: "#3B6AA0"
		},		
		backgroundColor: "#F2F2F2",	
		data: [
		{
			name:'alt',
			click: function(e){ 
				var output = "";
				var k = 1;
				for (var i = alt.length-1; i > 0; i--){
					output += i + ": " + alt[i].y + " ";
					if (k % 4 == 0){
						output += "\n";
					}
					k++;
				}
				alert(output);
				 $scope.playAlt = ! $scope.playAlt;
			},
			type: "spline",
			color:"#000080",
			dataPoints: alt
		}
		],
		axisY:{
	   		suffix:"m",
			  minimum: 80,
			  maximum: 300
	  	}, 
  	});
	$scope.altLargeChart = new CanvasJS.Chart("altitudeLargeContainer",{
		title :{
			text: "Altitude",
			fontFamily: "lucida grande",
			
			fontSize:16,
			fontColor: "#3B6AA0"
		},		
		backgroundColor: "#F2F2F2",	
		data: [
		{
			name:'alt',
			click: function(e){ 
				var output = "";
				var k = 1;
				for (var i = alt.length-1; i > 0; i--){
					output += i + ": " + alt[i].y + " ";
					if (k % 4 == 0){
						output += "\n";
					}
					k++;
				}
				alert(output);
			 $scope.playAlt = ! $scope.playAlt;
			},
			type: "spline",
			color:"#000080",
			dataPoints: alt
		}
		],
		axisY:{
	   		suffix:"m",
			  minimum: 80,
			  maximum: 300
	  	}, 
  	});
	
	/* --------------End of communication view graphs------------------------------------------------------------------------------- */

	var xVal = 0;
	var dataLength = 20; //number of dataPoints visible at any point
	
	//Function for columncharts
	$scope.updateColumnChart = function (c1, c2, c3, e1, e2, e3, e4) {
		c1 = parseInt(c1);
		c2 = parseInt(c2);
		c3 = parseInt(c3);
		e1 = parseInt(e1);
		e2 = parseInt(e2);
		e3 = parseInt(e3);
		e4 = parseInt(e4);
		
		battery.push({ label: "Cell1", y: c1});
		battery.push({ label: "Cell2", y: c2});
		battery.push({ label: "Cell3", y: c3});
		battery.push({ label: "Total", y: ((c1+c2+c3)/3)});
		
		engines.push({ label: "Engine1", y: e1});
		engines.push({ label: "Engine2", y: e2});
		engines.push({ label: "Engine3", y: e3});
		engines.push({ label: "Engine4", y: e4});
		
		displayBattery.push({ label: "Cell1", y: c1});
		displayBattery.push({ label: "Cell2", y: c2});
		displayBattery.push({ label: "Cell3", y: c3});
		displayBattery.push({ label: "Total", y: ((c1+c2+c3)/3).toFixed(2)});
		
		displayEngine.push({ label: "Engine1", y: e1});
		displayEngine.push({ label: "Engine2", y: e2});
		displayEngine.push({ label: "Engine3", y: e3});
		displayEngine.push({ label: "Engine4", y: e4});

		if (displayBattery.length > dataLength)
		{
			displayBattery.shift();	
			displayEngine.shift();	
	
		}
		
		if ($scope.play){
			if ($scope.playBattery){//Check which to update
				$scope.batteryChart.render();
				$scope.batteryLargeChart.render();
			}
			if ($scope.playEngine){
				$scope.engineChart.render();
				$scope.engineLargeChart.render();
			}
			

		}		
	};
	
	//update splinecharts
	$scope.updateChart = function (x_value, y_value) {
		var x1 = parseFloat(x_value);
		var y1 = parseFloat(y_value);
		
		temp.push(
			{ x: xVal, y: x1}
		);
		alt.push(
			{ x: xVal, y: y1}
		);

		xVal = xVal + 0.5;
		//No more than 20 values, push away the first value
		if (temp.length > dataLength)
		{
			temp.shift();	
			alt.shift();	
	
		}
		if ($scope.play){
			if ($scope.playTemp){//Check which to update
				$scope.tempChart.render();
				$scope.tempLargeChart.render();
			}
			if ($scope.playAlt){
				$scope.altChart.render();
				$scope.altLargeChart.render();
			}
			
		}		
	};
	
	
	$scope.$on('websocket', function(){//Here the controller listens for new data on the websocket.
		result = graphService.message;
		battery.length=0;//Clearing graphs of data
		engines.length=0;
		
		$scope.updateColumnChart(result[0].fields.BatteryCell1,result[0].fields.BatteryCell2,result[0].fields.BatteryCell3,
			result[0].fields.Engine1,result[0].fields.Engine2,result[0].fields.Engine3, result[0].fields.Engine4);	//websocket data is single Json row of data.
		$scope.updateChart(result[0].fields.Temperature, result[0].fields.Altitude);
	});
	
	$scope.$on('http', function(){//Here the controller listens for new data from HTTP
		battery.length=0;//Clearing graphs of data
		engines.length=0;
		temp.length=0;
		alt.length=0;
		xVal = 0;//ON new http clear x value
		result = graphService.data;
	
		$scope.updateColumnChart(result[result.length-1].fields.BatteryCell1,result[result.length-1].fields.BatteryCell2,
			result[result.length-1].fields.BatteryCell3, result[result.length-1].fields.Engine1,result[result.length-1].fields.Engine2,
			result[result.length-1].fields.Engine3, result[result.length-1].fields.Engine4);
			
		for (var i = result.length-1; i >= 0; i--){//HTTP data can be up to 20 rows of Json data, iteration ensued.
			$scope.updateChart(result[i].fields.Temperature,result[i].fields.Altitude);	
		}
		
	});
	
});
GraphCtrl.$inject = ['$scope', 'graphService', '$timeout'];
