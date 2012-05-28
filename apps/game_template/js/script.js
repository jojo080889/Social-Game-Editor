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
		rollMax = 5,
		onStart: function() {
			console.log("onStart");
		},
		onTurnStart: function(player) {
			console.log("onTurnStart");
			this.current.pieceToMove = player.showPiecePicker("allButPermRemoved");
			if (!this.current.pieceToMove.isOnBoard()) {
				this.current.pieceToMove.addToBoard(5, 5);
				game.disableLeaveEventThisTurn(this.board.options.slots[5][5]);
			});
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