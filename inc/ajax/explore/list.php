<?php
    require_once("checkCurrentDirectory.php");

    $list = array();

    // Récupération des dossiers
    $req = $bdd->prepare("SELECT * FROM elements WHERE location = ? AND user = ? AND type = ? ORDER BY name ASC");
    $req->execute(array(
        $_SESSION['directory'],
        $_SESSION['session']['user'],
        "folder"
    ));

    if($data = $req->fetchAll())
    {
        foreach($data as $element)
        {
            $temp_array = array();
            
            $temp_array[] = array(
                htmlspecialchars($element["name"]),
                $element["hash"],
                $element["type"],
            );
            
            $list[] = $temp_array;
        }
    }

    // Récupération des fichiers
    $req = $bdd->prepare("SELECT * FROM elements WHERE location = ? AND user = ? AND type != ? ORDER BY name ASC");
    $req->execute(array(
        $_SESSION['directory'],
        $_SESSION['session']['user'],
        "folder"
    ));

    if($data = $req->fetchAll())
    {
        foreach($data as $element)
        {
            $temp_array = array();

            $temp_array[] = array(
                htmlspecialchars($element["name"]),
                $element["hash"],
                $element["type"],
                htmlspecialchars($element["extension"])
            );
            
            $list[] = $temp_array;
        }
    }

    try
    {
        echo "ok~||]]";
        echo json_encode(array_chunk($list, 6));
    }
    catch(Exception $e)
    {
        die("error~||]]");
    }
?>