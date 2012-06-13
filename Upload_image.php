<?php

// If you want to ignore the uploaded files,
// set $demo_mode to true;

$upload_dir = 'uploads/';
$allowed_ext = array('jpg','jpeg','png','gif');

if(strtolower($_SERVER['REQUEST_METHOD']) != 'post'){
	exit_status('Error! Wrong HTTP method!');
}

if(array_key_exists('fileToUpload',$_FILES) && $_FILES['fileToUpload']['error'] == 0 ){

	$image = $_FILES['fileToUpload'];

	if(!in_array(get_extension($image['name']),$allowed_ext)){
		exit_status('Only '.implode(',',$allowed_ext).' files are allowed!');
	}	

	// Move the uploaded file from the temporary
	// directory to the uploads folder:

	if(move_uploaded_file($image['tmp_name'], $upload_dir.$image['name'])){
		exit_status($upload_dir.$image['name']);
	}

}

exit_status('Something went wrong with your upload!');

// Helper functions

function exit_status($str){
	echo $str;
	exit;
}

function get_extension($file_name){
	$ext = explode('.', $file_name);
	$ext = array_pop($ext);
	return strtolower($ext);
}

?>