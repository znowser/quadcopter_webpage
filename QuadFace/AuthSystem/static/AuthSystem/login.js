
var loginApp = angular.module('loginApp', []);

//set post-data format to django-compatible
loginApp.config(['$httpProvider', function($httpProvider) {
    // setup CSRF support
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

    // http://victorblog.com/2012/12/20/make-angularjs-http-service-behave-like-jquery-ajax/
    // Rewrite POST body data
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function(data){
      /**
       * The workhorse; converts an object to x-www-form-urlencoded serialization.
       * @param {Object} obj
       * @return {String}
       */ 
      var param = function(obj){
        var query = '';
        var name, value, fullSubName, subName, subValue, innerObj, i;
        
        for(name in obj){
          value = obj[name];
          
          if(value instanceof Array){
            for(i=0; i<value.length; ++i){
              subValue = value[i];
              fullSubName = name + '[' + i + ']';
              innerObj = {};
              innerObj[fullSubName] = subValue;
              query += param(innerObj) + '&';
            }
          }
          else if(value instanceof Object){
            for(subName in value){
              subValue = value[subName];
              fullSubName = name + '[' + subName + ']';
              innerObj = {};
              innerObj[fullSubName] = subValue;
              query += param(innerObj) + '&';
            }
          }
          else if(value !== undefined && value !== null){
            query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
          }
        }
        return query.length ? query.substr(0, query.length - 1) : query;
      };
      return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
  }
]);

loginApp.controller('loginCtrl', function($scope, $http) {
	$scope.submit = function() {
		if ($scope.username && $scope.password){
			//asynchronously login request
			$http({ 
					method: 'POST', 
					url: '/auth/authentication/', 
					data: {'username': $scope.username, 'password': $scope.password },
					}).
			success(function($data, $status, $headers, $config) {
				$scope.loginStatus = $data;
			}).error(function($data, $status){
				$scope.loginStatus = $data;
				//alert("Error: " + $status);
			});
		}
	};
	
	$scope.loginStatus = "";
});
