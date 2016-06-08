<?php
    require_once("../../global/checkSession.php");

    // TODO //
    function escape_script($str)
    {
        return $str;
    }

    if(isset($_GET['hash']) && !empty($_GET['hash']))
    {
        // Récupération des informations sur le fichier
        $req_get = $bdd->prepare("SELECT * FROM elements WHERE user = ? AND hash = ?");
        $req_get->execute(array(
            $_SESSION['session']['user'],
            htmlspecialchars($_GET['hash'])
        ));
        
        $data = $req_get->fetchAll();
        
        if(count($data) == 1)
        {
            if($data[0]["type"] == "doc")
            {
                $content = file_get_contents("../../../workspace/files/{$_SESSION['session']['user']}/{$_GET['hash']}.data", FILE_USE_INCLUDE_PATH);
                
                echo "ok~||]]";
                echo escape_script($content);
            }
            else
            {
                die("error~||]]3");
            }
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