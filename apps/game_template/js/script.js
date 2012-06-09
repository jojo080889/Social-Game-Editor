/* GAME VARIABLES */


/*
 * App launch when Musubi is ready
 */
var game = null;
var donburiGame = null;
Musubi.ready(function(context) {
    console.info("launching DonburiGame");
    donburiGame = new DonburiGame(context);

    console.info(donburiGame.state);

	donburiGame.state.board.onLand = function(slot, piece, eventType, callback) {
		console.log("onLandb");
		callback();
	};

	game.start(); 
});