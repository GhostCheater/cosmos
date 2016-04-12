<?php
    require_once("../../global/checkRequestTime.php");
    require_once("checkCurrentDirectory.php");

    if(isset($_GET['name']) && !empty($_GET['name']))
    {
        $hash = hash("sha256", microtime(true));
        $date = date("Y-m-d");
        
        /*
        * Test de l'existence du dossier
        */
        $req = $bdd->prepare("SELECT name FROM elements WHERE name = ? AND location = ? AND type = ? AND user = ?");
        $req->execute(array(
            $_GET['name'],
            $_SESSION['directory'],
            "folder",
            $_SESSION['session']['user']
        ));
        
        if($req->rowCount() != "" || $req->rowCount() != 0)
        {
            die("error~||]]");
        }
        
        /*
        * Insertion dans la base de données
        */
        $req = $bdd->prepare("INSERT INTO elements (id, name, hash, user, type, extension, location, date, lastDate, favorite, private, count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $req->execute(array(
            "",
            htmlspecialchars($_GET['name']),
            $hash,
            $_SESSION['session']['user'],
            "folder",
            "",
            $_SESSION['directory'],
            $date,
            $date,
            0,
            1,
            0
        ));
        
        die("ok~||]]");
    }
    else
    {
        die("error~||]]");
    }
?>