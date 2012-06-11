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
		var sPieces = slot.getPieces();
		if(sPieces.length > 1) {
			for (var i = 0; i < sPieces.length; i++) {
				var p = sPieces[i];
				if (p.options.player != donburiGame.whoseTurn()) {
					console.log("**player with turn ID: "+donburiGame.whoseTurn());
					console.log("piece player id: "+p.options.player);
					console.log("removing from board: "+p.getPieceDiv());
					p.removeFromBoard();
					game.turnSetAnother(donburiGame.state.players.getPlayerByID(donburiGame.whoseTurn()), 2);
					break;
				} 
			}
		}
		callback();
	};

	// when land on slot(3,3): curr player wins
	// donburiGame.state.board.options.slots[2][2].onLand = function(piece, eventType, callback) {
	// 	console.log("*onLand 5,5");
	// 	if (!$.isArray(piece)) {
	// 		piece = [piece];
	// 	}
	// 	game.playerWins();
	// };

	// when land on slot(3,3): opponent player wins
	donburiGame.state.board.options.slots[2][2].onLand = function(piece, eventType, callback) {
		console.log("*onLand 5,5");
		if (!$.isArray(piece)) {
			piece = [piece];
		}
		game.playerWins(game.getOtherPlayerID(donburiGame.whoseTurn()));
	};

	game.start(); 
});