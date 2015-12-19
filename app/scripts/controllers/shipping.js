'use strict';
/**
 * @ngdoc function
 * @name pureboxProductionApp.controller:CheckoutCtrl
 * @description
 * # CheckoutCtrl
 * Manages authentication to any active providers.
 */
angular.module('pureboxProductionApp')
  .controller('ShippingCtrl', function ($scope, $sce, $location, $q, Ref, $timeout, $window, Account) {

    console.log(sessionStorage.skintype);
    console.log(sessionStorage.skintone);
    console.log(sessionStorage.terms);
    console.log("email: " +sessionStorage.email);

    //Reset the errors display
    $scope.err = "";

    //For front end
    $scope.terms = Account.changeTermsString(sessionStorage.terms);
    $scope.total = Account.getOrderTotal();

    //Set scope of form to pass to Recurly
    $scope.setFormScope = function(scope){
      this.formScope = scope;
    }

    //Set shipping info from service to scope for page
    $scope.setShippingInfo = function(scope) {

      Account.setFname($scope.fname_shipping);
      Account.setLname($scope.lname_shipping);
      Account.setAddress1($scope.address1_shipping);
      Account.setAddress2($scope.address2_shipping);
      Account.setCity($scope.city_shipping);
      Account.setState($scope.state_shipping);
      Account.setPostal($scope.postal_code_shipping);

      //$scope.billing is from checkbox.
      Account.setSameBilling($scope.billing);

      //Set billing info
      Account.setBilling();

      //Redirect to billing  
      redirect();

    }


    function redirect() {
      $location.path('/billing');
    }

  });