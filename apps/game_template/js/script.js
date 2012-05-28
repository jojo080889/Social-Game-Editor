/* GAME VARIABLES */
var game;

$("#container").live("pageinit", function() {
	var players = convertToMooToolsPlayers();
	var pieces = convertToMooToolsPieces();
	var slots = convertToMooToolsBoard();
		
	game = new Game(null, {
		title: "Yutnori",
		players: new PlayerList(null, {players: players}),
		board: new Board(null, {slots: slots}),
		pieces: new PieceList(null, {pieces: pieces}),
		rollMax: 5
	});

	game.addEvent('start', function() {
		console.log("onStart");
	});
	game.addEvent('turnStart', function(player) {
		console.log("onTurnStart");
	});
	game.onMoveStart = function(player, callback) {
		player.showPiecePicker(["isOffBoard","isOnBoard"], function() {
			callback();
			if (!game.current.pieceToMove.isOnBoard()) {
				game.current.pieceToMove.addToBoard(5, 5);
				game.disableLeaveEventThisTurn(game.board.options.slots[5][5]);
			}
			
			if (game.current.moveCount == 4 || game.current.moveCount == 5) {
					game.turnSetAnother(player, 1);
			}
		});
	}
	game.addEvent('moveEnd', function(player) {
		console.log("onMoveEnd");
	});
	game.addEvent('turnEnd', function(player) {
		console.log("onTurnEnd");
	});
	game.addEvent('end', function() {
		console.log("onEnd");
	});
});

$("#container").live("pageshow", function() {
	game.start();
});