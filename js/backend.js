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
		{name: "king", image: "images/pieces/2.png"},
		{name: "queen", image: "images/pieces/1.png"},
		{name: "knight", image: "images/pieces/3.png"},
		{name: "pawn", image: "images/pieces/4.png"},
		{name: "colorPiece"}
	];
	
	var pieces = [];
	
	var tileTypes = [
		{name: "yellow", color: "yellow"},
		{name: "blue", color: "blue"},
		{name: "green", color: "green"},
		{name: "red", color: "red"}
	]
	
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
						type: model.get("name")
					});
					pieceList.push(piece); // add piece to global piece list
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
			var self = this;
			// show a warning, then also delete all pieces of the same piece type
			$( "#dialog-pieceTypeDelete" ).dialog({
				resizable: false,
				height:140,
				modal: true,
				buttons: {
					"Delete": function() {
						var toRemove = pieceList.where({type: self.model.get("name")});
						pieceList.remove(toRemove);
						self.model.destroy();
						$( this ).dialog( "close" );
					},
					Cancel: function() {
						$( this ).dialog( "close" );
					}
				}
			});
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
			// get model for appearance attributes
			var pieceTypeModel = pieceTypeList.collection.where({name: this.model.get("type")})[0];
			var tmpl = _.template(this.template);
			this.$el.html(tmpl(pieceTypeModel.toJSON()));
			if (pieceTypeModel.get("image") == null) {
				this.$el.css({background: pieceTypeModel.get("color")});
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
	var PieceList = Backbone.Collection.extend({
		model: Piece
	});
	
	/* TILE TYPES */
	var TileType = Backbone.Model.extend({
		defaults: {
			name: "tile_type_name",
			image: null, 
			color: "#ccc" //if no image specified, will render a colored div
		}
	});
	var TileTypeView = Backbone.View.extend({
		tagName: 'div',
		className: "draggable ui-widget-content tile ui-draggable",
		events: {
			"click span.delete": "remove"
		},    
		initialize: function() {
			_.bindAll(this, "render", "unrender", "remove");
			this.model.bind("change", this.render);
			this.model.bind("remove", this.unrender);
		},
		render: function() {
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
			var self = this;
			// show a warning, then also delete all pieces of the same piece type
			$( "#dialog-tileTypeDelete" ).dialog({
				resizable: false,
				height:140,
				modal: true,
				buttons: {
					"Delete": function() {
						var toRemove = board.where({type: self.model.get("name")});
						board.remove(toRemove);
						self.model.destroy();
						$( this ).dialog( "close" );
					},
					Cancel: function() {
						$( this ).dialog( "close" );
					}
				}
			});
		}
	});
	var TileTypeList = Backbone.Collection.extend({
		model: TileType
	});
	var TileTypeListView = Backbone.View.extend({
		el: $("#tileChoices"),
		events: {
			'click button#addTileType': 'addTileType'
		},
		initialize: function() {
			_.bindAll(this, 'render', 'renderTileType', 'addTileType'); 
			this.collection = new TileTypeList(tileTypes);
			this.collection.bind('add', this.renderTileType);
			this.render();
		},
		render: function() {
			var self = this;
			_.each(this.collection.models, function(item) {
				self.renderTileType(item);
			}, this);
		},
		renderTileType: function(tileType) {
			var tView = new TileTypeView({
				model: tileType
			});
			this.$el.append(tView.render().el);
		},
		addTileType: function() {
			//TODO: show modal to set color, name, and image
		}
	});	
	
	/* TILES */
	var Tile = Backbone.Model.extend({
		defaults: {
			paths: [], // array of ints
			position: {x:-1, y:-1},
			type: null // string
		}
	});
	var TileView = Backbone.View.extend({
		tagName: 'div',
		className: "draggable ui-widget-content tile ui-draggable",
		events: {
			"click": "showTileRules",
			"click span.delete": "unrender"
		},    
		initialize: function() {
			_.bindAll(this, "render", "unrender", "remove", "showTileRules");
			this.model.bind("change", this.render);
			this.model.bind("remove", this.unrender);
		},
		render: function() {
			// get model for appearance attributes
			var tileTypeModel = tileTypeList.collection.where({name: this.model.get("type")})[0];
			if (tileTypeModel.get("image") == null) {
				this.$el.css({background: tileTypeModel.get("color")});
			}
			return this;
		},
		unrender: function() {
			$(this.el).remove();
		},
		remove: function() {
			this.model.destroy();
		},
		showTileRules: function() {
			$('div#slotRulesPanel').show();
		}
	});
	var TileList = Backbone.Collection.extend({
		model: Tile
	});
	
	/* SLOT AND BOARD */
	/* The empty slot on the board a tile can be placed into. */
	var Slot = Backbone.Model.extend({
		defaults: {
			position: {x:-1, y:-1}, // Player ID. -1 means not owned.
		}
	});
	var SlotView = Backbone.View.extend({
		tagName: 'div',
		className: "slot droppable ui-widget-header ui-droppable",
		events: {
		},    
		initialize: function() {
			_.bindAll(this, "render", "unrender", "remove");
			this.model.bind("change", this.render);
			this.model.bind("remove", this.unrender);
		},
		render: function() {
			var self = this;
			this.$el.droppable({
				drop: function( event, ui ) {
					// Create a new Tile and place on top of slot
					var model = $(ui.draggable).data("backbone-view").model;
					var tile = new Tile({
						position: self.model.get("position"),
						type: model.get("name")
					});
					tileList.push(tile); // add piece to global piece list
					var tView = new TileView({
						model: tile
					});
					self.$el.append(tView.render().el);
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
	var Board = Backbone.Collection.extend({
		model: Slot
	});
	var BoardView = Backbone.View.extend({
		el: $("#slotsArea"),
		events: {
			'click': 'showBoardRules'
		},
		initialize: function() {
			_.bindAll(this, 'render', 'showBoardRules'); 
			this.collection = new Board();
			this.render();
		},
		render: function() {
			var html = "";
			var self = this;
			for (var i = 0; i < this.options.sizeY; i++) {
				var row = $("<div class='row'>");
				for (var j = 0; j < this.options.sizeX; j++) {
					// create slot
					var slot = new Slot({position: {x: i, y: j}});
					this.collection.push(slot);
					var sView = new SlotView({
						model: slot
					});
					// append
					row.append(sView.render().el);
				}
				this.$el.append(row);
			}
		},
		showBoardRules: function() {
			// TODO: show board rules
		}
	});	
	
	// Instantiate stuff
	var playerList = new PlayerListView();
	var pieceTypeList = new PieceTypeListView();
	var pieceList = new PieceList();
	
	var tileTypeList = new TileTypeListView();
	var boardView = new BoardView({sizeX: 3, sizeY: 3});
	var tileList = new TileList();
});