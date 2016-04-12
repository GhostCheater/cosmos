<?php
    require_once("checkCurrentDirectory.php");

    if(isset($_GET['type']) && !empty($_GET['type']) && isset($_GET['hash']) && !empty($_GET['hash']))
    {
        if(strlen($_GET['hash']) == 64)
        {
            if($_GET['type'] == "folder")
            {
                   
            }
            else
            {
                $req = $bdd->prepare("DELETE FROM elements WHERE hash = ? AND user = ?");
                $req->execute(array(
                    $_GET['hash'],
                    $_SESSION['session']['user']
                ));
                
                unlink("../../../workspace/files/{$_SESSION['session']['user']}/{$_GET['hash']}.data");
                
                die("ok~||]]");
            }
        }
        else
        {
            die("badLength~||]]");
        }
    }
    else
    {
        die("empty~||]]");
    }
?>