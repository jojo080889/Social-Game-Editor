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
		{type: "king", image: "images/pieces/2.png"},
		{type: "queen", image: "images/pieces/1.png"},
		{type: "knight", image: "images/pieces/3.png"},
		{type: "pawn", image: "images/pieces/4.png"},
		{type: "colorPiece"}
	];
	
	var pieces = [];
	
	/* PLAYER */
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
			var self = this;
			var tmpl = _.template(this.template);
			this.$el.html(tmpl(this.model.toJSON()));
			this.$el.droppable({
				drop: function(event, ui) {
					var model = $(ui.draggable).data("backbone-view").model;
					var piece = new Piece({
						player: self.model.get("id"),
						type: model
					});
					var pView = new PieceView({
						model: piece
					});
					self.$el.append(pView.render().el);
				}
			});
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
	
	/* PIECE TYPES */
	var PieceType = Backbone.Model.extend({
		defaults: {
			name: "piece_type_name",
			image: null, 
			color: "#ccc" //if no image specified, will render a colored div
		}
	});
	var PieceTypeView = Backbone.View.extend({
		tagName: 'div',
		className: "draggable ui-widget-content pieceType",
		template: $("#pieceTemplate").html(),
		events: {
			"click span.delete": "remove"
		},    
		initialize: function() {
			_.bindAll(this, "render", "unrender", "remove");
			this.model.bind("change", this.render);
			this.model.bind("remove", this.unrender);
		},
		render: function() {
			var tmpl = _.template(this.template);
			this.$el.html(tmpl(this.model.toJSON()));
			if (this.model.get("image") == null) {
				this.$el.css({background: this.model.get("color")});
			}
			this.$el.draggable({
				snap:true,
				helper: "clone"
			});
			this.$el.data("backbone-view", this);
			return this;
		},
		unrender: function() {
			$(this.el).remove();
		},
		remove: function() {
			// TODO: show a warning, then also delete all pieces of the same piece type
			this.model.destroy();
		}
	});
	var PieceTypeList = Backbone.Collection.extend({
		model: PieceType
	});
	var PieceTypeListView = Backbone.View.extend({
		el: $("#pieceTypeList"),
		events: {
			'click button#addPieceType': 'addPieceType'
		},
		initialize: function() {
			_.bindAll(this, 'render', 'renderPieceType', 'addPieceType'); 
			this.collection = new PieceTypeList(pieceTypes);
			this.collection.bind('add', this.renderPieceType);
			this.render();
		},
		render: function() {
			var self = this;
			_.each(this.collection.models, function(item) {
				self.renderPieceType(item);
			}, this);
		},
		renderPieceType: function(pieceType) {
			var pView = new PieceTypeView({
				model: pieceType
			});
			this.$el.append(pView.render().el);
		},
		addPieceType: function() {
			//TODO: show modal to set color, name, and image
		}
	});
	
	/* PIECES */
	var Piece = Backbone.Model.extend({
		defaults: {
			player: -1, // Player ID. -1 means not owned.
			type: null
		}
	});
	var PieceView = Backbone.View.extend({
		tagName: 'div',
		className: "draggable ui-widget-content piece",
		template: $("#pieceTemplate").html(),
		events: {
			"click span.delete": "unrender"
		},    
		initialize: function() {
			_.bindAll(this, "render", "unrender", "remove");
			this.model.bind("change", this.render);
			this.model.bind("remove", this.unrender);
		},
		render: function() {
			var tmpl = _.template(this.template);
			this.$el.html(tmpl(this.model.get("type").toJSON()));
			if (this.model.get("type").get("image") == null) {
				this.$el.css({background: this.model.get("type").get("color")});
			}
			return this;
		},
		unrender: function() {
			$(this.el).remove();
		},
		remove: function() {
			this.model.destroy();
		}
	});
	
	// Instantiate stuff
	var playerList = new PlayerListView();
	var pieceTypeList = new PieceTypeListView();
});