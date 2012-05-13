$('#x').change(function() {
  alert('Handler for .change() called.');
});

function initDroppable() {
	$("#slotsArea .droppable").droppable({
		drop: function( event, ui ) {
			var html = $(ui.draggable).html();
			var ide = $(ui.draggable).attr('id');
			$(this).css("background", ide);  
			//var parentOffset = $(this).offset();
			//$(ui.draggable).offset({ top: parentOffset.top, left: parentOffset.left });
		}
	});
	$("#playerList .droppable").droppable({
		drop: function(event, ui) {
			var html = $(ui.draggable).html();
			var ide = $(ui.draggable).attr('id');
			$(this).append(html);
			if ($('div#triggersPiece').length) {
				$('div#triggersPiece').show();
				$('div#triggersPiece').html("Piece Triggers<br /><div style='float: right; background:white; width: 60px; text-align: center'; display:inline>" + html + "</div>"
											+ "<div style='float: left; line-height: 50px; font-size: 250%; color: white; font-family: Georgia; font-style: italic'>Piece: '" + ide + "'</div>"
											+ "<div style='clear: both; line-height: 40px;'>trigger 1 <select><option>on move</option><option>on kill</option></select><br />" 
											+ "trigger 2 <select><option>on move</option><option>on kill</option></select><br />"
											+ "trigger 3 <select><option>on move</option><option>on kill</option></select><br />"
											+ "</div>") ;
				
				$( this )
					.addClass( "ui-state-highlight" )
					.find( "p" )
						//.html( "Dropped!" );
			}
		}
	});
	$('.droppable').click(function() {
		rulesToolbar();
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


/*** Buttons ***/
$(document).ready(function() {
	$('.otherbutton,.homebutton,.downloadbutton,.donatebutton').append('<span class="hover"></span>').each(function () {
		var $span = $('> span.hover', this).css('opacity', 0);
		$(this).hover(function () {
			$span.stop().fadeTo(500, 1);
		}, function () {
	$span.stop().fadeTo(500, 0);
		});
	});
});

/*** Tabs ***/
$(function() {
	var $items = $('#vtab>ul>li');
	$items.mouseover(function() {
		$items.removeClass('selected');
		$(this).addClass('selected');

		var index = $items.index($(this));
		$('#vtab>div').hide().eq(index).show();
	}).eq(0).mouseover();			// sets default tab
	
});

/*** Rules Panel ***/
function rulesToolbar() {
	$('div#slotRulesPanel').show();
}


/*** Drag and Drop ***/
$(function() {
	$( ".draggable" ).draggable({
		snap:true,
		helper: "clone"
	});
});

$(document).ready(function() {
	initDroppable();
  }
);