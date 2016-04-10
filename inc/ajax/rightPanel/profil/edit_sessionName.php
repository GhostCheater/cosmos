<?php
	require_once("../../../global/checkSession.php");
	
	if(isset($_GET['name']) && !empty($_GET['name']))
	{
		if(strlen($_GET['name']) <= 32)
		{
			/*
			* Changement dans la table "users"
			*/
			$req = $bdd->prepare("UPDATE users SET name = ? WHERE hash = ?");
			$req->execute(array(
				htmlspecialchars($_GET['name']),
				$_SESSION['session']['user']
			));
			
			/*
			* Changement dans la table "session"
			*/
			$req = $bdd->prepare("UPDATE session SET name = ? WHERE user = ?");
			$req->execute(array(
				htmlspecialchars($_GET['name']),
				$_SESSION['session']['user']
			));
			
			die("ok~||]]");
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