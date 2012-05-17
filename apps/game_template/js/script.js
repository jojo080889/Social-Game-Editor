/* CONSTANTS */
var UP = 0;
var LEFT = 1;
var DOWN = 2;
var RIGHT = 3;
var UP_LEFT = 4;
var DOWN_LEFT = 5;
var DOWN_RIGHT = 6;
var UP_RIGHT = 7;

/* GAME VARIABLES */
var title = "My Donburi Game";
var playerNum = data.players.length;//Math.floor((Math.random()*3) + 2);
var currentPlayer = Math.floor((Math.random()*playerNum)); // 0 to playerNum - 1

var boardState = data.board.board;
var size = boardState.length;//Math.floor((Math.random()*10)+3);
getBoardStateObj();
//var boardState = getBoardStateObj();

var pieces = data.pieces.pieces;
var piecesState = getPiecesStateObj();

$(document).ready(function() {
	// Set title
	$("title").html(title);
	$("header h1").html(title);

	// Create players
	$("#players").append($(generatePlayers(playerNum)));

	// Create board
	$("#board-container").append($(generateGrid(size)));
	adjustGrid(size);
	
	// Set current player
	setCurrentPlayer(currentPlayer);
	
	// Create pieces and place in correct positions
	createPieces();
	
	// Set event handlers
	bindActionHandlers();
	$(document).bind("orientationchange", function() { alert("hi") });
});

/* BOARD */
/* Format: Array of arrays (rows and columns). Each array slot has a JS object that contains 
 * { slot: (true or false), path: (a constant indicating a direction), rules: (format TBD) }
 */
function getBoardStateObj() {
	for (var i = 0; i < size; i++) {
		for (var j = 0; j < size; j++) {
			// Create a simple circuit board
			var tile = boardState[i][j];
			if (typeof(tile) == 'undefined' && tile == null) {
				tile = {};
			}
			// if first row or last row
			if (i == 0 || i == (size - 1) || j == 0 || j == (size - 1)) {
				if (i == 0 && j != 0) {
					tile.path = LEFT;
				} else if (j == 0 && i != (size - 1)) {
					tile.path = DOWN;
				} else if (i == (size - 1) && j != (size - 1)) {
					tile.path = RIGHT;
				} else if (j == (size - 1) && i != 0) {
					tile.path = UP;
				}
			} 
		}
	}
}

function generateGrid(size) {
	var html = "<div id='board'>";
	for (var i = 0; i < size; i++) {
		html += "<div class='row'>";
		for (var j = 0; j < size; j++) {
			var boardSlot = boardState[i][j];
			if (typeof(boardSlot.color) !== 'undefined' && boardSlot.color !== null) {
				html += "<div class='slot' style='background: " + boardSlot.color + "'></div>";
			} else {
				html += "<div class='slot'></div>";
			}
		}
		html += "</div>";
	}
	html += "</div>";
	return html;
}

function adjustGrid(size) {
	// adjust square and board sizes to fit on screen
	var totalWidth = $(window).width();
	var totalHeight = $(window).height() - $("#actions").outerHeight() - 
		$("#players").outerHeight() - $("header h1").outerHeight() - 30; // add some buffer space
	if (totalHeight < totalWidth) {
		totalWidth = totalHeight;
	}
	var maxBoxWidth = Math.floor(totalWidth / size);
	boxWidth = maxBoxWidth - (2 * parseInt($(".slot").css("borderWidth")));
	$(".slot").css("width", boxWidth).css("height", boxWidth);
	
	var boardWidth = maxBoxWidth * size;
	$("#board").css("width", boardWidth).css("height", boardWidth);
}

/* PLAYERS */
function generatePlayers(number) {
	// TODO actually get points
	var pointsExistIndex = Math.floor((Math.random()*2));
	var pointsExist = [true,false][pointsExistIndex];
	console.log(pointsExistIndex);

	var html = "<ul>";
	for (var i = 0; i < number; i++) {
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

function setCurrentPlayer(number) {
	$(".player-status").removeClass("active");
	$($(".player")[number]).find(".player-status").addClass("active");
}

function changeToNextTurn() {
	currentPlayer++;
	if (currentPlayer == playerNum) { currentPlayer = 0; }
	setCurrentPlayer(currentPlayer);
}

/* PIECES */
/* Format: Array of array where outer index corresponds to player number. Array slots contain
 * {x: (x position on board) and y: (y position on board) }
 * TODO move this into app.js
 */
function getPiecesStateObj() {
	var allPieces = new Array();
	for (var i = 0; i < pieces.length; i++) {
		var piece = pieces[i];
		var playerIndex = piece.player;
		var playerPieces = allPieces[playerIndex];
		var mustPush = false;
		if (typeof(playerPieces) == 'undefined' && playerPieces == null) {
			playerPieces = new Array();
			mustPush = true;
		}
		//var x = Math.floor(Math.random()*size); // random position of pieces
		//var y = Math.floor(Math.random()*size);
		var x = 0;
		var y = 0;
		piece.x = x;
		piece.y = y;
		playerPieces.push(piece);
		
		if (mustPush) {
			allPieces[playerIndex] = playerPieces;
		}
	}
	return allPieces;
}

/* Based on pieces state, place pieces on board */
function createPieces() {
	for (var i = 0; i < piecesState.length; i++) {
		/*for (var j = 0; j < piecesState[i].length; j++) {
			var p = piecesState[i][j];
			// find the right slot
			var slot = $($($("#board .row")[p.y]).find(".slot")[p.x]);
			slot.append($("<div class='piece player" + (i + 1) + "' id='piece" + (i + 1) + "'></div>"));
		}*/
		// Only do first piece for each player
		var p = piecesState[i][0];
		var slot = $($($("#board .row")[p.y]).find(".slot")[p.x]);
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
}

/* ACTIONS */
function bindActionHandlers() {
	$("#roll_move").click(startTurn);
	
	$("#skip_turn").click(function() {
		changeToNextTurn();
	});
}

function startTurn() {
	// get piece of current player
	var pieceDiv = $("#piece" + (currentPlayer + 1));
	var pieceState = piecesState[currentPlayer];

	// pick random number
	// TODO: Display on screen
	// TODO: make flexible with different kinds of dice
	var diceResult = Math.floor((Math.random()*6) + 1); // 1 through 6
	$("#move-result-num").html(diceResult);
	$("#move-result").show("fast").delay(1000).hide("fast", function() {
		makeMove(pieceDiv, pieceState[0], diceResult);
	});
}

function makeMove(pieceDiv, position, moveCount) {
	// TODO: handle multiple pieces
	var curX = position.x;
	var curY = position.y;
	
	if (moveCount == 0) {
		piecesState[currentPlayer][0].x = curX;
		piecesState[currentPlayer][0].y = curY;	
		// Change turn to next player
		changeToNextTurn();
		return;
	}
	
	var sourceSlot = $($($("#board .row")[curY]).find(".slot")[curX]);

	// get path of current square
	var path = boardState[curY][curX].path; // row first
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

	var destSlot = $($($("#board .row")[curY]).find(".slot")[curX]);
	position.x = curX;
	position.y = curY;
	sourceSlot.addClass("slot-moving");
	pieceDiv.addClass("piece-moving")
	.animate(moveObj, 1000, function() { 
		$(this).css({top: 0, left: 0}).removeClass("piece-moving").appendTo(destSlot);
		sourceSlot.removeClass("slot-moving");
		makeMove(pieceDiv, position, moveCount - 1);
	});
}