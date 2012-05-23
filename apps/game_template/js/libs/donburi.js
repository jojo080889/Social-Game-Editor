/* CONSTANTS */
var UP = 0;
var LEFT = 1;
var DOWN = 2;
var RIGHT = 3;
var UP_LEFT = 4;
var DOWN_LEFT = 5;
var DOWN_RIGHT = 6;
var UP_RIGHT = 7;

/* Game Class
 * Master class that controls game state.
 */
var Game = new Class({
	Implements: [Options, Events],
	options: {
		title: "title here",
		players: null,
		board: null,
		pieces: null
	},
	jQuery: 'game', //namespace for new jquery method
	initialize: function(selector, options) {
		this.setOptions(options);
		
		this.playerNum = this.options.players.playerNum;
		this.currentPlayer = Math.floor((Math.random()*this.playerNum)); // 0 to playerNum - 1
		
		this.render();
	},
	render: function() {
		this.fireEvent('start');
		// Set title
		$("title").html(this.options.title);
		$("header h1").html(this.options.title);

		// Create players
		this.options.players.render();
		this.renderCurrentPlayer(this.currentPlayer);

		// Create board
		this.options.board.render();
		
		// Create pieces and place in correct positions
		this.options.pieces.render();
		
		// Set event handlers
		this.bindActionHandlers();
		//$(document).bind("orientationchange", function() { alert("hi") });
	},
	setTitle: function(newTitle) {
		this.options.title = newTitle;
	},
	
	/* PLAYERS */
	renderCurrentPlayer: function(number) {
		$(".player-status").removeClass("active");
		$($(".player")[number]).find(".player-status").addClass("active");
	},
	changeToNextTurn: function() {
		this.fireEvent('turnStart');
		this.currentPlayer++;
		if (this.currentPlayer == this.playerNum) { this.currentPlayer = 0; }
		this.renderCurrentPlayer(this.currentPlayer);
	},

	/* ACTIONS */
	bindActionHandlers: function() {
		var self = this;
		$("#roll_move").click(function() {
			self.startTurn();
		});
		
		$("#skip_turn").click(function() {
			self.changeToNextTurn();
		});
	},
	
	/* GAME */
	startTurn: function() {
		var self = this;
		// get piece of current player
		var pieceDiv = $("#piece" + (this.currentPlayer + 1));
		var piece = this.options.pieces.getPiecesByPlayerID(this.currentPlayer)[0];

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
	makeMove: function(pieceDiv, piece, moveCount) {
		// TODO: handle multiple pieces
		var curX = piece.options.positionX;
		var curY = piece.options.positionY;
		
		if (moveCount == 0) {
			piece.options.positionX = curX;
			piece.options.positionY = curY;
			this.fireEvent('moveEnd');
			this.fireEvent('turnEnd');
			// Change turn to next player
			this.changeToNextTurn();
			return;
		}
		
		var sourceSlot = $($($("#board .row")[curY]).find(".slot")[curX]);

		// get path of current square
		var path = this.options.board.slots[curY][curX].path; // row first
		var verDistance = sourceSlot.outerHeight();
		var horDistance = sourceSlot.outerWidth();
		var moveObj = {top: 0, left: 0};
		
		// update position
		if (path == RIGHT || path == UP_RIGHT || path == DOWN_RIGHT) {
			curX++;
			moveObj.left = horDistance + "px";
		}
		if (path == LEFT || path == UP_LEFT || path == DOWN_LEFT) {
			curX--;
			moveObj.left = "-" + horDistance + "px";
		}
		if (path == DOWN || path == DOWN_LEFT || path == DOWN_RIGHT) {
			curY++;
			moveObj.top = verDistance + "px";
		}
		if (path == UP || path == UP_LEFT || path == UP_RIGHT) {
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
	getPlayerById: function(players, id) {
		for (var i = 0; i < players.length; i++) {
			var curID = players[i].getID();
			if (id == curID) {
				return players[i];
			}
		}
		return null;
	}
});

/* Player Class
 * Class represents each player
 */
var Player = new Class({
	Implements: [Options, Events],
	options: {
		id: -1,
		pointsAmt: 0,
		pieces: null,
		state: "playing" //"playing" | "won" | "lost"
	},
	jQuery: 'player', //namespace for new jquery method
	initialize: function(selector, options) {
		this.setOptions(options);
	},
	piecesOnBoard: function() {
	
	},
	showPiecePicker: function() {
	
	},
	getID: function() {
		return this.options.id;
	}
});

/* Piece Class
 * Class represents a game piece
 */
var Piece = new Class({
	Implements: [Options, Events],
	options: {
		player: null, // ref to a player object
		state: "isOffBoard", // "isOnBoard" | "isOnBoard" | "isPermOffBoard"
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
	getPlayer: function() {
	
	},
	setPlayer: function() {
	
	},
	removeFromBoard: function(permanently) {
	
	},
	addToBoard: function(positionX, positionY) {
	
	},
	getPosition: function() {
	
	},
	setPosition: function(positionX, positionY) {
	
	},
	isOnBoard: function() {
	
	}
});

/* Board Class
 * Class represents the game board
 */
var Board = new Class({
	Implements: [Options, Events],
	options: {
		tiles: null // Array of Array of objects representing tile appearance
	},
	jQuery: 'board', //namespace for new jquery method
	initialize: function(selector, options) {
		this.setOptions(options);
		this.size = this.options.tiles.length; // TODO Assumes a square
		this.slots = this.initBoardSlots(); //Array of Array of Slot Objects
		
		// set up path
		this.initBoardPath();
	},
	
	/* UI */
	render: function (){
		$("#board-container").append($(this.generateGrid()));
		this.adjustGrid();
	},
	
	/* Event Handlers */
	// master event functions that execute on EVERY
	// slot land/leave/pass.
	onLand: function() {
	
	},
	onLeave: function() {
	
	},
	onPass: function() {
	
	},
	
	/* Utility */
	initBoardSlots: function() {
		var slots = [];
		for (var i = 0; i < this.size; i++) {
			var row = new Array();
			for (var j = 0; j < this.size; j++) {
				row.push(null);
			}
			slots.push(row);
		}
		return slots;
	},
	/* Format: Array of arrays (rows and columns). Each array slot has a JS object that contains 
	 * { slot: (true or false), path: (a constant indicating a direction), rules: (format TBD) }
	 */
	initBoardPath: function() {
		for (var i = 0; i < this.size; i++) {
			for (var j = 0; j < this.size; j++) {
				// Create a simple circuit board
				var tile = this.slots[i][j];
				if (typeof(tile) == 'undefined' || tile == null) {
					tile = {};
				}
				// if first row or last row
				if (i == 0 || i == (this.size - 1) || j == 0 || j == (this.size - 1)) {
					if (i == 0 && j != 0) {
						tile.path = LEFT;
					} else if (j == 0 && i != (this.size - 1)) {
						tile.path = DOWN;
					} else if (i == (this.size - 1) && j != (this.size - 1)) {
						tile.path = RIGHT;
					} else if (j == (this.size - 1) && i != 0) {
						tile.path = UP;
					}
				}
				this.slots[i][j] = tile;
			}
		}
	},
	generateGrid: function() {
		var html = "<div id='board'>";
		for (var i = 0; i < this.size; i++) {
			html += "<div class='row'>";
			for (var j = 0; j < this.size; j++) {
				var boardTile = this.options.tiles[i][j];
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
			var p = this.options.pieces[i].options;
			var slot = $($($("#board .row")[p.positionY]).find(".slot")[p.positionX]);
			var piece;
			if (typeof(p.color) == undefined || p.color == null) {
				// the piece is an image
				piece = $("<div class='piece imagePiece' id='piece" + (i + 1) + "'><img src='" + p.image + "' /></div>");
			} else {
				// the piece is just a color
				piece = $("<div class='piece colorPiece' id='piece" + (i + 1) + "' style='background: " + p.color + "'></div>");
			}
			slot.append(piece);
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
	}
});