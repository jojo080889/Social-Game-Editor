/* GAME VARIABLES */

$("#container").live("pageinit", function() {
});


/*
 * App launch when Musubi is ready
 */
var game = null;
var donburiGame = null;
Musubi.ready(function(context) {
    console.info("launching DonburiGame");
    donburiGame = new DonburiGame(context);
	game.start(); 
});