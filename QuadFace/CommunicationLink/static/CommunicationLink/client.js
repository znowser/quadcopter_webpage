var ws = new WebSocket('ws://10.0.1.13:8080/ws/comLink?subscribe-broadcast');
ws.onopen = function() {
    console.log("websocket connected");
};
ws.onmessage = function(e) {
    console.log("Received: " + e.data);
	angular.element(document.getElementById('buttonid')).click();
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

var itemsController = function ($scope, $http) {
  // initialize a list of items on the scope
  var update = function () {
    // get a list of items from the api located at '/api/items'
	$http.get('10.0.1.13:8080/communication/').success(successCallback);
  };

};
