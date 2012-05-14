/* App JS */
/* Will soon be replaced with Backbone */
$(document).ready(function() {
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
	$("#mode_switch #test").click(function() {
		$("#vtab").hide();
		$("#test_tab").show();
		$("#mode_switch .mode_button").removeClass("selected");
		$(this).addClass("selected");
	});
	$("#mode_switch #edit").click(function() {
		$("#vtab").show();
		$("#test_tab").hide();
		$("#mode_switch .mode_button").removeClass("selected");
		$(this).addClass("selected");
	});
	
	/* Dialogs */
	$( "#dialog-tileTypeDelete" ).dialog({
		autoOpen: false,
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
	$( "#dialog-pieceTypeDelete" ).dialog({
		autoOpen: false,
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
});

function changeGridSize() {
	var numX = $('#numX').val(); 
	var numY = $('#numY').val(); 
	if (numX == "") numX = 1;
	if (numY == "") numY = 1;
	var tilesArea = $('#slotsArea');
	tilesArea.empty();
	for (var i = 0; i < numY; i++) {
		tilesArea.append("<div style='display: block; width: 800px'>")
		for (var j = 0; j < numX; j++) {
			jQuery('<div/>', {
				class: 'slot droppable ui-widget-header',
				html: ''
			}).appendTo(tilesArea);
		}
		tilesArea.append("</div>");
	}
	initDroppable();
}
