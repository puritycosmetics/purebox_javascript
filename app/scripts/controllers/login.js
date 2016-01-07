'use strict';
/**
 * @ngdoc function
 * @name pureboxProductionApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Manages authentication to any active providers.
 */
angular.module('pureboxProductionApp')
  .controller('LoginCtrl', function ($rootScope, $scope, Auth, $location, $q, Ref, $timeout) {
    $scope.oauthLogin = function(provider) {
      $scope.err = null;
      Auth.$authWithOAuthPopup(provider, {rememberMe: true}).then(redirect, showError);
    };

    $scope.anonymousLogin = function() {
      $scope.err = null;
      Auth.$authAnonymously({rememberMe: true}).then(redirect, showError);
    };

    $scope.passwordLogin = function(email, pass) {
      $scope.err = null;
      Auth.$authWithPassword({
        email: email, 
        password: pass
      }, {rememberMe: true})
      .then(redirect, showError);
      // .then(function(){
      //   redirect;
      //   console.log("good");
      // }, function(){
      //   showError();
      //   console.log("bad")
      // })

      //.then(redirect, showError);

    };

    $scope.createAccount = function(email, pass, confirm) {
      $scope.err = null;
      if( !pass ) {
        $scope.err = 'Please enter a password';
      }
      else if( pass !== confirm ) {
        $scope.err = 'Passwords do not match';
      }
      else {
        Auth.$createUser({email: email, password: pass})
          .then(function () {
            // authenticate so we have permission to write to Firebase
            return Auth.$authWithPassword({email: email, password: pass}, {rememberMe: true});
          })
          .then(createProfile)
          .then($scope.redirect('account'), showError);
      }

      function createProfile() {
        var ref = Ref.child('users'), def = $q.defer();
        ref.set({email: email, name: firstPartOfEmail(email)}, function(err) {
          $timeout(function() {
            if( err ) {
              def.reject(err);
            }
            else {
              def.resolve(ref);
            }
          });
        });
        return def.promise;
      }
    };

    function firstPartOfEmail(email) {
      return ucfirst(email.substr(0, email.indexOf('@'))||'');
    }

    function ucfirst (str) {
      // inspired by: http://kevin.vanzonneveld.net
      str += '';
      var f = str.charAt(0).toUpperCase();
      return f + str.substr(1);
    }

    function redirect (str) {

      console.log(str)

      //Set loggedIn to change the Sign Up button to say Account
      sessionStorage.loggedIn = true;

      //Redirect back to account page
      $location.path('/account');
    }

    function showError(err) {
      $scope.err = err;
      if (err.code == 'INVALID_EMAIL'){
        $scope.err.code = 'Invalid Email';
      }else if (err.code == 'INVALID_PASSWORD'){
          $scope.err.code = 'Invalid Password';
      }else{
          $scope.err.code = 'Not A Valid Account';
      }
    }
  });


