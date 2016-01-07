'use strict';

/**
 * @ngdoc function
 * @name pureboxProductionApp.controller:SubscriptionCtrl
 * @description
 * # SubscriptionCtrl
 * Controller of the pureboxProductionApp
 */
angular.module('pureboxProductionApp')
  	.controller('SubscriptionCtrl', function ($rootScope, $scope, $http, $location, user, $q, $timeout, Auth, Ref, $firebaseObject) {


	    $scope.getSubscriptionInfo = function(){
            $http({
              url: '/api/subscriptions/get?email=' + user.password.email,
              method: 'GET'             
           }).then(function successCallback(response) {
				$scope.setSubscriptionScope(response);
                //console.log(response);

            }, function errorCallback(response) {
                console.log(response);
            });      
	    }

	    $scope.updateSubscription = function() {

	          // Disable the submit button

				// //Checkout form passed to recurly.token
				// var billingInfo = {
				// 	plan_code: $scope.subscription_plan_code,
				// 	uuid: user.password.email
				// };

				console.log("plan code: " + $scope.subscription_plan_code);
				console.log("uuid: " + user.password.email);		

		      $http({
		        url: '/api/subscriptions/update',
		        method: 'PUT',
		        dataType: 'json',
		        config: {
		        	'Accept': 'application/json',
		        	'Content-Type': 'application/json;'
		        },
		        data: { 
		        		plan_code: $scope.subscription_plan_code, 
						uuid: user.password.email
		              }
		     }).then(function successCallback(response) {
		      
		     	  console.log(response);

		      }, function errorCallback(response) {

		          // called asynchronously if an error occurs or server returns response.
		          console.log("*** Error: Update subscription ***");
		          console.log(response);
		      });
	    }

	    //Sets account scope variables
	    $scope.setSubscriptionScope = function(response){

	      var x = response.data.data.subscriptions.subscription;

	      $scope.subscription_invoice = getInvoiceNumber(x.invoice.$.href);
	      $scope.subscription_start_date = $scope.convertDate(x.current_period_started_at._);
	      $scope.subscription_end_date = $scope.convertDate(x.current_period_ends_at._);
	      $scope.subscription_plan_name = x.plan.name;
	      $scope.subscription_plan_code = x.plan.plan_code;
	    }

	    $scope.convertDate = function(date){

	        var month = ['January','February','March','April','May','June','July','August','September','October','November','December'];

	        //Parse and return correct date format
	        var x = date.indexOf("T");
	        var str = date.substring(0,x);

	        //Split on dash
	        var dateArray = str.split("-");

	        //Convert number to month and put in correct format
	        var monthIndex = parseInt(dateArray[1],10);
	        var dateStr = month[monthIndex-1] + " " + parseInt(dateArray[2],10) + ", " + dateArray[0];
	        return dateStr;

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

	    function getInvoiceNumber(invoice){
	      var i = invoice.lastIndexOf("/");
	      var invoice_number = invoice.substring(i+1, invoice.length);
	      return invoice_number;
	    }		

});