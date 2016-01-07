'use strict';
/**
 * @ngdoc function
 * @name pureboxProductionApp.controller:CheckoutCtrl
 * @description
 * # CheckoutCtrl
 * Manages authentication to any active providers.
 */
angular.module('pureboxProductionApp')
  .controller('BillingCtrl', function ($scope, $http, Auth, $location, Ref, $sce, $timeout, $window, Account) {
    
    //Check if same billing was checked or not
    $scope.sameBilling = Account.getSameBilling();

    //Convert from number to month for front end
    $scope.terms = Account.changeTermsString(sessionStorage.terms);
    $scope.total = Account.getOrderTotal();

    $scope.fname_shipping = Account.getFname();
    $scope.lname_shipping = Account.getLname();
    $scope.address1_shipping = Account.getAddress1();
    $scope.address2_shipping = Account.getAddress2();
    $scope.city_shipping = Account.getCity();
    $scope.state_shipping = Account.getState();
    $scope.postal_code_shipping = Account.getPostal();
    $scope.phone_shipping = Account.getPhone();

    //Assign billing to shipping if same
    if($scope.sameBilling){
      $scope.fname_billing = Account.getFname();
      $scope.lname_billing = Account.getLname();
      $scope.address1_billing = Account.getAddress1();
      $scope.address2_billing = Account.getAddress2();
      $scope.city_billing = Account.getCity();
      $scope.state_billing = Account.getState();
      $scope.postal_code_billing = Account.getPostal();
      $scope.phone_billing = Account.getPhone();
    }

    //Reset the errors display
    $scope.err = "";

    // Configure recurly.js
    var x = recurly.configure('sjc-17qcx07uRgUUxXLBx4HIAw');

    // //Set scope of form to pass to Recurly
    // $scope.setFormScope = function(scope){
    //   this.formScope = scope;
    // }

    $scope.checkout = function() {
          // Reset the errors display
          $scope.err = "";

          // Disable the submit button

          console.log("postal_code: " + $scope.postal_code_shipping);
          console.log("phone: " + $scope.phone_shipping);

          //Checkout form passed to recurly.token
          var billingInfo = {
            number: $scope.number,
            month: $scope.month,
            year: $scope.year,
            first_name: $scope.fname_billing,
            last_name: $scope.lname_billing,
            cvv: $scope.cvv,
            address1: $scope.address1_billing,
            address2: $scope.address2_billing,
            city: $scope.city_billing,
            state: $scope.state_billing,
            postal_code: $scope.postal_code_billing,
            country: 'US',
            phone: $scope.phone_billing,
            plan_code: sessionStorage.terms,
            account_code: sessionStorage.email
          };

          var shippingInfo = {
            address1: $scope.address1_shipping,
            address2: $scope.address2_shipping,
            city: $scope.city_shipping,
            state: $scope.state_shipping,
            postal_code: $scope.postal_code_shipping
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

                  console.log(shippingInfo);
                  console.log(billingInfo);
                  console.log(token.id);
                  console.log(sessionStorage.terms);
                  console.log(sessionStorage.email);

                  //Create new subscription
                  $http({
                    url: '/api/subscriptions/new',
                    method: 'POST',
                    dataType: 'json',
                    data: { shippingInfo: shippingInfo,
                            token_id: token.id, 
                            plan_code: sessionStorage.terms,
                            email: sessionStorage.email
                          }
                 }).then(function successCallback(response) {
                  
                      console.log("in new subscriptions");
                      console.log(response);

                      //Set loggedIn to change the Sign Up button to say Account
                      sessionStorage.loggedIn = true;

                      //Redirect to Confirmation page call asynchronously
                      redirect();

                  }, function errorCallback(response) {
                      // called asynchronously if an error occurs
                      // or server returns response with an error status.
                      console.log("error");
                      console.log(response);
                  });

 
                 //  $http({
                 //    url: '/api/account/new',
                 //    method: 'POST',
                 //    dataType: 'json',
                 //    data: { 
                 //            account_code: sessionStorage.email,
                 //            shippingInfo: shippingInfo
                 //          }
                 // }).then(function successCallback(response) {
                  
                 //      console.log("in new account");
                 //      console.log(response);

                 //      //Set loggedIn to change the Sign Up button to say Account
                 //      sessionStorage.loggedIn = true;

                 //      //Redirect to Confirmation page call asynchronously
                 //      redirect();

                 //  }, function errorCallback(response) {
                 //      // called asynchronously if an error occurs
                 //      // or server returns response with an error status.
                 //      console.log("error");
                 //      console.log(response);
                 //  });                 

              }//end else

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