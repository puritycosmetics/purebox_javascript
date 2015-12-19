'use strict';

/**
 * @ngdoc function
 * @name pureboxProductionApp.controller:HeaderController
 * @description
 * # HeaderController
 * Controller of the pureboxProductionApp
 */
angular.module('pureboxProductionApp')
  	.controller('HeaderController', 
  	function ($scope, $location) {
		$scope.isActive = function (viewLocation) { 
	        return viewLocation === $location.path();
	    };
	    $scope.navbarCollapsed = true;
  	});