'use strict';
/**
 * @ngdoc function
 * @name pureboxProductionApp.controller:SignUpCtrl
 * @description
 * # SignUpCtrl
 * Manages authentication to any active providers.
 */
angular.module('pureboxProductionApp')

  .controller('OrderReviewCtrl', function ($scope, $http, Auth, $location, $q, Ref, $timeout, $window, Account) {  

      //Set billing info to scope for page
      $scope.fname = Account.getFname();
      $scope.lname = Account.getLname();
      $scope.address1 = Account.getAddress1();
      $scope.address2 = Account.getAddress2();
      $scope.address2 = Account.getAddress2();
      $scope.city = Account.getCity();
      $scope.state = Account.getState();
      $scope.postal_code = Account.getPostal();

      //Set shipping info from service to scope for page
      $scope.fname_shipping = Account.getFname();
      $scope.lname_shipping = Account.getLname();
      $scope.address1_shipping = Account.getAddress1();
      $scope.address2_shipping = Account.getAddress2();
      $scope.address2_shipping = Account.getAddress2();
      $scope.city_shipping = Account.getCity();
      $scope.state_shipping = Account.getState();
      $scope.postal_code_shipping = Account.getPostal();      

      //Redirect to payment page
      $location.path('payment');

      function emailToKey(emailAddress) {
         return emailAddress.replace('.', ',');
      }

      function changeTermsString(terms){
        if(terms == "month") terms = "Monthly";
        else if(terms == "3month") terms = "3 months";
        else if(terms == "6month") terms = "6 months";
        else terms = "12 months";

        return terms;
      }

      function firstPartOfEmail(email) {
        return ucfirst(email.substr(0, email.indexOf('@'))||'');
      }

      function ucfirst (str) {
        str += '';
        var f = str.charAt(0).toUpperCase();
        return f + str.substr(1);
      }

      //If selected same shipping address go to checkout
      function redirect() {
        if($scope.shipping)
          $location.path('/checkout');
        $location.path('/shipping');
      }

      function showError(err) {
        $scope.err = err;

        if (err.code == 'EMAIL_TAKEN'){
          $scope.err.code = 'This Email Already Has An Account';
        }else if (err.code == 'INVALID_PASSWORD'){
            $scope.err.code = 'Wrong Password';
        } else {
            console.log(err);
            $scope.err.code = 'Not A Valid Account';
        }
      }
});    