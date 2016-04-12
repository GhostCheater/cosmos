<?php
    require_once("checkCurrentDirectory.php");

    if(isset($_GET['directoryID']) && !empty($_GET['directoryID']))
    {
        $req = $bdd->prepare("SELECT * FROM elements WHERE hash = ? AND user = ? AND type = ?");
        $req->execute(array(
            $_GET['directoryID'],
            $_SESSION['session']['user'],
            "folder"
        ));

        if($req->rowCount() == 1)
        {
            $data = $req->fetchAll();

            $_SESSION['directory'] = $data[0]["location"].$data[0]["name"]."/";
            
            die("ok~||]]");
        }
        else
        {
            die("exists~||]]");
        }
    }
    else
    {
        die("error~||]]");
    }
?>