// Global namespace
var PROFILEAPP = PROFILEAPP || {};

var Profile = function() {

};

Profile.prototype.setSkinTone = function(skintone){
	this.skintone = skintone;

}

Profile.prototype.setSkinType = function(skintype){
	this.skintype = skintype;

}

Profile.prototype.setTerms = function(terms){
	this.terms = terms;

}

Profile.prototype.setSelected= function(div, type){

	var divName;

	//Set based on profile question
	if(type == 'skintone'){
		divName = 'sub-selected';
	}else if(type == 'skintype'){
		divName = 'sub-selected2';
	}else{
		divName = 'sub-selected3';
	}

	//Set what is selected to unselected
	var selectedDiv = document.getElementsByClassName(divName);

	//Nothing is selected yet	
	if(selectedDiv.length == 0){

		//Set selected class
		div.className = divName;

	}else{

		//Set selected to unselected
		selectedDiv = document.getElementsByClassName(divName);
		selectedDiv[0].className = "sub";

		//Then assign selected class
		div.className = divName;		
	}
}

Profile.prototype.validateProfile = function(){

	//All items have to be selected to proceed
	if(!this.skintone || !this.skintype || !this.terms){
		var x = document.getElementById('errMsg');
		x.innerHTML = "Please select all items!";
	}else{

		Profile.prototype.setSessionVars();

		window.location.href = "sign-up.html";
	}
}

Profile.prototype.setSessionVars = function(){
	sessionStorage.setItem('skintype', profile.skintype);
	sessionStorage.setItem('skintone', profile.skintone);
	sessionStorage.setItem('terms', profile.terms);

}

Profile.prototype.signUp = function(){

	//Get profile
	var password = document.getElementById('loginPass').value;
	var confirm = document.getElementById('loginConfirm').value;
	this.email = document.getElementById('loginEmail').value;
	this.fname = document.getElementById('loginFname').value;
	this.lname = document.getElementById('loginLname').value;

	if(!password) {

	    var errMsg =  'Please enter a password';
	    console.log("Please enter a password");

	}else if(password !== confirm) {

		console.log("Passwords do not match");
	    var errMsg = 'Passwords do not match';

	}else {

		var ref = new Firebase("https://purebox-production.firebaseIO.com");
		ref.createUser({
			email: this.email,
			password: password
		}, function(error, userData) {
		  if (error) {
		    switch (error.code) {
		      case "EMAIL_TAKEN":
		        document.getElementById('error').innerHTML = "This email address is already taken";
		        break;
		      case "INVALID_EMAIL":
		        document.getElementById('error').innerHTML = "Invalid email";
		        break;
		      default:
		        console.log("Error creating user:", error);
		    }
		  } else {
		    profile.createProfile();
		  }
		});
	}	

}

Profile.prototype.createProfile = function() {

	var ref = new Firebase("https://purebox-production.firebaseIO.com");
/*
	var skintype = sessionStorage.getItem('skintype');
	var skintone = sessionStorage.getItem('skintone');
	var terms = sessionStorage.getItem('terms');
*/

	console.log("skintype: " + sessionStorage.skintype);

	//Set profile to firebase
	var onComplete = function(error) {
	  if (error) {
	    console.log('Synchronization failed');
	  } else {
	    window.location = "checkout.html";
	  }
	};

    ref.set({
      skintone: sessionStorage.skintone,
      skintype: sessionStorage.skintype,
      term: sessionStorage.terms, 
      email: this.email,
      fname: this.fname,
      lname: this.lname
    }, onComplete);
}

//Create profile instance
var profile = new Profile();

