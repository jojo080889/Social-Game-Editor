$(document).ready(function() {

	//Backbone.sync = function(method, model, success, error) {
		// TODO: write to database instead
	//}

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
		{name: "colorPiece", color: "yellow"}
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
		className: "player",
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
					
					//TODO populate players with their pieces
					var piece = pieceList.create({
						player: self.model.get("id"),
						type: model.get("name")
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
		model: Player,
		localStorage: new Store("PlayerList")
	});
	var PlayerListView = Backbone.View.extend({
		el: $("#playerList"),
		events: {
			//'click button#addPlayer': 'addPlayer',
			//'click button#removePlayer': 'removePlayer'
		},
		initialize: function() {
			_.bindAll(this, 'render', 'renderPlayer', 'addPlayer', 'removePlayer'); 
			this.collection = new PlayerList(players);
			this.collection.bind('add', this.renderPlayer);
			// TODO bind these events in a PlayerActionsView
			$("#addPlayer").click(this.addPlayer);
			$("#removePlayer").click(this.removePlayer);
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
				model: player,
				id: "player_" + player.get("id")
			});
			this.$el.append(pView.render().el);
		},
		addPlayer: function() {
			if (this.collection.length < 4) {
				var player = new Player();
				player.set({
					id: this.collection.length
				});
				player.save();
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
		className: "pieceType",
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
				$(".colorPiece", this.$el).css({background: this.model.get("color")});
			}
			this.$el.draggable({
				snap:true,
				helper: "clone",
				appendTo: '#player_design'
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
			$( "#dialog-pieceTypeDelete" ).show().dialog({
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
		model: PieceType,
		localStorage: new Store("PieceTypeList")
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
		className: "piece",
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
			// get model for appearance attributes
			var pieceTypeModel = pieceTypeList.collection.where({name: this.model.get("type")})[0];
			var tmpl = _.template(this.template);
			this.$el.html(tmpl(pieceTypeModel.toJSON()));
			if (pieceTypeModel.get("image") == null) {
				$(".colorPiece",this.$el).css({background: pieceTypeModel.get("color")});
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
		model: Piece,
		localStorage: new Store("PieceList")
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
		className: "tile",
		template: $("#tileTypeTemplate").html(),
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
				$(".colorTile", this.$el).css({background: this.model.get("color")});
			}
			this.$el.draggable({
				appendTo: "#board_design",
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
			$( "#dialog-tileTypeDelete" ).show().dialog({
				resizable: false,
				height:140,
				modal: true,
				buttons: {
					"Delete": function() {
						var toRemove = tileList.where({type: self.model.get("name")});
						tileList.remove(toRemove);
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
		model: TileType,
		localStorage: new Store("TileTypeList")
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
		template: $("#tileTemplate").html(),
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
			var tmpl = _.template(this.template);
			this.$el.html(tmpl(tileTypeModel.toJSON()));
			if (tileTypeModel.get("image") == null) {
				this.$el.css({background: tileTypeModel.get("color")});
			}
			return this;
		},
		unrender: function(e) {
			$(this.el).remove();
			if (!e.cid) { // if not a model
				e.stopImmediatePropagation();
			}
		},
		remove: function() {
			this.model.destroy();
		},
		showTileRules: function() {
			$('div#slotRulesPanel').show();
		}
	});
	var TileList = Backbone.Collection.extend({
		model: Tile,
		localStorage: new Store("TileList")
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
					tile.save();
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
		model: Slot,
		localStorage: new Store("Board")
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
					slot.save();
					
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
	
	/* App Views */
	var BoardEditView = Backbone.View.extend({
		el: $("#board_design"),
		events: {
			'click button#setBoardSize': 'setBoardSize'
		},
		initialize: function() {
			_.bindAll(this, 'render', 'setBoardSize');
			this.render();
		},
		render: function() {
		},
		setBoardSize: function() {
			// TODO validation here
			var size = $("#size", this.el).val();
			
			// clear existing board
			$("#slotsArea", this.el).empty();
			
			// replace with new board
			var boardView = new BoardView({sizeX: size, sizeY: size});
		}
	});	
	var PiecesAndPlayersView = Backbone.View.extend({
		el: $("#player_design"),
		events: {
			//'click button#setBoardSize': 'setBoardSize'
		},
		initialize: function() {
			_.bindAll(this, 'render', 'addOne', 'addAll');
			pieceList.bind('reset', this.addAll, this); // when re-loading the pieces list from storage
			this.render();
		},
		render: function() {
		},
		addOne: function(piece) {
			var view = new PieceView({model: piece});
			var player = piece.get("player");
			$("#player_" + player).append(view.render().el);
		},
		addAll: function() {
			pieceList.each(this.addOne);
		}
	});	
	
	// Instantiate stuff
	var playerList = new PlayerListView();
	var pieceTypeList = new PieceTypeListView();
	var pieceList = new PieceList();
	
	var tileTypeList = new TileTypeListView();
	var tileList = new TileList();
	
	var boardEditView = new BoardEditView();
	var piecesAndPlayersView = new PiecesAndPlayersView();
	
	// Load data
	var data = pieceList.fetch();
	
});