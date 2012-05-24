/* PATH CONSTANTS */
var Path = {};
Path.UP = 0;
Path.LEFT = 1;
Path.DOWN = 2;
Path.RIGHT = 3;
Path.UP_LEFT = 4;
Path.DOWN_LEFT = 5;
Path.DOWN_RIGHT = 6;
Path.UP_RIGHT = 7;

/* Game Class
 * Master class that controls game state.
 */
var Game = new Class({
	Implements: [Options, Events],
	options: {
		title: "title here",
		players: null,
		board: null,
		pieces: null,
		usePoints: false, // if true, use points
		rollMin: 1,
		rollMax: 6
	},
	jQuery: 'game', //namespace for new jquery method
	initialize: function(selector, options) {
		this.setOptions(options);
		
		this.playerNum = this.options.players.playerNum;
		
		// Set up current turn state tracker
		this.current = {
			player: Math.floor((Math.random()*this.playerNum)), // 0 to playerNum - 1
			moveCount: null,
			pieceToMove: null,
			moveType: null
		};
		
		this.render();
	},
	
	/* UI */
	render: function() {
		// Set title
		$("title").html(this.options.title);
		$("header h1").html(this.options.title);

		// Create players
		this.options.players.render();
		this.renderCurrentPlayer(this.current.player);

		// Create board
		this.options.board.render();
		
		// Create pieces and place in correct positions
		this.options.pieces.render();
		
		// Set event handlers
		this.bindActionHandlers();
		
		// Start Game
		this.start();
	},
	
	/* Events */
	onStart: function() {
	},
	onTurnStart: function(player) {
	},
	onMoveStart: function(player) {
	},
	onMoveEnd: function(player) {
	},
	onTurnEnd: function(player) {
	},
	onEnd: function() {
	},
	
	/* Utility */
	setTitle: function(newTitle) {
		this.options.title = newTitle;
	},
	getPlayerById: function(players, id) {
		for (var i = 0; i < players.length; i++) {
			var curID = players[i].getID();
			if (id == curID) {
				return players[i];
			}
		}
		return null;
	},
	
	/* PLAYERS */
	renderCurrentPlayer: function(number) {
		$(".player-status").removeClass("active");
		$($(".player")[number]).find(".player-status").addClass("active");
	},

	/* ACTIONS */
	bindActionHandlers: function() {
		var self = this;
		$("#roll_move").click(function() {
			self.moveStart();
		});
		
		$("#skip_turn").click(function() {
			self.changeToNextTurn();
		});
	},
	
	/* GAME */
	start: function() {
		this.fireEvent('start');
		this.fireEvent('turnStart'); // first player's turn start
	},
	end: function() {
		this.fireEvent('end');
	},
	changeToNextTurn: function() {
		this.fireEvent('turnEnd');
		this.current.player++;
		if (this.current.player == this.playerNum) { this.current.player = 0; }
		this.renderCurrentPlayer(this.current.player);
		this.fireEvent('turnStart');
	},
	moveStart: function() {
		var self = this;
		// get piece of current player
		var pieceDiv = $("#piece" + (this.current.player + 1));
		var piece = this.options.pieces.getPiecesByPlayerID(this.current.player)[0];

		// pick random number
		// TODO: Display on screen
		// TODO: make flexible with different kinds of dice
		var diceResult = Math.floor((Math.random()*6) + 1); // 1 through 6
		$("#move-result-num").html(diceResult);
		$("#move-result").show("fast").delay(1000).hide("fast", 
		function() {
			self.fireEvent('moveStart');
			self.makeMove(pieceDiv, piece, diceResult);
		});
	},
	move: function() {
	
	},
	decideMove: function() {
	
	},
	makeMove: function(pieceDiv, piece, moveCount) {
		// TODO: handle multiple pieces
		var curX = piece.options.positionX;
		var curY = piece.options.positionY;
		
		if (moveCount == 0) {
			piece.options.positionX = curX;
			piece.options.positionY = curY;
			this.fireEvent('moveEnd');
			// Change turn to next player
			this.changeToNextTurn();
			return;
		}
		
		var sourceSlot = $($($("#board .row")[curY]).find(".slot")[curX]);

		// get path of current square
		var path = this.options.board.options.slots[curY][curX].options.path; // row first
		var verDistance = sourceSlot.outerHeight();
		var horDistance = sourceSlot.outerWidth();
		var moveObj = {top: 0, left: 0};
		
		// update position
		if (path == Path.RIGHT || path == Path.UP_RIGHT || path == Path.DOWN_RIGHT) {
			curX++;
			moveObj.left = horDistance + "px";
		}
		if (path == Path.LEFT || path == Path.UP_LEFT || path == Path.DOWN_LEFT) {
			curX--;
			moveObj.left = "-" + horDistance + "px";
		}
		if (path == Path.DOWN || path == Path.DOWN_LEFT || path == Path.DOWN_RIGHT) {
			curY++;
			moveObj.top = verDistance + "px";
		}
		if (path == Path.UP || path == Path.UP_LEFT || path == Path.UP_RIGHT) {
			curY--;
			moveObj.top = "-" + verDistance + "px";
		}
		console.log("roll:" + moveCount + ", path:" + path + ", position:" + curX + " " + curY + ", move:" + moveObj.left + " " + moveObj.top);

		var self = this;
		var destSlot = $($($("#board .row")[curY]).find(".slot")[curX]);
		piece.options.positionX = curX;
		piece.options.positionY = curY;
		sourceSlot.addClass("slot-moving");
		pieceDiv.addClass("piece-moving")
		.animate(moveObj, 1000, function() { 
			$(this).css({top: 0, left: 0}).removeClass("piece-moving").appendTo(destSlot);
			sourceSlot.removeClass("slot-moving");
			self.makeMove(pieceDiv, piece, moveCount - 1);
		});
	},
	moveEnd: function() {
	
	},
	turnEnd: function() {
	
	},
	turnSetSkip: function(player, n) {
	
	},
	turnSetAnother: function(player, n) {
	
	},
	// Should these following events be in Slot?
	disableLeaveEvent: function(slot, howLong) {
	
	},
	disableLandEvent: function(slot, howLong) {
	
	},
	enableLeaveEvent: function(slot, howLong) {
	
	},
	enableLandEvent: function(slot, howLong) {
	
	},
	undoTurn: function(n) {
	
	},
	showChoice: function(msg, choices) {
	
	},
	getActivePlayerCount: function() { // move to PlayerList?
	
	}
});

