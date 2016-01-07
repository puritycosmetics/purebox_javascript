'use strict';

/**
 * @ngdoc function
 * @name pureboxProductionApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pureboxProductionApp
 */
angular.module('pureboxProductionApp')
  	.controller('SubscribeCtrl', function ($rootScope, $scope, $location, Account) {

  		//Set terms box selected based on homepage click
  		$scope.terms = $location.$$search.terms

  		//Set sessionStorage in case user refreshes browser still holds value
        $scope.setSkinTone = function(skintone) {
        	$scope.skintone = skintone;
			sessionStorage.skintone = skintone;
			$scope.errMsg = ""; //removes error message.
            Account.setSkinTone(skintone);
        }

		$scope.setSkinType = function(skintype){
			$scope.skintype = skintype;
			sessionStorage.skintype = skintype;
			$scope.errMsg = "";
            Account.setSkinType(skintype);			
		}

		$scope.setTerms = function(terms){
			$scope.terms = terms;
			sessionStorage.terms = terms;
			$scope.errMsg = "";
			Account.setTerms(terms);
		}

		$scope.validateProfile = function(){

			//All items have to be selected to proceed
			if(!$scope.skintone || !$scope.skintype || !$scope.terms){
				$scope.errMsg = "Please select all items!";
			}else{
				$location.path('sign-up.html');
			}
		}
  	});
