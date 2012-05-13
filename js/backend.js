$(document).ready(function() {
	Backbone.sync = function(method, model, success, error) {
		// TODO: write to database instead
	}

	// Initial values
	// TODO: read from database instead
	var players = [
		{id: 0},
		{id: 1}
	];
	
	var pieceTypes = [
		{type: "king"},
		{type: "queen"},
		{type: "knight"},
		{type: "pawn"}
	];
	
	var pieces = [];
	
	/* Player */
	var Player = Backbone.Model.extend({
		defaults: {
			id: -1
		}
	});
	
	var PlayerView = Backbone.View.extend({
		tagName: 'div',
		className: "droppable ui-widget-header",
		template: $("#playerTemplate").html(),
		events: {
		},    
		initialize: function() {
			_.bindAll(this, "render", "unrender", "remove");
			this.model.bind("change", this.render);
			this.model.bind("remove", this.unrender);
		},
		render: function() {
			var tmpl = _.template(this.template);
			this.$el.html(tmpl(this.model.toJSON()));
			return this;
		},
		unrender: function() {
			$(this.el).remove();
		},
		remove: function() {
			this.model.destroy();
		}
	});
	
	var PlayerList = Backbone.Collection.extend({
		model: Player
	});
	var PlayerListView = Backbone.View.extend({
		el: $("#playerList"),
		events: {
			'click button#addPlayer': 'addPlayer',
			'click button#removePlayer': 'removePlayer'
		},
		initialize: function() {
			_.bindAll(this, 'render', 'renderPlayer', 'addPlayer', 'removePlayer'); 
			this.collection = new PlayerList(players);
			this.collection.bind('add', this.renderPlayer);
			this.render();
		},
		render: function() {
			var self = this;
			_.each(this.collection.models, function(item) {
				self.renderPlayer(item);
			}, this);
		},
		renderPlayer: function(player) {
			var pView = new PlayerView({
				model: player
			});
			this.$el.append(pView.render().el);
		},
		addPlayer: function() {
			if (this.collection.length < 4) {
				var player = new Player();
				player.set({
					id: this.collection.length
				});
				this.collection.add(player);
			} else {
				// TODO: show a message indicating player limit
			}
		},
		removePlayer: function() {
			if (this.collection.length > 2) {
				this.collection.pop()
			}
		}
	});
	
	// Instantiate stuff
	var playerList = new PlayerListView();
});