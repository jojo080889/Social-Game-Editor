var playerList;
var pieceTypeList;
var pieceList;

var tileTypeList;
var tileList;

var board;

var boardEditView;
var piecesAndPlayersView;
var rulesSelectView;

$(document).ready(function() {

	/* RULE */	
	var Rule = Backbone.Model.extend({
		defaults: {
			id: -1
		}
	});
	
	var RuleView = Backbone.View.extend({
		tagName: 'div',
		className: "rule",
		template: $("#ruleTemplate").html(),
		events: {
			"click span.delete": "remove"
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
			return this;
		},
		unrender: function() {
			$(this.el).remove();
			this.remove();
		},
		remove: function() {
			this.model.destroy();
			var removedType = this.model.get("id");
			alert("TODO: remove from DOM and collection");
			
			// TODO: show a warning first
			var self = this;
			var toRemove = ruleList.where({type: self.model.get("name")});
			ruleList.remove(toRemove);
			self.model.destroy();
		}
	});
	
	var RuleList = Backbone.Collection.extend({
		model: Rule,
		localStorage: new Store("RuleList")
	});
	var RuleListView = Backbone.View.extend({
		el: $("#ruleList"),
		events: {
		},
		initialize: function() {
			_.bindAll(this, 'render', 'renderRule', 'addRule', 'removeRule'); 
			this.collection = new RuleList();
			this.collection.bind('add', this.renderRule);
			$("#addRule").click(this.addRule);
			$("#removeRule").click(this.removeRule);
			this.render();
		},
		render: function() {
			var self = this;
			_.each(this.collection.models, function(item) {
				self.renderRule(item);
			}, this);
		},
		renderRule: function(rule) {
			var rView = new RuleView({
				model: rule,
				id: "rule_" + rule.get("id")
			});
			this.$el.append(rView.render().el);
			initRuleSelectElems();
		},
		addRule: function() {
			// if we're not going to limit the number of rules
			// then delete the if statement
			if (this.collection.length < 10) {
				var rule = this.collection.create({
					id: this.collection.length
				});
			} else {
			}
			initRuleSelectElems();
		},
		removeRule: function() {
			if (this.collection.length > 1) {
				this.collection.pop();
			}
		}
	});
	
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
			type: null,
			startPositionX: 0,
			startPositionY: 0,
			startState: "isOffBoard"
		}
	});
	var PieceView = Backbone.View.extend({
		tagName: 'div',
		className: "piece",
		template: $("#pieceTemplate").html(),
		events: {
			"click": "showPieceOptions",
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
			if (e) {
				e.stopImmediatePropagation();
			}
		},
		showPieceOptions: function(e) {
			var pieceOptionsView = new PieceOptionsView({
				model: this.model
			});
			$("#triggersPiece").empty().append(pieceOptionsView.render().el);
			pieceOptionsView.initOptions();
			
			if (!e.cid) { // if not a model
				e.stopImmediatePropagation();
			}
		}
	});
	var PieceList = Backbone.Collection.extend({
		model: Piece,
		localStorage: new Store("PieceList")
	});
	var PieceOptionsView = Backbone.View.extend({
		tagName: 'div',
		template: $("#pieceOptionsTemplate").html(),
		events: {
			"change #startX": "changeStartX",
			"change #startY": "changeStartY",
			"change #startState": "changeStartState"
		},    
		initialize: function() {
			_.bindAll(this, "render", "unrender", "initOptions", "changeStartX", "changeStartY", "changeStartState");
			this.model.bind("change", this.render);
			this.model.bind("remove", this.unrender);
		},
		render: function() {
			var tmpl = _.template(this.template);
			this.$el.html(tmpl(this.model.toJSON()));
			
			return this;
		},
		initOptions: function() {
			var self = this;
			this.model.set("startPositionX", $("#startX").val());
			this.model.set("startPositionY", $("#startY").val());
			this.model.set("startState", $("#startState").val());
			this.model.save();
		},
		unrender: function(e) {
		},
		changeStartX: function(e) {
			this.model.set("startPositionX", $("#startX").val());
			this.model.save();
		},
		changeStartY: function() {
			this.model.set("startPositionY", $("#startY").val());
			this.model.save();
		},
		changeStartState: function() {
			this.model.set("startState", $("#startState").val());
			this.model.save();
		}
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
			positionX: -1, 
			positionY: -1,
			type: null // string
		}
	});
	var TileView = Backbone.View.extend({
		tagName: 'div',
		className: "tile",
		template: $("#tileTemplate").html(),
		events: {
			"click": "showTileRules",
			"click span.delete": "remove"
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
			$("div#boardRulesPanel").show();
			$('div#slotRulesPanel').hide();
			$(this.el).remove();
			this.remove();
			if (!e.cid) { // if not a model
				e.stopImmediatePropagation();
			}
		},
		remove: function(e) {
			this.model.destroy();
			if (e) {
				e.stopImmediatePropagation();
			}
		},
		showTileRules: function(e) {
			$("div#boardRulesPanel").hide();
			$('div#slotRulesPanel').show();
			var tileRulesView = new TileRulesView({
				model: this.model
			});
			$("#slotRulesPanel").empty().append(tileRulesView.render().el);
			tileRulesView.initPathPicker();
			
			if (!e.cid) { // if not a model
				e.stopImmediatePropagation();
			}
		}
	});
	var TileList = Backbone.Collection.extend({
		model: Tile,
		localStorage: new Store("TileList")
	});
	var TileRulesView = Backbone.View.extend({
		tagName: 'div',
		template: $("#tileRulesTemplate").html(),
		events: {
			"click #pathPicker td": "changeTilePaths"
		},    
		initialize: function() {
			_.bindAll(this, "render", "unrender", "changeTilePaths", "initPathPicker", "showNormalArrow", "showSelectedArrow", "setArrowAsSelected");
			this.model.bind("change", this.render);
			this.model.bind("remove", this.unrender);
		},
		render: function() {
			var tmpl = _.template(this.template);
			this.$el.html(tmpl(this.model.toJSON()));
			
			return this;
		},
		initPathPicker: function() {
			var self = this;
		
			// bind path picker events (TODO find more backbone way to do this)
			$("#pathPicker td").mouseenter(function() {
				self.showSelectedArrow(this);
			});
			$("#pathPicker td").mouseleave(function() {
				self.showNormalArrow(this);
			});
			
			// update path picker
			var paths = this.model.get("paths");
			// reset all paths
			$("#pathPicker .arrow").removeClass("arrow-hide");
			$("#pathPicker .arrow-selected").removeClass("arrow-show");
			$("#pathPicker td").removeClass("hover");
			
			for (var i = 0; i < paths.length; i++) {
				// depending on paths array, select
				var tdId = "";
				switch(paths[i]) {
					case 0:
						tdId = "up";
						break;
					case 1:
						tdId = "left";
						break;
					case 2:
						tdId = "down";
						break;
					case 3:
						tdId = "right";
						break;
					case 4:
						tdId = "up_left";
						break;
					case 5:
						tdId = "down_left";
						break;
					case 6:
						tdId = "down_right";
						break;
					case 7:
						tdId = "up_right";
						break;
				}
				this.setArrowAsSelected($("#pathPicker td#" + tdId));
			}
		},
		unrender: function(e) {
		},
		changeTilePaths: function(e) {
			// update Tile path attribute
			var self = this;
			var arrowId = e.currentTarget.id;
			var addPath = false;
			var removePath = false;
			
			var arrowTd = $("#pathPicker td#" + arrowId);
			if (arrowTd.hasClass("hover")) {
				this.setArrowAsSelected(arrowTd);
				addPath = true;
			} else {
				$(".arrow", arrowTd).removeClass("arrow-hide");
				$(".arrow-selected", arrowTd).removeClass("arrow-show");
		
				arrowTd.mouseleave(function() {
					self.showNormalArrow(this);
					console.log("mouseout");
				});
				arrowTd.mouseenter(function() {
					self.showSelectedArrow(this);
					console.log("mouseover");
				});
				removePath = true;
			}
		
			var pathClicked = -1;
			switch(arrowId) {
				case "up_left":
					pathClicked = 4;
					break;
				case "up":
					pathClicked = 0;
					break;
				case "up_right":
					pathClicked = 7;
					break;
				case "left":
					pathClicked = 1;
					break;
				case "right":
					pathClicked = 3;
					break;
				case "down_left":
					pathClicked = 5;
					break;
				case "down":
					pathClicked = 2;
					break;
				case "down_right":
					pathClicked = 6;
					break;
			}
			
			var paths = this.model.get("paths");
			if (pathClicked != -1 && ($.inArray(pathClicked, paths) == -1) && addPath) {
				paths.push(pathClicked);
			} else if (pathClicked != -1 && removePath) {
				var index = paths.indexOf(pathClicked);
				while (index != -1) {
					paths.splice(index, 1);
					index = paths.indexOf(pathClicked);
				}
			}
			this.model.set("paths", paths);
			this.model.save();
			if (!e.cid) { // if not a model
				e.stopImmediatePropagation();
			}
		},
		setArrowAsSelected: function(self) {
			$(".arrow", $(self)).addClass("arrow-hide");
			$(".arrow-selected", $(self)).addClass("arrow-show");
			$(self).unbind("mouseleave");
			$(self).unbind("mouseenter");
			$(self).removeClass("hover");
		},
		showSelectedArrow: function(self) {
			$(".arrow", $(self)).addClass("arrow-hide");
			$(".arrow-selected", $(self)).addClass("arrow-show");
			$(self).addClass("hover");
		},
		showNormalArrow: function(self) {
			$(".arrow", $(self)).removeClass("arrow-hide");
			$(".arrow-selected", $(self)).removeClass("arrow-show");
			$(self).removeClass("hover");	
		}
	});
	
	/* SLOT AND BOARD */
	/* The empty slot on the board a tile can be placed into. */
	var Slot = Backbone.Model.extend({
		defaults: {
			positionX: -1, 
			positionY: -1
		}
	});
	var SlotView = Backbone.View.extend({
		tagName: 'div',
		className: "slot",
		events: {
		},    
		initialize: function() {
			_.bindAll(this, "render", "unrender", "remove");
			this.model.bind("change", this.render);
			this.model.bind("remove", this.unrender);
		},
		render: function() {
			var self = this;
			self.$el.addClass("slot_" + this.model.get("positionX"));
			this.$el.droppable({
				drop: function( event, ui ) {
					// Create a new Tile and place on top of slot
					var model = $(ui.draggable).data("backbone-view").model;
					
					var tile = tileList.create({
						positionX: self.model.get("positionX"),
						positionY: self.model.get("positionY"),
						type: model.get("name"),
						paths: []
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
		model: Slot//,
		//localStorage: new Store("SlotList")
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
				var row = $("<div class='row' id='row_" + i +"'>");
				for (var j = 0; j < this.model.get("sizeX"); j++) {
					// create slot
					var slot = new Slot({
						positionX: j, 
						positionY: i
					});
					
					this.model.collection.add(slot);
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
			$("div#boardRulesPanel").show();
			$('div#slotRulesPanel').hide();
		}
	});	
	
	/* App Views */
	var BoardEditView = Backbone.View.extend({
		el: $("#board_design"),
		events: {
			'click button#setBoardSize': 'setBoardSize',
			'click button#clearBoard': 'clearBoardAsk'
		},
		initialize: function() {
			_.bindAll(this, 'render', 'clearBoard', 'clearBoardAsk','setBoardSize', 'addOne', 'addAll');
			tileList.bind('reset', this.addAll, this); // when re-loading the pieces list from storage
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
			this.clearBoard();
			this.board.destroy();
			
			// replace with new board
			this.board = new Board({id: 1, sizeX: size, sizeY: size});
			this.board.save();
			this.boardView = new BoardView({model: this.board});
			this.boardView.render();
		},
		clearBoard: function() {
			while (!tileList.isEmpty()) {
				tileList.pop();
			}
		},
		clearBoardAsk: function() {
			var self = this;
			$( "#dialog-clearBoard" ).show().dialog({
				resizable: false,
				height:140,
				modal: true,
				buttons: {
					"Clear": function() {
						self.clearBoard();
						$( this ).dialog( "close" );
					},
					Cancel: function() {
						$( this ).dialog( "close" );
					}
				}
			});
		},
		addOne: function(tile) {
			var view = new TileView({model: tile});
			var positionX = tile.get("positionX");
			var positionY = tile.get("positionY");
			
			// get the slot of the right position
			var destSlot = $(".slot_" + positionX, $("#row_" + positionY));
			destSlot.append(view.render().el);
		},
		addAll: function() {
			tileList.each(this.addOne);
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
	var RulesSelectView = Backbone.View.extend({
		el: $("#rules_select"),
		initialize: function() {
			// TODO: bind pieces and players to the select menus within the rules
			ruleList.collection.bind('reset', ruleList.render); 
			this.render();
		}
	});	
	
	var Settings = Backbone.Model.extend({
		initialize: function() {
		},
		defaults: {
			moveDecider: "dice",
			moveDeciderOptions: {
				minRoll: 1,
				maxRoll: 6
			}
		},
		localStorage: new Store("Settings")
	});
	var SettingsView = Backbone.View.extend({
		el: $("#settings"),
		events: {
			'change #move_decider': 'showMoveDeciderOptions',
			'change #move_decider_options input': 'saveMoveDeciderOptions'
		},
		initialize: function() {
			_.bindAll(this, 'render', 'showMoveDeciderOptions', 'saveMoveDeciderOptions');
			this.render();
		},
		render: function() {
			// load settings from storage
			var moveDecider = settings.get("moveDecider");
			if (typeof moveDecider == "undefined") {
				moveDecider = "dice";
			}
			$("#move_decider option[value='" + moveDecider + "']").attr('selected', 'selected');
			this.showMoveDeciderOptions();
		},
		showMoveDeciderOptions: function() {
			var moveDecider = $("#move_decider").val();
			if (moveDecider == "choose") {
				$("#move_decider_options").hide();
			} else {
				// TODO change move decider options based on chosen value
				$("#move_decider_options").show();
				var moveDeciderOptions = settings.get("moveDeciderOptions");
				if (moveDeciderOptions != null) {
					$("#min_roll").val(moveDeciderOptions.minRoll);
					$("#max_roll").val(moveDeciderOptions.maxRoll);
				}
				settings.set("moveDecider", moveDecider);
				settings.save();
			}
		},
		saveMoveDeciderOptions: function() {
			// TODO change move decider options based on chosen value
			var minRoll = $("#min_roll").val();
			var maxRoll = $("#max_roll").val();
			var moveDeciderOptions = {
				minRoll: minRoll,
				maxRoll: maxRoll
			};
			settings.set("moveDeciderOptions", moveDeciderOptions);
			settings.save();
		}
	});	
	
	// Instantiate stuff
	
	ruleList = new RuleListView();
	
	playerList = new PlayerListView();
	pieceTypeList = new PieceTypeListView();
	pieceList = new PieceList();
	
	tileTypeList = new TileTypeListView();
	tileList = new TileList();
	
	boardEditView = new BoardEditView();
	piecesAndPlayersView = new PiecesAndPlayersView();
	rulesSelectView = new RulesSelectView();
	
	settings = new Settings({id: 123}); //TODO remove dummy id value -- needed for proper fetching though
	settings.fetch();
	settingsView = new SettingsView();
	
	// Load data
	if (localStorage.getItem("TileTypeList") == null) {
		for (var i = 0; i < tileTypes.length; i++) {
			tileTypeList.collection.create(tileTypes[i]);
		}
	} else {
		tileTypeList.collection.fetch();
	}
	tileList.fetch();
	
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
	
	
	if (localStorage.getItem("RuleList") == null) {
		for (var i = 0; i < rules.length; i++) {
			ruleList.collection.create(rules[i]);
		}
	} else {
		ruleList.collection.fetch(); // players MUST be loaded before pieces
	}
});