/* Initial Values */
// TODO: read from database/localstorage instead
var players = [
	{id: 0},
	{id: 1}
];

var pieceTypes = [
	{name: "king", image: "images/pieces/2.png"},
	{name: "queen", image: "images/pieces/1.png"},
	{name: "knight", image: "images/pieces/3.png"},
	{name: "pawn", image: "images/pieces/4.png"},
	{name: "colorPiece", color: "yellow"}
];

var pieces = [];

var tileTypes = [
	{name: "yellow", color: "yellow"},
	{name: "blue", color: "blue"},
	{name: "green", color: "green"},
	{name: "red", color: "red"}
]

/* App JS */
/* Will soon be replaced with Backbone */
$(document).ready(function() {
	/* Pieces */
	$("#pieceTypeListContainer .scrollLeft").click(function() {
		// TODO check for constraints
		var curLeft = parseInt($("#pieceTypeList").css("left"));
		$("#pieceTypeList").css("left", (curLeft - 30) + "px");
	});
	$("#pieceTypeListContainer .scrollRight").click(function() {
		var curLeft = parseInt($("#pieceTypeList").css("left"));
		$("#pieceTypeList").css("left", (curLeft + 30) + "px");
	});

	/* Tabs */
	var $items = $('#vtab>ul>li');
	$items.click(function() {
		$items.removeClass('selected');
		$(this).addClass('selected');

		var index = $items.index($(this));
		$('#vtab>div').hide().eq(index).show();
	}).eq(0).click();			// sets default tab
	
	/* Mode Switch */
	$("#mode_switch #test").click(function() {
		$("#vtab").hide();
		$("#test_tab").show();
		$("#mode_switch .mode_button").removeClass("selected");
		$(this).addClass("selected");
	});
	$("#mode_switch #edit").click(function() {
		$("#vtab").show();
		$("#test_tab").hide();
		$("#mode_switch .mode_button").removeClass("selected");
		$(this).addClass("selected");
	});
	
	/* Dialogs */
	// initially open and close them to hide the initial div
	$( "#dialog-tileTypeDelete" ).dialog('open');
	$( "#dialog-tileTypeDelete" ).dialog('close');
	$( "#dialog-pieceTypeDelete" ).dialog('open');
	$( "#dialog-pieceTypeDelete" ).dialog('close');
});

function changeGridSize() {
	var numX = $('#numX').val(); 
	var numY = $('#numY').val(); 
	if (numX == "") numX = 1;
	if (numY == "") numY = 1;
	var tilesArea = $('#slotsArea');
	tilesArea.empty();
	for (var i = 0; i < numY; i++) {
		tilesArea.append("<div style='display: block; width: 800px'>")
		for (var j = 0; j < numX; j++) {
			jQuery('<div/>', {
				class: 'slot droppable ui-widget-header',
				html: ''
			}).appendTo(tilesArea);
		}
		tilesArea.append("</div>");
	}
	initDroppable();
}

function convertValuesToSingleJSON() {
	var data = {};
	data.players = getPlayerJSON();
	data.pieces = getPiecesJSON();
	data.board = getBoardJSON();
	return data;
}

function getPlayerJSON() {
	return players;
}
function getPiecesJSON() {
	var pieces = JSON.parse(localStorage.PieceList);
	var piecesArray = new Array();
	for (var key in pieces) {
		if (pieces.hasOwnProperty(key)) {
			var obj = {};
			obj.player = pieces[key].player;
			var pieceInfo = getPieceTypeInfo(pieces[key].type);
			if (typeof(pieceInfo.color) != "undefined") {
				obj.color = pieceInfo.color;
			} else {
				obj.image = pieceInfo.image;
			}
			piecesArray.push(obj);
		}
	}
	return {"pieces": piecesArray};
}
function getBoardJSON() {
	// Create holder array for board
	var sizeX = boardEditView.boardView.options.sizeX;
	var sizeY = boardEditView.boardView.options.sizeY;
	
	var board = new Array();
	for (var i = 0; i < sizeX; i++) {
		var row = new Array();
		for (var j = 0; j < sizeY; j++) {
			var tile = {};
			row.push(tile);
		}
		board.push(row);
	}
	
	// Iterate through tiles and place correctly
	tileList.each(function(tile) {
		var obj = {};
		obj.paths = tile.paths;
		
		var tileInfo = getTileTypeInfo(tile.get("type"));
		if (typeof(tileInfo.color) != "undefined" || tileInfo.color == null) {
			obj.color = tileInfo.color;
		} else {
			obj.image = tileInfo.image;
		}
		
		var pos = tile.get("position");
		board[pos.x][pos.y] = obj;
	});
	
	return {"board": board};
}

function getPieceTypeInfo(pieceType) {
	for (var key in pieceTypes) {
		if (pieceTypes.hasOwnProperty(key)) {
			if (pieceTypes[key].name == pieceType) {
				return pieceTypes[key];
			}
		}
	}
	return null;
}

function getTileTypeInfo(tileType) {
	for (var key in tileTypes) {
		if (tileTypes.hasOwnProperty(key)) {
			if (tileTypes[key].name == tileType) {
				return tileTypes[key];
			}
		}
	}
	return null;
}

function createGameModelsFile(successCallback) {
	var dataString = JSON.stringify(convertValuesToSingleJSON());
	$.post(
		'scripts/export_game.php',
		{
			data: dataString
		},
		function(data) {
			console.log(data);
			successCallback();
		},
		"text"
	);
}
