'use strict';

/**
 * @ngdoc overview
 * @name pureboxProductionApp
 * @description
 * # pureboxProductionApp
 *
 * Main module of the application.
 */
var AccountService = angular.module('AccountService', [])
    .service('Account', function(){
        this.setSkinTone = function(a){
        	this.skintone = a; 
        };
        this.setSkinType = function(a){
            this.skintype = a; 
        };
        this.setTerms = function(a){
            this.terms = a; 
        };
        this.setDidCheckout = function(a){
            this.didCheckout = a;
        };

        this.getSkinTone = function(){
            return this.skintone;
        };
        this.getSkinType = function(){
            return this.skintype;
        };
        this.getTerms = function(){
            return this.terms;
        };
        this.getDidCheckout = function(){
            return this.didCheckout;
        };

        this.changeTermsString = function(terms){
              if(terms == 1) terms = "Monthly";
              else if(terms == 6) terms = "6 months";
              else if(terms == 12) terms = "12 months";
              return terms;
        };

        //Set to display on front end of billing page
        this.getOrderTotal = function(){
            var total;
            if(sessionStorage.terms == 1) total = 40;
            else if(sessionStorage.terms == 6) total = 200;
            else total = 375;
            return total.toFixed(2);
        }        

        //To pass shipping info to checkout page
        this.setFname = function(a) { this.fname = a; }
        this.setLname = function(a) { this.lname = a; }
        this.setAddress1 = function(a) {this.address1 = a; }
        this.setAddress2 = function(a) {this.address2 = a; }
        this.setCity = function(a) {this.city = a; }
        this.setState = function(a) {this.state = a; }
        this.setPostal = function(a) {this.postal_code = a; }
        this.setPhone = function(a) {this.phone = a; }


        //To get shipping info to checkout page
        this.getFname = function(a) { return this.fname; }
        this.getLname = function(a) { return this.lname; }
        this.getAddress1 = function(a) { return this.address1; }
        this.getAddress2 = function(a) { return this.address2; }
        this.getCity = function(a) { return this.city; }
        this.getState = function(a) { return this.state; }
        this.getPostal = function(a) { return this.postal_code; }
        this.getPhone = function(a) { return this.phone; }

        this.setSameBilling = function(a) { 
            this.sameBilling = a == true ? true : false;
        }

        this.getSameBilling = function() {
            return this.sameBilling;
        }
        
        this.setBilling = function(a) {
            this.fname_billing = this.fname;
            this.lname_billing = this.lname;
            this.address1_billing = this.address1;
            this.address2_billing = this.address2;
            this.city_billing = this.city;
            this.state_billing = this.state;
            this.postal_code_billing = this.postal_code;
            this.phone_billing = this.phone;
        }

        this.getBilling = function() {
            return this.sameBilling;
        }




    });