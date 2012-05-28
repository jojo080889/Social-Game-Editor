/* GAME VARIABLES */
var game;

$("#container").live("pageinit", function() {
	var players = convertToMooToolsPlayers();
	var pieces = convertToMooToolsPieces();
	var slots = convertToMooToolsBoard();
		
	game = new Game(null, {
		title: "My Donburi Game",
		players: new PlayerList(null, {players: players}),
		board: new Board(null, {slots: slots}),
		pieces: new PieceList(null, {pieces: pieces}),
		onStart: function() {
			console.log("onStart");
		},
		onTurnStart: function(player) {
			console.log("onTurnStart");
		},
		onMoveStart: function(player) {
			console.log("onMoveStart");
		},
		onMoveEnd: function(player) {
			console.log("onMoveEnd");
		},
		onTurnEnd: function(player) {
			console.log("onTurnEnd");
		},
		onEnd: function() {
			console.log("onEnd");
		}
	});
});