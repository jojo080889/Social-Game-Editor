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
            <h4>
                Design your board</h4>
				<img onclick=cersei() src="images/toolbar.jpg" style="position: relative; top: 0; float: left;" />
				<div style="float: left; padding-top: -200px; border: 1px solid blue; height: 600px; width: 600px; overflow: hidden">
						<iframe src="http://hakim.se/experiments/html5/sketch/" style="height: 600px; margin-top: -100px; z-index: -1000; width: 600px; overflow-y: hidden" scrolling="no"></iframe>
				</div>
				<div id="triggersBoard" style="padding: 20px; font-size: 60%; line-height: 300%; width: 260px; color: #cecece; float: right; display: none; background: #2b2b2b">
					<h4>Triggers</h4>
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
					<div id="pieceTypeList">
						<button id="addPieceType">Add Piece Type</button>
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
	
	<script id="pieceTemplate" type="text/template">
		<% if (image != null) { %>
			<p><img src="<%= image %>"></p>
		<% } %>
		<span class="delete">[Delete]</span>
	</script>
</body>
</html>
