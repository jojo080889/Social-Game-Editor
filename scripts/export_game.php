<?php 
// Write components file
$res = json_decode(stripslashes($_POST['data']), true);
$resEn = "var data = ".json_encode($res);
$filename = '../apps/game_template/js/components.js';

$handle = fopen($filename, 'w+');
fwrite($handle, $resEn);
fclose($handle);

// Move over any piece images needed
$pieces = $res["pieces"]["pieces"];
// Empty game images directory
SureRemoveDir("../apps/game_template/images/pieces", false);
for ($i = 0; $i < count($pieces); $i++) {
	if (array_key_exists('image', $pieces[$i])) {
		//$imagesToMove[] = $pieces[$i]["image"];
		$img = $pieces[$i]["image"];
		copy("../".$img, "../apps/game_template/".$img);
	}
}
print_r($res);
echo json_encode($pieces);
echo $resEn;

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
?>