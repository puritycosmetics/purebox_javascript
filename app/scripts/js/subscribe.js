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

		//Set as sessionStorage in case user refreshes
		sessionStorage.setItem('skintype', profile.skintype);
		sessionStorage.setItem('skintone', profile.skintone);
		sessionStorage.setItem('terms', profile.terms);

		window.location.href = "sign-up.html";

	}
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

		  	//Set sessionStorage email
		  	sessionStorage.setItem('email', profile.email);
		    profile.createProfile();

		  }
		});
	}	

}

Profile.prototype.createProfile = function() {

	var ref = new Firebase("https://purebox-production.firebaseIO.com/users");
	//var ref = Ref.child('users').child(emailToKey(email)), def = $q.defer();

	//Set profile to firebase
	var onComplete = function(error) {
	  if (error) {
	    console.log('Synchronization failed');
	  } else {
	    window.location = "checkout.html";
	  }
	};

    ref.child(profile.emailToKey(this.email)).set({
      skintone: sessionStorage.skintone,
      skintype: sessionStorage.skintype,
      term: sessionStorage.terms, 
      email: this.email,
      fname: this.fname,
      lname: this.lname
    }, onComplete);
}
Profile.prototype.getInvoiceNumber = function(link_url) {

	var n = link_url.lastIndexOf('/');
	var invoice_num = link_url.substring(n + 1);
	console.log(invoice_num)
    return invoice_num;

}
Profile.prototype.capitalizeFirst = function(str) {

	var res = str.charAt(0).toUpperCase() + str.slice(1);
	return res;

}
Profile.prototype.emailToKey = function(emailAddress) {
       return emailAddress.replace('.', ',');
}
Profile.prototype.displayProfile = function() {

	var ref = new Firebase("https://purebox-production.firebaseIO.com");
	console.log(ref.child('users').equalTo(sessionStorage.email));

	// console.log(profile.skintype);
	// document.getElementById('skintype').innerHTML = this.skintype;

}


//Create profile instance
var profile = new Profile();
profile.displayProfile();

$(function() {

      //Get account info  
      $.ajax({ 
         url: '/api/accounts/get?email=' + sessionStorage.email,
         type: 'GET',               
         dataType: 'json',            
         success: function(data) {

            document.getElementById('first_name').innerHTML = data.data.billing_info.first_name;
            document.getElementById('last_name').innerHTML = data.data.billing_info.last_name;
            document.getElementById('address1').innerHTML = data.data.billing_info.address1;
            document.getElementById('address2').innerHTML = data.data.billing_info.address2;
            document.getElementById('city').innerHTML = data.data.billing_info.city;
            document.getElementById('state').innerHTML = data.data.billing_info.state;
            document.getElementById('zip').innerHTML = data.data.billing_info.zip;
            document.getElementById('phone').innerHTML = data.data.billing_info.phone;    
         }
      });

      //Get account info  
      $.ajax({ 
         url: '/api/listByAccount/get?email=' + sessionStorage.email,
         type: 'GET',               
         dataType: 'json',            
         success: function(data) {
            console.log(data);
            // document.getElementById('activated_at').innerHTML = data.subscriptions.subscription.activated_at;
            document.getElementById('current_state').innerHTML = profile.capitalizeFirst(data.data.subscriptions.subscription.state);

            var x = document.getElementById('invoice');
            if(x) x.innerHTML = profile.getInvoiceNumber(data.data.subscriptions.subscription.invoice.$.href);

            document.getElementById('total').innerHTML = data.data.subscriptions.subscription.unit_amount_in_cents._;
            document.getElementById('plan_code').innerHTML = data.data.subscriptions.subscription.plan.name;

            //Need to add   
            document.getElementById('start_date').innerHTML = data.data.subscriptions.subscription.current_period_started_at._;

            document.getElementById('expires_at').innerHTML = data.data.subscriptions.subscription.current_period_ends_at._;
         }
      });

})

