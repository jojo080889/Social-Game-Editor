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
	<div id="board_design">
		<h4>Design your board</h4>

		Set grid size:
		<input type="text" placeholder="x" id="numX" />
		<input type="text" placeholder="y" id="numY" />

		<div id="slotsArea">
			<div class="info_text">Specify grid size</div>
		</div>

		<button id="newTile">Define a new tile</button>

		<div id="tileChoices">
			<div class="draggable ui-widget-content tile" style="background: #002930">
			</div>
			<div class="draggable ui-widget-content tile" style="background: #F8F0AF">
			</div>
			<div class="draggable ui-widget-content tile" style="background: #AC4A00">
			</div>
			<div class="draggable ui-widget-content tile" style="background: #C5B475">
			</div>
			<div class="draggable ui-widget-content tile" style="background: #FDFDEB">
			</div>
			<div class="draggable ui-widget-content tile" style="background: #E6DEAD">
			</div>
		</div>
				
		<div id="slotRulesPanel">
			<h4>Rules for this board slot...</h4>
			1. On land ... <br/>
			2. On land ... <br />
		</div>
	</div>
	
	<!-- player design tab -->
	<div id="player_design" class="tab">
		<h4>Create Pieces and Players</h4>
		<div id="playerList">
			<button id="addPlayer">Add a Player</button>
			<button id="removePlayer">Remove a Player</button>
		</div>
		
		<div style="padding: 20px; background: white; clear: both; height: 200px; width: 500px; ">
			<h6>Drag pieces to players</h6>
			<div id="pieceTypeList">
				<button id="addPieceType">Add Piece Type</button>
			</div>
		</div>
		
		<div id="triggersPiece" style="padding: 20px; font-size: 60%; line-height: 300%; width: 260px; color: #cecece; float: right; display: none; background: #2b2b2b">
			<h4>Trigger for Piece</h4>
			1. On land ... <br/>
			2. On land ... <br />
		</div>	
	</div>
	
	<div>
		<h4>
			Online Support</h4>
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
	
<!-- dialogs -->
<div id="dialog-pieceTypeDelete" title="Delete this piece type?">
	<p><span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 20px 0;"></span>Deleting this piece type will delete all pieces of that type currently assigned to players. Are you sure?</p>
</div>

<!-- templates -->
<script id="playerTemplate" type="text/template">
	<p>Player <%= id + 1 %></p>
</script>

<script id="pieceTemplate" type="text/template">
	<% if (image != null) { %>
		<p><img src="<%= image %>"></p>
	<% } %>
	<span class="delete">[Delete]</span>
</script>
<?php include "footer.php" ?>
