'use strict';
/**
 * @ngdoc function
 * @name pureboxProductionApp.controller:CheckoutCtrl
 * @description
 * # CheckoutCtrl
 * Manages authentication to any active providers.
 */
angular.module('pureboxProductionApp')
  .controller('CheckoutCtrl', function ($rootScope, $scope, $sce, $http, Auth, $location, $q, Ref, $timeout, $window, Calculator) { 

    //Reset the errors display
    $scope.err = "";

    // Configure recurly.js
    var x = recurly.configure('sjc-17qcx07uRgUUxXLBx4HIAw');

    //Set scope of form to pass to Recurly
    $scope.setFormScope = function(scope){
      this.formScope = scope;
    }

    $scope.checkout = function() {

          //Checkout form passed to recurly.token
          var billingInfo = {      

            number: document.getElementById('number').value;
            month: document.getElementById('month').value;
            year: document.getElementById('year').value;
            fname: document.getElementById('fname').value;
            last: document.getElementById('lname').value;
            cvv: document.getElementById('cvv').value;
            address1: document.getElementById('address1').value;
            address2: document.getElementById('address2 ').value;
            city: document.getElementById('city').value;
            state: document.getElementById('state').value;
            postal_code: document.getElementById('postal_code').value;
            country: 'US';
            phone: document.getElementById('phone').value;
            plan_code: document.getElementById('plan_code').value;
            account_code: sessionStorage.email; 

          };
            
          // Disable the submit button


          // Now we call recurly.token with the form. It goes to Recurly servers
          // to tokenize the credit card information, then injects the token into the
          // data-recurly="token" field above
          recurly.token(billingInfo, function (err, token) {

              // send any errors to the error function below
              if (err){
                  console.log("The following items are invalid");

                  /*  
                  //If more than one error need to loop through the err.fields array.
                  angular.forEach(err.fields, function(value, index){
                    if(value == 'number') $scope.err += 'Credit card number<br />';
                    if(value == 'month') $scope.err += 'Expiration month<br />';
                    if(value == 'year') $scope.err += 'Expiration year<br />';
                    if(value == 'postal_code') $scope.err += 'Postal code<br />';
                  }) 
                  */

              // Otherwise send token to recurly
              }else{

                console.log("token: " + token.id);

/*
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
*/                  
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