<?php
	session_start();

    $_SESSION['session'] = array(
        "token" => "d9e6762dd1c8eaf6d61b3c6192fc408d4d6d5f1176d0c29169bc24e71c3f274ad27fcd5811b313d681f7e55ec02d73d499c95455b6b5bb503acf574fba8ffe85",
        "user" => "0a041b9462caa4a31bac3567e0b6e6fd9100787db2ab433d96f6d178cabfce90",
        "name" => "Romain",
        "lockSession" => false
    );
	
    require_once("global.php");
    require_once("checkSleepMode.php");

    if(isset($_SESSION['session']['token']) && isset($_SESSION['session']['user']) && isset($_SESSION['session']['name']))
    {
        $req = $bdd->prepare("SELECT * FROM session WHERE token = ? AND user = ? AND ip = ?");
        $req->execute(array(
            $_SESSION['session']['token'],
            $_SESSION['session']['user'],
            $_SERVER['REMOTE_ADDR']
        ));
        
        if($req->rowCount() != 1)
        {
            die("invalidSession~||]]");
        }
    }
    else
    {
        die("error~||]]");
    }
?>