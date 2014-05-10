var isMobileDevice = function(){
	if(/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){//return true if mobile device(small screen)
		return true;
	} else {
		return false;
	}
}
var init3DModel = function(){

	
}
var ModelCtrl = angular.module('client').controller('ModelCtrl', function($scope, graphService, $timeout){
	$scope.left = false;
	$scope.intervalFunction = function(){
		$timeout(function() {
			var obj = document.getElementById("3d");
			var obj2 = window.getComputedStyle(obj, null);
			var height = parseInt(obj2.getPropertyValue('height'));
			var width = parseInt(obj2.getPropertyValue('width'));
			console.log(height);
			console.log(width);
			camera.aspect = width / height;
			camera.updateProjectionMatrix();
			$scope.renderer.setSize( width, height );

		}, 10)
	};
	
	$scope.setView = function(){
		if (!isMobileDevice()){
			$scope.left= ! $scope.left;

			

		}		
	}
	$scope.resize = function(){
		$scope.intervalFunction();

	}
	$scope.model = null;
	/*$scope.init3d = function(){
		
	}*/
	window.onresize = function(event) {
		var obj = document.getElementById("3d");
		var obj2 = window.getComputedStyle(obj, null);
		var height = obj2.getPropertyValue('height');
		var width = obj2.getPropertyValue('width');
		width = parseInt(width);
		height = parseInt(height);
		console.log(height);
		console.log(width);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
		$scope.renderer.setSize( width, height );
	};
	var scene = new THREE.Scene();
	var obj = document.getElementById("3d");
	var obj2 = window.getComputedStyle(obj, null);
	var height = obj2.getPropertyValue('height');
	var width = obj2.getPropertyValue('width')
	console.log("hej");
	width = parseInt(width);
	height = parseInt(height);
	console.log(width);
	console.log(height);

	var camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);

	$scope.renderer = new THREE.WebGLRenderer();
	$scope.renderer.setSize(width/2, height/2);
	var obj = document.getElementById("3d");
	obj.appendChild($scope.renderer.domElement);
	obj.appendChild($scope.renderer.domElement);

	var geometry = new THREE.CubeGeometry(2,2,2);
	var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
	$scope.cube = new THREE.Mesh(geometry, material);
	scene.add($scope.cube);

	camera.position.z = 5;

	var render = function () {
		requestAnimationFrame(render);
		//console.log("hej");

		$scope.renderer.render(scene, camera);
	};

	render();
	$scope.$on('websocket', function(){//Here the controller listens for new data on the websocket.
		result = graphService.message;
		if (((result[0].fields.Roll * 3.14159/180) - $scope.cube.rotation.x) > 3.14159){
			tempx = -(7.28 - ((result[0].fields.Roll * 3.14159/180) - $scope.cube.rotation.x));
		} else if (((result[0].fields.Roll * 3.14159/180) - $scope.cube.rotation.x) < 3.14159) {
			tempx = 7.28 + ((result[0].fields.Roll * 3.14159/180) - $scope.cube.rotation.x);
		} else {
			tempx = (result[0].fields.Roll * 3.14159/180) - $scope.cube.rotation.x;
		}
		
		tempy = (result[0].fields.Pitch * 3.14159/180) - $scope.cube.rotation.y;
		tempz = (result[0].fields.Yaw * 3.14159/180) - $scope.cube.rotation.z;
		
		$scope.intervalFunction3d = function(x){
			$timeout(function() {
				$scope.cube.rotation.z += tempz/25;
				$scope.cube.rotation.y += tempy/25;
				$scope.cube.rotation.x += tempx/25;
				if (x > 0){
					var i = --x;
					$scope.intervalFunction3d(i);
				}
			}, 20)
		};
		$scope.intervalFunction3d(25);
		
		
	});
	

});
ModelCtrl.$inject = ['$scope', 'graphService', '$timeout'];