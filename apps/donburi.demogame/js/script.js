/*
 * DonburiGame is the application's main class
 */
function DonburiGame(context) {
    this.state = {points: null, pieces: null};
    this.init(context);
}
DonburiGame.prototype = new SocialKit.Multiplayer.TurnBasedMultiplayerGame;

DonburiGame.UP = 0;
DonburiGame.LEFT = 1;
DonburiGame.DOWN = 2;
DonburiGame.RIGHT = 3;
DonburiGame.UP_LEFT = 4;
DonburiGame.DOWN_LEFT = 5;
DonburiGame.DOWN_RIGHT = 6;
DonburiGame.UP_RIGHT = 7;

DonburiGame.DiceMin = 1;
DonburiGame.DiceMax = 6;

DonburiGame.title = "DemoGame";
DonburiGame.size = 5;
DonburiGame.board = null;

// App initializations
DonburiGame.prototype.init = function(context) {   
    //Make the board. This should be built in.
    DonburiGame.board = makeBoard();


    this.onUpdate(function(state) {
        console.info("Updating...");
        console.info(this.whoAmI());
        console.info(this.state.pieces);
        
        var thisGame = this;
            // Set title
        $("title").html(DonburiGame.title);
        $("header h1").html(DonburiGame.title);

        // Create players
        $("#players").html($(showPlayers(thisGame)));

        // Create board
        $("#board-container").html($(generateGrid(DonburiGame.size)));
        adjustGrid(DonburiGame.size);
	
        // Set current player
        setCurrentPlayer(this.whoseTurn());
        
        // Create pieces and place in correct positions
        createPieces(thisGame);
	
        // Set event handlers
        
        if(this.isMyTurn()) {
            $("#roll_move").html("Roll Dice");
            
            /*During initialization, the function below is bound to this button, 
             *and then on update it is bound again. This unbind (and the one below) 
             *prevent that from being a problem. There has to be a more elegant solution.
             */
            $("#roll_move").unbind(); 
                
            $("#roll_move").click(function() {
                $("#roll_move").unbind();
                $("#skip_turn").unbind();
                console.log("Are you calling this twice?");
                startTurn(thisGame);
            });
            $("#skip_turn").unbind();
            $("#skip_turn").click(function(){
                $("#roll_move").unbind();
                $("#skip_turn").unbind();
                thisGame.takeTurn(thisGame.state);
            });
        } else {
            $("#roll_move").html("Waiting...");
            $("#roll_move").click(function() {
                return;
            });
            $("#skip_turn").click(function(){
                return;
            });
        }
        
        $(document).bind("orientationchange", function() { alert("hi") });
        
        
    });
    SocialKit.Multiplayer.TurnBasedMultiplayerGame.prototype.init.call(this, context);
};

