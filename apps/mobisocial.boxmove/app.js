/*
 * BoxMove is the application's main class
 */
function BoxMove(app) {
    this.box = [0,0];
    this.init(app);
}
BoxMove.prototype = new SocialKit.Multiplayer.TurnBasedMultiplayerGame;

// App initializations
BoxMove.prototype.init = function(app) {    
    this.onUpdate(function(state) {
        this.box = state.s;
        var mover = this;
        $("#divbox").css({left:this.box[0], top:this.box[1]});
        $("#divbox").drag(function(event, loc) {
        	$(this).css({left:loc.offsetX, top:loc.offsetY});
        	mover.box = [loc.offsetX, loc.offsetY];
        	});
        $("#divbox").click(function() {
        	console.log("I clicked a box!");
        	});
        $("#turn").html(this.isMyTurn() ? "It's your turn!" : "Waiting for other player.");
        $("#taketurn").click(function() {
        	mover.takeTurn(mover.makeState())
        	});
        this.isMyTurn() ? $("#taketurn").show() : $("#taketurn").hide();
    });

    SocialKit.Multiplayer.TurnBasedMultiplayerGame.prototype.init.call(this, app);
    for (var key in this.players) {
        $("#players").append('<li>' + this.players[key].name + '</li>');
    }
};

BoxMove.prototype.createInitialState = function() {
	this.state = {s: [0,0]};
	return this.state;
}

// Returns the state
BoxMove.prototype.makeState = function() {
    if (DBG) console.log("making state...");
    return {s: this.box};
};

BoxMove.prototype.reset = function() {
    if (this.isMyTurn()) {
        this.box = [0,0];
        this.takeTurn(this.makeState())
    }
};

BoxMove.prototype.feedView = function() {
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
    console.info("launching BoxMove");
    game = new BoxMove(context);
});