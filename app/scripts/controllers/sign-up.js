'use strict';
/**
 * @ngdoc function
 * @name pureboxProductionApp.controller:SignUpCtrl
 * @description
 * # SignUpCtrl
 * Manages authentication to any active providers.
 */
angular.module('pureboxProductionApp')

  .controller('SignUpCtrl', function ($scope, Auth, $location, $q, Ref, $timeout, $window, Account) {  

    $scope.signUp = function(email, pass, confirm) {

      $scope.err = null;
      if( !pass ) {
        $scope.err = {code:'Please enter a password'};
      }else if( pass !== confirm ) {
        $scope.err = {code:'Passwords do not match'};
      }else {

        Auth.$createUser({email: email, password: pass})
          .then(function () {
            // authenticate so we have permission to write to Firebase
            return Auth.$authWithPassword({email: email, password: pass}, {rememberMe: true});
          })

          //If new user, create profile and redirect to payment page.
          .then(createProfile)
          // comment leadRedirect for testing purpose
          //.then(leadRedirect, showError);
          .then(redirect, showError);
      }

      function createProfile(user) {
        var ref = Ref.child('users').child(emailToKey(email)), def = $q.defer();

        ref.set({
          skintone: sessionStorage.skintone,
          skintype: sessionStorage.skintype,
          term: sessionStorage.terms,
          provider: user.uid, 
          email: email,
          fname: $scope.fname,
          lname: $scope.lname
          }, function(err) {
              $timeout(function() {
                if( err ) {
                  console.log(err);
                  def.reject(err);
                }
                else {

                  //Set sessionStorage email for account page and holds value after refresh
                  sessionStorage.email =  email;
                  def.resolve(ref);
                }
              });
            });
          return def.promise;
        }
    };

    function emailToKey(emailAddress) {
       return emailAddress.replace('.', ',');
    }

    function redirect() {
      $location.path('/shipping');
    }
    function redirectAcct() {
      $location.path('/account');
    }    

    function leadRedirect() {
        $window.location.href = $rootScope.url;
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