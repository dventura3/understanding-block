'use strict';

/**
 * @ngdoc function
 * @name dashboardApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dashboardApp
 */
var app = angular.module('dashboardApp');


app.controller('MainCtrl', ['$scope', 'serversideServices', function ($scope, serversideServices) {

		//Init values for the image containing the loading.gif and the content.
		//It is done because I have to wait for server-side service to have all tha user data.
		$scope.loading = true;

		$scope.isUserInput = false;

		$scope.userInput = "";

		$scope.currentIndexAction = {};
		

		var getData = function(){
			serversideServices.getData().then(function() {
				$scope.data = serversideServices.data();
				$scope.loading = false;
				if($scope.data !== undefined){
					$scope.currentIndexAction = {
						"what" : 0,
						"whose" : 0,
						"where" : 0,
						"operation" : 0,
						"value" : 0,
						"unit" : 0
					};
				}
			});
		};


		getData();


		/*
		* Management of arrow-up and arrow-down.
		* @PARAMETERS
		* typeRequested = what|whose|where|operation|value|unit
		* typeArrow = UP|DOWN
		*/
		$scope.arrowManagement = function(typeRequested, typeArrow){

			var currentIndexForType = $scope.currentIndexAction[typeRequested];
			var numberOfElements = $scope.data[typeRequested].length; //number of elements of type device|gesture|object
			var newIndex = 0;  //tmp min index in the list of devices|gestures|objects			
			
			if (typeArrow == 'UP'){
				if(currentIndexForType < (numberOfElements - 1))
					newIndex = currentIndexForType + 1;
			}
			else if (typeArrow == 'DOWN'){
						newIndex = numberOfElements - 1;
						if(currentIndexForType > 0)
							newIndex = currentIndexForType - 1;
			}

			$scope.currentIndexAction[typeRequested] = newIndex;

			if(typeRequested == "value"){
				if($scope.data.value[newIndex].name == "{User Input}")
					$scope.isUserInput = true;
				else
					$scope.isUserInput = false;
			}
			
		};
		

		
		
		/*
		* Invoke the service to save the rules in the DB (server).
		*/
		$scope.executeAction = function(){

			var action = {};

			//what
			if($scope.data.what[$scope.currentIndexAction.what].name != "-")
				action.what = $scope.data.what[$scope.currentIndexAction.what].semantic;

			//whose
			if($scope.data.whose[$scope.currentIndexAction.whose].name != "-")
				action.whose = $scope.data.whose[$scope.currentIndexAction.whose].semantic;

			//where
			if($scope.data.where[$scope.currentIndexAction.where].name != "-")
				action.where = $scope.data.where[$scope.currentIndexAction.where].semantic;

			//TODO: LATO SEMANTIC ENGINE NON DEVO PRENDERE IL NAME MA L'OPERATION - FORSE
			//operation
			if($scope.data.operation[$scope.currentIndexAction.operation].name != "-")
				action.operation = $scope.data.operation[$scope.currentIndexAction.operation].name;

			//value
			if($scope.data.value[$scope.currentIndexAction.value].name != "-"){
				if($scope.data.value[$scope.currentIndexAction.value].name == "{User Input}")
					action.value = $scope.userInput;
				else
					action.value = $scope.data.value[$scope.currentIndexAction.value].semantic;
			}

			//unit
			if($scope.data.unit[$scope.currentIndexAction.unit].name != "-")
				action.unit = $scope.data.unit[$scope.currentIndexAction.unit].semantic;

			serversideServices.saveGoal(action).then(function() {
				var response = serversideServices.data();				
				if(response.success == true){
					alert("Action management is in progress!");
				}
				else
					alert("Error in execution of Action!");
			});
		};

}]);
