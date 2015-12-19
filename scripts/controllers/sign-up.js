'use strict';
/**
 * @ngdoc function
 * @name pureboxProductionApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Manages authentication to any active providers.
 */
angular.module('pureboxProductionApp')
  .controller('SignUpCtrl', function ($rootScope, $scope, Auth, $location, $q, Ref, $timeout, $window) {

    $scope.signUp = function($event, email, pass, confirm) {
      console.log("in sign up")
      //$event.preventDefault();

    //   // Configure recurly.js
    //   recurly.configure('sjc-17qcx07uRgUUxXLBx4HIAw');

    //   //Prevent form submit

    //   //Reset errors display

    //   //Disable the submit button

    //   recurly.token(form, function (err, token) {
    //       // send any errors to the error function below
    //       if (err){
    //           error(err);
    //       // Otherwise we continue with the form submission
    //       }else{
    //           $.ajax({
    //               url: "app.js", 
    //               success: function(result){
    //                 console.log("success")
    //               }
    //             });
    //       }
    //   });

    //   $scope.err = null;
    //   if( !pass ) {
    //     $scope.err = 'Please enter a password';
    //   }
    //   else if( pass !== confirm ) {
    //     $scope.err = 'Passwords do not match';
    //   }
    //   else {
    //     Auth.$createUser({email: email, password: pass})
    //       .then(function () {
    //         // authenticate so we have permission to write to Firebase
    //         return Auth.$authWithPassword({email: email, password: pass}, {rememberMe: true});
    //       })

    //       //If new user, create profile and redirect to payment page.
    //       .then(createProfile)
    //       // comment leadRedirect for testing purpose
    //       .then(leadRedirect, showError);
    //       //.then(redirect, showError);
    //   }

    //   function createProfile(user) {
    //     var ref = Ref.child('users').child(user.uid), def = $q.defer();

    //     ref.set({
    //       skintone: $rootScope.skintone,
    //       skintype: $rootScope.skintype,
    //       term: changeTermsString($rootScope.terms),
    //       provider: user.uid, 
    //       email: email,
    //       fname: $scope.fname,
    //       lname: $scope.lname
    //       //name: firstPartOfEmail(email)
    //       }, function(err) {
    //           $timeout(function() {
    //             if( err ) {
    //               def.reject(err);
    //             }
    //             else {
    //               def.resolve(ref);
    //             }
    //           });
    //         });
    //       return def.promise;
    //     }
    // };
    // function changeTermsString(terms){
    //   if(terms == "month") terms = "Monthly";
    //   else if(terms == "3month") terms = "3 months";
    //   else if(terms == "6month") terms = "6 months";
    //   else terms = "12 months";

    //   return terms;
    // }
    // function firstPartOfEmail(email) {
    //   return ucfirst(email.substr(0, email.indexOf('@'))||'');
    // }

    // function ucfirst (str) {
    //   // inspired by: http://kevin.vanzonneveld.net
    //   str += '';
    //   var f = str.charAt(0).toUpperCase();
    //   return f + str.substr(1);
    // }

    // function redirect() {
    //   $location.path('/account');
    // }

    // function leadRedirect() {
    //     $window.location.href = $rootScope.url;
    // }

    // function showError(err) {
    //   $scope.err = err;
    // }
  });