/* Player Class
 * Class represents each player
 */
var Player = new Class({
	Implements: [Options, Events],
	options: {
		id: -1,
		state: "playing" //"playing" | "won" | "lost"
	},
	jQuery: 'player', //namespace for new jquery method
	initialize: function(selector, options) {
		this.setOptions(options);
		this.pointsAmt = 0;
	},
	piecesOnBoard: function() {
	
	},
	showPiecePicker: function(types) {
		showThePiecePicker("Choose which piece to move");
	},
	getID: function() {
		return this.options.id;
	},
	getState: function() {
		return this.options.state;
	},
	setState: function(state) {
		if (state == "playing" || state == "won" || state == "lost") {
			this.options.state = state;
		}
	}
});

/* Piece Class
 * Class represents a game piece
 */
var Piece = new Class({
	Implements: [Options, Events],
	options: {
		player: null, // ID of player object
		state: "isOffBoard", // "isOffBoard" | "isOnBoard" | "isPermOffBoard"
		positionX: -1,
		positionY: -1,
		validMoves: "followPath", //TODO extend this
		image: null,
		color: null,
		type: null
	},
	jQuery: 'piece', //namespace for new jquery method
	initialize: function(selector, options) {
		this.setOptions(options);
	},
	
	/* UI */
	render: function() {
		var p = this.options;
		this.pieceDiv;
		if (typeof(p.color) == undefined || p.color == null) {
			// the piece is an image
			this.pieceDiv = $("<div class='piece imagePiece' id='piece" + (i + 1) + "'><img src='" + p.image + "' /></div>");
		} else {
			// the piece is just a color
			this.pieceDiv = $("<div class='piece colorPiece' id='piece" + (i + 1) + "' style='background: " + p.color + "'></div>");
		}
		return this.pieceDiv;
	},
	
	/* Utility */
	getPlayer: function() {
		return game.options.players.getPlayerByID(this.options.player);
	},
	setPlayer: function(newID) {
		this.options.player = newID;
	},
	removeFromBoard: function(permanently) {
		permanently = typeof permanently !== 'undefined' ? permanently : false;
		
		this.pieceDiv.remove();
		
		permanently ? this.options.state = "isPermOffBoard" : this.options.state = "isOffBoard";
	},
	addToBoard: function(positionX, positionY) {
		var p = this.options;
		positionX = typeof positionX !== 'undefined' ? positionX : p.positionX;
		positionY = typeof positionY !== 'undefined' ? positionY : p.positionY;
		
		this.render();
		var slotDiv = $($($("#board .row")[positionY]).find(".slot")[positionX]);
		slotDiv.append(this.pieceDiv);
		this.options.state = "isOnBoard";
	},
	getPositionX: function() {
		return this.options.positionX;
	},
	getPositionY: function() {
		return this.options.positionY;
	},
	setPosition: function(positionX, positionY) {
		this.options.positionX = positionX;
		this.options.positionY = positionY;
	},
	isOnBoard: function() {
		return (this.options.state == "isOnBoard")
	}
});

