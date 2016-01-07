'use strict';

/**
 * @ngdoc function
 * @name pureboxProductionApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pureboxProductionApp
 */
angular.module('pureboxProductionApp')
  	.controller('SubscribeCtrl', 
  	function ($rootScope, $scope) {
		$scope.setSkinTone = function(skintone){
			$rootScope.skintone = skintone;
			console.log('skintone: ' + $rootScope.skintone);
		};
		$scope.setSkinType = function(skintype){
			$rootScope.skintype = skintype;
			console.log('skintype: ' + $rootScope.skintype);
		};
		$scope.setTerms = function(terms){
			$rootScope.terms = terms;
			$scope.setRecurlyURL(terms);
		};		
		$scope.setRecurlyURL = function(terms){
			var baseUrl = 'https://purebox-2.recurly.com/subscribe/';

			if(terms === 'month') {
				$rootScope.url = baseUrl + 'monthly/{{leaddyno.visit.id}}';
			} else if (terms === '3month') {
				$rootScope.url = baseUrl + '3month/{{leaddyno.visit.id}}';
			} else if (terms === '6month') {
				$rootScope.url = baseUrl + '6month/{{leaddyno.visit.id}}';
			} else if (terms === '12month') {
				$rootScope.url = baseUrl + '12month/{{leaddyno.visit.id}}';
			}
		};
  	});