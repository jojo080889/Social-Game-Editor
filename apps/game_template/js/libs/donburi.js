/*
 * DonburiGame is the application's main class
 */
function DonburiGame(context) {
	this.state = {
		board: null, 
		players: null, 
		pieces: null, 
		pieceToMove: null, 
		moveCount: null, 
		moveType: null,
		moveFlags: null,
		moveDecider: null,
		updateTurnPlayer: null, // id
		updatedPlayers: null // associative array
	};
    this.init(context);
}
DonburiGame.prototype = new SocialKit.Multiplayer.TurnBasedMultiplayerGame;

/* PATH CONSTANTS */
DonburiGame.UP = 0;
DonburiGame.LEFT = 1;
DonburiGame.DOWN = 2;
DonburiGame.RIGHT = 3;
DonburiGame.UP_LEFT = 4;
DonburiGame.DOWN_LEFT = 5;
DonburiGame.DOWN_RIGHT = 6;
DonburiGame.UP_RIGHT = 7;

DonburiGame.prototype.pathToString = function(path) {
	switch (path) {
		case DonburiGame.UP:
			return "Up";
		case DonburiGame.LEFT:
			return "Left";
		case DonburiGame.DOWN:
			return "Down";
		case DonburiGame.RIGHT:
			return "Right";
		case DonburiGame.UP_LEFT:
			return "Up left";
		case DonburiGame.DOWN_LEFT:
			return "Down left";
		case DonburiGame.DOWN_RIGHT:
			return "Down right";
		case DonburiGame.UP_RIGHT:
			return "Up right";
	}
};

// App initializations
DonburiGame.prototype.init = function(context) {
	//console.log("DonburiGame.prototype.init moveDecider val: " + $("#move_decider_option").val());
	console.info("DonburiGame context in init : ");
	console.info(context);

	game = new Game(null, {
		title: "My Donburi Game"
	});
	
    this.onUpdate(function(gameState) {
		this.state = gameState;
		game.update(this);
    });
    SocialKit.Multiplayer.TurnBasedMultiplayerGame.prototype.init.call(this, context);
};

DonburiGame.prototype.createInitialState = function() {
	console.log("creating Initial State");
	console.log(this.players);
	console.log("Donburi state moveDecider val: " + data.moveDecider);

	var players = convertToMooToolsPlayers(this);
	var pieces = convertToMooToolsPieces();
	var slots = convertToMooToolsBoard();
	
	state = {
		board: new Board(null, {slots: slots}), 
		players: new PlayerList(null, {players: players}), 
		pieces: new PieceList(null, {pieces: pieces}), 
		pieceToMove: null, 
		slotPicked: null,
		moveCount: null, 
		moveType: null,
		moveFlags: null,
		moveDecider: data.moveDecider,
		updateTurnPlayer: -1,
		updatedPlayers: {}
	};
	
	game.render(state);

	console.info("this.state in createInitialState is: ");
	console.info(this.state);
	
	return state;
};

// Returns the state
DonburiGame.prototype.makeState = function() {
    if (DBG) console.log("making state...");
    return this.state;
};

/*Pretty sure we don't need this one.
/*DonburiGame.prototype.reset = function() {
    if (this.isMyTurn()) {
        this.box = [0,0];
        this.takeTurn(this.makeState())
    }
};*/

DonburiGame.prototype.feedView = function() {
    var container = $('<div></div>');
    var cssRules = document.styleSheets[0].cssRules;
    var css = "";
    for (var i=0; i<cssRules.length; i++) {// cssRules.length; i++) {
        if (cssRules[i].cssText)
            css += cssRules[i].cssText + " ";
        
    }
    return '<html><head><style>' + css + '</style></head><body><div id="divbox">' + container.html() + '</div></body></html>';
};

/* Game Class
 * Master class that controls game state.
 */
