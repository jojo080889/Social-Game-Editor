<?php include "header.php" ?>
	
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
			<input id="add_user" type="button" value="Add user/device" />
			<input type="text" id="appId" value="game_template" />
			<input id="app_launch" type="button" value="Launch"/>
		</div>
		<div id="devices"></div>
    </div>
</body>
</html>
