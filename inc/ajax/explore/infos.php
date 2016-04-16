<?php
	require_once("checkCurrentDirectory.php");
	
	if(isset($_GET['hash']) && !empty($_GET['hash']))
	{
		$req = $bdd->prepare("SELECT * FROM elements WHERE hash = ? AND user = ?");
		$req->execute(array(
			$_GET['hash'],
			$_SESSION['session']['user']
		));
		
		if($req->rowCount() == 1)
		{
			$data = $req->fetchAll();
			
			echo "ok~||]]";
			
			echo json_encode($data);
		}
		else 
		{
			die("error~||]]");
		}
	}
	else 
	{
		die("error~||]]");
	}
?>