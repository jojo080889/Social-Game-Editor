/* GAME VARIABLES */
//var title = "My Donburi Game";
var game;

//var playerNum = data.players.length;//Math.floor((Math.random()*3) + 2);
//var currentPlayer = Math.floor((Math.random()*playerNum)); // 0 to playerNum - 1

//var boardState = data.board.board;
//var size = boardState.length;//Math.floor((Math.random()*10)+3);
//getBoardStateObj();
//var boardState = getBoardStateObj();

//var pieces = data.pieces.pieces;
//var piecesState = getPiecesStateObj();

$(document).ready(function() {
	game = new Game(null, {
		title: "My Donburi Game",
		players: data.players,
		board: data.board.board,
		pieces: data.pieces.pieces
	});
});
