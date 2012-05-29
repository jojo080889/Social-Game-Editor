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
		pieces: new PieceList(null, {pieces: pieces})
	});
	game.start();
});