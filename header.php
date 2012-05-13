<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<!-- for all pages -->
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
	<script src="http://code.jquery.com/ui/1.8.18/jquery-ui.min.js" type="text/javascript"></script>
    <script src="http://cdnjs.cloudflare.com/ajax/libs/json2/20110223/json2.js"></script>
    <script src="http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.3.3/underscore-min.js"></script>
    <script src="http://cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.2/backbone-min.js"></script>
	<script type="text/javascript" src="js/buttons.js"></script>
	<link rel="stylesheet" href="http://code.jquery.com/ui/1.8.18/themes/base/jquery-ui.css" type="text/css" media="all" />
	<link rel="stylesheet" href="http://static.jquery.com/ui/css/demo-docs-theme/ui.theme.css" type="text/css" media="all" />
    <link rel="stylesheet" href="style.css" type="text/css" media="screen" />
    <link rel="stylesheet" href="button-styles.css" type="text/css" media="screen" />
    <!--[if IE 7]>
    <style type="text/css">
        #vtab > ul > li.selected{
            border-right: 1px solid #fff !important;
        }
        #vtab > ul > li {
            border-right: 1px solid #ddd !important;
        }
        #vtab > div { 
            z-index: -1 !important;
            left:1px;
        }
    </style>
    <![endif]-->
	
	<!-- For edit tab -->
	<?php if ($page == "index") { ?>
	<script type="text/javascript" src="js/backend.js"></script>
	<?php } ?>
	
	<!-- For testing tab -->
	<?php if($page == "test") { ?>
	<script type="text/javascript" src="js/lib/socialKit.js"></script>
	<script type="text/javascript" src="js/lib/turnBasedGame.js"></script>
	<script type="text/javascript" src="js/rsa/bigint.js"> </script>
	<script type="text/javascript" src="js/rsa/barrett.js"> </script>
	<script type="text/javascript" src="js/rsa/rsa.js"> </script>
	<script type="text/javascript" src="js/crypto-js/crypto-min.js"> </script>
	<script type="text/javascript" src="js/crypto-js/crypto-sha1-hmac-pbkdf2-blockmodes-aes.js"> </script>
	<script type="text/javascript" src="js/musubi/web_socket.js"> </script>
	<script type="text/javascript" src="js/musubi/transport.js"> </script>
	<script type="text/javascript" src="js/musubi/messageFormat.js"> </script>
	<script type="text/javascript" src="js/lib/platforms/socialKit-browser.js"></script>	
	<script type="text/javascript" src="js/test.js"></script>
	<link rel="stylesheet" href="css/test.css" type="text/css" />
	<?php } ?>
</head>
<body>
<header>
<div style="padding-top: 30px; margin-left: 500px">
		<a href="index.php" class="homebutton"></a>
		<a href="test.php" class="downloadbutton"></a>
</div>
</header>
