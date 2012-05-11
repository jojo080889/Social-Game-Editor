/* test.js
 * Javascript file for test.php.
 */

var env;
var feed;

$(document).ready(function() {
 	env = new Musubi.Browser.Environment(new Musubi.Browser.InterFrameTransport('test'));
	feed = {name: "Test", uri: "", session: "test", key: ""};

	$("#add_user").click(addUser);
	$("#app_launch").click(function() {
		launch($("#appId").val());
	});

	addUser();
	addUser();		
		
});
 
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

