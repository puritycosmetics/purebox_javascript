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

		console.log("skintone: " + profile.skintone);
		console.log("skintype: " + profile.skintype);
		console.log("terms: " + profile.terms);

		window.location.href = "/sign-up";
	}
}

//Create profile instance
var profile = new Profile();

