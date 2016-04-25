<?php
    require_once("global.php");
    
    if($_SESSION['session']['lockSession'] == 1)
    {
        die("lock~||]]");
    }

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