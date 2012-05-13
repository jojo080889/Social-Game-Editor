<?php 
$page = "index";
include "header.php" 
?>
    <div id="vtab">
        <ul>
            <li class="home selected">board</li>
            <li class="login">pieces</li>
            <li class="support">settings</li>
        </ul>
        <div>
			<h4>Design your board</h4>

			Set grid size:
			<input type="text" placeholder="x" id="numX" onchange=changeGridSize() />
			<input type="text" placeholder="y" id="numY" onchange=changeGridSize() /><br /><br />

			<div id="slotsArea">
				<!--
				<div class="slot droppable ui-widget-header" ></div>
				<div class="slot droppable ui-widget-header" ></div>
				<div class="slot droppable ui-widget-header" ></div>
				-->
				<div style="margin: 0 auto; width: 160px; margin-top: 170px; color: #bbb;">Specify grid size</div>
			</div>

				<input type="button" value="Define a new tile" />

			<div id="tileChoices">
				<div id="#002930" class="draggable ui-widget-content tile" style="background: #002930">
				</div>
				<div id="#F8F0AF" class="draggable ui-widget-content tile" style="background: #F8F0AF">
				</div>
				<div id="#AC4A00" class="draggable ui-widget-content tile" style="background: #AC4A00">
				</div>
				<div id="#C5B475" class="draggable ui-widget-content tile" style="background: #C5B475">
				</div>
				<div id="#FDFDEB" class="draggable ui-widget-content tile" style="background: #FDFDEB">
				</div>
				<div id="#E6DEAD" class="draggable ui-widget-content tile" style="background: #E6DEAD">
				</div>
			</div>
					
					
			<div id="slotRulesPanel">
				<h4>Rules for this board slot...</h4>
				1. On land ... <br/>
				2. On land ... <br />
			</div>

		</div>
        <div id="player_tab" class="tab">
            <h4>Create Pieces and Players</h4>
			<div class="demo" style="float: left; width: 600px">
				<div id="playerList">
					<button id="addPlayer">Add a Player</button>
					<button id="removePlayer">Remove a Player</button>
				</div>
				
				<div style="padding: 20px; background: white; clear: both; height: 200px; width: 500px; ">
				
				<h6>Drag pieces to players</h6>
					<div id="queen" class="draggable" class="ui-widget-content">
						<p><img src="images/pieces/1.png"></p>
					</div>
					<div id="king" class="draggable" class="ui-widget-content">
						<p><img src="images/pieces/2.png"></p>
					</div>
					<div id="knight" class="draggable" class="ui-widget-content">
						<p><img src="images/pieces/3.png"></p>
					</div>
					<div id="pawn" class="draggable" class="ui-widget-content">
						<p><img src="images/pieces/4.png"></p>
					</div>
					<div id="queen1" class="draggable" class="ui-widget-content">
						<p><img src="images/pieces/1.png"></p>
					</div>
					<div id="king1" class="draggable" class="ui-widget-content">
						<p><img src="images/pieces/2.png"></p>
					</div>
					<div id="knight1" class="draggable" class="ui-widget-content">
						<p><img src="images/pieces/3.png"></p>
					</div>
					<div id="pawn1" class="draggable" class="ui-widget-content">
						<p><img src="images/pieces/4.png"></p>
					</div>
				</div>
			</div><!-- End demo-description -->
			
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
    </div>
	
	<!-- templates -->
	<script id="playerTemplate" type="text/template">
		<p>Player <%= id + 1 %></p>
	</script>
</body>
</html>
