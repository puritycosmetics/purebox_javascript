'use strict';

/**
 * @ngdoc function
 * @name pureboxProductionApp.controller:BillingCtrl
 * @description
 * # BillingCtrl
 * Controller of the pureboxProductionApp
 */
angular.module('pureboxProductionApp')
  	.controller('BillingCtrl', function ($rootScope, $scope, $http, $location, user, $q, $timeout, Auth, Ref, $firebaseObject) {
    
    // Configure recurly.js
    //recurly.configure('sjc-17qcx07uRgUUxXLBx4HIAw');

    $scope.updateBillingInfo = function() {

          // Reset the errors display

          // Disable the submit button

			//Checkout form passed to recurly.token
			var billingInfo = {
				address1: $scope.billing_address1,
				address2: $scope.billing_address2,
				city: $scope.billing_city,
				state: $scope.billing_state,
				postal_code: $scope.billing_postal_code,
				phone: $scope.billing_phone
				//plan_code: $scope.terms
			};

			console.log(billingInfo);

			// Now we call recurly.token with the form. It goes to Recurly servers
			// to tokenize the credit card information, then injects the token into the
			// data-recurly="token" field above
			//recurly.token(billingInfo, function (err, token) {

			  // send any errors to the error function below
			  //if (err){
				//console.log(err);

			  // Otherwise send token to recurly
			  //}else{

			      $http({
			        url: '/api/billing/update',
			        method: 'POST',
			        dataType: 'json',
			        data: { account_code: $scope.billing_email, 
							address1: $scope.billing_address1,
							address2: $scope.billing_address2,
							city: $scope.billing_city,
							state: $scope.billing_state,
							postal_code: $scope.billing_postal_code,
							phone: $scope.billing_phone
			              }
			     }).then(function successCallback(response) {
			      
			     	  console.log("updated");

			      }, function errorCallback(response) {
			          // called asynchronously if an error occurs
			          // or server returns response with an error status.
			          console.log("error");
			      });
			  //}

			//})//end recurly.token
    	}

	    $scope.getBillingInfo = function(){
            $http({
              url: '/api/accounts/get?email=' + user.password.email,
              method: 'GET'             
           }).then(function successCallback(response) {
				$scope.setBillingScope(response);
                console.log(response);

            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                console.log(response);
            });      
	    }

	    //Sets account scope variables
	    $scope.setBillingScope = function(response){

	      var x = response.data.data;

	      //$scope.billing_first_name = x.billing_info.first_name;
	      //$scope.billing_last_name = x.billing_info.last_name;
	      $scope.billing_address1 = x.billing_info.address1;
	      $scope.billing_address2 = x.billing_info.address2;
	      $scope.billing_city = x.billing_info.city;
	      $scope.billing_state = x.billing_info.state; 
	      $scope.billing_country = x.billing_info.country;
	      $scope.billing_zip = x.billing_info.zip;
	      $scope.billing_email = user.password.email;
	      $scope.billing_phone = $scope.convertPhoneNum(x.billing_info.phone);
	      console.log($scope.phone);
	    }

	    $scope.convertPhoneNum = function(num){
	      if(num.$ == undefined)
	        return '-';
	      else if(num.$.nil == 'nil')
	        return '-';
	      else          
	        return num;
	    }

		$scope.redirect = function(){
			$location.path('/account');
		}

});