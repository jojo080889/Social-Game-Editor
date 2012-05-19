var playerList;
var pieceTypeList;
var pieceList;

var tileTypeList;
var tileList;

var board;

var boardEditView;
var piecesAndPlayersView;

$(document).ready(function() {
	
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
			this.remove();
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
			this.collection = new PlayerList();
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
				var player = this.collection.create({
					id: this.collection.length
				});
			} else {
				// TODO: show a message indicating player limit
			}
		},
		removePlayer: function() {
			// remove pieces attached to the player, if there are any
			var last = this.collection.last();
			var self = this;
			var toRemove = pieceList.where({player: last.get("id")});
			
			if ($.isEmptyObject(toRemove)) {
				if (this.collection.length > 2) {
					this.collection.pop();
				}
			} else {
				$( "#dialog-playerPieceDelete" ).show().dialog({
					resizable: false,
					height:140,
					modal: true,
					buttons: {
						"Delete": function() {
							if (self.collection.length > 2) {
								self.collection.pop();
								pieceList.remove(toRemove);
							}
							$( this ).dialog( "close" );
						},
						Cancel: function() {
							$( this ).dialog( "close" );
						}
					}
				});
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
			//'click button#addPieceType': 'addPieceType'
		},
		initialize: function() {
			_.bindAll(this, 'render', 'renderPieceType', 'addPieceType'); 
			this.collection = new PieceTypeList();//(pieceTypes);
			this.collection.bind('add', this.renderPieceType);
			$("#addPieceType").click(this.addPieceType);
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
			// show modal to set color, name, and image
			var self = this;
			$( "#dialog-pieceTypeAdd" ).show().dialog({
				resizable: false,
				height:300,
				modal: true,
				buttons: {
					"Add": function() {
						var pieceType = self.collection.create({
							name: $("#new_pieceTypeName").val(), //TODO validate
							color: $("#new_pieceTypeColor").val()
						});
						$( this ).dialog( "close" );
					},
					Cancel: function() {
						$( this ).dialog( "close" );
					}
				}
			});
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
			this.remove();
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
		className: "tileType",
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
			this.collection = new TileTypeList();//(tileTypes);
			this.collection.bind('add', this.renderTileType);
			$("#addTileType").click(this.addTileType);
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
			// show modal to set color, name, and image
			var self = this;
			$( "#dialog-tileTypeAdd" ).show().dialog({
				resizable: false,
				height:300,
				modal: true,
				buttons: {
					"Add": function() {
						var pieceType = self.collection.create({
							name: $("#new_tileTypeName").val(), //TODO validate
							color: $("#new_tileTypeColor").val()
						});
						$( this ).dialog( "close" );
					},
					Cancel: function() {
						$( this ).dialog( "close" );
					}
				}
			});
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
		className: "tile",
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
					
					var tile = tileList.create({
						position: self.model.get("position"),
						type: model.get("name")
					});
					
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
	var SlotList = Backbone.Collection.extend({
		model: Slot,
		localStorage: new Store("SlotList")
	});
	var Board = Backbone.Model.extend({
		initialize: function() {
			this.collection = new SlotList();
		},
		defaults: {
			sizeX: 3,
			sizeY: 3
		},
		localStorage: new Store("Board")
	});
	var BoardView = Backbone.View.extend({
		el: $("#slotsArea"),
		events: {
			'click': 'showBoardRules'
		},
		initialize: function() {
			_.bindAll(this, 'render', 'unrender','showBoardRules'); 
			//this.collection = new Board();
			this.model.bind("change", this.render);
			this.model.bind("destroy", this.unrender);
			//this.render();
		},
		render: function() {
			$(".info_text", this.el).hide();
			var html = "";
			var self = this;
			for (var i = 0; i < this.model.get("sizeY"); i++) {
				var row = $("<div class='row'>");
				for (var j = 0; j < this.model.get("sizeX"); j++) {
					// create slot
					var slot = this.model.collection.create({
						position: {x: i, y: j}
					});
					var sView = new SlotView({
						model: slot
					});
					// append
					row.append(sView.render().el);
				}
				this.$el.append(row);
			}
		},
		unrender: function() {
			$(".row", this.el).remove();
			$(".info_text", this.el).show();
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
			tileTypeList.collection.bind('reset', tileTypeList.render);
			this.board = new Board({id: 1}); // for some reason have to set ID for fetch() to work properly
			this.boardView = new BoardView({model: this.board});
			if (localStorage.getItem("Board") != null) {
				this.board.fetch();
			}
	
			this.render();
		},
		render: function() {
		},
		setBoardSize: function() {
			// TODO validation here
			var size = $("#size", this.el).val();
			
			// clear existing board
			//$("#slotsArea", this.el).empty(); // TODO unrender!
			this.board.destroy();
			
			// replace with new board
			//this.boardView = new BoardView({sizeX: size, sizeY: size});
			this.board = new Board({id: 1, sizeX: size, sizeY: size});
			this.board.save();
			this.boardView = new BoardView({model: this.board});
			this.boardView.render();
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
			playerList.collection.bind('reset', playerList.render); // when re-loading the players list from storage
			pieceTypeList.collection.bind('reset', pieceTypeList.render); 
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
	playerList = new PlayerListView();
	pieceTypeList = new PieceTypeListView();
	pieceList = new PieceList();
	
	tileTypeList = new TileTypeListView();
	tileList = new TileList();
	
	boardEditView = new BoardEditView();
	piecesAndPlayersView = new PiecesAndPlayersView();
	
	// Load data
	if (localStorage.getItem("TileTypeList") == null) {
		for (var i = 0; i < tileTypes.length; i++) {
			tileTypeList.collection.create(tileTypes[i]);
		}
	} else {
		tileTypeList.collection.fetch(); // players MUST be loaded before pieces
	}
	
	if (localStorage.getItem("PlayerList") == null) {
		for (var i = 0; i < players.length; i++) {
			playerList.collection.create(players[i]);
		}
	} else {
		playerList.collection.fetch(); // players MUST be loaded before pieces
	}
	if (localStorage.getItem("PieceTypeList") == null) {
		for (var i = 0; i < pieceTypes.length; i++) {
			pieceTypeList.collection.create(pieceTypes[i]);
		}
	} else {
		pieceTypeList.collection.fetch();
	}
	pieceList.fetch();
});