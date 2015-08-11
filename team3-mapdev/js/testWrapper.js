/* testWrapper.js
 *
 * A simple shell for developing components
 * Uses vanilla JS so as to not require jQuery, etc.
 *
 */

testWrapper = {
	
	/**
	 * start
	 *  
	 * Call routines to set up needed environment for the
	 *  component(s) under development, then activate the
	 *  component(s).		
	 */

var tweetArray = [
	{"lat": "40.121978", "lng": "-79.051518", "username": "@bob_daye" "message": "thanks for all the help"}
	{"lat": "4.403647", "lng": "-62.528042", "username": "@chris_burds" "message": "thanks for all the help"}
	{"lat": "50.035639", "lng": "14.598146", "username": "@khristian_blue", "message": "thanks for all the help"}
	{"lat": "64.415696", "lng": "-18.624512", "username": "@totes", "message": "thanks for all the help"}
	{"lat": "52.882076", "lng": "-105.987797", "username": "@the_six_with_mywoes", "message": "thanks for all the help"}
	{"lat": "35.781747", "lng": "-119.347173", "username": "@hippielife", "message": "thanks for all the help"}
];

	start: function(){

		document.getElementById('message').innerHTML += '<br/><span class="status-message">Test wrapper active.</span>';

		mapModule.displayMap(tweetArray);
		
	},
	

};
