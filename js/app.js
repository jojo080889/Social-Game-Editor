/* Initial Values */
// TODO: read from database/localstorage instead
var players = [
	{id: 0},
	{id: 1}
];

var pieceTypes = [
	{name: "yellow", image: "images/pieces/yellow.png"},
	{name: "blue", image: "images/pieces/blue.png"},
	{name: "green", image: "images/pieces/green.png"},
	{name: "red", image: "images/pieces/red.png"},
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
	$("#mode_switch #test").click(switchTest);
	$("#mode_switch #edit").click(function() {
		$("#vtab").show();
		$("#test_tab").hide();
		$("#mode_switch .mode_button").removeClass("selected");
		$(this).addClass("selected");
	});
	
	/* Dialogs */
	$("#new_pieceTypeColor").miniColors({readonly: true});
	$("#new_tileTypeColor").miniColors({readonly: true});
	
	/* Testing */
	$("#app_launch").click(function() {
		createGameModelsFile(function() {launch("game_template");}); // generate components.js
	});
	$("#return_feed").click(function() {
		var user = {name: "User 1", id: 0};
		env.startInstance('view0', user, feed, "edu.stanford.mobisocial.dungbeetle");
		user = {name: "User 2", id: 1};
		env.startInstance('view1', user, feed, "edu.stanford.mobisocial.dungbeetle");
	});
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
	var players = JSON.parse(localStorage.PlayerList);
	var playersArray = new Array();
	for (var key in players) {
		if (players.hasOwnProperty(key)) {
			var obj = {};
			obj.id = players[key].id;
			playersArray.push(obj);
		}
	}
	return playersArray;
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
	var sizeX = boardEditView.boardView.model.get("sizeX");
	var sizeY = boardEditView.boardView.model.get("sizeY");
	
	var board = new Array();
	for (var i = 0; i < sizeY; i++) {
		var row = new Array();
		for (var j = 0; j < sizeX; j++) {
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
		
		var posX = tile.get("positionX");
		var posY = tile.get("positionY");
		board[posY][posX] = obj;
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

/* TESTING TAB
 */

var env;
var feed;
var test_user_count = 0;

function switchTest() {
	$("#vtab").hide();
	$("#test_tab").show();
	$("#mode_switch .mode_button").removeClass("selected");
	$(this).addClass("selected");
		
 	env = new Musubi.Browser.Environment(new Musubi.Browser.InterFrameTransport('test'));
	feed = {name: "Test", uri: "", session: "test", key: ""};

	$("#devices").empty();
	test_user_count = 0;
	var playerNum = getPlayerJSON().length;
	for (var i = 0; i < playerNum; i++) {
		addUser();
	}
}
 
function addUser() {
	var frame = 'view' + test_user_count;
	var user = {name: "User " + (test_user_count + 1), id: test_user_count};
	test_user_count++;

	$("#devices").append('<div class="device" id="device' + (test_user_count + 1) + '"><iframe name="' + frame + '"></iframe></div>');
	env.startInstance(frame, user, feed, 'edu.stanford.mobisocial.dungbeetle');
}
		
function launch(appId) {
	var user = {name: "User 1", id: 0};
	env.startInstance('view0', user, feed, appId);
}


