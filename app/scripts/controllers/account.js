'use strict';
/**
 * @ngdoc function
 * @name muck2App.controller:AccountCtrl
 * @description
 * # AccountCtrl
 * Provides rudimentary account management functions.
 */
angular.module('pureboxProductionApp')
  .controller('AccountCtrl', function ($scope, $rootScope, $http, user, Auth, Ref, $firebaseObject, $timeout, Account) {

    $scope.user = user;
    $scope.messages = [];

    //Set sessionStorage email so if user refreshes still exists.
    sessionStorage.email = user.password.email;

    
    var profile = $firebaseObject(Ref.child('users/' + emailToKey(sessionStorage.email)));
    profile.$bindTo($scope, 'profile');

    //Assign for creating new subscription
    sessionStorage.terms;
    console.log(profile);

    $scope.logout = function() {

      //Set flag for account/login button  
      sessionStorage.loggedIn = false;

      //Call unauth for Firebase
      Auth.$unauth(); 
    };
    
    $scope.changePassword = function(oldPass, newPass, confirm) {
      $scope.err = null;
      if( !oldPass || !newPass ) {
        error('Please enter all fields');
      }
      else if( newPass !== confirm ) {
        error('Passwords do not match');
      }
      else {
        Auth.$changePassword({email: profile.email, oldPassword: oldPass, newPassword: newPass})
          .then(function() {
            success('Password changed');
          }, error);
      }
    };
    
    //Because firebase getting data is asynchronous assign the variables here
    //Used to assign profile for checkout page
    $scope.assignServiceValues = function() {
          Account.setSkinTone(profile.skintone);
          sessionStorage.skintone = profile.skintone;

          Account.setSkinType(profile.skintype);
          sessionStorage.skintype = profile.skintype;

          Account.setTerms(profile.term);
          sessionStorage.terms = profile.term;
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

                //console.log(response)

                //Set response object to the scope variable
                $scope.setAccountScope(response);
  
            }, function errorCallback(response) {
                console.log("Error: getAccountInfo");
                //console.log(response);

            });      
    }

    $scope.getSubscriptionInfo = function(){
            $http({
              url: '/api/subscriptions/get?email=' + sessionStorage.email,
              method: 'GET'             
           }).then(function successCallback(response) {
                  console.log(response);
                  $scope.setSubscriptionScope(response); 
            }, function errorCallback(response) {
                console.log("Error: getSubscriptionInfo");
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

      console.log(response.data.data);

      if(response.data.data != undefined){

        //Set didCheckout flag to see if made account but did not checkout 
        Account.setDidCheckout(true);

        //Used to hide in account page
        $scope.didCheckout = true;

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
        console.log("No subscription listed");
        console.log(response);

        Account.setDidCheckout(false);
        $scope.didCheckout = false;  

      }
    }  

    $scope.changeEmail = function(pass, newEmail) {
      $scope.err = null;
      Auth.$changeEmail({password: pass, newEmail: newEmail, oldEmail: profile.email})
        .then(function() {
          profile.email = newEmail;
          profile.$save();
          success('Email changed');
        })
        .catch(error);
    };

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

    //Converts email from , back to . from firebase format
    function emailToKey(emailAddress) {
       return emailAddress.replace('.', ',');
    }

    function getInvoiceNumber(invoice){
      var i = invoice.lastIndexOf("/");
      var invoice_number = invoice.substring(i+1, invoice.length);
      return invoice_number;
    }

    function error(err) {
      alert(err, 'danger');
    }

    function success(msg) {
      alert(msg, 'success');
    }

    function alert(msg, type) {
      var obj = {text: msg+'', type: type};
      $scope.messages.unshift(obj);
      $timeout(function() {
        $scope.messages.splice($scope.messages.indexOf(obj), 1);
      }, 10000);
    }

  });
