var game = {
	name: "Test Game",
	players: [],
	screen: {width: 243, height: 405, background: "#ddd" },
	pieces: {
		box: {top: 0, left: 0, background: "purple"},
		bigBox: {top: 0, left: 0, background: "blue"},
	},
	board: {
		size: 0,
		top: 0,
		left: 0,
		state: []
	},
	pieceSets: []
};
$(document).ready(function() {
	$("#box").draggable({ 
		containment: 'parent', 				
		start: function(event, ui) {
			ui.helper.moveToPieceBox = true;
		},
		stop: function(event, ui) {
			if (ui.helper.moveToPieceBox) {
				$(this).css({top: 0, left: 0});
				$("#workarea").append($(this));
			}
			
			// save position relative to workarea
			var positionX = parseInt(ui.position.left);
			var positionY = parseInt(ui.position.top);
			game.pieces.box.left = positionX;
			game.pieces.box.top = positionY;
			console.log(game);
		}
	});
	$("#bigBox").draggable({
		containment: 'parent', 
		stop: function(event, ui) {
			// save position relative to workarea
			var positionX = parseInt(ui.position.left);
			var positionY = parseInt(ui.position.top);
			game.pieces.bigBox.left = positionX;
			game.pieces.bigBox.top = positionY;
			console.log(game);
		}
	});
	$("#generate").click(function(e) {
		$.generateFile({
			filename: 'app.html',
			content: createGameHTML(),
			script: 'download.php'
		});
		e.preventDefault();
	});
	
	$("#load_project").click(function(e) {
		$("#load_window").dialog();
	});
	/*var uploader = new qq.FileUploader({
		// pass the dom node (ex. $(selector)[0] for jQuery users)
		element: document.getElementById('file-uploader'),
		// path to server-side upload script
		action: 'load.php',
		debug: true,
		onComplete: function(id, fileName, responseJSON){
			alert(responseJSON);
		}
	}); */
	//https://github.com/jfeldstein/jQuery.AjaxFileUpload.js
	$('input#uploadedfile').ajaxfileupload({
		'action': 'load.php',
		'onComplete': function(response) {
			game = response;
			updateWorkarea();
		}
	});
	$("#save_project").click(function(e) {
		$.generateFile({
			filename: 'myGame.ramen',
			content: createProjectFile(),
			script: 'download.php'
		});
		e.preventDefault();	
	});
	
	$("#createGrid").click(function(e) {
		var size = $("#createGridSize").val();
		var grid = $(generateGrid(size));
		grid.draggable({
			containment: 'parent', 
		stop: function(event, ui) {
			// save position relative to workarea
			var positionX = parseInt(ui.position.left);
			var positionY = parseInt(ui.position.top);
			game.board.left = positionX;
			game.board.top = positionY;
			console.log(game);
			}
		});
		$("#workarea").append(grid);
		adjustGrid(size);
		
		// update game JSON
		game.board.size = size;
		game.board.state = [];
		// Assumes square
		for (var i = 0; i < size; i++) {
			var row = [];
			for (var j = 0; j < size; j++) {
				row.push([]);
			}
			game.board.state.push(row);
		}
		
		$(".slot").droppable({
			drop: function(event, ui) {
				// TODO: check for Pieces class objects
				if(ui.draggable.attr("id") == "box") {
					ui.helper.moveToPieceBox = false;
					var $this = $(this);
					$this.append(ui.draggable);
					
					var width = $this.width();
					var height = $this.height();
					var cntrLeft = (width / 2) - (ui.draggable.width() / 2);
					var cntrTop = (height / 2) - (ui.draggable.height() / 2);
					
					ui.draggable.css({
						left: cntrLeft + "px",
						top: cntrTop + "px"
					});
				}
			}
		});
	});
	
	/* Piece Sets */
	$("#add_piece_set").click(function() {
		var setID = game.pieceSets.length + 1;
		game.pieceSets.push({});
		
		var html = "";
		html += "<div class='piece_set'>";
		html += "<div class='title'>Piece Set " + setID + "</div>"; // TODO: Make editable
		html += "<div class='properties'>No pieces yet created</div>";
		html += "</div>";
		$("#piece_sets").append($(html));		
	});
	
	/* Players */
	$("#add_player").click(function() {
		var playerID = game.players.length + 1;
		game.players.push({pieceSet: null});
	
		var html = "";
		html += "<div class='player'>";
		html += "<div class='title'>Player " + playerID + "</div>";
		html += "<div class='properties'>No piece set yet assigned</div>";
		html += "</div>";
		$("#players").append($(html));
	});
	
});

function createGameHTML() {
	var html = "";
	html += "<html><head><title>" + game.name + "</title></head>";
	html += "<body><div id='container' style='position: relative; width:" + game.screen.width + "px; height:" + game.screen.height + "px; background:" + game.screen.background + "'>";
	html += "<div id='box' style='position:absolute; width:60px; height:60px; left:" + game.pieces.box.left + "px; top:" + game.pieces.box.top + "px; background:" + game.pieces.box.background + ";'></div>";	
	html += "<div id='bigBox' style='position:absolute; width:150px; height: 150px; left:" + game.pieces.bigBox.left + "px; top:" + game.pieces.bigBox.top + "px; background:" + game.pieces.bigBox.background + ";'></div>";
	html += "</div></body></html>";
	return html;
}

// Exports game's JSON description as a .ramen file.
function createProjectFile() {
	return JSON.stringify(game, null, '\t');
}

// Generates a square board
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
	var maxBoxWidth = Math.floor($("#workarea").width() / size);
	boxWidth = maxBoxWidth - (2 * parseInt($(".slot").css("borderWidth")));
	$(".slot").css("width", boxWidth).css("height", boxWidth);
	
	var boardWidth = maxBoxWidth * size;
	$("#board").css("width", boardWidth).css("height", boardWidth);
}

// Updates the Workarea based on 'game' JSON object
function updateWorkarea() {
	// TODO:
}