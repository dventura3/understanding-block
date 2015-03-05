//server communication

var app = angular.module('dashboardApp');

app.factory('serversideServices', ['$http', '$q', function($http, $q){
	var ip = "localhost";
	var port = "3300";

	//var baseURL = "http://" + ip + ":" + port;
	var baseURL = "";
	var myServices = {};
	var data = []; 


	myServices.getData = function(){
		var deffered = $q.defer();
		var URL = baseURL + "/data";
		$http({
			url: URL,
			method: "GET"
		})
		.then(function(resp){
			data = resp.data;
			deffered.resolve();
		});
		return deffered.promise;
	};
	

	myServices.saveGoal = function(goal){
		var deffered = $q.defer();
		var URL = baseURL + "/newGoal";
		$http({
			url: URL,
			method: "POST",
			data: { 'goal' : goal }
		})
		.then(function(resp){
			data = resp.data;
			deffered.resolve();
		});
		return deffered.promise;
	};
	
	myServices.data = function() { return data; };
	
	return myServices;

}]);
