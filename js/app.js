/* Initial Values */
var players = [
	{id: 0},
	{id: 1}
];


var rules = [
	{id: 0},
	{id: 1}
];

var pieceTypes = [
	{name: "yellow", image: "images/pieces/yellow.png"},
	{name: "blue", image: "images/pieces/blue.png"},
	{name: "green", image: "images/pieces/green.png"},
	{name: "red", image: "images/pieces/red.png"},
	{name: "cross", image: "images/pieces/cross.png"},
	{name: "oval", image: "images/pieces/oval.png"},
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

	$("#board_background").load(function() {
		console.log("in board image loaded");
		console.log(this.width); 
		console.log(this.height);

		var w = $("#board_slots").width();
		var h = $("#board_slots").height();
		$("#board_background").width(w);
		$("#board_background").height(h);

		$("#board_slots").animate({ opacity: 0.5 }, 500);
	});

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
		$("#devices").empty();
		test_user_count = 0;
		var playerNum = getPlayerJSON().length;
		for (var i = 0; i < playerNum; i++) {
			addUser();
		}
		createGameModelsFile(function() {launch("game_template");}); // generate components.js
	});
	$("#sk_app_launch").click(function() {
		createGameModelsFile(function() {launch("donburi.demogame");}); // generate components.js
	});
	$("#return_feed").click(function() {
		var user = {name: "User 1", id: 0};
		env.startInstance('view0', user, feed, "edu.stanford.mobisocial.dungbeetle");
		user = {name: "User 2", id: 1};
		env.startInstance('view1', user, feed, "edu.stanford.mobisocial.dungbeetle");
	});
});

function fileSelected() {
	console.log("entering fileSelected");
  var file = document.getElementById('fileToUpload').files[0];
  if (file) {
    var fileSize = 0;
    if (file.size > 1024 * 1024)
      fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
    else
      fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
          
    document.getElementById('fileName').innerHTML = 'Name: ' + file.name;
    document.getElementById('fileSize').innerHTML = 'Size: ' + fileSize;
    document.getElementById('fileType').innerHTML = 'Type: ' + file.type;
  }
}

function uploadFile() {
	console.log("entering uploadFile");

  	var fd = new FormData();
    fd.append("fileToUpload", document.getElementById('fileToUpload').files[0]);

  	var xhr = new XMLHttpRequest();
  /* event listners */
  xhr.upload.addEventListener("progress", uploadProgress, false);
  xhr.addEventListener("load", uploadComplete, false);
  xhr.addEventListener("error", uploadFailed, false);
  xhr.addEventListener("abort", uploadCanceled, false);
  /* Be sure to change the url below to the url of your upload server side script */
  xhr.open("POST", "Upload_image.php");
  xhr.send(fd);
}

function uploadProgress(evt) {
  if (evt.lengthComputable) {
    var percentComplete = Math.round(evt.loaded * 100 / evt.total);
    document.getElementById('progressNumber').innerHTML = percentComplete.toString() + '%';
  }
  else {
    document.getElementById('progressNumber').innerHTML = 'unable to compute';
  }
}

function uploadComplete(evt) {
  /* This event is raised when the server send back a response */
  $("#board_background").attr("src", evt.target.responseText);
}

function uploadFailed(evt) {
  alert("There was an error attempting to upload the file.");
}

function uploadCanceled(evt) {
  alert("The upload has been canceled by the user or the browser dropped the connection.");
}

function convertValuesToSingleJSON() {
	var data = {};
	data.players = getPlayerJSON();
	data.pieces = getPiecesJSON();
	data.board = getBoardJSON();
	data.rules = getRulesJSON();	
	data.settings = getSettingsJSON();
	data.moveDecider = $("#move_decider_option").val();
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
	if (typeof localStorage.PieceList == "undefined") {
		return {};
	}
	var pieces = JSON.parse(localStorage.PieceList);
	var piecesArray = new Array();
	var i = 0;
	for (var key in pieces) {
		if (pieces.hasOwnProperty(key)) {
			var obj = {};
			obj.id = i;
			obj.player = pieces[key].player;
			obj.startPositionX = pieces[key].startPositionX;
			obj.startPositionY = pieces[key].startPositionY;
			obj.startState = pieces[key].startState;
			var pieceInfo = getPieceTypeInfo(pieces[key].type);
			obj.type = pieces[key].type;
			if (typeof(pieceInfo.image) == "undefined" || pieceInfo.image == null) {
				obj.color = pieceInfo.color; // color as backup
			} else {
				obj.image = pieceInfo.image;
			}
			piecesArray.push(obj);
		}
		i++;
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
		obj.paths = tile.get("paths");
		
		var tileInfo = getTileTypeInfo(tile.get("type"));
		obj.type = tile.get("type");
		if (typeof(tileInfo.image) != "undefined" || tileInfo.image == null) {
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
function getSettingsJSON() {
	var settings = JSON.parse(localStorage.Settings);
	var settingsArray = new Array();
	for (var key in settings) {
		if (settings.hasOwnProperty(key)) {
			var obj = {};
			obj.moveDecider = settings[key].moveDecider;
			obj.moveDeciderOptions = settings[key].moveDeciderOptions;
			settingsArray.push(obj);
		}
	}
	return settingsArray;
}

function getRulesJSON() {
	if (typeof localStorage.RuleList == "undefined") {
		return {};
	}
	var rules = JSON.parse(localStorage.RuleList);
	var rulesArray = new Array();
	var i = 0;
	for (var key in rules) {
		if (rules.hasOwnProperty(key)) {
			var obj = {};
			obj.id = i;
			obj.sensing_object = rules[key].sensing_object;
			obj.sensing_subobject = rules[key].sensing_subobject;
			obj.sensing_action = rules[key].sensing_action;
			obj.sensing_action_modifier = rules[key].sensing_action_modifier;
			obj.do_action = rules[key].do_action;
			if (rules[key].do_num_turns == "")
				obj.do_num_turns = 0;
			else
				obj.do_num_turns = parseInt(rules[key].do_num_turns);
			obj.do_action_object = rules[key].do_action_object;
			obj.do_action_subobject = rules[key].do_action_subobject;
			rulesArray.push(obj);
		}
		i++;
	}
	return {"rules": rulesArray};
}

function getPieceTypeInfo(pieceType) {
	var pieceTypeModel = pieceTypeList.collection.where({name: pieceType})[0];
	return pieceTypeModel.attributes;
}

function getTileTypeInfo(tileType) {
	var tileTypeModel = tileTypeList.collection.where({name: tileType})[0];
	return tileTypeModel.attributes;
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
	
	// clear test console
	$("#test_debug p").remove();
		
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
