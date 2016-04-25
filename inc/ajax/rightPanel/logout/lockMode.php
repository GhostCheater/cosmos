<?php
	require_once("../../../global/global.php");

	if(isset($_GET['action']) && !empty($_GET['action']) && !empty($_SESSION['session']['user']))
	{
		switch($_GET['action'])
		{
			case "lock":
				$_SESSION['session']['lockSession'] = 1;
				break;
				
			case "unlock":
				if(isset($_GET['password']) && !empty($_GET['password']))
				{
					$req = $bdd->prepare("SELECT * FROM users WHERE mdp_login = ? AND hash = ?");
					$req->execute(array(
						$_GET['password'],
						$_SESSION['session']['user']
					));
					
					if($req->rowCount() == 1)
					{
						$_SESSION['session']['lockSession'] = 0;
						die("ok~||]]");
					}
					else 
					{
						die("error~||]]");
					}
				}
				else 
				{
					die("empty1~||]]");
				}
				break;
				
			default:
				die("bad~||]]");
				break;
		}
	}
	else 
	{
		die("empty2~||]]");
	}
?>