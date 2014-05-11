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
	camera.position.set(5,5,5);
	camera.lookAt(new THREE.Vector3(0,0,0));
	var light = new THREE.AmbientLight( 0x000044 ); // soft white light
	scene.add( light );
	var directionalLight = new THREE.DirectionalLight(0xffffff);
	directionalLight.position.set(-4, 2, 5);
	scene.add(directionalLight);
	directionalLight.lookAt(new THREE.Vector3(0,0,0))
	

	

	
	var material = new THREE.LineBasicMaterial({
		color: 0x0000ff
	});

	var geometry = new THREE.Geometry();
	geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
	geometry.vertices.push( new THREE.Vector3( 0, 0, 5 ) );

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


	var render = function () {
		requestAnimationFrame(render);
		$scope.renderer.render(scene, camera);
	};

	render();
	$scope.$on('websocket', function(){//Here the controller listens for new data on the websocket.
		result = graphService.message;
			if (((result[0].fields.Roll * 3.14159/180) - $scope.cube.rotation.x) > 3.14159){
				tempx = -(7.28 - ((result[0].fields.Roll * 3.14159/180) - $scope.cube.rotation.x));
			} else if (((result[0].fields.Roll * 3.14159/180) - $scope.cube.rotation.x) < -3.14159) {
				tempx = 7.28 + ((result[0].fields.Roll * 3.14159/180) - $scope.cube.rotation.x);
			} else {
				tempx = (result[0].fields.Roll * 3.14159/180) - $scope.cube.rotation.x;
			}
		
		
	
			if (((result[0].fields.Pitch * 3.14159/180) - $scope.cube.rotation.y) > 3.14159){
				tempy = -(7.28 - ((result[0].fields.Pitch * 3.14159/180) - $scope.cube.rotation.y));
			} else if (((result[0].fields.Pitch * 3.14159/180) - $scope.cube.rotation.y) < -3.14159) {
				tempy = 7.28 + ((result[0].fields.Pitch * 3.14159/180) - $scope.cube.rotation.y);
			} else {
				tempy = (result[0].fields.Pitch * 3.14159/180) - $scope.cube.rotation.y;
			}
		
		
	
			if (((result[0].fields.Yaw * 3.14159/180) - $scope.cube.rotation.z) > 3.14159){
				tempz = -(7.28 - ((result[0].fields.Yaw * 3.14159/180) - $scope.cube.rotation.z));
			} else if (((result[0].fields.Yaw * 3.14159/180) - $scope.cube.rotation.z) < -3.14159) {
				tempz = 7.28 + ((result[0].fields.Yaw * 3.14159/180) - $scope.cube.rotation.z);
			} else {
				tempz = (result[0].fields.Yaw * 3.14159/180) - $scope.cube.rotation.z;
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