function makeBoard() {
	// Create board state object
	var boardState = [];
	for (var i = 0; i < DonburiGame.size; i++) {
		var row = [];
		for (var j = 0; j < DonburiGame.size; j++) {
			// Create a simple circuit board
			var tile = {};
			// if first row or last row
			if (i == 0 || i == (DonburiGame.size - 1) || j == 0 || j == (DonburiGame.size - 1)) {
				tile.slot == true;
                tile.rules = null;
				if (i == 0 && j != 0) {
					tile.path = DonburiGame.LEFT;
				} else if (j == 0 && i != (DonburiGame.size - 1)) {
					tile.path = DonburiGame.DOWN;
				} else if (i == (DonburiGame.size - 1) && j != (DonburiGame.size - 1)) {
					tile.path = DonburiGame.RIGHT;
				} else if (j == (DonburiGame.size - 1) && i != 0) {
					tile.path = DonburiGame.UP;
				}
			} else {
				tile.slot == false;
			}
			row.push(tile);
		}
		boardState.push(row);
	}
    
    //Do points!
    for(var i = 0; i < 2; i++) {
        for(var j = 0; j <2; j++) {
            boardState[4*i][4*j].rules = {land: 15};
        }
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
function showPlayers(game) {
	var html = "<ul>";
	for (var idx = 0; idx < game.players.length; idx++) {
		html += "<li class='player'>";
		html += "<p><span class='player" + (idx + 1) + "'></span>" + game.players[idx].name + "</p>";
		
		// Points exist, so...
        html += "<p class='points'>" + game.state.points[idx] + "</p>";

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


/* Based on pieces state, place pieces on board */
function createPieces(game) {
	if (game != null) {
		console.info("Creating pieces: " + game.whoseTurn());
	}
    console.info(game.state);
	for (var i = 0; i < game.state.pieces.length; i++) {
		for (var j = 0; j < game.state.pieces[i].length; j++) {
			var p = game.state.pieces[i][j];
			// find the right slot
			var slot = $($($("#board .row")[p.y]).find(".slot")[p.x]);
			slot.append($("<div class='piece player" + (i + 1) + "' id='piece" + (i + 1) + "'></div>"));
		}
	}
}

function startTurn(game) {
	// get piece of current player
    var currentPlayer = game.whoseTurn();
	var pieceDiv = $("#piece" + (currentPlayer + 1));
	var pieceState = game.state.pieces[currentPlayer];

	// pick random number
	// TODO: Display on screen
	var diceResult = Math.floor((Math.random()*DonburiGame.DiceMax) + DonburiGame.DiceMin); // Min through Max
    console.info("Dice roll!");
    console.info(diceResult);
	$("#move-result-num").html(diceResult);
	$("#move-result").show("fast").delay(1000).hide("fast", function() {
		makeMove(game, pieceDiv, pieceState[0], diceResult);
	});
    return;
}

function makeMove(game, pieceDiv, position, moveCount) {
	// TODO: handle multiple pieces
    var currentPlayer = game.whoseTurn();
	var curX = position.x;
	var curY = position.y;
	
	if (moveCount == 0) {
		game.state.pieces[currentPlayer][0].x = curX;
		game.state.pieces[currentPlayer][0].y = curY;	
		// Change turn to next player
		game.takeTurn(game.makeState());
		return;
	}
	
	var sourceSlot = $($($("#board .row")[curY]).find(".slot")[curX]);

	// get path of current square
	var path = DonburiGame.board[curY][curX].path; // row first
	var verDistance = sourceSlot.outerHeight();
	var horDistance = sourceSlot.outerWidth();
	var moveObj = {top: 0, left: 0};
	
	// update position
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
	console.info("roll:" + moveCount + ", path:" + path + ", position:" + curX + " " + curY + ", move:" + moveObj.left + " " + moveObj.top);
    
	var destSlot = $($($("#board .row")[curY]).find(".slot")[curX]);
	position.x = curX;
	position.y = curY;
    
    //Do points!
    var rules = DonburiGame.board[curY][curX].rules;
    if(rules != null) {
        if(rules.land != null) {
            game.state.points[game.whoseTurn()] += rules.land;
            $("#players").html($(showPlayers(game)));
            setCurrentPlayer(game.whoseTurn());
        }
    }

    
	sourceSlot.addClass("slot-moving");
	pieceDiv.addClass("piece-moving")
	.animate(moveObj, 1000, function() { 
		$(this).css({top: 0, left: 0}).removeClass("piece-moving").appendTo(destSlot);
		sourceSlot.removeClass("slot-moving");

		makeMove(game, pieceDiv, position, moveCount - 1);
	});
    
}

DonburiGame.prototype.createInitialState = function() {
	state = {points: null, pieces: null};
    
    //Everyone starts with 0 points.
    state.points = [];
    for(var i in this.players) {
        state.points.push(0);
    }
    
    
    //Create the pieces and put them in their initial spaces.
    //TODO: Decide how pieces are distributed!
    state.pieces = [];
    for(var idx = 0; idx < this.players.length; idx++) {
        var player = [];
        for(var pnum = 0; pnum < 1; pnum ++) {
            var piece = {};
            piece.x = 0;
            piece.y = 0;
            player.push(piece);
        }
        state.pieces.push(player);
    }
    
	return state;
}

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
}


/*
 * App launch when Musubi is ready
 */
var game = null;
Musubi.ready(function(context) {
    console.info("launching DonburiGame");
    game = new DonburiGame(context);
});