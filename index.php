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
		<div id="edit_board">
			<h4>Design your Board</h4>
		
			<button id="addTileType" class="button"><i class="icon-plus"></i> Add Tile Type</button>
			<div id="tileChoicesContainer" class="scroll_container">
				<div class="scrollLeft scroll"><i class="icon-chevron-left"></i></div>
				<div class="scrollRight scroll"><i class="icon-chevron-right"></i></div>
				<div id="tileChoices" class="scroll_list">
				</div>
			</div>

			<span id="size_text">Set grid size:</span> <input type="text" placeholder="Type a number..." id="size" />
			<button id="setBoardSize" class="button">Set Board Size</button>
			<button id="clearBoard" class="button">Clear Board</button>
			<div id="slotsArea">
				<div class="info_text">Specify grid size</div>
			</div>
		</div>
				
		<div id="slotRulesPanel" class="rules_panel">
	
		</div>
		<div id="boardRulesPanel" class="rules_panel">
			<h4>Rules for Game</h4>
			<div id="rules_select" class="tab_content">
				<button id="addRule" class="button"><i class="icon-plus"></i>Add Rule</button>
				<button id="removeRule" class="button"><i class="icon-minus"></i>Remove Rule</button>
				
				<div id="ruleList"></div>
			</div>
		</div>
	</div>
	
	<!-- player design tab -->
	<div id="player_design" class="tab_content">
		<div id="edit_pieces">
			<h4>Create Pieces and Players</h4>
			
			<p>Drag-and-drop pieces to assign them to players.</p>
			
			<button id="addPieceType" class="button"><i class="icon-plus"></i>Add Piece Type</button>
			<div id="pieceTypeListContainer" class="scroll_container">
				<div class="scrollLeft scroll"><i class="icon-chevron-left"></i></div>
				<div class="scrollRight scroll"><i class="icon-chevron-right"></i></div>
				<div id="pieceTypeList" class="scroll_list">
				</div>
			</div>
			
			<button id="addPlayer" class="button"><i class="icon-plus"></i>Add a Player</button>
			<button id="removePlayer" class="button"><i class="icon-minus"></i>Remove a Player</button>
			<div id="playerList">
			</div>
		</div>
		
		<div id="triggersPiece" class="rules_panel">
		</div>	
	</div>
	
	<!-- settings tab -->
	<div id="settings" class="tab_content">
		<h4>Settings</h4>
		<div>
			<p>
				Move Decider:
				<select id="move_decider">
					<option value="choose">Choose...</option>
					<option value="dice">Dice (default)</option>
				</select>
			</p>
			<p id="move_decider_options">
				Minimum roll: <input type="text" id="min_roll" size="2" />
				Maximum roll: <input type="text" id="max_roll" size="2" />
			</p>
		</div>
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
			<button id="sk_app_launch" class="button">Launch SK</button>
			<button id="app_restart" class="button"><i class="icon-refresh"></i> Restart Game</button>
			<button id="return_feed" class="button"><i class="icon-stop"></i> Return to Feed</button>
		</div>
		<div id="test_debug">
			--- Donburi test console: Errors and warnings will be displayed here. ---
		</div>
		<div id="devices"></div>
	</div>
</div>	
	
<!-- dialogs -->
<div id="dialog-pieceTypeDelete" class="dialog" title="Delete this piece type?">
	<p><span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 20px 0;"></span>Deleting this piece type will delete all pieces of that type currently assigned to players. Are you sure?</p>
</div>
<div id="dialog-tileTypeDelete" class="dialog" title="Delete this tile type?">
	<p><span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 20px 0;"></span>Deleting this tile type will delete all tiles of that type currently on the board. Are you sure?</p>
</div>
<div id="dialog-playerPieceDelete" class="dialog" title="Delete this player?">
	<p><span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 20px 0;"></span>Removing this player will remove pieces assigned to this player. Are you sure?</p>
</div>
<div id="dialog-pieceTypeAdd" class="dialog" title="Add a Piece Type">
	<p>Piece Type Name: <input type="text" id="new_pieceTypeName" /></p>
	<p>Color: <input type="text" id="new_pieceTypeColor" /></p>
</div>
<div id="dialog-tileTypeAdd" class="dialog" title="Add a Tile Type">
	<p>Tile Type Name: <input type="text" id="new_tileTypeName" /></p>
	<p>Color: <input type="text" id="new_tileTypeColor" /></p>
</div>
<div id="dialog-clearBoard" class="dialog" title="Clear Board?">
	<p><span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 20px 0;"></span>Do you really want to clear the board of all tiles?</p>
