<?php
    require_once("checkCurrentDirectory.php");

    function deleteElement($bdd, $hash, $type)
    {
        $req = $bdd->prepare("DELETE FROM elements WHERE hash = ? AND type = ? AND user = ?");
        $req->execute(array(
            $hash,
            $type,
            $_SESSION['session']['user']
        ));
        
        if($type != "folder")
        {
            unlink("../../../workspace/files/{$_SESSION['session']['user']}/{$hash}.data");   
        }
    }

    if(isset($_GET['type']) && !empty($_GET['type']) && isset($_GET['hash']) && !empty($_GET['hash']))
    {
        if(strlen($_GET['hash']) == 64)
        {
            if($_GET['type'] == "folder")
            {
                // Récupération du nom du dossier
                $req_name = $bdd->prepare("SELECT name FROM elements WHERE hash = ? AND user = ? AND type = ?");
                $req_name->execute(array(
                    $_GET['hash'],
                    $_SESSION['session']['user'],
                    "folder"
                ));
                
                $name = $req_name->fetch()["name"];
                
                // Liste des éléments contenus dans le dossier en cours de suppression
                $req_elements = $bdd->prepare("SELECT * FROM elements WHERE location LIKE ? AND user = ?");
                $req_elements->execute(array(
                    $_SESSION['directory'].$name."/%",
                    $_SESSION['session']['user']
                ));
                
                $list = $req_elements->fetchAll();
                
                // Suppression des éléments contenus dans le dossier en cours de suppression
                foreach($list as $element)
                {
                    deleteElement($bdd, $element["hash"], $element["type"]);
                }
                
                // Suppression du dossier
                deleteElement($bdd, $_GET['hash'], $_GET['type']);
                
                die("ok~||]]");
            }
            else
            {
                
                deleteElement($bdd, $_GET['hash'], $_GET['type']);
                
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