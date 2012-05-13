<?php 
$page = "test";
include "header.php" 
?>
	
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
			<button id="app_launch">Launch Game</button>
			<button id="app_restart">Restart Game</button>
			<button id="return_feed">Return to Feed</button>
		</div>
		<div id="devices"></div>
    </div>
<?php include "footer.php" ?>
