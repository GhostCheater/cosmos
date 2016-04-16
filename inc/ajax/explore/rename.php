<?php
    require_once("checkCurrentDirectory.php");
    require_once("../../global/extensions.php");
    
    if(isset($_GET['hash']) && !empty($_GET['hash']) && isset($_GET['name']) && !empty($_GET['name']))
    {
        /* Récupération des informations sur l'élément */
        $req_type = $bdd->prepare("SELECT * FROM elements WHERE hash = ? AND user = ?");
        $req_type->execute(array(
            $_GET['hash'],
            $_SESSION['session']['user']
        ));
        
        if($req_type->rowCount() == 1)
        {
            $data = $req_type->fetchAll();
            
            /* Test d'existence d'un élément de ce nom */
            
            if($data[0]["type"] == "folder")
            {
                $extension = "";
                $type = "folder";
                
                $req_test = $bdd->prepare("SELECT * FROM elements WHERE name = ? AND location = ? AND type = ? AND user = ?");
                $req_test->execute(array(
                    $_GET['name'],
                    $_SESSION['directory'],
                    "folder",
                    $_SESSION['session']['user']
                ));
            }
            else 
            {
                if(isset($_GET['extension']))
                {
                    if(!empty($_GET['extension']))
                    {                        
                        if($_GET['extension'] == $data[0]["extension"])
                        {
                            $extension = $_GET['extension'];
                            $type = $data[0]["type"];
                        }
                        else 
                        {
                            $type = "";
                            
                            foreach($_EXTENSIONS as $key => $types)
                            {
                                if(in_array($_GET['extension'], $types))
                                {
                                    $type = $key;
                                }
                            }
                            
                            if($type == "")
                            {
                                $type = "text";
                            }
                            
                            $extension = $_GET['extension'];
                        }
                    }    
                }
                
                $req_test = $bdd->prepare("SELECT * FROM elements WHERE name = ? AND location = ? AND extension = ? AND type = ? AND user = ?");
                $req_test->execute(array(
                    $_GET['name'],
                    $_SESSION['directory'],
                    $extension,
                    $type,
                    $_SESSION['session']['user']
                ));       
            }
            
            if($req_test->rowCount() == 0 || $req_test->rowCount() == "")
            {
                $req_update = $bdd->prepare("UPDATE elements SET name = ?, type = ?, extension = ? WHERE hash = ? AND user = ?");
                $req_update->execute(array(
                    $_GET['name'],
                    $type,
                    $extension,
                    $_GET['hash'],
                    $_SESSION['session']['user']
                ));
                
                $req_update->closeCursor();
                
                die("ok~||]]");
            }
            else
            {
                die("error~||]]");
            }
            
            $req_test->closeCursor();
        }
        else 
        {
            die("error~||]]");
        }
        
        $req_type->closeCursor();
    }
    else 
    {
        die("error~||]]");    
    }
?>