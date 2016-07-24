<?php
    class cGeneral
    {
        static function relative_path()
        {
            return "../";
        }
        
        static function load_preferences()
        {
            $path = cGeneral::relative_path();
            
            try
            {
                $data_preferences = file_get_contents("{$path}workspace/storage/{$_SESSION['session']['user']}/app_global.json");

                echo "ok~||]]";			
                echo $data_preferences;
            }
            catch(Exception $e)
            {
                die("error~||]]");
            }
        }
        
        static function put_content_file($content)
        {
            require("secure.php");
            
            $path = cGeneral::relative_path();
                
            $hash = explode("|", $content)[0];
            $data = explode("|", $content)[1];
                
            if($hash == "new_file")
            {
                // Le fichier n'existe pas, on doit le créer
                $new_hash = hash("sha256", microtime(true));
                $date = date("Y-m-d");
                $type = "doc";
                $extension = "doc";
                $name = "Nouveau document sans nom";

                $req_insert = $bdd->prepare("INSERT INTO elements (id, name, hash, user, type, extension, location, date, lastDate, favorite, private, count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $req_insert->execute(array(
                    "",
                    htmlspecialchars($name),
                    $new_hash,
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

                // Création du fichier de façon "physique"
                if(!file_exists("{$path}workspace/files/{$_SESSION['session']['user']}/{$new_hash}.data"))
                {
                    fopen("{$path}workspace/files/{$_SESSION['session']['user']}/{$new_hash}.data", "w");
                    
                    // Une fois le fichier créé, on peut écrire dedans
                    file_put_contents("{$path}workspace/files/{$_SESSION['session']['user']}/{$new_hash}.data", $data);
                    
                    // Mettre à la jour la date de dernière édition du fichier
                    // ...

                    echo "ok~||]]";
                    echo $new_hash;
                }
                else
                {
                    die("error~||]]");
                }
            }
            else
            {
                // Test de l'existence du fichier
                $req_test = $bdd->prepare("SELECT * FROM elements WHERE user = ? AND hash = ?");
                $req_test->execute(array(
                    $_SESSION['session']['user'],
                    htmlspecialchars($hash)
                ));

                $data = $req_test->fetchAll();

                if(count($data) == 1)
                {
                    // Le fichier existe, on peut écrire dedans
                    file_put_contents("{$path}workspace/files/{$_SESSION['session']['user']}/{$hash}.data", $data);

                    // Mettre à la jour la date de dernière édition du fichier
                    // ...

                    echo "ok~||]]";
                    echo $hash;
                }
                else
                {
                    die("error~||]]2");
                }   
            }
        }
        
        static function put_preferences($content)
        {
            $path = cGeneral::relative_path();
            
            $change = explode("|", $content)[0];
            $data = explode("|", $content)[1];
            
            $json = json_decode(file_get_contents("{$path}workspace/storage/{$_SESSION['session']['user']}/app_global.json"), true);
            
            switch($change)
            {
                case "headerBackground":
                    $json["preferences"]["headerBackground"] = htmlspecialchars($data);

                    $json_string = json_encode($json);

                    file_put_contents("{$path}workspace/storage/{$_SESSION['session']['user']}/app_global.json", $json_string);
                    break;

                case "desktopBackground":
                    $json["preferences"]["desktopBackground"] = htmlspecialchars($data);

                    $json_string = json_encode($json);

                    file_put_contents("{$path}workspace/storage/{$_SESSION['session']['user']}/app_global.json", $json_string);
                    break;

                case "fontSize":
                    $json["preferences"]["fontSize"] = htmlspecialchars($data);

                    $json_string = json_encode($json);

                    file_put_contents("{$path}workspace/storage/{$_SESSION['session']['user']}/app_global.json", $json_string);
                    break;

                case "disposition":
                    $json["preferences"]["windowDisposition"] = htmlspecialchars($data);

                    $json_string = json_encode($json);

                    file_put_contents("{$path}workspace/storage/{$_SESSION['session']['user']}/app_global.json", $json_string);
                    break;

                default:
                    break;
            }
        }
    }
?>