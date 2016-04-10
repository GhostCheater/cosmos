<?php
    require_once("../../global/checkSession.php");

    if(isset($_GET['patternToSearch']) && !empty($_GET['patternToSearch']))
    {        
        /* Résultats globaux */
        $results = array(
            "Applications" => array(),
            "Fichiers" => array(),
            "Dossiers" => array()
        );
        
        /* Recherche dans les applications */
        if($folder_apps = opendir("../../../apps/"))
        {
            while(($item = readdir($folder_apps)) !== false)
            {
                if($item != "." && $item != "..")
                {
                    if(is_dir("../../../apps/" . $item . "/"))
                    {
                        if(file_exists("../../../apps/" . $item . "/manifest.json"))
                        {
                            if($data = file_get_contents("../../../apps/" . $item . "/manifest.json", FILE_USE_INCLUDE_PATH))
                            {
                                try
                                {
                                    $json = json_decode($data, true);

                                    if($json["app"]["name"] != NULL)
                                    {
                                        if(strpos($json["app"]["name"], $_GET['patternToSearch']) !== false)
                                        {
                                            $results["Applications"][] = array(
                                                str_replace($_GET['patternToSearch'], "<b style='text-decoration: underline;'>{$_GET['patternToSearch']}</b>", $json["app"]["name"]), 
                                                $item,
                                                $json["app"]["color"]
                                            );
                                        }
                                    }
                                }
                                catch(Exception $e)
                                {
                                    die("error~||]]");
                                }
                            }
                        }
                    }
                }
            }
        }
        else
        {
            die("error~||]]");
        }
        
        /* Recherche dans les fichiers */
        $req = $bdd->prepare("SELECT * FROM elements WHERE user = ? AND type != ?");
        $req->execute(array(
            $_SESSION['session']['user'],
            "folder"
        ));
        
        $data = $req->fetchAll();
        
        foreach($data as $item)
        {            
            if(strpos($item["name"], $_GET['patternToSearch']) !== false)
            {                
                $results["Fichiers"][] = array(
                    str_replace($_GET['patternToSearch'], "<b style='text-decoration: underline;'>{$_GET['patternToSearch']}</b>", $item["name"]).".".$item["extension"], 
                    $item["hash"],
                    $item["type"],
                    $item["location"]
                );
            }
        }
        
        /* Recherche dans les dossiers */
        $req = $bdd->prepare("SELECT * FROM elements WHERE user = ? AND type = ?");
        $req->execute(array(
            $_SESSION['session']['user'],
            "folder"
        ));
        
        $data = $req->fetchAll();
        
        foreach($data as $item)
        {            
            if(strpos($item["name"], $_GET['patternToSearch']) !== false)
            {                
                $results["Dossiers"][] = array(
                    str_replace($_GET['patternToSearch'], "<b style='text-decoration: underline;'>{$_GET['patternToSearch']}</b>", $item["name"]), 
                    $item["hash"],
                    "folder",
                    $item["location"]
                );
            }
        }
        
        
        echo "ok~||]]";
        
        echo json_encode($results);
    }
    else
    {
        die("error~||]]");
    }
?>