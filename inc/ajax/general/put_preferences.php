<?php
	require_once("../../global/checkSession.php");
	
	$json = json_decode(file_get_contents("../../../workspace/preferences/{$_SESSION['session']['user']}/preferences.json"), true);
	
	if(isset($_GET['change']) && !empty($_GET['change']) && isset($_GET['content']) && !empty($_GET['content']))
	{
		switch($_GET['change'])
		{
			case "headerBackground":
				$json["preferences"]["headerBackground"] = htmlspecialchars($_GET['content']);
				
				$json_string = json_encode($json);
				
				file_put_contents("../../../workspace/preferences/{$_SESSION['session']['user']}/preferences.json", $json_string);
				break;
                
            case "desktopBackground":
                $json["preferences"]["desktopBackground"] = htmlspecialchars($_GET['content']);
				
				$json_string = json_encode($json);
				
				file_put_contents("../../../workspace/preferences/{$_SESSION['session']['user']}/preferences.json", $json_string);
                break;
                
            case "fontSize":
                $json["preferences"]["fontSize"] = htmlspecialchars($_GET['content']);
				
				$json_string = json_encode($json);
				
				file_put_contents("../../../workspace/preferences/{$_SESSION['session']['user']}/preferences.json", $json_string);
                break;
                
            case "disposition":
                $json["preferences"]["windowDisposition"] = htmlspecialchars($_GET['content']);
				
				$json_string = json_encode($json);
				
				file_put_contents("../../../workspace/preferences/{$_SESSION['session']['user']}/preferences.json", $json_string);
                break;
				
			default:
				break;
		}
	}
?>