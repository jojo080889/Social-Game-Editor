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
var size = Math.floor((Math.random()*10)+3);
var playerNum = Math.floor((Math.random()*3) + 2);
var boardState = getBoardStateObj();
var piecesState = getPiecesStateObj();

$(document).ready(function() {
	// Set title
	$("title").html(title);
	$("header h1").html(title);

	// Create board
	$("#board-container").append($(generateGrid(size)));
	adjustGrid(size);
	
	// Create players
	$("#players").append($(generatePlayers(playerNum)));
	
	// Set current player
	var currentPlayer = Math.floor((Math.random()*playerNum));
	setCurrentPlayer(currentPlayer);
	
	// Create pieces and place in correct positions
	createPieces();
});

/* BOARD */
/* TODO: change this to the actual board state
 * Format: Array of arrays (rows and columns). Each array slot has a JS object that contains 
 * { slot: (true or false), path: (a constant indicating a direction), rules: (format TBD) }
 */
function getBoardStateObj() {
	// Create board state object
	var boardState = new Array();
	for (var i = 0; i < size; i++) {
		var row = new Array();
		for (var j = 0; j < size; j++) {
			// Create a simple circuit board
			var tile = {};
			// if first row or last row
			if (i == 0 || i == (size - 1) || j == 0 || j == (size - 1)) {
				tile.slot == true;
				if (i == 0 && j != 0) {
					tile.path = LEFT;
				} else if (j == 0 && i != (size - 1)) {
					tile.path = DOWN;
				} else if (i == (size - 1) && j != (size - 1)) {
					tile.path = RIGHT;
				} else if (j == (size - 1) && i != 0) {
					tile.path = UP;
				}
			} else {
				tile.slot == false;
			}
			row.push(tile);
		}
		boardState.push(row);
	}
	return boardState;
}

function generateGrid(size) {
	var html = "<div id='board'>";
	for (var i = 0; i < size; i++) {
		html += "<div class='row'>";
		for (var j = 0; j < size; j++) {
			html += "<div class='slot'></div>";
		}
		html += "</div>";
	}
	html += "</div>";
	return html;
}

function adjustGrid(size) {
	// adjust square and board sizes to fit on screen
	var maxBoxWidth = Math.floor($("#main #board-container").width() / size);
	boxWidth = maxBoxWidth - (2 * parseInt($(".slot").css("borderWidth")));
	$(".slot").css("width", boxWidth).css("height", boxWidth);
	
	var boardWidth = maxBoxWidth * size;
	$("#board").css("width", boardWidth).css("height", boardWidth);
}

/* PLAYERS */
function generatePlayers(number) {
	var pointsExistIndex = Math.floor((Math.random()*2));
	var pointsExist = [true,false][pointsExistIndex];
	console.log(pointsExistIndex);

	var html = "<ul>";
	for (var i = 0; i < number; i++) {
		html += "<li class='player'>";
		html += "<p>Player " + (i+1) + "</p>";
		
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

/* PIECES */
/* TODO: get real pieces state
 * Format: Array of array where outer index corresponds to player number. Array slots contain
 * {x: (x position on board) and y: (y position on board) }
 */
function getPiecesStateObj() {
	// randomly pick squares for pieces to exist
	var piecesState = new Array();
	for (var i = 0; i < playerNum; i++) {
		var pieces = new Array();
		var x = Math.floor(Math.random()*size);
		var y = Math.floor(Math.random()*size);
		var piece = {};
		piece.x = x;
		piece.y = y;
		pieces.push(piece);
		piecesState.push(pieces);
	}
	return piecesState;
}

/* Based on pieces state, place pieces on board */
function createPieces() {
	for (var i = 0; i < piecesState.length; i++) {
		for (var j = 0; j < piecesState[i].length; j++) {
			var p = piecesState[i][j];
			// find the right slot
			var slot = $($($("#board .row")[p.y]).find(".slot")[p.x]);
			slot.append($("<div class='piece' id='piece" + (i + 1) + "'></div>"));
		}
	}
}