/* Slot Class 
 * Represents a single slot on the board.
 */
var Slot = new Class({
	Implements: [Options, Events],
	options: {
		path: null,
		type: "",
		color: null,
		image: null,
		positionX: -1,
		positionY: -1,
		pieces: null // Array of Pieces currently in the slot
	},
	jQuery: 'slot',
	initialize: function(selector, options) {
		this.setOptions(options);
	},
	
	/* UI */
	render: function() {
	
	},
	
	/* Events */
	onLand: function(piece, eventType) {
	
	},
	onLeave: function(piece, eventType) {
	
	},
	onPass: function(piece, eventType) {
	
	},
	
	/* Utility */
	getPath: function() {
		return this.options.path;
	},
	setPath: function(newPath) {
		this.options.path = newPath;
	},
	getPieces: function() {
		return game.options.pieces.getPiecesByPosition(this.options.positionX, this.options.positionY);
	},
	showPathPicker: function() {
		showThePathPicker("Choose where to move next:");
	},
	showPiecePicker: function(types) {
		showThePiecePicker("Choose which piece to move");
	}
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
		$("#board-container").append($(this.generateGrid()));
		this.adjustGrid();
	},
	
	/* Event Handlers */
	// master event functions that execute on EVERY
	// slot land/leave/pass.
	onLand: function(slot, piece, eventType) {
	
	},
	onLeave: function(slot, piece, eventType) {
	
	},
	onPass: function(slot, piece, eventType) {
	
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
	},
	
	/* UI */
	render: function (){
		$("#players").append($(this.generatePlayers()));
	},
	generatePlayers: function() {
		// TODO actually get points
		var pointsExistIndex = Math.floor((Math.random()*2));
		var pointsExist = [true,false][pointsExistIndex];
		console.log(pointsExistIndex);

		var html = "<ul>";
		for (var i = 0; i < this.playerNum; i++) {
			html += "<li class='player'>";
			html += "<p><span class='player" + (i + 1) + "'></span>Player " + (i+1) + "</p>";
			
			// Check if there are points, and set points
			if (pointsExist) {
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
		for (var i = 0; i < this.piecesNum; i++) {
			// Only do first piece for each player
			var piece = this.options.pieces[i];
			piece.addToBoard();
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
			if (p.positionX == x && p.positionY == y) {
				posPieces.push(this.options.pieces[i]);
			}
		}
		return posPieces;	
	}
});

/* FUNCTIONS */
/* showThePathPicker 
 * Given an array of ints (paths), have the user choose between them
 */
 // TODO
function showThePathPicker(msg, paths) { 
	$('<div>').simpledialog2({
		mode: 'button',
		headerText: msg,
		headerClose: true, 
		dialogForce:true,
		buttonPrompt: 'Please Choose One',
		buttons : {
		  'OK': {
			click: function () { 
			  $('#buttonoutput').text('OK');
			}
		  },
		  'Cancel': {
			click: function () { 
			  $('#buttonoutput').text('Cancel');
			},
			icon: "delete",
			theme: "c"
		  }
		}
	});
}

/* showThePiecePicker 
 * Given an array of Pieces (pieces), have the user choose between them
 */
 // TODO
function showThePiecePicker(msg, pieces) { 
	$('<div>').simpledialog2({
		mode: 'button',
		headerText: msg,
		headerClose: true, 
		dialogForce:true,
		buttonPrompt: 'Please Choose One',
		buttons : {
		  'OK': {
			click: function () { 
			  $('#buttonoutput').text('OK');
			}
		  },
		  'Cancel': {
			click: function () { 
			  $('#buttonoutput').text('Cancel');
			},
			icon: "delete",
			theme: "c"
		  }
		}
	});
}