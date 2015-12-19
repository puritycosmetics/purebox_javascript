'use strict';

/**
 * @ngdoc function
 * @name pureboxProductionApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the pureboxProductionApp
 */
angular.module('pureboxProductionApp')
  	.controller('ProfileCtrl', function ($rootScope, $scope, $location, user, $q, $timeout, Auth, Ref, $firebaseObject) {

  		//Get firebase object with uid
  		var url = "https://purebox-production.firebaseio.com/users/" + emailToKey(sessionStorage.email);
  		var ref = new Firebase(url);

		$scope.profile = $firebaseObject(ref);

		//Wait until data is loaded before assigning.
		$scope.profile.$loaded()
			.then(function() {

				//Set scope variables to show selected
				$scope.setSkinTone($scope.profile.skintone);
				$scope.setSkinType($scope.profile.skintype);
				//$scope.setTerms($scope.profile.term);
			})
			.catch(function(err) {
				console.err(err);
			});

  		//Set terms box selected based on homepage click
  		// $scope.terms = $location.$$search.terms

  		$scope.updateProfile = function(ref){

  			console.log(sessionStorage.email)
			
			var ref = Ref.child('users').child(emailToKey(sessionStorage.email)), def = $q.defer();

	        ref.update({
	          skintone: $scope.skintone,
	          skintype: $scope.skintype
	          }, function(err) {
	              $timeout(function() {
	                if( err ) {
	                  def.reject(err);
	                }
	                else {
	                  def.resolve(ref);
	                }
	              });
	            });
	       	  $scope.errMsg = "Profile updated"	 
	          return def.promise;
	        }

		$scope.setSkinTone = function(skintone){
			$scope.skintone = skintone;
			$scope.errMsg = ""; //removes error message.
		};
		$scope.setSkinType = function(skintype){
			$scope.skintype = skintype;
			$scope.errMsg = "";
		};
		/*
		$scope.setTerms = function(terms){
			console.log(terms);
			if(sessionStorage.terms){
				$scope.terms = sessionStorage.terms;
			}else{
				$scope.terms = terms;
				$scope.errMsg = "";
			}	
		};
		*/
		$scope.redirect = function(){
			$location.path('/account');
		}
		// $scope.validateProfile = function(){

		// 	//All items have to be selected to proceed
		// 	if(!$rootScope.skintone || !$rootScope.skintype || !$rootScope.terms){
		// 		$scope.errMsg = "Please select all items!";
		// 	}else{
		// 		$location.path('/sign-up');
		// 	}
		// }

	    //Converts email from , back to . from firebase format
	    function emailToKey(emailAddress) {
	       return emailAddress.replace('.', ',');
	    }		
  	});