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

  //   game.onTurnStart = function(player, callback) {
  //   	console.log("onTurnStartb");

		// var board = $("#board");
		// player.showSlotPicker(board, function() {
		// 	console.log("Slot picked is "+donburiGame.state.slotPicked.options.positionX+","+donburiGame.state.slotPicked.options.positionY);
			
		// 	if (typeof callback != "undefined" && callback != null) {
		// 		console.log("calling turn start callback");
		// 		callback();
		// 	}
		// });
  //   }

	// game.onMoveStart = function(player, callback) {
	// 	console.log("onMoveStartb");

	// 	//var paths = donburiGame.state.board.options.slots[0][2].getPaths(); // row first
	// 	//showThePathPicker("Choose where to move next:", paths, [2, 0]);


	// 	var types = ["isOffBoard"];
	// 	var pickpieces = donburiGame.state.pieces.getPieces({player:donburiGame.whoseTurn(), piecestate: types});

	// 	showThePiecePicker("Choose which piece to move", pickpieces, $("#board"), function() {
	// 		console.log("Piece picked is "+donburiGame.state.pieceToMove.getPositionX()+","+donburiGame.state.pieceToMove.getPositionY());

	// 		//console.log("Piece picked is "+donburiGame.state.pieceToMove.getPieceDiv());

	// 		donburiGame.state.pieceToMove.addToBoard(0, 0, $("#board"));
	// 		game.disableLeaveEvent(donburiGame.state.board.options.slots[0][0], 1);

	// 		console.log("calling callback");
	// 		callback();
	// 	});
	// }


	// game.onMoveStart = function(player, callback) {
	// 	console.log("onMoveStartb");
	// 	player.showPiecePicker(["isOffBoard","isOnBoard"], $("#board"), function() {
	// 		console.log("Piece picked is "+donburiGame.state.pieceToMove.getPositionX()+","+donburiGame.state.pieceToMove.getPositionY());

	// 		if (!donburiGame.state.pieceToMove.isOnBoard()) {
	// 			donburiGame.state.pieceToMove.addToBoard(0, 0, $("#board"));
	// 			game.disableLeaveEvent(donburiGame.state.board.options.slots[0][0], 1);
	// 		}
	// 		console.log("calling callback");

	// 		callback();
	// 	});
	// }

	donburiGame.state.board.onLand = function(slot, piece, eventType, callback) {
		console.log("onLandb");
		callback();
	};

	game.start(); 
});