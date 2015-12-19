'use strict';
/**
 * @ngdoc function
 * @name pureboxProductionApp.controller:ConfirmationCtrl
 * @description
 * # ConfirmationCtrl
 * Manages authentication to any active providers.
 */
angular.module('pureboxProductionApp')
  .controller('ConfirmationCtrl', function ($scope, $http, $location, $window, Account) {

    LeadDyno.recordPurchase();

    $scope.redirectAcct = function() {
      $location.path('/account');
    }

    //Load all customer data on load
    $scope.getCustomerInfo = function(){
        $scope.getAccountInfo();
        $scope.getSubscriptionInfo();
    }
    
    $scope.getAccountInfo = function(){
            $http({
              url: '/api/accounts/get?email=' + sessionStorage.email,
              method: 'GET'             
           }).then(function successCallback(response) {

                console.log(response)

                //Set response object to the scope variable
                $scope.setAccountScope(response);

                if(response != undefined){

                   //Set didCheckout flag to see if made account but did not checkout on other views
                   Account.setDidCheckout(true);
                   $scope.didCheckout = true; //Used to hide in account page

                }else{

                   Account.setDidCheckout(false);
                   $scope.didCheckout = false; 

                }  
                console.log(sessionStorage.didCheckout)  
            }, function errorCallback(response) {

                console.log(response);

            });      
    }

    $scope.getSubscriptionInfo = function(){
            $http({
              url: '/api/subscriptions/get?email=' + sessionStorage.email,
              method: 'GET'             
           }).then(function successCallback(response) {
                if(response){
                  console.log(response)
                  $scope.setSubscriptionScope(response);
                }else{
                  console.log("Error getSubscriptionInfo");
                }  
            }, function errorCallback(response) {
                console.log(response);
            });      
    }

    //Sets account scope variables
    $scope.setAccountScope = function(response){

      var x = response.data.data;

	  if(x.billing_info != undefined){
	      $scope.first_name = x.billing_info.first_name;
	      $scope.last_name = x.billing_info.last_name;
	      $scope.address1 = x.billing_info.address1;
	      $scope.address2 = x.billing_info.address2;
	      $scope.city = x.billing_info.city;
	      $scope.state = x.billing_info.state; 
	      $scope.country = x.billing_info.country;
	      $scope.zip = x.billing_info.zip;
	      $scope.email = sessionStorage.email;
	      $scope.phone = $scope.convertPhoneNum(x.billing_info.phone);
	  }      
    }

    $scope.convertPhoneNum = function(num){
      if(num.$ == undefined)
        return '-';
      else if(num.$.nil == 'nil')
        return '-';
      else          
        return num;
    }

    $scope.setSubscriptionScope = function(response){

      //Only do if there is a response


      console.log(response.data.dateArray);

      if(response.data.data != undefined){   

        var a = response.data.data.subscriptions.subscription;

        $scope.start_date = $scope.convertDate(a.current_period_started_at._);
        $scope.end_date = $scope.convertDate(a.current_period_ends_at._);
        $scope.plan = a.plan.name;
        $scope.status = a.state;

        //Convert total amount from cents to dollars
        $scope.total_amount = a.unit_amount_in_cents._;
        $scope.total_amount = ($scope.total_amount/100).toFixed(2);

        //Get last 4 digits in string for Invoice number.
        $scope.invoice = getInvoiceNumber(a.invoice.$.href);

      }else{
        console.log("Error setSubscriptionScope");
      }
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

    function getInvoiceNumber(invoice){
      var i = invoice.lastIndexOf("/");
      var invoice_number = invoice.substring(i+1, invoice.length);
      return invoice_number;
    }

  });