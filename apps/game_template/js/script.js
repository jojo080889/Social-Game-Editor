/* GAME VARIABLES */
var game;

$(document).ready(function() {
	// convert data.players into Player Classes
	var players = new Array();
	for (var i = 0; i < data.players.length; i++) {
		players.push(new Player(null, {
			id: data.players[i].id
		}));
	}
	
	// convert data.pieces into Piece Classes
	var pieces = new Array();
	for (var i = 0; i < data.pieces.pieces.length; i++) {
		pieces.push(new Piece(null, {
			image: data.pieces.pieces[i].image,
			player: data.pieces.pieces[i].player,
			type: data.pieces.pieces[i].type,
			positionX: 0,
			positionY: 0
		}));
	}
	
	game = new Game(null, {
		title: "My Donburi Game",
		players: new PlayerList(null, {players: players}),
		board: new Board(null, {tiles: data.board.board}),
		pieces: new PieceList(null, {pieces: pieces}),
		onStart: function() {
			alert("onStart");
		},
		onTurnStart: function() {
			alert("onTurnStart");
		},
		onMoveStart: function() {
			alert("onMoveStart");
		},
		onMoveEnd: function() {
			alert("onMoveEnd");
		},
		onTurnEnd: function() {
			alert("onTurnEnd");
		},
		onEnd: function() {
			alert("onEnd");
		}
	});
});