var Game = new Class({
	Implements: [Options, Events],
	options: {
		title: "title here",
		moveDecider: "",
		usePoints: false, // if true, use points
		rollMin: 1,
		rollMax: 6
	},
	jQuery: 'game', //namespace for new jquery method
	initialize: function(selector, options) {
		this.setOptions(options);
	},
	
	/* UI */
	render: function(state) {
		// Set title
		$("title").html(this.options.title);
		$("header h1").html(this.options.title);
		
		console.info("in game render: moveDecider: "+state.moveDecider);
		$("#roll_move").html(state.moveDecider);
		this.options.moveDecider = state.moveDecider;

		// Create players
		state.players.render();
		
		// Create board
		state.board.render();
		
		// Create pieces
        state.pieces.render();
	},
	
	/* Events */
	onStart: function(callback) {
		if (typeof callback != "undefined" && callback != null) {
			callback();
		}
	},
	onTurnStart: function(player,callback) {
		if (typeof callback != "undefined" && callback != null) {
			callback();
		}
	},
	onMoveStart: function(player, callback) {
		if (typeof callback != "undefined" && callback != null) {
			callback();
		}
	},
	onMoveEnd: function(player, callback) {
		if (typeof callback != "undefined" && callback != null) {
			callback();
		}
	},
	onTurnEnd: function(player, callback) {
		if (typeof callback != "undefined" && callback != null) {
			callback();
		}
	},
	onEnd: function(callback) {
		if (typeof callback != "undefined" && callback != null) {
			callback();
		}
	},
	
	/* Utility */
	getTitle: function() {
		return this.options.title;
	},
	setTitle: function(newTitle) {
		this.options.title = newTitle;
	},
	
	/* PLAYERS */
	renderCurrentPlayer: function(number) {
		if (number != null && typeof number != "undefined") {
			$(".player-status").removeClass("active");
			$(".player#player_" + number).find(".player-status").addClass("active");
		}
	},

	/* ACTIONS */
	bindActionHandlers: function(donburiGame) {
        if(donburiGame.isMyTurn()) {
        	$("#won").html("I Won");
			// Bind the 'I Won' button
		    $("#won").click(function() {
		    	donburiGame.state.players.winningPlayerID = donburiGame.whoseTurn() + 1;
		    	game.ifMyTurnChangeToNextTurn();
		    });

            console.info("************* bindActionHandlers : moveDecider: " + this.options.moveDecider);
            $("#roll_move").html(this.options.moveDecider);

            /*During initialization, the function below is bound to this button, 
             *and then on update it is bound again. This unbind (and the one below) 
             *prevent that from being a problem. There has to be a more elegant solution.
             */
            $("#roll_move").unbind(); 
            $("#roll_move").click(function() {
            	console.log("roll move clicked");
                $("#roll_move").unbind();
                $("#skip_turn").unbind();
                game.turnStart();
            });

            $("#skip_turn").unbind();
            $("#skip_turn").click(function(){
                $("#roll_move").unbind();
                $("#skip_turn").unbind();
                game.ifMyTurnChangeToNextTurn();
            });
        } else {
       		$("#won").html("...");
			// Bind the 'I Won' button
		    $("#won").click(function() {
		    	return;
		    });

            $("#roll_move").html("Waiting...");
            $("#roll_move").click(function() {
                return;
            });
            $("#skip_turn").click(function(){
                return;
            });
        }
	},
	
	/* GAME */
	start: function() {
		var self = this;
		this.onStart(function() {
			// get piece of current player
			//var piece = self.options.pieces.getPiecesByPlayerID(self.current.player)[0];
			//self.current.pieceToMove = piece;
			
			//self.onTurnStart(self.options.players.getPlayerByID(self.current.player)); // first player's turn start
		});
	},
	end: function() {
		var self = this;
		this.onEnd(function() {
			// show notice
			$("#game-message").html("<b>Player " + (donburiGame.state.players.winningPlayerID) + "</b> has won the game!");
			$("#game-message").show("fast");
			
			// disable actions
			$("#won").unbind();
			$("#roll_move").unbind();
			$("#skip_turn").unbind();
		});
	},
	update: function(context) {
        console.info("Updating...");
        var player_num = context.whoseTurn() + 1;
        var other_player_num = (player_num % 2) + 1;
        console.info("Curr Turn player ID: "+context.whoseTurn() + ", i.e. player # "+ player_num + ", other: "+other_player_num);
        var who_am_i_player = context.whoAmI() + 1;
        console.info("I am: " + context.whoAmI() +", or I am player number "+ who_am_i_player);
        if (context.isMyTurn())
        	console.log("my turn");

//        console.info(context.state.pieces);
		
		var currentPlayer = context.whoseTurn();
        
        // Create pieces and place in correct positions
		for (var i = 0; i < context.state.pieces.options.pieces.length; i++) {
			var piece = context.state.pieces.options.pieces[i];
			$("#" + piece.pieceDiv).remove();
			piece.options.isRendered = false;
		}
        //context.state.pieces.render();
		for (var i = 0; i < context.state.pieces.options.pieces.length; i++) {
			var piece = context.state.pieces.options.pieces[i];
			
			// implicitly only draws pieces that are already on the board
			piece.setPosition(piece.options.positionX, piece.options.positionY, $("#board"));
		}
		
        // Set current player
        this.renderCurrentPlayer(currentPlayer);
		
        // Set event handlers
	    this.bindActionHandlers(context);

		this.onTurnStart(context.state.players.getPlayerByID(currentPlayer)); // TODO: remove
	
		var curPlayerObj = context.state.players.getPlayerByID(currentPlayer);

		if (context.state.players.checkIfAnyPlayerWon()) { // check if any player has won
			console.log("******Player # " + context.state.players.winningPlayerID + " WON!");
			game.end();
		} //else {

		//}
		console.log("update ends...for...");
		console.info("Curr Turn player ID: "+context.whoseTurn() + ", i.e. player # "+ player_num + ", other: "+other_player_num);
        console.info("I am: " + context.whoAmI() +", or I am player number "+ who_am_i_player);
	},
	changeToNextTurn: function() {
		console.log("changeToNextTurn, current player id: " + donburiGame.whoseTurn());
		var self = this;
		this.turnEnd(function() {
			console.log("taking turn...");
			donburiGame.takeTurn(donburiGame.makeState());
		});
	},
	ifMyTurnChangeToNextTurn: function() {
		var self = this;
		this.turnEnd(function() {
			// check if player will get extra turn
			if (donburiGame.isMyTurn() && curPlayerObj.options.skipTurnNum > 0) {
				console.log("My turn and I need to skip it");
				// show notice
				$("#game-message").html("<b>Player " + (donburiGame.whoseTurn() + 1) + "'s</b> turn is skipped. Sorry!");
				$("#game-message").show("fast").delay(1000).hide("fast");
			
				if (curPlayerObj.options.skipTurnNum > 0) {
					curPlayerObj.options.skipTurnNum--;
				}

			if (donburiGame.isMyTurn()) {
				console.log("my turn so changeToNextTurn, current player id: " + donburiGame.whoseTurn());
				console.log("taking turn...");
				donburiGame.takeTurn(donburiGame.makeState());
			}
		});
	},
	getCurrentSlotPosition: function() {
		var pieceToMove = donburiGame.state.pieceToMove;
		var curX, curY;
		if (typeof pieceToMove.length == "number") {
			// if pieceToMove is an array
			curX = pieceToMove[0].getPositionX(); // assume all pieces are in the same position
			curY = pieceToMove[0].getPositionY();
		} else {
			curX = pieceToMove.getPositionX();
			curY = pieceToMove.getPositionY();
		}
		return {x:curX, y:curY}
	},
	turnStart: function() {
		console.log("turn start beginning");

		var curPlayerObj = donburiGame.state.players.getPlayerByID(donburiGame.whoseTurn());
		// check if player needs to skip their turn
		if (donburiGame.isMyTurn() && curPlayerObj.options.skipTurnNum > 0) {
			console.log("My turn and I need to skip it");
			// show notice
			$("#game-message").html("<b>Player " + (donburiGame.whoseTurn() + 1) + "'s</b> turn is skipped. Sorry!");
			$("#game-message").show("fast").delay(1000).hide("fast");
		
			if (curPlayerObj.options.skipTurnNum > 0) {
				curPlayerObj.options.skipTurnNum--;
			}
			
			this.ifMyTurnChangeToNextTurn();
		} else { // continue with turn

			if (donburiGame.state.moveDecider == "Roll Dice") {
				var diceResult = game.decideMove();
				donburiGame.state.moveCount = diceResult;
				$("#move-result-num").html(diceResult);
				$("#move-result p:first").html("You rolled a");
				$("#move-result").show("fast").delay(1500).hide("fast", function() { 
					game.onTurnStart(donburiGame.state.players.getPlayerByID(donburiGame.whoseTurn()), game.turnStartHelper);
				});
			} else { // Pick Slot
				showTheSlotPicker("Pick slot to move to", donburiGame.state.board.options.slots, $("#board"));
			}
		}
	},
	turnStartHelper: function() {
		console.log("in turnStartHelper begin, calling moveStart");

		game.moveStart();
	},
	slotPickerHelper: function() {
		console.log("in slotPickerHelper");
		
		var slotX = donburiGame.state.slotPicked.options.positionX + 1;
		var slotY = donburiGame.state.slotPicked.options.positionY + 1;
		var str = "" + slotX + "," + slotY;
		console.log("Slot picked is "+str);
				
		$("#move-result-num").html(str);
		$("#move-result p:first").html("You chose");
		$("#move-result").show("fast").delay(1500).hide("fast", function() { 
			console.log("in slotPickerHelper end, calling onTurnStart");
			// TODO: call onTurnStart() here
			game.turnStartHelper();
		});
	},
	moveStart: function() {
		// define pieceToMove - either current piece or pick piece

		var types = ["isOnBoard"];
		var onPieces = donburiGame.state.pieces.getPieces({player:donburiGame.whoseTurn(), piecestate: types});

		var types = ["isOffBoard"];
		var offPieces = donburiGame.state.pieces.getPieces({player:donburiGame.whoseTurn(), piecestate: types});

		var showPickerIf = (donburiGame.state.moveDecider == "Pick Slot" ||
							onPieces.length == 0);

		if (!showPickerIf) { // Roll Dice
			// by default, set piece to move to be the first piece owned
			// by the current player
			if (onPieces.length >= 1) // TODO: change to select b/w multiple on board pieces
				donburiGame.state.pieceToMove = onPieces[0];
			this.knowPiece();
		} else { // Pick Slot
			showThePiecePicker("Choose which piece to move", offPieces, $("#board"));
		}
	},
	// set donburiGame.state.pieceToMove before this point
	knowPiece: function() {
		console.log("in knowPiece, calling onMoveStart with callback moveStartHelper");
		this.onMoveStart(donburiGame.state.players.getPlayerByID(donburiGame.whoseTurn()), this.moveStartHelper);
	},
	piecePickerHelper: function() {
		console.log("in game.piecePickerHelper");
		
		console.log("Piece picked is "+donburiGame.state.pieceToMove.getPositionX()+","+donburiGame.state.pieceToMove.getPositionY());

		donburiGame.state.pieceToMove.addToBoard(0, 0, $("#board"));
		game.disableLeaveEvent(donburiGame.state.board.options.slots[0][0], 1);

		this.knowPiece();
	},
	moveStartHelper: function() {
		/* Must write this callback function using game instead of this, because this is the dialog widget */
		// TODO: handle multiple pieces
		console.log("in moveStartHelper begin");

		if (donburiGame.state.slotPicked == null) {
			var pieceToMove = donburiGame.state.pieceToMove;
			var curX = game.getCurrentSlotPosition().x;
			var curY = game.getCurrentSlotPosition().y;
			
			var currentSlot = donburiGame.state.board.getSlotByPosition(curX, curY);
			
			if (currentSlot.options.disableLeaveEventNum == 0) {
				donburiGame.state.board.onLeave(currentSlot, pieceToMove, "normal", function() {
					donburiGame.state.moveFlags = game.createMoveFlags(donburiGame.state.pieceToMove);
					currentSlot.onLeave(pieceToMove, "normal", function() {
						game.makeMove(curX, curY);
					});
				});
			} else {
				if (currentSlot.options.disableLeaveEventNum != -1) {
					currentSlot.options.disableLeaveEventNum--;
				}
				donburiGame.state.moveFlags = game.createMoveFlags(donburiGame.state.pieceToMove);
				game.makeMove(curX, curY);
			}
		} else {
			var curX = donburiGame.state.slotPicked.options.positionX;
			var curY = donburiGame.state.slotPicked.options.positionY;
			console.log("in moveStartHelper slotPicked curX: " + curX);
			console.log("in moveStartHelper slotPicked curY: " + curY);
			donburiGame.state.moveCount = 0;
			game.makeMove(curX, curY);
		}
		console.log("in moveStartHelper end");
	},
	createMoveFlags: function(pieceToMove) {
		var moveFlags = new Array();
		for (var i = 1; i <= donburiGame.state.moveCount; i++) {
			var flagRow = new Array();
			if (typeof pieceToMove.length == "number") {
				for (var j = 0; j < pieceToMove.length; j++) {
					flagRow.push(false);
				}
			} else {
				flagRow.push(false);
			}
			moveFlags[i] = flagRow;
		}
		return moveFlags;
	},
	decideMove: function() {
		// pick random number
		// TODO: make flexible with different kinds of dice
		var diceResult = Math.floor((Math.random()*this.options.rollMax) + this.options.rollMin); // 1 through 6
		return diceResult;
	},
	// specifying either donburiGame.state.moveCount or donburiGame.state.moveFlags before 
	// this point is crucial
	makeMove: function(curX, curY) {
		console.log("in makeMove begin");
		var piece = donburiGame.state.pieceToMove;
		var moveCount = donburiGame.state.moveCount;
		if (moveCount == 0) {
			this.moveEnd(piece, curX, curY);
			return;
		}

		// get path of current square
		var paths = donburiGame.state.board.options.slots[curY][curX].getPaths(); // row first
		var path = null;

		if (paths.length == 1) {
			path = paths[0];
			this.makeMoveHelper(curX, curY, path);
		} else if (paths.length > 1) {
			showThePathPicker("Choose where to move next:", paths, [curX, curY]);
		}
	},
	makeMoveHelper: function(curX, curY, path) {
		var piece = donburiGame.state.pieceToMove;
		var moveCount = donburiGame.state.moveCount;

		console.log("source slot X,Y: "+curX+","+curY);
		var sourceSlot = $($($("#board .row")[curY]).find(".slot")[curX]);
		var verDistance = sourceSlot.outerHeight();
		var horDistance = sourceSlot.outerWidth();
		var moveObj = {top: 0, left: 0};
		
		// update position
		if (path == null) {
			// stop automatically
			this.makeMove(curX, curY, 0);
		} else {
			if (path == DonburiGame.RIGHT || path == DonburiGame.UP_RIGHT || path == DonburiGame.DOWN_RIGHT) {
				curX++;
				moveObj.left = horDistance + "px";
			}
			if (path == DonburiGame.LEFT || path == DonburiGame.UP_LEFT || path == DonburiGame.DOWN_LEFT) {
				curX--;
				moveObj.left = "-" + horDistance + "px";
			}
			if (path == DonburiGame.DOWN || path == DonburiGame.DOWN_LEFT || path == DonburiGame.DOWN_RIGHT) {
				curY++;
				moveObj.top = verDistance + "px";
			}
			if (path == DonburiGame.UP || path == DonburiGame.UP_LEFT || path == DonburiGame.UP_RIGHT) {
				curY--;
				moveObj.top = "-" + verDistance + "px";
			}
			
			if (typeof piece.length == "number") {
				// if piece is an array
				var pieceDivs = new Array();
				for (var i = 0; i < piece.length; i++) {
					piece[i].addToBoard();
					pieceDivs.push(piece[i].getPieceDiv());
				}
				this.makeMovePiece(pieceDivs, sourceSlot, moveObj, curX, curY);
			} else {
				piece.addToBoard();
				this.makeMovePiece(piece.getPieceDiv(), sourceSlot, moveObj, curX, curY);
			}
		}
	},
	makeMovePiece: function(pieceDivs, sourceSlot, moveObj, curX, curY) {
		console.log("makeMovePiece:");
		console.log(pieceDivs);
		console.log(moveObj);
		console.log(curX);
		console.log(curY);
		var self = this;
		var destSlot = $($($("#board .row")[curY]).find(".slot")[curX]);
		sourceSlot.addClass("slot-moving");

		var moveCount = donburiGame.state.moveCount;
		if (!$.isArray(pieceDivs)) {
			pieceDivs = [pieceDivs];
		}
		console.log(pieceDivs);
		$.each(pieceDivs, function(i, pieceDiv) {
			console.log(pieceDiv);
			pieceDiv = $("#" + pieceDiv);
			//console.log(pieceDiv);
			pieceDiv.addClass("piece-moving")
			.animate(moveObj, {
				duration: 1000, 
				complete: function() { 
					$(this).css({top: 0, left: 0}).removeClass("piece-moving").appendTo(destSlot);
					
					donburiGame.state.moveFlags[moveCount][i] = true;
					
					// Check if this pieceDiv is the last to animate for the current move step
					var allFlagged = true;
					for (var j = 0; j < donburiGame.state.moveFlags[moveCount].length; j++) {
						if (donburiGame.state.moveFlags[moveCount][j] == false) {
							allFlagged = false;
						}
					}
					if (allFlagged) {
						console.log("allFlagged");
						sourceSlot.removeClass("slot-moving");

						if (moveCount - 1 > 0) {
							console.log(moveCount);
							var currentSlot = donburiGame.state.board.getSlotByPosition(curX, curY);
							
							if (currentSlot.options.disablePassEventNum == 0) {
								donburiGame.state.board.onPass(currentSlot, donburiGame.state.pieceToMove, "normal", function() {
									currentSlot.onPass(donburiGame.state.pieceToMove, "normal", function() {
										donburiGame.state.moveCount--;
										self.makeMove(curX, curY);
									});
								});
							} else {
								if (currentSlot.options.disablePassEventNum != -1) {
									currentSlot.options.disablePassEventNum--;
								}
								donburiGame.state.moveCount--;
								self.makeMove(curX, curY);
							}
						} else {
							donburiGame.state.moveCount--;
							self.makeMove(curX, curY);
						}
					}
				}
			});
		});
	},
	moveEnd: function(piece, curX, curY) {
		console.log("move end begin");
		console.log(piece);
		console.log(curX + ", " + curY);
		if (!$.isArray(piece)) {
			piece = [piece];
		}
		for (var i = 0; i < piece.length; i++) {
			piece[i].setPosition(curX, curY);
		}
		var currentSlot = donburiGame.state.board.getSlotByPosition(curX, curY);
		
		console.log("pieceToMove is: ");
		console.log(donburiGame.state.pieceToMove);

		if (currentSlot.options.disableLandEventNum == 0) {
			console.log("in if: "+currentSlot.options.disableLandEventNum);
			donburiGame.state.board.onLand(currentSlot, donburiGame.state.pieceToMove, "normal", function() {		
				currentSlot.onLand(donburiGame.state.pieceToMove, "normal", function() {
					// Change turn to next player
					game.ifMyTurnChangeToNextTurn();
				});
			});
		} else {
			console.log("in else: "+currentSlot.options.disableLandEventNum);

			if (currentSlot.options.disableLandEventNum != -1) {
				currentSlot.options.disableLandEventNum--;
			}
			// Change turn to next player
			this.ifMyTurnChangeToNextTurn();
		}
		this.onMoveEnd(donburiGame.state.players.getPlayerByID(donburiGame.whoseTurn()));
		console.log("moveEnd end");
	},
	turnEnd: function(callback) {
		this.onTurnEnd(donburiGame.state.players.getPlayerByID(donburiGame.whoseTurn()), callback);
		console.log("turnEnd end");
	},
	turnSetSkip: function(player, n) {
		player.options.skipTurnNum += n;
	},
	turnSetAnother: function(player, n) {
		//player.options.moreTurnNum += n;

		var player_num = player.options.id + 1;
        var other_player_id = (player_num % 2);

        this.turnSetSkip(donburiGame.state.players.getPlayerByID(other_player_id), n);
	},
	disableLeaveEvent: function(slot, howLong) {
		howLong = typeof howLong !== 'undefined' ? howLong : -1;
		slot.options.disableLeaveEventNum = howLong;
	},
	disableLandEvent: function(slot, howLong) {
		howLong = typeof howLong !== 'undefined' ? howLong : -1;
		slot.options.disableLandEventNum = howLong;
	},
	disablePassEvent: function(slot, howLong) {
		howLong = typeof howLong !== 'undefined' ? howLong : -1;
		slot.options.disablePassEventNum = howLong;
	},
	enableLeaveEvent: function(slot) {
		slot.options.disableLeaveEventNum = 0;
	},
	enableLandEvent: function(slot) {
		slot.options.disableLandEventNum = 0;
	},
	enablePassEvent: function(slot) {
		slot.options.disablePassEventNum = 0;
	},
	undoTurn: function(n) {
		// Hm... there's probably a better way to do things than use this
	},
	// choices is an Array of {"choice": string, "function": function} objects
	showChoice: function(msg, choices) {
		var buttons = {};
		for (var i = 0; i < choices.length; i++) {
			var button = {};
			button.click = choices[i]["function"];
			buttons[choices[i].choice] = button;
		}
		$('<div>').simpledialog2({
			mode: 'button',
			dialogForce:true,
			buttonPrompt: msg,
			buttons : buttons
		});	
	}
});

/* Player Class
 * Class represents each player
 */
var Player = new Class({
	Implements: [Options, Events],
	options: {
		id: -1,
		state: "playing", //"playing" | "won" | "lost"
		skipTurnNum: 0//,
		//moreTurnNum: 0
	},
	jQuery: 'player', //namespace for new jquery method
	initialize: function(selector, options) {
		this.setOptions(options);
		this.pointsAmt = 0;
	},
	getPieces: function() {
		return donburiGame.state.pieces.getPiecesByPlayerID(this.options.id);
	},
	getPiecesOnBoard: function() {
		var pieces = new Array();
		for (var i = 0; i < donburiGame.state.pieces.options.pieces.length; i++) {
			var p = donburiGame.state.pieces.options.pieces[i].options;
			if (p.player == this.options.id && p.state == "isOnBoard") {
				pieces.push(donburiGame.state.pieces.options.pieces[i]);
			}
		}
		return pieces;
	},
	/*
	showPiecePicker: function(types, board, callback) {
		console.log("piece picker");
		var pickpieces = donburiGame.state.pieces.getPieces({player:this.options.id, piecestate: types});
		console.log("about to go inside the piece picker");
		showThePiecePicker("Choose which piece to move", pickpieces, board, callback);
	},*/
	getID: function() {
		return this.options.id;
	},
	getState: function() {
		return this.options.state;
	},
	win: function() {
		if (this.options.state == "playing") {
			this.options.state = "won";
		}
	},
	lose: function() {
		if (this.options.state == "playing") {
			this.options.state = "lose";
		}
	}
});

/* Piece Class
 * Class represents a game piece
 */
var Piece = new Class({
	Implements: [Options, Events],
	options: {
		id: -1, // ID of piece
		player: null, // ID of player object
		state: "isOffBoard", // "isOffBoard" | "isOnBoard" | "isPermOffBoard"
		positionX: -1,
		positionY: -1,
		validMoves: "followPath", //TODO extend this
		image: null,
		color: null,
		type: null,
		isRendered: false
	},
	jQuery: 'piece', //namespace for new jquery method
	initialize: function(selector, options) {
		this.setOptions(options);
		this.pieceDiv = "piece" + (this.options.player + 1) + "_" + this.options.id;
		this.render(); // initialize this.pieceDiv
	},
	
	/* UI */
	render: function() {
		var p = this.options;
		var pieceDiv;
		if (typeof(p.color) == "undefined" || p.color == null) {
			// the piece is an image
			pieceDiv = $("<div class='piece imagePiece' id='" + this.pieceDiv + "'><img src='" + p.image + "' /></div>");
		} else {
			// the piece is just a color
			pieceDiv = $("<div class='piece colorPiece' id='" + this.pieceDiv + "' style='background: " + p.color + "'></div>");
		}
		console.log("from render: returning piecediv: "+pieceDiv);
		return pieceDiv;
	},
	
	/* Utility */
	getPlayer: function() {
		return donburiGame.state.players.getPlayerByID(this.options.player);
	},
	setPlayer: function(newID) {
		this.options.player = newID;
	},
	removeFromBoard: function(permanently) {
		permanently = typeof permanently !== 'undefined' ? permanently : false;
		
		//this.options.isRendered = false;
		
		permanently ? this.options.state = "isPermOffBoard" : this.options.state = "isOffBoard";
	},
	addToBoard: function(positionX, positionY, board) {
		if (!this.isOnBoard()) {
			var p = this.options;
			positionX = typeof positionX !== 'undefined' ? positionX : p.positionX;
			positionY = typeof positionY !== 'undefined' ? positionY : p.positionY;
			
			this.options.state = "isOnBoard";
			console.log(this.options.isRendered);
			this.setPosition(positionX, positionY, board);
			
			console.log("added "+this.pieceDiv+", to loc: "+positionX+","+positionY);
			console.log(this.options.isRendered);
		}
	},
	getPositionX: function() {
		return this.options.positionX;
	},
	getPositionY: function() {
		return this.options.positionY;
	},
	setPosition: function(positionX, positionY, board) {
		board = typeof board !== 'undefined' ? board : $("#board");
		this.options.positionX = parseInt(positionX);
		this.options.positionY = parseInt(positionY);
		var pieceDiv;
		if (this.isOnBoard()) {
			// also move its visual representation
			if (this.options.isRendered) {
				console.log("remove piecediv");
				$("#" + this.pieceDiv).remove();
				pieceDiv = $("#" + this.pieceDiv);
			} else {
				pieceDiv = this.render();	
				this.options.isRendered = true;
			}
			var slotDiv = $($($(".row", board)[positionY]).find(".slot")[positionX]);
			slotDiv.append(pieceDiv);
		}
	},
	isOnBoard: function() {
		return (this.options.state == "isOnBoard")
	},
	getState: function() {
		return this.options.state;
	},
	getPieceDiv: function() {
		console.log("getpieceDiv");
		return this.pieceDiv;
	}
});

/* Slot Class 
 * Represents a single slot on the board.
 */
var Slot = new Class({
	Implements: [Options, Events],
	options: {
		paths: null,
		type: "",
		color: null,
		image: null,
		positionX: -1,
		positionY: -1,
		pieces: null, // Array of Pieces currently in the slot
		disableLandEventNum: 0, // if -1, disable until further notice
		disableLeaveEventNum: 0,
		disablePassEventNum: 0
	},
	jQuery: 'slot',
	initialize: function(selector, options) {
		this.setOptions(options);
	},
	
	/* UI */
	render: function() {
	
	},
	
	/* Events */
	onLand: function(piece, eventType, callback) {
		console.log("onLand (" + this.options.positionX + ", " + this.options.positionY + ")");
		if (typeof callback != "undefined" && callback != null) {
			callback();
		}
	},
	onLeave: function(piece, eventType, callback) {
		console.log("onLeave (" + this.options.positionX + ", " + this.options.positionY + ")");
		if (typeof callback != "undefined" && callback != null) {
			callback();
		}
	},
	onPass: function(piece, eventType, callback) {
		console.log("onPass (" + this.options.positionX + ", " + this.options.positionY + ")");
		
		if (typeof callback != "undefined" && callback != null) {
			callback();
		}
	},
	
	/* Utility */
	getPaths: function() {
		return this.options.paths;
	},
	setPaths: function(newPaths) {
		this.options.paths = newPaths;
	},
	getPieces: function() {
		return donburiGame.state.pieces.getPiecesByPosition(this.options.positionX, this.options.positionY);
	}/*,
	showPathPicker: function(callback) {
		showThePathPicker("Choose where to move next:", this.options.paths, callback);
	},*/
	/*
	showPiecePicker: function(types, board, callback) {
		var pickpieces = donburiGame.state.pieces.getPieces({player:this.options.id, piecestate: types});
		showThePiecePicker("Choose which piece to move", pickpieces, board, callback);
	}*/
});

/* Board Class
 * Class represents the game board
 */
var Board = new Class({
	Implements: [Options, Events],
	options: {
		slots: null // Array of Array of objects representing tile appearance
	},
	jQuery: 'board', //namespace for new jquery method
	initialize: function(selector, options) {
		this.setOptions(options);
		this.size = this.options.slots.length; // TODO Assumes a square
	},
	
	/* UI */
	render: function (){
		$("#board-container").html($(this.generateGrid()));
		this.adjustGrid();
	},
	
	/* Event Handlers */
	// master event functions that execute on EVERY
	// slot land/leave/pass.
	onLand: function(slot, piece, eventType, callback) {
		console.log("board onLand");
		if (typeof callback != "undefined" && callback != null) {
			callback();
		}
	},
	onLeave: function(slot, piece, eventType, callback) {
		console.log("board onLeave");
		if (typeof callback != "undefined" && callback != null) {
			callback();
		}
	},
	onPass: function(slot, piece, eventType, callback) {
		console.log("board onPass");
		if (typeof callback != "undefined" && callback != null) {
			callback();
		}
	},
	
	/* Utility */
	generateGrid: function() {
		var html = "<div id='board'>";
		for (var i = 0; i < this.size; i++) {
			html += "<div class='row'>";
			for (var j = 0; j < this.size; j++) {
				var boardTile = this.options.slots[i][j].options;
				if (typeof(boardTile.color) !== 'undefined' && boardTile.color !== null) {
					html += "<div class='slot' style='background: " + boardTile.color + "'></div>";
				} else {
					html += "<div class='slot'></div>";
				}
			}
			html += "</div>";
		}
		html += "</div>";
		return html;
	},
	adjustGrid: function() {
		// adjust square and board sizes to fit on screen
		var totalWidth = $(window).width();
		var totalHeight = $(window).height() - $("#actions").outerHeight() - 
			$("#players").outerHeight() - $("header h1").outerHeight() - 30; // add some buffer space
		if (totalHeight < totalWidth) {
			totalWidth = totalHeight;
		}
		var maxBoxWidth = Math.floor(totalWidth / this.size);
		boxWidth = maxBoxWidth - (2 * parseInt($(".slot").css("borderWidth")));
		$(".slot").css("width", boxWidth).css("height", boxWidth);
		
		var boardWidth = maxBoxWidth * this.size;
		$("#board").css("width", boardWidth).css("height", boardWidth);
	},
	getSize: function() {
		return this.size;
	},
	getSlotByPosition: function(x, y) {
		return this.options.slots[y][x];
	}
});

/*-----------------------*/
/* PlayerList Class
 * Class represents all the players in the game
 */
var PlayerList = new Class({
	Implements: [Options, Events],
	options: {
		players: null //Array of Player Objects
	},
	jQuery: 'playerList', //namespace for new jquery method
	initialize: function(selector, options) {
		this.setOptions(options);
		this.playerNum = this.options.players.length;
		this.winningPlayerID = -1;
	},
	
	/* UI */
	render: function() {
		$("#players").html($(this.generatePlayers()));
	},
	generatePlayers: function() {
		// TODO actually get points
		/*var pointsExistIndex = Math.floor((Math.random()*2));
		var pointsExist = [true,false][pointsExistIndex];
		console.log(pointsExistIndex);*/

		var html = "<ul>";
		for (var i = 0; i < this.playerNum; i++) {
			html += "<li class='player' id='player_" + i + "'>";
			html += "<p><span class='player" + (i + 1) + "'></span>Player " + (i+1) + "</p>";
			
			// Check if there are points, and set points
			if (game.options.usePoints) {
				html += "<p class='points'>0</p>";
			}
			html += "<p class='player-status'></p>";
			html += "</li>";
		}
		html += "</ul>";
		return html;
	},
	getPlayerByID: function(id) {
		for (var i = 0; i < this.playerNum; i++) {
			var p = this.options.players[i].options;
			if (p.id == id) {
				return this.options.players[i];
			}
		}
	},
	checkIfAnyPlayerWon: function() {
		return this.winningPlayerID != -1;
	},
	getWinningPlayerID: function() {
		return this.winningPlayerID; // returns id (starting with 1 not 0)
	},
	getActivePlayers: function() {
		var playerArr = new Array();
		for (var i = 0; i < this.playerNum; i++) {
			var p = this.options.players[i].options;
			if (p.state == "playing") {
				playerArr.push(this.options.players[i]);
			}
		}
		return playerArr;
	}
});

/* PieceList Class
 * Class represents all the pieces in the game
 */
var PieceList = new Class({
	Implements: [Options, Events],
	options: {
		pieces: null //Array of Piece Objects
	},
	jQuery: 'pieceList', //namespace for new jquery method
	initialize: function(selector, options) {
		this.setOptions(options);
		this.piecesNum = this.options.pieces.length;
	},
	
	/* UI */
	render: function (){
		this.createPieces();
	},
	
	/* Utility */
	/* Based on pieces state, place pieces on board */
	createPieces: function() {
		if (donburiGame != null) {
			console.info("Creating pieces: " + donburiGame.whoseTurn());
		}
		for (var i = 0; i < this.piecesNum; i++) {

			// Only do first piece for each player
			var piece = this.options.pieces[i];
			
						console.info("Setting position of piece " + i + " to " + piece.options.positionX + " , " + piece.options.positionY);
			
			// implicitly only draws pieces that are already on the board
			piece.setPosition(piece.options.positionX, piece.options.positionY);
		}
	},
	getPiecesByPlayerID: function(player) {
		var playerPieces = new Array();
		for (var i = 0; i < this.piecesNum; i++) {
			var p = this.options.pieces[i].options;
			if (p.player == player) {
				playerPieces.push(this.options.pieces[i]);
			}
		}
		return playerPieces;
	},
	getPiecesByPosition: function(x, y) {
		var posPieces = new Array();
		for (var i = 0; i < this.piecesNum; i++) {
			var p = this.options.pieces[i].options;
			if (p.positionX == x && p.positionY == y && p.state == "isOnBoard") {
				posPieces.push(this.options.pieces[i]);
			}
		}
		return posPieces;	
	},
	// searchcrit is an object that may includes search criteria. By default, searches for criteria using AND.
	// searchcrit = {
	//	player: <id>,
	//	piecestate: <piece state>
	//}
	// if you want the criterion to match multiple values, pass an array instead of a single value.
	getPieces: function(searchcrit) {
		var resPieces = new Array();
		for (var i = 0; i < this.piecesNum; i++) {
			var p = this.options.pieces[i].options;	
			// build criteria
			var criteria = true;
			
			if (typeof searchcrit.player != "undefined") {
				if (typeof searchcrit.player == "object") {
					var subcriteria = false;
					for (var j = 0; j < searchcrit.player.length; j++) {
						subcriteria = subcriteria || (searchcrit.player[j] == p.player);
					}
					criteria = criteria && subcriteria;
				} else if (typeof searchcrit.player == "number") {
					criteria = criteria && (searchcrit.player == p.player);
				}
			}
			if (typeof searchcrit.piecestate != "undefined") {
				if (typeof searchcrit.piecestate == "object") {
					var subcriteria = false;
					for (var j = 0; j < searchcrit.piecestate.length; j++) {
						subcriteria = subcriteria || (searchcrit.piecestate[j] == p.state);
					}
					criteria = criteria && subcriteria;
				} else if (typeof searchcrit.piecestate == "string") {
					criteria = criteria && (searchcrit.piecestate == p.state);
				}
			}
			if (criteria) {
				resPieces.push(this.options.pieces[i]);
			}
		}
		return resPieces;		
	}
});

/* FUNCTIONS */
/* showThePathPicker 
 * Given an array of ints (paths), have the user choose between them
 */
 // TODO
function showThePathPicker(msg, paths, makeMoveHelperArgs) {
	var buttons = {};
	$.each(paths, function(i, path) {
		var button = {
			click: function () { 
			  $("#buttonoutput").text(path);
			  game.makeMoveHelper(makeMoveHelperArgs[0], makeMoveHelperArgs[1], path);
			},
			icon: ""
		};
		buttons[donburiGame.pathToString(paths[i])] = button;
	});
	$('<div>').simpledialog2({
		mode: 'button',
		dialogForce:true,
		buttonPrompt: msg,
		buttons : buttons
	});
}

/* showThePiecePicker 
 * Given an array of Pieces (pieces), have the user choose between them
 */
 // TODO
function showThePiecePicker(msg, pieces, board) { 
	board = typeof board !== 'undefined' ? board : $("#board");
	var buttons = {};
	$.each(pieces, function(i, piece) {
		var p = pieces[i].options;
		var button = {
			click: function () { 
			  donburiGame.state.pieceToMove = pieces[i];
			  game.piecePickerHelper();
			},
			icon: ""
		};
		var buttonText = "";
		if (p.image != null) {
			buttonText += ("<img src='" + p.image + "' class='button-piece' />");
		} else if (p.color != null) {
			buttonText += ("<div class='button-piece' style='background:" + p.color + "'></div>");
		}
		if (p.type != null) {
			buttonText += p.type;
		}
		if (p.positionX != -1 && p.positionY != -1) {
			buttonText += (" at (" + p.positionX + ", " + p.positionY + ")");
		}
		if (typeof(buttons[buttonText]) == "undefined") {
			buttons[buttonText] = button;
		} else {
			buttons[buttonText + " " + i] = button;
		}
	});

	$('<div>').simpledialog2({
		mode: 'button',
		dialogForce:true,
		buttonPrompt: msg,
		buttons : buttons
	});
}

function showTheSlotPicker(msg, slots, board) { 
	board = typeof board !== 'undefined' ? board : $("#board");
	var buttons = {};
	console.log(slots);
	$.each(slots, function(i, row) {
		var r = slots[i];
		$.each(r, function(j, slot) {
			var s = r[j].options;
			var button = {
				click: function () { 
				  donburiGame.state.slotPicked = r[j];
				  game.slotPickerHelper();
				},
				icon: ""
			};
			var buttonText = "";
			if (s.image != null) {
				buttonText += ("<img src='" + s.image + "' class='button-piece' />");
			} else if (s.color != null) {
				buttonText += ("<div class='button-piece' style='background:" + s.color + "'></div>");
			}
			if (s.type != null) {
				buttonText += s.type;
			}
			if (s.positionX != -1 && s.positionY != -1) {
				var slotX = s.positionX + 1;
				var slotY = s.positionY + 1;
				buttonText += (" at (" + slotX + ", " + slotY + ")");
			}
			if (typeof(buttons[buttonText]) == "undefined") {
				buttons[buttonText] = button;
			} else {
				buttons[buttonText + " " + i] = button;
			}
		});
	});

	$('<div>').simpledialog2({
		mode: 'button',
		dialogForce:true,
		buttonPrompt: msg,
		buttons : buttons
	});
}

function convertToMooToolsPlayers(context) {
	// convert SocialKit players into Player Classes
	var players = new Array();
	for (var i = 0; i < context.players.length; i++) {
		players.push(new Player(null, {
			id: context.players[i].id
		}));
	}
	return players;
}



function convertToMooToolsPieces() {
	// convert data.pieces into Piece Classes
	if (data.pieces.length == 0) {
		return [];
	}
	var pieces = new Array();
	for (var i = 0; i < data.pieces.pieces.length; i++) {
		pieces.push(new Piece(null, {
			id: data.pieces.pieces[i].id,
			image: data.pieces.pieces[i].image,
			player: data.pieces.pieces[i].player,
			type: data.pieces.pieces[i].type,
			positionX: data.pieces.pieces[i].startPositionX,
			positionY: data.pieces.pieces[i].startPositionY,
			state: data.pieces.pieces[i].startState
		}));
	}
	return pieces;
}

function convertToMooToolsBoard() {
	// convert data.board.board into Slot Classes
	var slots = new Array();
	for (var i = 0; i < data.board.board.length; i++) {
		var row = new Array(); //data.board.board[i];
		for (var j = 0; j < data.board.board[i].length; j++) {
			var tile = null;
			var slot;
			if (typeof(data.board.board[i][j].length) == "undefined") { // TODO checks if it's an object. hacky
				tile = data.board.board[i][j];
				slot = new Slot(null, {
					color: tile.color,
					image: tile.image,
					type: tile.type,
					positionX: j,
					positionY: i,
					paths: tile.paths
				});
			} else {
				slot = new Slot(null, {
					positionX: j,
					positionY: i,
				});
			}
			row.push(slot);
		}
		slots.push(row);
	}
	return slots;
}

/* Format: Array of arrays (rows and columns). Each array slot has a JS object that contains 
 * { slot: (true or false), path: (a constant indicating a direction), rules: (format TBD) }
 */
function initBoardPathWithCircuit(slots) {
	var size = slots.length;
	for (var i = 0; i < size; i++) {
		for (var j = 0; j < size; j++) {
			// Create a simple circuit board
			var tile = slots[i][j];
			// if first row or last row
			if (i == 0 || i == (size - 1) || j == 0 || j == (size - 1)) {
				if (i == 0 && j != 0) {
					tile.options.path = DonburiGame.LEFT;
				} else if (j == 0 && i != (size - 1)) {
					tile.options.path = DonburiGame.DOWN;
				} else if (i == (size - 1) && j != (size - 1)) {
					tile.options.path = DonburiGame.RIGHT;
				} else if (j == (size - 1) && i != 0) {
					tile.options.path = DonburiGame.UP;
				}
			}
		}
	}
	return slots;
}