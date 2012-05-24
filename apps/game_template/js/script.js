/* GAME VARIABLES */
var game;

$("#container").live("pageinit", function() {
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
					positionY: i
				});
			} else {
				slot = new Slot(null, {
					positionX: j,
					positionY: i
				});
			}
			row.push(slot);
		}
		slots.push(row);
	}
	// TODO replace this later. For now, set up circuit path around board.
	slots = initBoardPath(slots);
		
	game = new Game(null, {
		title: "My Donburi Game",
		players: new PlayerList(null, {players: players}),
		board: new Board(null, {slots: slots}),
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


/* Format: Array of arrays (rows and columns). Each array slot has a JS object that contains 
 * { slot: (true or false), path: (a constant indicating a direction), rules: (format TBD) }
 */
function initBoardPath(slots) {
	var size = slots.length;
	for (var i = 0; i < size; i++) {
		for (var j = 0; j < size; j++) {
			// Create a simple circuit board
			var tile = slots[i][j];
			// if first row or last row
			if (i == 0 || i == (size - 1) || j == 0 || j == (size - 1)) {
				if (i == 0 && j != 0) {
					tile.options.path = Path.LEFT;
				} else if (j == 0 && i != (size - 1)) {
					tile.options.path = Path.DOWN;
				} else if (i == (size - 1) && j != (size - 1)) {
					tile.options.path = Path.RIGHT;
				} else if (j == (size - 1) && i != 0) {
					tile.options.path = Path.UP;
				}
			}
		}
	}
	return slots;
}
