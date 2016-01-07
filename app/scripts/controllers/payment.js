'use strict';
/**
 * @ngdoc function
 * @name pureboxProductionApp.controller:CheckoutCtrl
 * @description
 * # CheckoutCtrl
 * Manages authentication to any active providers.
 */
angular.module('pureboxProductionApp')
  .controller('paymentCtrl', function ($rootScope, $scope, $sce, $http, Auth, $location, $q, Ref, $timeout, $window, Account) {

    console.log("fname: " + Account.getFname());


    // console.log(sessionStorage.skintype);
    // console.log(sessionStorage.skintone);
    // console.log(sessionStorage.terms);
    // console.log("email: " +sessionStorage.email);
    // console.log(Calculator.getSameShipping()); 

    //Reset the errors display
    $scope.err = "";

    // Configure recurly.js
    var x = recurly.configure('sjc-17qcx07uRgUUxXLBx4HIAw');

    //Set scope of form to pass to Recurly
    $scope.setFormScope = function(scope){
      this.formScope = scope;
    }

    $scope.checkout = function() {

          // Reset the errors display
          $scope.err = "";

          // Disable the submit button

          //Checkout form passed to recurly.token
          var billingInfo = {
            number: $scope.number,
            month: $scope.month,
            year: $scope.year,
            first_name: $scope.fname,
            last_name: $scope.lname,
            cvv: $scope.cvv,
            address1: $scope.address1,
            address2: $scope.address2,
            city: $scope.city,
            state: $scope.state,
            postal_code: $scope.postal_code,
            country: 'US',
            phone: $scope.phone,
            plan_code: $scope.terms,
            account_code: sessionStorage.email
          };

          // Now we call recurly.token with the form. It goes to Recurly servers
          // to tokenize the credit card information, then injects the token into the
          // data-recurly="token" field above
          recurly.token(billingInfo, function (err, token) {

              // send any errors to the error function below
              if (err){
                  $scope.err = "The following items are invalid:<br />";

                  //If more than one error need to loop through the err.fields array.
                  angular.forEach(err.fields, function(value, index){
                    if(value == 'number') $scope.err += 'Credit card number<br />';
                    if(value == 'month') $scope.err += 'Expiration month<br />';
                    if(value == 'year') $scope.err += 'Expiration year<br />';
                    if(value == 'postal_code') $scope.err += 'Postal code<br />';
                  }) 

                  //Allows html in angular string
                  $scope.trustedHtml = $sce.trustAsHtml($scope.err);

              // Otherwise send token to recurly
              }else{

                  $http({
                    url: '/api/subscriptions/new',
                    method: 'POST',
                    dataType: 'json',
                    data: { token_id: token.id, 
                            plan_code: sessionStorage.terms,
                            email: sessionStorage.email
                          }
                 }).then(function successCallback(response) {
                  
                      //Set loggedIn to change the Sign Up button to say Account
                      sessionStorage.loggedIn = true;

                      //Redirect to Confirmation page call asynchronously
                      redirect();

                  }, function errorCallback(response) {
                      // called asynchronously if an error occurs
                      // or server returns response with an error status.
                      console.log("error");
                  });
              }

          })//end recurly.token
    }
    // A simple error handling function to expose errors to the customer
    function error (err) {
      $('#errors').text('The following fields appear to be invalid: ' + err.fields.join(', '));
      $('button').prop('disabled', false);
      $.each(err.fields, function (i, field) {
        $('[data-recurly=' + field + ']').addClass('error');
      });
    }

    // function changeTermsString(terms){
    //   if(terms == "month") terms = "Monthly";
    //   else if(terms == "3month") terms = "3 months";
    //   else if(terms == "6month") terms = "6 months";
    //   else terms = "12 months";

    //   return terms;
    // }

    // function ucfirst (str) {
    //   // inspired by: http://kevin.vanzonneveld.net
    //   str += '';
    //   var f = str.charAt(0).toUpperCase();
    //   return f + str.substr(1);
    // }

    function redirect() {
      $location.path('/confirmation');
    }

    // function leadRedirect() {
    //     $window.location.href = $rootScope.url;
    // }

    function showError(err) {
      $scope.err = err;
    }
  });