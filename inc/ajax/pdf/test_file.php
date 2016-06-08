<?php
    require_once("../../global/checkSession.php");

    if(isset($_GET['hash']) && !empty($_GET['hash']))
    {
        $req = $bdd->prepare("SELECT * FROM elements WHERE user = ? AND hash = ? AND type = ?");
        $req->execute(array(
            $_SESSION['session']['user'],
            htmlspecialchars($_GET['hash']),
            "pdf"
        ));
        
        $data = $req->fetchAll();
        
        if(count($data) == 1)
        {
            die("ok~||]]");
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