<?php
// check if game directory exists, if not, create it
$hostDir = "../hosted/musubi/app/game";
if(!is_dir($hostDir)) {
	mkdir($hostDir);
} else {
	// Empty hosted game directory
	SureRemoveDir($hostDir, false);
}

// copy game_template in to hosted game directory
recurse_copy("../apps/game_template", $hostDir);

// $dir = the target directory
// $DeleteMe = if true delete also $dir, if false leave it alone
function SureRemoveDir($dir, $DeleteMe) {
    if(!$dh = @opendir($dir)) return;
    while (false !== ($obj = readdir($dh))) {
        if($obj=='.' || $obj=='..') continue;
        if (!@unlink($dir.'/'.$obj)) SureRemoveDir($dir.'/'.$obj, true);
    }
    if ($DeleteMe){
        closedir($dh);
        @rmdir($dir);
    }
}

echo $hostDir;

// recurively copy all contents of $src directory to $dst directory
function recurse_copy($src,$dst) { 
    $dir = opendir($src); 
    @mkdir($dst); 
    while(false !== ( $file = readdir($dir)) ) { 
        if (( $file != '.' ) && ( $file != '..' )) { 
            if ( is_dir($src . '/' . $file) ) { 
                recurse_copy($src . '/' . $file,$dst . '/' . $file); 
            } 
            else { 
                copy($src . '/' . $file,$dst . '/' . $file); 
            } 
        } 
    } 
    closedir($dir); 
} 
?>