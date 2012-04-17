<?php
	if ($_FILES['uploadedfile']['error'] == UPLOAD_ERR_OK 
		  && is_uploaded_file($_FILES['uploadedfile']['tmp_name'])) { //checks that file is uploaded
	  echo file_get_contents($_FILES['uploadedfile']['tmp_name']); 
	}
?>