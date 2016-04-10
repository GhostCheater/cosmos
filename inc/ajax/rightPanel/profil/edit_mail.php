<?php
	require_once("../../../global/checkSession.php");
	
	if(isset($_GET['mail']) && !empty($_GET['mail']))
	{
		if(strlen($_GET['mail']) <= 64)
		{
            if(filter_var($_GET['mail'], FILTER_VALIDATE_EMAIL))
            {
                /*
                * Changement dans la table "users"
                */
                $req = $bdd->prepare("UPDATE users SET mail = ? WHERE hash = ?");
                $req->execute(array(
                    htmlspecialchars($_GET['mail']),
                    $_SESSION['session']['user']
                ));
                
                die("ok~||]]");
            }
            else
            {
                die("format~||]]");
            }
		}
		else
		{
			die("length~||]]");
		}
	}
	else
	{
		die("empty~||]]");
	}
?>