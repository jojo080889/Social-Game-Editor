/* App JS */
/* Will soon be replaced with Backbone */
$(document).ready(function() {
	/* Board Tab */
	$("#numX").change(changeGridSize);
	$("#numY").change(changeGridSize);
	$("#board_design .draggable").draggable({
		snap:true,
		helper: "clone"
	});
	
	/* Tabs */
	var $items = $('#vtab>ul>li');
	$items.click(function() {
		$items.removeClass('selected');
		$(this).addClass('selected');

		var index = $items.index($(this));
		$('#vtab>div').hide().eq(index).show();
	}).eq(0).click();			// sets default tab
	
	initDroppable();
});

function initDroppable() {
	$("#slotsArea .droppable").droppable({
		drop: function( event, ui ) {
			var html = $(ui.draggable).html();
			var bg = $(ui.draggable).css("background");
			$(this).css("background", bg);
		}
	});
	$('#slotsArea .droppable').click(function() {
		$('div#slotRulesPanel').show();
	});
}

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
