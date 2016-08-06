<?php
    class cExplorer
    {
        static function relative_path()
        {
            return "../";
        }
        
        
        static function _action_copyElement($hash, $bdd, $sessionDirectory, $sessionUser, $sessionToPaste)
        {
            $path = cExplorer::relative_path();
            
            // Récupération des informations sur l'élément à copier
            $get_element_hash = $bdd->prepare("SELECT * FROM elements WHERE hash = ? AND user = ?");
            $get_element_hash->execute(array(
                $hash,
                $sessionUser
            ));

            if($get_element_hash->rowCount() != 1) die("error~||]]");

            $data_element_hash = $get_element_hash->fetch();

            // Détermination du type de l'élément : dossier ou fichier
            if($data_element_hash["type"] == "folder")
            {			
                $get_list_elements = $bdd->prepare("SELECT * FROM elements WHERE user = ? AND location LIKE ?");
                $get_list_elements->execute(array(
                    $sessionUser,
                    $sessionToPaste['startDirectory'] . $data_element_hash["name"] . "/%"
                ));

                $list_elements = $get_list_elements->fetchAll();

                // Test de l'existence des éléments contenus dans le dossier allant être copiés
                foreach($list_elements as $element)
                {
                    // Répertoire de copie
                    $directory_copy = $sessionDirectory.substr($element["location"], strpos($element["location"], $data_element_hash["location"])+1, strlen($element["location"]));

                    // Récupération de la liste des éléments dans le répertoire de copie
                    $get_list_targetFolder = $bdd->prepare("SELECT * FROM elements WHERE user = ? AND location = ?");
                    $get_list_targetFolder->execute(array(
                        $sessionUser,
                        $directory_copy
                    ));

                    $list_targetFolder = $get_list_targetFolder->fetchAll();

                    // Détermination du type de l'élément : dossier ou fichier
                    // Si c'est un dossier, on teste juste s'il existe déjà dans le dossier de copie. S'il n'existe pas, on l'ajoute à la liste de copie
                    // Si c'est un fichier, on teste plusieurs combinaisons du type "Copie_de_" + nom + "_" + nombre entre 0 et 20 afin de copier le fichier dans tous les cas
                    if($element["type"] == "folder")
                    {
                        $existing = false;

                        foreach($list_targetFolder as $alreadyHere)
                        {
                            if($alreadyHere["name"] == $element["name"] && $alreadyHere["extension"] == $element["extension"])
                            {
                                $existing = true;
                            }
                        }

                        // Si le dossier n'existe pas déjà dans le dossier de copie, on doit le créer
                        if(!$existing)
                        {
                            $list[] = array(
                                "name" => $element["name"],
                                "element" => $element,
                                "directory" => $directory_copy
                            );

                            $newHash = hash("sha256", microtime(true));
                            $date = date("Y-m-d");

                            $req_insert = $bdd->prepare("INSERT INTO elements (id, name, hash, user, type, extension, location, date, lastDate, favorite, private, count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                            $req_insert->execute(array(
                                "",
                                $element["name"],
                                $newHash,
                                $sessionUser,
                                $element["type"],
                                $element["extension"],
                                $directory_copy,
                                $date,
                                $date,
                                0,
                                1,
                                0
                            ));
                        }
                    }
                    else
                    {
                        // Liste des "extensions" que l'on peut rajouter aux fichiers pour éviter d'écraser un fichier avec le même nom lors de la copie
                        $toExtend = ["", "_0", "_1", "_2", "_3", "_4", "_5", "_6", "_7", "_8", "_9", "_10", "_11", "_12", "_13", "_14", "_15", "_16", "_17", "_18", "_19", "_20"];
                        $count = 0;

                        // Test des noms de fichier
                        do
                        {
                            $existing = false;

                            foreach($list_targetFolder as $alreadyHere)
                            {
                                if($alreadyHere["name"] == $element["name"].$toExtend[$count] && $alreadyHere["extension"] == $element["extension"])
                                {
                                    $existing = true;
                                }
                            }

                            $count++;

                            if($count >= 20)
                            {
                                die("overflow~||]]");
                            }
                        } while($existing);

                        $newHash = hash("sha256", microtime(true));
                        $date = date("Y-m-d");

                        $req_insert = $bdd->prepare("INSERT INTO elements (id, name, hash, user, type, extension, location, date, lastDate, favorite, private, count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                        $req_insert->execute(array(
                            "",
                            $element["name"].$toExtend[$count - 1],
                            $newHash,
                            $sessionUser,
                            $element["type"],
                            $element["extension"],
                            $directory_copy,
                            $date,
                            $date,
                            0,
                            1,
                            0
                        ));

                        if($element["type"] != "folder")
                        {
                            copy("{$path}workspace/files/{$sessionUser}/{$element['hash']}.data", "{$path}workspace/files/{$sessionUser}/{$newHash}.data");
                        }
                    }
                }

                // Test du dossier lui-même afin de déterminer s'il faut qu'il soit copié ou non
                $get_list_existingElements_in_copyFolder = $bdd->prepare("SELECT * FROM elements WHERE location = ? AND user = ? AND type = ?");
                $get_list_existingElements_in_copyFolder->execute(array(
                    $sessionDirectory,
                    $sessionUser,
                    "folder"
                ));

                $list_existingElements_in_copyFolder = $get_list_existingElements_in_copyFolder->fetchAll();

                $existing = false;

                foreach($list_existingElements_in_copyFolder as $existingElements)
                {
                    if($data_element_hash["name"] == $existingElements["name"])
                    {
                        $existing = true;
                    }
                }

                if(!$existing)
                {				
                    $newHash = hash("sha256", microtime(true));
                    $date = date("Y-m-d");

                    $req_insert = $bdd->prepare("INSERT INTO elements (id, name, hash, user, type, extension, location, date, lastDate, favorite, private, count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                    $req_insert->execute(array(
                        "",
                        $data_element_hash["name"],
                        $newHash,
                        $sessionUser,
                        $data_element_hash["type"],
                        $elmt["element"]["extension"],
                        $sessionDirectory,
                        $date,
                        $date,
                        0,
                        1,
                        0
                    ));
                }
            }
            else
            {
                // Récupération des informations sur l'élément à copier
                $get_element_hash = $bdd->prepare("SELECT * FROM elements WHERE hash = ? AND user = ?");
                $get_element_hash->execute(array(
                    $hash,
                    $sessionUser
                ));

                if($get_element_hash->rowCount() != 1) die("error~||]]");

                $element = $get_element_hash->fetch();

                // Récupération du noms des fichiers dans le dossier de destination
                $get_files_targetFolder = $bdd->prepare("SELECT * FROM elements WHERE location = ? AND user = ? AND extension = ? AND type = ?");
                $get_files_targetFolder->execute(array(
                    $sessionDirectory,
                    $sessionUser,
                    $element["extension"],
                    $element["type"]
                ));

                $list_files_targetFolder = $get_files_targetFolder->fetchAll();

                $toExtend = ["", "_0", "_1", "_2", "_3", "_4", "_5", "_6", "_7", "_8", "_9", "_10", "_11", "_12", "_13", "_14", "_15", "_16", "_17", "_18", "_19", "_20"];
                $count = 0;

                // Test des noms de fichier
                do
                {
                    $existing = false;

                    foreach($list_files_targetFolder as $alreadyHere)
                    {
                        if($alreadyHere["name"] == $element["name"].$toExtend[$count])
                        {
                            $existing = true;
                        }
                    }

                    $count++;

                    if($count >= 20)
                    {
                        die("overflow~||]]");
                    }
                } while($existing);

                $newName = $element["name"].$toExtend[$count - 1];
                $newHash = hash("sha256", microtime(true));
                $date = date("Y-m-d");

                $req_insert = $bdd->prepare("INSERT INTO elements (id, name, hash, user, type, extension, location, date, lastDate, favorite, private, count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $req_insert->execute(array(
                    "",
                    $newName,
                    $newHash,
                    $sessionUser,
                    $element["type"],
                    $element["extension"],
                    $sessionDirectory,
                    $date,
                    $date,
                    0,
                    1,
                    0
                ));

                copy("{$path}workspace/files/{$sessionUser}/{$element['hash']}.data", "{$path}workspace/files/{$sessionUser}/{$newHash}.data");
            }
        }
        
        static function _action_cutElement($hash, $bdd, $sessionDirectory, $sessionUser, $sessionToPaste)
        {
            // Récupération des informations sur l'élément
            $get_info_element = $bdd->prepare("SELECT * FROM elements WHERE hash = ? AND user = ?");
            $get_info_element->execute(array(
                $hash,
                $sessionUser
            ));

            if($get_info_element->rowCount() != 1) die("error~||]]");

            $baseElement = $get_info_element->fetch();

            // Test du type de l'élément : dossier ou fichier
            if($baseElement["type"] == "folder")
            {
                // Récupération de la liste des éléments du dossier
                $list_element_toCut = $bdd->prepare("SELECT * FROM elements WHERE user = ? AND location LIKE ?");
                $list_element_toCut->execute(array(
                    $sessionUser,
                    $sessionToPaste["startDirectory"].$baseElement["name"]."/%"
                ));

                $list_elements = $list_element_toCut->fetchAll();

                foreach($list_elements as $element)
                {
                    // Répertoire de copie
                    $directory_copy = $sessionDirectory.substr($element["location"], strpos($element["location"], $baseElement["location"])+1, strlen($element["location"]));

                    // Test du type de l'élément : dossier ou fichier
                    if($element["type"] == "folder")
                    {
                        $get_existingElements = $bdd->prepare("SELECT * FROM elements WHERE user = ? AND type = ? AND location = ?");
                        $get_existingElements->execute(array(
                            $sessionUser,
                            "folder",
                            $directory_copy
                        ));

                        $existingElements = $get_existingElements->fetchAll();

                        // Si le dossier n'existe pas, il faut le créer, sinon on supprime l'ancien
                        $existing = false;

                        foreach($existingElements as $existingElement)
                        {
                            if($element["name"] == $existingElement["name"])
                            {
                                $existing = true;
                            }
                        }

                        if(!$existing)
                        {
                            $req_update = $bdd->prepare("UPDATE elements SET location = ? WHERE user = ? AND hash = ?");
                            $req_update->execute(array(
                                $directory_copy,
                                $sessionUser,
                                $element["hash"]
                            ));
                        }
                        else
                        {
                            $req_delete = $bdd->prepare("DELETE FROM elements WHERE hash = ? AND user = ?");
                            $req_delete->execute(array(
                                $element["hash"],
                                $sessionUser
                            ));
                        }
                    }
                    else
                    {
                        // Récupération de la liste des fichiers dans le dossier de copie
                        $get_existingElements = $bdd->prepare("SELECT * FROM elements WHERE user = ? AND type != ? AND location = ?");
                        $get_existingElements->execute(array(
                            $sessionUser,
                            "folder",
                            $directory_copy
                        ));

                        $existingElements = $get_existingElements->fetchAll();

                        $toExtend = ["", "_0", "_1", "_2", "_3", "_4", "_5", "_6", "_7", "_8", "_9", "_10", "_11", "_12", "_13", "_14", "_15", "_16", "_17", "_18", "_19", "_20"];
                        $count = 0;

                        // Test des noms de fichier
                        do
                        {
                            $existing = false;

                            foreach($existingElements as $alreadyHere)
                            {
                                if($alreadyHere["name"] == $element["name"].$toExtend[$count])
                                {
                                    $existing = true;
                                }
                            }

                            $count++;

                            if($count >= 20)
                            {
                                die("overflow~||]]");
                            }
                        } while($existing);

                        $newName = $newName = $element["name"].$toExtend[$count - 1];
                        $date = date("Y-m-d");

                        $req_update = $bdd->prepare("UPDATE elements SET name = ?, date = ?, location = ? WHERE user = ? AND hash = ?");
                        $req_update->execute(array(
                            $newName,
                            $date,
                            $directory_copy,
                            $sessionUser,
                            $element["hash"]
                        ));
                    }
                }

                // Copie du dossier parent
                $get_list_elements = $bdd->prepare("SELECT * FROM elements WHERE location = ? AND user = ? AND type = ?");
                $get_list_elements->execute(array(
                    $sessionDirectory,
                    $sessionUser,
                    "folder"
                ));

                $list_elements = $get_list_elements->fetchAll();

                $existing = false;

                foreach($list_elements as $existingElement)
                {
                    if($existingElement["name"] == $baseElement["name"])
                    {
                        $existing = true;
                    }
                }

                if(!$existing)
                {
                    $req_update = $bdd->prepare("UPDATE elements SET location = ? WHERE user = ? AND hash = ?");
                    $req_update->execute(array(
                        $sessionDirectory,
                        $sessionUser,
                        $baseElement["hash"]
                    ));
                }
            }
            else
            {
                // Test de l'existence du fichier dans le dossier de copie
                $get_list_element_from_copyFolder = $bdd->prepare("SELECT * FROM elements WHERE user = ? AND location LIKE ?");
                $get_list_element_from_copyFolder->execute(array(
                    $sessionUser,
                    $sessionDirectory."%"
                ));

                $list_element_copyFolder = $get_list_element_from_copyFolder->fetchAll();

                // Test pour chaque élément distant
                $toExtend = ["", "_0", "_1", "_2", "_3", "_4", "_5", "_6", "_7", "_8", "_9", "_10", "_11", "_12", "_13", "_14", "_15", "_16", "_17", "_18", "_19", "_20"];
                $count = 0;

                do
                {
                    $existing = false;

                    foreach($list_element_copyFolder as $alreadyHere)
                    {
                        if($alreadyHere["name"] == $baseElement["name"].$toExtend[$count] AND $alreadyHere["extension"] == $baseElement["extension"])
                        {
                            $existing = true;
                        }
                    }

                    $count++;

                    if($count >= 20)
                    {
                        die("overflow~||]]");
                    }
                } while($existing);

                $newName = $baseElement["name"].$toExtend[$count - 1];
                $date = date("Y-m-d");

                $req_update = $bdd->prepare("UPDATE elements SET name = ?, date = ?, location = ? WHERE user = ? AND hash = ?");
                $req_update->execute(array(
                    $newName,
                    $date,
                    $sessionDirectory,
                    $sessionUser,
                    $baseElement["hash"]
                ));
            }
        }
        
        static function _action_deleteElement($bdd, $hash, $type, $user)
        {
            $path = cExplorer::relative_path();
            
            $req = $bdd->prepare("DELETE FROM elements WHERE hash = ? AND type = ? AND user = ?");
            $req->execute(array(
                $hash,
                $type,
                $user
            ));

            if($type != "folder")
            {
                unlink("{$path}workspace/files/{$user}/{$hash}.data");  
            }
        }
        
        
        static function change_directory_navBar($hash)
        {
            require("secure.php");
            
            if($hash == "Home")
            {
                $_SESSION['directory'] = "/";

                die("ok~||]]");
            }
            else
            {
                $req = $bdd->prepare("SELECT * FROM elements WHERE hash = ? AND user = ? AND type = ?");
                $req->execute(array(
                    $hash,
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
        }
        
        static function change_directory_workspace($hash)
        {
            require("secure.php");
            
            $req = $bdd->prepare("SELECT * FROM elements WHERE hash = ? AND user = ? AND type = ?");
            $req->execute(array(
                $hash,
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
        
        static function list_elements()
        {
            require("secure.php");
            
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
                echo json_encode($list);
            }
            catch(Exception $e)
            {
                die("error~||]]");
            }
        }
        
        static function show_navBar()
        {
            require("secure.php");
            
            $array = explode("/", $_SESSION['directory']);
            $list = array();

            for($i = 1; $i < count($array); $i++)
            {
                $link = "";
                $name = "";
                $hash = "";

                for($a = 0; $a < $i; $a++)
                {
                    if($a == $i - 1)
                    {
                        $name = $array[$a];
                    }
                    else
                    {
                        $link .= $array[$a]."/";
                    }
                }

                if($name != "" && $link != "")
                {
                    $list[] = array($name, $link, $hash);   
                }
            }

            for($i = 0; $i < count($list); $i++)
            {
                $req = $bdd->prepare("SELECT hash FROM elements WHERE name = ? AND location = ? AND user = ? AND type = ?");
                $req->execute(array(
                    $list[$i][0],
                    $list[$i][1],
                    $_SESSION['session']['user'],
                    "folder"
                ));

                if($req->rowCount() == 1)
                {
                    $list[$i][2] = $req->fetch()["hash"];
                }
                else
                {
                    die("error~||]]");
                }
            }

            $toAppend = "<p class='directory' onclick='EXPLORER.actions.call(\"Home\", \"folder\", \"\", \"navBar\");'>Home</p>";

            for($i = 0; $i < count($list); $i++)
            {
                $toAppend .= "<p class='separator'>&gt;</p>";
                $toAppend .= "<p class='directory' onclick='EXPLORER.actions.call(\"".$list[$i][2]."\", \"folder\", \"\", \"navBar\");'>".$list[$i][0]."</p>";
            }

            echo "ok~||]]";
            echo $toAppend;
        }
        
        static function upload($file)
        {
            require("secure.php");
            
            $infos = explode("|", $file);
            
            $path = cExplorer::relative_path();
            
            // Répertoire d'upload
            $directoryToUpload = "{$path}workspace/files/{$_SESSION['session']['user']}/";

            // Extension du fichier
            $extension = substr($infos[0], strrpos($infos[0], ".") + 1);

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
            $name = rawurlencode(substr($infos[0], 0, strrpos($infos[0], ".")));

            if(move_uploaded_file($infos[2], $directoryToUpload.$hash.".data"))
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
        
        static function delete_elements($data)
        {
            require("secure.php");
            
            $hashs = explode(",", $data);
        
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
                        cExplorer::_action_deleteElement($bdd, $element["hash"], $element["type"], $_SESSION['session']['user']);
                    }

                    // Suppression du dossier
                    cExplorer::_action_deleteElement($bdd, $hash, $type, $_SESSION['session']['user']);
                }
                else
                {
                    // Suppression du fichier
                    cExplorer::_action_deleteElement($bdd, $hash, $type, $_SESSION['session']['user']);
                }
            }

            die("ok~||]]");
        }
        
        static function copy_elements($hashs)
        {
            $hashs = explode(",", $hashs);
        
            $_SESSION['toPaste'] = array(
                "action" => "copy",
                "elements" => $hashs,
                "startDirectory" => $_SESSION['directory']
            );

            die("ok~||]]");
        }
        
        static function cut_elements($hashs)
        {
            $hashs = explode(",", $hashs);
        
            $_SESSION['toPaste'] = array(
                "action" => "cut",
                "elements" => $hashs,
                "startDirectory" => $_SESSION['directory']
            );

            die("ok~||]]");
        }
        
        static function paste()
        {
            require("secure.php");
            
            switch($_SESSION['toPaste']['action'])
            {
                case "copy":
                    foreach($_SESSION['toPaste']['elements'] as $element)
                    {
                        if(strlen($element) == 64)
                        {
                            cExplorer::_action_copyElement($element, $bdd, $_SESSION['directory'], $_SESSION['session']['user'], $_SESSION['toPaste']);
                        }
                    }

                    unset($_SESSION['toPaste']);

                    die("ok~||]]");
                    break;

                case "cut":
                    foreach($_SESSION['toPaste']['elements'] as $element)
                    {
                        if(strlen($element) == 64)
                        {
                            cExplorer::_action_cutElement($element, $bdd, $_SESSION['directory'], $_SESSION['session']['user'], $_SESSION['toPaste']);
                        }
                    }
                    
                     unset($_SESSION['toPaste']);

                    die("ok~||]]");
                    break;

                default:
                    die("error~||]]");
                    break;
            }
        }
        
        static function create_file($content)
        {
            require("secure.php");
            
            $path = cExplorer::relative_path();
            
            $name = explode("|", $content)[0];
            $extension = explode("|", $content)[1];
            
            $hash = hash("sha256", microtime(true));
            $date = date("Y-m-d");

            if(isset($extension))
            {
                if(empty($extension))
                {
                    $extension = "txt";
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
                $name,
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


            /*
            * Création du fichier dans le "workspace" de l'utilisateur
            */
            if(!file_exists("{$path}workspace/files/{$_SESSION['session']['user']}/{$hash}.data"))
            {
                fopen("{$path}workspace/files/{$_SESSION['session']['user']}/{$hash}.data", "w");

                die("ok~||]]");
            }
            else
            {
                die("error~||]]");
            }
        }
        
        static function create_folder($name)
        {
            require("secure.php");
            
            $hash = hash("sha256", microtime(true));
            $date = date("Y-m-d");

            /*
            * Test de l'existence du dossier
            */
            $req = $bdd->prepare("SELECT name FROM elements WHERE name = ? AND location = ? AND type = ? AND user = ?");
            $req->execute(array(
                $name,
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
                htmlspecialchars($name),
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
        
        static function rename_element($content)
        {
            require("secure.php");
            
            $hash = explode("|", $content)[0];
            $name = explode("|", $content)[1];
            if(explode("|", $content)[2]) $extension = explode("|", $content)[2];
            
            /* Récupération des informations sur l'élément */
            $req_type = $bdd->prepare("SELECT * FROM elements WHERE hash = ? AND user = ?");
            $req_type->execute(array(
                $hash,
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
                        $name,
                        $_SESSION['directory'],
                        "folder",
                        $_SESSION['session']['user']
                    ));
                }
                else 
                {
                    if(isset($extension))
                    {
                        if(!empty($extension))
                        {                        
                            if($extension == $data[0]["extension"])
                            {
                                $type = $data[0]["type"];
                            }
                            else 
                            {
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
                            }
                        }    
                    }

                    $req_test = $bdd->prepare("SELECT * FROM elements WHERE name = ? AND location = ? AND extension = ? AND type = ? AND user = ?");
                    $req_test->execute(array(
                        $name,
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
                        $name,
                        $type,
                        $extension,
                        $hash,
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
        
        static function view_infos($hash)
        {
            require("secure.php");
            
            $relative_path = cExplorer::relative_path();
            
            $req = $bdd->prepare("SELECT * FROM elements WHERE hash = ? AND user = ?");
            $req->execute(array(
                $hash,
                $_SESSION['session']['user']
            ));

            if($req->rowCount() == 1)
            {
                $data = $req->fetchAll();
                
                if($data[0]["type"] != "folder")
                {
                    $size = filesize("{$relative_path}workspace/files/{$_SESSION['session']['user']}/{$hash}.data") / 8;
                }
                else
                {
                    $size = "500";
                }
                
                $data[0]["size"] = ceil($size);

                echo "ok~||]]";

                echo json_encode($data);
            }
            else 
            {
                die("error~||]]");
            }
        }
    }
?>