<?php
    require_once("checkCurrentDirectory.php");

    function deleteElement($bdd, $hash, $type, $user)
    {
        $req = $bdd->prepare("DELETE FROM elements WHERE hash = ? AND type = ? AND user = ?");
        $req->execute(array(
            $hash,
            $type,
            $user
        ));
        
        if($type != "folder")
        {
            unlink("../../../workspace/files/{$user}/{$hash}.data");  
        }
    }

    if(isset($_GET['hash']) && !empty($_GET['hash']))
    {
        $hashs = explode(",", $_GET['hash']);
        
        foreach($hashs as $hash)
        {
            $req = $bdd->prepare("SELECT type FROM elements WHERE hash = ? AND user = ?");
            $req->execute(array(
                $hash,
                $_SESSION['session']['user']
            ));
            
            if($req->rowCount() != 1) die("error~||]]");
            
            $type = $req->fetch()["type"];
            
            if($type == "folder")
            {
                // Récupération du nom du dossier
                $req_name = $bdd->prepare("SELECT name FROM elements WHERE hash = ? AND user = ? AND type = ?");
                $req_name->execute(array(
                    $hash,
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
                    deleteElement($bdd, $element["hash"], $element["type"], $_SESSION['session']['user']);
                }
                
                // Suppression du dossier
                deleteElement($bdd, $hash, $type, $_SESSION['session']['user']);
            }
            else
            {
                // Suppression du fichier
                deleteElement($bdd, $hash, $type, $_SESSION['session']['user']);
            }
        }
        
        die("ok~||]]");
    }
    else
    {
        die("empty~||]]");
    }
?>