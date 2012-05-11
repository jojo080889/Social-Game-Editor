<?php include "header.php" ?>
	<style type="text/css">
		body, html {
			font-family: Helvetica;
			font-size: 12px;
			color: #333;
		}
		
		.device {
			border: solid 1px #999; 
			border-radius: 10px; 
			box-shadow: #333 1px 1px 3px; 
			padding: 10px; 
			float: left; 
			margin-right: 20px;
		}
		
		.device iframe {
			width: 320px;
			height: 480px;
			border: solid 1px #999;
		}
	</style>

	<div id="devices"></div>
	
	<div style="clear: both;"></div>
	
	<input type="button" onclick="addUser()" value="Add user/device" style="margin-top: 20px"/>
	<input type="text" id="appId" value="game_template" style="width: 300px"></input><input type="button" onclick="launch($('#appId').val())" value="Launch"/>
	<a href="http://bjdodson.com/musubi/htmlwriter/" target="_BLANK">html editor</a>
	<script type="text/javascript">
		var env = new Musubi.Browser.Environment(new Musubi.Browser.InterFrameTransport('test'));
		var feed = {name: "Test", uri: "", session: "test", key: ""};
		
		addUser();
		addUser();
		
		
		function addUser() {
			var id = $(".device").length;
			var frame = 'view' + id;
			var user = {name: "User " + (id + 1), id: id};
			
			$("#devices").append('<div class="device"><iframe name="' + frame + '"></iframe></div>');
			env.startInstance(frame, user, feed, 'edu.stanford.mobisocial.dungbeetle');
		}
		
		function launch(appId) {
			var user = {name: "User 1", id: 0};
			env.startInstance('view0', user, feed, appId);
		}
	</script>
	
	<div style="width: 900px; margin: 0 auto">
		<div style="float: right; width: 450px"><img src="images/android.png" width=450/></div>
		<div style="float: right; color: #2b2b2b; padding: 20px; width: 360px; background: white; margin: 20px; height: 550px;" class="sansa">
		Game Logic
		<p>
		trigger 1<br/>
		trigger 1<br/>
		trigger 1<br/>
		trigger 1<br/>
		trigger 1<br/>
		trigger 1<br/>
		trigger 1<br/>
		</p>
		</div>
	</div>
</body>
</html>