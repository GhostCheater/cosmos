<?php
	require_once("../../global/checkSession.php");
	
	try
    {
        $data_preferences = file_get_contents("../../../workspace/preferences/{$_SESSION['session']['user']}/preferences.json");
        
		echo "ok~||]]";			
		echo $data_preferences;
    }
    catch(Exception $e)
    {
        die("error~||]]");
    }
?>