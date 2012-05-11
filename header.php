<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.1/jquery.min.js"></script>
	<!-- For testing tab -->
	<!-- TODO include these ONLY if the current tab is the testing tab -->
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
    <style type="text/css">
        #vtab {
            margin: auto;
            width: 90%;
            height: 100%;
        }
        #vtab > ul > li {
            width: 110px;
            height: 110px;
            background-color: #fff !important;
            list-style-type: none;
            display: block;
            text-align: center;
            margin: auto;
			line-height: 100px;
			text-transform: uppercase;
			font-size: 170%;
            padding-bottom: 10px;
            border: 1px solid #fff;
            position: relative;
            border-right: none;
            opacity: .3;
            -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=30)";
            filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=30);
        }
        #vtab > ul > li.home {
            background: url('home.png') no-repeat center center;
        }
        #vtab > ul > li.login {
            background: url('login.png') no-repeat center center;
        }
        #vtab > ul > li.support {
            background: url('support.png') no-repeat center center;
        }
        #vtab > ul > li.selected {
            opacity: 1;
            -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)";
            filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=100);
            border: 1px solid #ddd;
            border-right: none;
            z-index: 10;
            background-color: #fafafa !important;
            position: relative;
			
        }
        #vtab > ul {
            float: left;
            width: 110px;
            text-align: left;
            display: block;
            margin: auto 0;
            padding: 0;
            position: relative;
            top: 30px;
        }
        #vtab > div {
            background-color: #fafafa;
            margin-left: 110px;
            border: 1px solid #ddd;
            min-height: 500px;
            padding: 12px;
            position: relative;
            z-index: 9;
            -moz-border-radius: 20px;
        }
        #vtab > div > h4 {
            color: #800;
            font-size: 1.2em;
            border-bottom: 1px dotted #800;
            padding-top: 5px;
            margin-top: 0;
        }
        #loginForm label {
            float: left;
            width: 100px;
            text-align: right;
            clear: left;
            margin-right: 15px;
        }
        #loginForm fieldset {
            border: none;
        }
        #loginForm fieldset > div {
            padding-top: 3px;
            padding-bottom: 3px;
        }
        #loginForm #login {
            margin-left: 115px;
        }
    </style>

<script type="text/javascript">
	$(document).ready(function() {
		$('.otherbutton,.homebutton,.downloadbutton,.donatebutton').append('<span class="hover"></span>').each(function () {
	  		var $span = $('> span.hover', this).css('opacity', 0);
	  		$(this).hover(function () {
	    		$span.stop().fadeTo(500, 1);
	 		}, function () {
	   	$span.stop().fadeTo(500, 0);
	  		});
		});
	});
</script>
    <script type="text/javascript">
        $(function() {
            var $items = $('#vtab>ul>li');
            $items.mouseover(function() {
                $items.removeClass('selected');
                $(this).addClass('selected');

                var index = $items.index($(this));
                $('#vtab>div').hide().eq(index).show();
            }).eq(1).mouseover();
        });
		function cersei() {
			$('div#triggersBoard').show();
		}
    </script>
	<script src="http://code.jquery.com/ui/1.8.18/jquery-ui.min.js" type="text/javascript"></script>
	
	<link rel="stylesheet" href="http://code.jquery.com/ui/1.8.18/themes/base/jquery-ui.css" type="text/css" media="all" />
	<link rel="stylesheet" href="http://static.jquery.com/ui/css/demo-docs-theme/ui.theme.css" type="text/css" media="all" />
<style>
	.draggable { width: 100px; height: 100px; padding: 0.5em; float: left; margin: 10px 10px 10px 0; }
	.droppable { width: 150px; height: 250px; padding: 0.5em; float: left; margin: 10px; background: #bed4f2}
	</style>
	<script>
	$(function() {
		$( ".draggable" ).draggable({
			snap:true
		});
		$( ".droppable" ).droppable({
			drop: function( event, ui ) {
				
				var html = $(ui.draggable).html();
				var ide = $(ui.draggable).attr('id');
				$('div#triggersPiece').show();
				$('div#triggersPiece').html("Piece Triggers<br /><div style='float: right; background:white; width: 60px; text-align: center'; display:inline>" + html + "</div>"
											+ "<div style='float: left; line-height: 50px; font-size: 250%; color: white; font-family: Georgia; font-style: italic'>Piece: '" + ide + "'</div>"
											+ "<div style='clear: both; line-height: 40px;'>trigger 1 <select><option>on move</option><option>on kill</option></select><br />" 
											+ "trigger 2 <select><option>on move</option><option>on kill</option></select><br />"
											+ "trigger 3 <select><option>on move</option><option>on kill</option></select><br />"
											+ "</div>") ;
				
				$( this )
					.addClass( "ui-state-highlight" )
					.find( "p" )
						//.html( "Dropped!" );
			}
		});
	});
	</script>
</head>
<body>
	<header>
	<div style="padding-top: 30px; margin-left: 500px">
			<a href="index.html" class="homebutton"></a>
			<a href="test.html" class="downloadbutton"></a>
	</div>
	</header>