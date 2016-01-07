'use strict';

/**
 * @ngdoc function
 * @name pureboxProductionApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pureboxProductionApp
 */
angular.module('pureboxProductionApp')
  	.controller('MainCtrl', 
  	function ($scope) {
    	$scope.awesomeThings = [
      	'HTML5 Boilerplate',
      	'AngularJS',
      	'Karma'
    	];
  	});