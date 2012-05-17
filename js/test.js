/* test.js
 * Javascript file for test.php.
 */

var env;
var feed;
var test_user_count = 0;

$(document).ready(function() {
 	env = new Musubi.Browser.Environment(new Musubi.Browser.InterFrameTransport('test'));
	feed = {name: "Test", uri: "", session: "test", key: ""};

	$("#app_launch").click(function() {
		createGameModelsFile(function() {launch("game_template");}); // generate components.js
	});
	$("#return_feed").click(function() {
		var user = {name: "User 1", id: 0};
		env.startInstance('view0', user, feed, "edu.stanford.mobisocial.dungbeetle");
		user = {name: "User 2", id: 1};
		env.startInstance('view1', user, feed, "edu.stanford.mobisocial.dungbeetle");
	});

	addUser();
	addUser();		
});
 
function addUser() {
	var frame = 'view' + test_user_count;
	var user = {name: "User " + (test_user_count + 1), id: test_user_count};
	test_user_count++;

	$("#devices").append('<div class="device" id="device' + (test_user_count + 1) + '"><iframe name="' + frame + '"></iframe></div>');
	env.startInstance(frame, user, feed, 'edu.stanford.mobisocial.dungbeetle');
}
		
function launch(appId) {
	var user = {name: "User 1", id: 0};
	env.startInstance('view0', user, feed, appId);
}

