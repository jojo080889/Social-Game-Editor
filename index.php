<?php 
$page = "index";
include "header.php" 
?>
<div id="vtab">
	<ul>
		<li class="home selected">Board</li>
		<li class="login">Pieces</li>
		<li class="support">Settings</li>
	</ul>
	
	<!-- board design tab -->
	<div id="board_design" class="tab_content">
		<h4>Design your board</h4>

		Set grid size: <input type="text" placeholder="Type a number..." id="size" />
		<button id="setBoardSize">Set Board Size</button>

		<div id="slotsArea">
			<div class="info_text">Specify grid size</div>
		</div>

		<button id="addTileType">Add Tile Type</button>

		<div id="tileChoices">
		</div>
				
		<div id="slotRulesPanel" class="rules_panel">
			<h4>Rules for this board slot...</h4>
			1. On land ... <br/>
			2. On land ... <br />
		</div>
	</div>
	
	<!-- player design tab -->
	<div id="player_design" class="tab_content">
		<h4>Create Pieces and Players</h4>
		
		<p>Drag-and-drop pieces to assign them to players.</p>
		
		<button id="addPieceType" class="button"><i class="icon-plus"></i>Add Piece Type</button>
		<div id="pieceTypeListContainer">
			<div class="scrollLeft scroll"><i class="icon-chevron-left"></i></div>
			<div class="scrollRight scroll"><i class="icon-chevron-right"></i></div>
			<div id="pieceTypeList">
			</div>
		</div>
		
		<button id="addPlayer" class="button"><i class="icon-plus"></i>Add a Player</button>
		<button id="removePlayer" class="button"><i class="icon-minus"></i>Remove a Player</button>
		<div id="playerList">
		</div>
		
		<div id="triggersPiece" class="rules_panel">
			<h4>Trigger for Piece</h4>
			1. On land ... <br/>
			2. On land ... <br />
		</div>	
	</div>
	
	<!-- settings tab -->
	<div id="settings" class="tab_content">
		<h4>Online Support</h4>
		Maecenas in varius nulla. Morbi leo elit, volutpat ac faucibus in; aliquam eget
		massa. Nullam a neque ac turpis luctus venenatis et placerat risus. Quisque pretium
		scelerisque sapien, et accumsan nunc venenatis non. Donec ullamcorper, leo gravida
		hendrerit interdum, tellus nisi vestibulum justo; quis dignissim enim risus quis
		ipsum.<br />
		<br />
		Mauris fringilla, urna vitae posuere commodo, neque tellus tincidunt nisi, aliquam
		scelerisque purus nulla ac enim. Cras urna urna, vestibulum ut aliquam sed, laoreet
		et justo! Vestibulum eleifend porta mollis. Donec molestie, turpis sed commodo consequat,
		erat purus sollicitudin arcu, non vestibulum risus lacus ac ipsum. Curabitur vitae
		pellentesque purus.
	</div>
</div> <!-- end vtab -->
	
<div id="test_tab">
	<div id="rule_summary"> 
		<h1>How to Play</h1>
		<p class="info_text">
			These rules have been automatically generated from the program you've created.
		</p>
		<ul id="rule_list">
			<li>
				On the start of your turn, roll a dice and move the number of spaces you roll.
			</li>
			<li>
				When you land on the same square an opponent is occupying, the opponent must move their piece back to start.
			</li>
		</ul>
	</div>

	<div id="test_area">
		<div id="test_actions">
			<button id="app_launch" class="button"><i class="icon-play"></i> Launch Game</button>
			<button id="app_restart" class="button"><i class="icon-refresh"></i> Restart Game</button>
			<button id="return_feed" class="button"><i class="icon-stop"></i> Return to Feed</button>
		</div>
		<div id="devices"></div>
	</div>
</div>	
	
<!-- dialogs -->
<div id="dialog-pieceTypeDelete" title="Delete this piece type?">
	<p><span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 20px 0;"></span>Deleting this piece type will delete all pieces of that type currently assigned to players. Are you sure?</p>
</div>
<div id="dialog-tileTypeDelete" title="Delete this tile type?">
	<p><span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 20px 0;"></span>Deleting this tile type will delete all tiles of that type currently on the board. Are you sure?</p>
</div>

<!-- templates -->
<script id="playerTemplate" type="text/template">
	<p>Player <%= id + 1 %></p>
</script>

<script id="pieceTemplate" type="text/template">
	<% if (image != null) { %>
		<p><img src="<%= image %>"></p>
	<% } else { %>
		<div class="colorPiece" style="background: <% color %>"></div>
	<% } %>
	<span class="name"><%= name %></span>
	<span class="delete"><i class="icon-remove-sign"></i></span>
</script>

<script id="tileTypeTemplate" type="text/template">
	<p><%= name %></p>
	<span class="delete">[Delete]</span>
</script>
<script id="tileTemplate" type="text/template">
	<span class="delete">[Delete]</span>
</script>

<?php include "footer.php" ?>