</div>

<!-- templates -->
<script id="ruleTemplate" type="text/template">
	<p>
		<h2>Rule <%= id + 1 %><span class="delete" style="position:relative; float: right;"><i class="icon-remove-sign"></i></span>
		</h2>
		
		<div class="when">
			<h2>When:</h2>
			<select class="sensing_object">
				<option></option>
				<option>player</option>
				<option>slot</option>
				<option>piece</option>
			</select>
		</div>
		<div class="do">
			<h2>Do:</h2>
			<select class="action">
				<option></option>
				<option value="change">change</option>
				<option value="add">add to board ... </option>
				<option value="remove">remove piece from board</option>
				<option value="disable_leave">disable leave rules</option>
				<option value="disable_land">disable land rules</option>
				<option value="enable_leave">enable leave rules</option>
				<option value="enable_land">enable land rules</option>
				<option value="give">give player more turns </option>
				<option value="skip">player skips turn</option>
				<option value="win">player wins</option>
				<option value="lose">player loses</option>
				<option value="end">end game</option>
			</select>
		</div>
	</p>
</script>


<script id="playerTemplate" type="text/template">
	<p>Player <%= id + 1 %></p>
</script>

<script id="pieceTemplate" type="text/template">
	<% if (image != null) { %>
		<p><img src="<%= image %>"></p>
	<% } else { %>
		<div class="colorPiece"></div>
	<% } %>
	<span class="name"><%= name %></span>
	<span class="delete"><i class="icon-remove-sign"></i></span>
</script>

<script id="tileTypeTemplate" type="text/template">
	<div class="colorTile"></div>
	<p><%= name %></p>
	<span class="delete"><i class="icon-remove-sign"></i></span>
</script>
<script id="tileTemplate" type="text/template">
	<span class="delete">[Delete]</span>
</script>

<script id="tileRulesTemplate" type="text/template">
	<h4>Rules for Slot (<%= positionX %>, <%= positionY %>)</h4>
	1. On land ... <br/>
	2. On land ... <br />
	
	<table id="pathPicker">
	<tr>
		<td id="up_left">
			<img src="images/arrows/nw.png" class="arrow" />
			<img src="images/arrows/nw_select.png" class="arrow arrow-selected" />
		</td>
		<td id="up">
			<img src="images/arrows/n.png" class="arrow"/>
			<img src="images/arrows/n_select.png" class="arrow arrow-selected" />
		</td>
		<td id="up_right">
			<img src="images/arrows/ne.png" class="arrow" />
			<img src="images/arrows/ne_select.png" class="arrow arrow-selected" />
		</td>
	</tr>
	<tr>
		<td id="left">
			<img src="images/arrows/w.png" class="arrow"/>
			<img src="images/arrows/w_select.png" class="arrow arrow-selected" />
		</td>
		<td>
			<img src="images/arrows/center.png"  />
		</td>
		<td id="right">
			<img src="images/arrows/e.png" class="arrow" />
			<img src="images/arrows/e_select.png" class="arrow arrow-selected" />
		</td>
	</tr>
	<tr>
		<td id="down_left">
			<img src="images/arrows/sw.png" class="arrow" />
			<img src="images/arrows/sw_select.png" class="arrow arrow-selected" />
		</td>
		<td id="down">
			<img src="images/arrows/s.png" class="arrow" />
			<img src="images/arrows/s_select.png" class="arrow arrow-selected" />
		</td>
		<td id="down_right">
			<img src="images/arrows/se.png" class="arrow" />
			<img src="images/arrows/se_select.png" class="arrow arrow-selected" />
		</td>
	</tr>
	</table>
</script>

<script id="pieceOptionsTemplate" type="text/template">
	<h4>Starting location</h4>
	X: <input type="text" size="2" id="startX" value="<%= startPositionX %>" />
	Y: <input type="text" size="2" id="startY" value="<%= startPositionY %>" />
	
	<h4>Starting state</h4>
	<select id="startState">
		<% if (startState == "isOnBoard") { %>
			<option selected="selected">isOnBoard</option>
		<% } else { %>
			<option>isOnBoard</option>
		<% } %>
		<% if (startState == "isOffBoard") { %>
			<option selected="selected">isOffBoard</option>
		<% } else { %>
			<option>isOffBoard</option>
		<% } %>
		<% if (startState == "isPermOffBoard") { %>
			<option selected="selected">isPermOffBoard</option>
		<% } else { %>
			<option>isPermOffBoard</option>
		<% } %>
	</select>
</script>
<?php include "footer.php" ?>
