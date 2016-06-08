<?php
    require_once("checkCurrentDirectory.php");
    require_once("../../global/extensions.php");

    if(isset($_FILES) && !empty($_FILES))
    {
        // Répertoire d'upload
        $directoryToUpload = "../../../workspace/files/{$_SESSION['session']['user']}/";
        
        // Extension du fichier
        $extension = substr($_FILES['file']['name'], strrpos($_FILES['file']['name'], ".") + 1);
        
        // Type du fichier
        $type = "";
        
        // Recherche du type du fichier par rapport à son extension
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
        
        // Date d'upload du fichier
        $date = date("Y-m-d");
        
        // Hash du fichier
        $hash = hash("sha256", microtime(true));
        
        // Nom du fichier
        $name = substr($_FILES['file']['name'], 0, strrpos($_FILES['file']['name'], "."));
        
        if(move_uploaded_file($_FILES['file']['tmp_name'], $directoryToUpload.$hash.".data"))
        {
            // Création du fichier dans la bdd
            $req = $bdd->prepare("INSERT INTO elements (id, name, hash, user, type, extension, location, date, lastDate, favorite, private, count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $req->execute(array(
                "",
                htmlspecialchars($name),
                $hash,
                $_SESSION['session']['user'],
                $type,
                htmlspecialchars($extension),
                $_SESSION['directory'],
                $date,
                $date,
                0,
                1,
                0
            ));
            
            echo "ok~||]]";
        }
        else
        {
            die("error~||]]2");
        }
    }
    else
    {
        die("error~||]]1");
    }
?>