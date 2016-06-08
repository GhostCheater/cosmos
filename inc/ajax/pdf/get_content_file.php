<?php
    require_once("../../global/checkSession.php");

    header('Content-Type: application/pdf');

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
            if(file_exists("../../../workspace/files/{$_SESSION['session']['user']}/{$_GET['hash']}.data"))
            {
                readfile("../../../workspace/files/{$_SESSION['session']['user']}/{$_GET['hash']}.data");
                
                exit;
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
    }
    else
    {
        die("error~||]]");
    }
?>