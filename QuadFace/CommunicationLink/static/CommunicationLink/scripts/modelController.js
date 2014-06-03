var ModelCtrl = angular.module('client').controller('ModelCtrl', function($scope, graphService, $timeout){
	$scope.left = false;
	$scope.intervalFunction = function(){
		$timeout(function() {
			var obj = document.getElementById("3d");
			var obj2 = window.getComputedStyle(obj, null);
			var height = parseInt(obj2.getPropertyValue('height'));
			var width = parseInt(obj2.getPropertyValue('width'));

			camera.aspect = width / height;
			camera.updateProjectionMatrix();
			$scope.renderer.setSize( width, height );

		}, 30)
	};
	
	if (isMobileDevice()){
		$scope.intervalFunction();
	}
	
	$scope.setView = function(){
		if (!isMobileDevice()){
			$scope.left= ! $scope.left;
		}		
	}
	$scope.resize = function(){
		$scope.intervalFunction();
	}
	window.onresize = function(event) {
		var obj = document.getElementById("3d");
		var obj2 = window.getComputedStyle(obj, null);
		var height = obj2.getPropertyValue('height');
		var width = obj2.getPropertyValue('width');
		width = parseInt(width);
		height = parseInt(height);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
		$scope.renderer.setSize( width, height );
	};
	var scene = new THREE.Scene();
	var obj = document.getElementById("3d");
	var obj2 = window.getComputedStyle(obj, null);
	var height = obj2.getPropertyValue('height');
	var width = obj2.getPropertyValue('width')
	width = parseInt(width);
	height = parseInt(height);

	var camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);

	$scope.renderer = new THREE.WebGLRenderer();
	$scope.renderer.setSize(width/2, height/2);
	$scope.renderer.setClearColor( '#F2F2F2', 1 );
	
	var obj = document.getElementById("3d");
	obj.appendChild($scope.renderer.domElement);
	obj.appendChild($scope.renderer.domElement);
	
	
					
	var geometry = new THREE.BoxGeometry(6,1,3);
	var material = new THREE.MeshLambertMaterial({color:'blue'});
	//$scope.cube = new THREE.Mesh( new THREE.CubeGeometry( 6, 1, 3 ), new THREE.MeshNormalMaterial({morphTargs:true, etshading:THREE.FlatShading}) );
	$scope.cube = new THREE.Mesh(geometry, material);
	scene.add($scope.cube);
	camera.position.set(0,3,7);
	camera.lookAt(new THREE.Vector3(0,0,0));
	camera.scale.z = 1.5;
	var light = new THREE.AmbientLight( 0x000044 ); // soft white light
	scene.add( light );
	var directionalLight = new THREE.DirectionalLight(0xffffff);
	directionalLight.position.set(-4, 2, 5);
	scene.add(directionalLight);
	directionalLight.lookAt(new THREE.Vector3(0,0,0))
	
	var material = new THREE.LineBasicMaterial({
		color: 0x006400
	});

	var geometry = new THREE.Geometry();
	geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
	geometry.vertices.push( new THREE.Vector3( 0, 0, -5 ) );

	var linez = new THREE.Line( geometry, material );
	scene.add( linez );
	
	var material = new THREE.LineBasicMaterial({
		color: 0xff0000
	});
	
	var geometry = new THREE.Geometry();
	geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
	geometry.vertices.push( new THREE.Vector3( 0, 5, 0 ) );

	var liney = new THREE.Line( geometry, material );
	scene.add( liney );

	$scope.cube.rotation.order = 'YXZ';
	liney.rotation.order = 'YXZ';
	linez.rotation.order = 'YXZ';
	var render = function () {
		requestAnimationFrame(render);
		$scope.renderer.render(scene, camera);
	};

	render();
	$scope.$on('websocket', function(){//Here the controller listens for new data on the websocket.
		result = graphService.message;
		var pi = 3.14159;
	
		if (result[0].fields.Roll < 0){
			result[0].fields.Roll = (360 + parseInt(result[0].fields.Roll));
		} else {
			result[0].fields.Roll = (result[0].fields.Roll);
		}
		if (result[0].fields.Pitch < 0){
			result[0].fields.Pitch = (360 + parseInt(result[0].fields.Pitch));
		} else {
			result[0].fields.Pitch = (result[0].fields.Pitch);
		}
		if (result[0].fields.Yaw < 0){
			result[0].fields.Yaw = (360 + parseInt(result[0].fields.Yaw));;
		} else {
			result[0].fields.Yaw = (result[0].fields.Yaw);
		}
		
		console.log("roll: " + result[0].fields.Roll + " pitch: " + result[0].fields.Pitch + " yaw: " + result[0].fields.Yaw); 
		
		result[0].fields.Roll = (result[0].fields.Roll)*pi/180
		result[0].fields.Pitch = (result[0].fields.Pitch)*pi/180
		result[0].fields.Yaw = (result[0].fields.Yaw)*pi/180
		//console.log("roll: " + result[0].fields.Roll + " pitch: " + result[0].fields.Pitch + " yaw: " + result[0].fields.Yaw); 
		
		if ((result[0].fields.Roll - $scope.cube.rotation.y) > pi){
			tempy = 2*pi - (result[0].fields.Roll - $scope.cube.rotation.y);
			tempy = tempy * -1;
			//console.log("tempy negative: " + tempy);
		} else if ((result[0].fields.Roll - $scope.cube.rotation.y) < -pi) {
			tempy = 2*pi + (result[0].fields.Roll - $scope.cube.rotation.y);
			//console.log("tempy positive: " + tempy);
			
		} else {
			tempy = result[0].fields.Roll - $scope.cube.rotation.y;
		}
		
		
		if ((result[0].fields.Pitch - $scope.cube.rotation.x) > pi){
			tempx = 2*pi - (result[0].fields.Pitch - $scope.cube.rotation.x);
			tempx = tempx * -1;
		} else if ((result[0].fields.Pitch - $scope.cube.rotation.x) < -pi) {
			tempx = 2*pi + (result[0].fields.Pitch - $scope.cube.rotation.x);
		} else {
			tempx = result[0].fields.Pitch - $scope.cube.rotation.x;
		}
		
		
		if (((result[0].fields.Yaw * pi/180) - $scope.cube.rotation.z) > pi){
			tempz = 2*pi - (result[0].fields.Yaw  - $scope.cube.rotation.z);
			tempz = tempz * -1;
		} else if ((result[0].fields.Yaw - $scope.cube.rotation.z) < -pi) {
			tempz = 2*pi + (result[0].fields.Yaw - $scope.cube.rotation.z);
		} else {
			tempz = result[0].fields.Yaw - $scope.cube.rotation.z;
		}
		
		
		
		$scope.intervalFunction3d = function(x){
			$timeout(function() {
				$scope.cube.rotation.z += tempz/25;
				linez.rotation.z += tempz/25;
				liney.rotation.z += tempz/25;
				$scope.cube.rotation.y += tempy/25;
				linez.rotation.y += tempy/25;
				liney.rotation.y += tempy/25;
				$scope.cube.rotation.x += tempx/25;
				linez.rotation.x += tempx/25;
				liney.rotation.x += tempx/25;
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