<?php
    require_once("../../global/extensions.php");
    require_once("../../global/checkRequestTime.php");
    require_once("checkCurrentDirectory.php");

    if(isset($_GET['name']) && !empty($_GET['name']))
    {
        $hash = hash("sha256", microtime(true));
        $date = date("Y-m-d");
        
        if(isset($_GET['extension']))
        {
            if(empty($_GET['extension']))
            {
                $extension = "txt";
            }
            else
            {
                $extension = $_GET['extension'];
            }
        }
        
        $type = "";
        
        foreach($_EXTENSIONS as $key => $types)
        {
            if(in_array($extension, $types))
            {
                $type = $key;
            }
        }
        
        if($type == "")
        {
            $type = "text";
        }
        
        
        /*
        * Test de l'existence du fichier
        */
        $req = $bdd->prepare("SELECT name FROM elements WHERE name = ? AND location = ? AND type = ? AND extension = ? AND user = ?");
        $req->execute(array(
            $_GET['name'],
            $_SESSION['directory'],
            $type,
            $extension,
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
            $type,
            htmlspecialchars($_GET['extension']),
            $_SESSION['directory'],
            $date,
            $date,
            0,
            1,
            0
        ));
        
        
        /*
        * Création du fichier dans le "workspace" de l'utilisateur
        */
        if(!file_exists("../../../workspace/files/{$_SESSION['session']['user']}/{$hash}.data"))
        {
            fopen("../../../workspace/files/{$_SESSION['session']['user']}/{$hash}.data", "w");
            
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