'use strict';
/**
 * @ngdoc function
 * @name pureboxProductionApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Manages authentication to any active providers.
 */
angular.module('pureboxProductionApp')
  .controller('LoginCtrl', function ($scope, Auth, $location, $q, Ref, $timeout) {
    $scope.oauthLogin = function(provider) {
      $scope.err = null;
      Auth.$authWithOAuthPopup(provider, {rememberMe: true}).then(redirect, showError);
    };

    $scope.anonymousLogin = function() {
      $scope.err = null;
      Auth.$authAnonymously({rememberMe: true}).then(redirect, showError);
    };

    $scope.passwordLogin = function(email, pass) {
      alert("3: " + email)
      $scope.err = null;
      Auth.$authWithPassword({email: emailToKey(email), password: pass}, {rememberMe: true})
      .then(redirect, showError);

      //Set login in variable to show Update Profile link when redirecting back to homepage.
      $scope.loggedIn = true;
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
          .then(redirect, showError);
      }

      //Converts email from , back to . from firebase format
      function emailToKey(emailAddress) {
         return emailAddress.replace('.', ',');
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

    function redirect() {
      $location.path('/account');
    }

    function showError(err) {
      $scope.err = err;
    }

  });
