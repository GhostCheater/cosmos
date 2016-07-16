<?php
    class cAudio
    {
        static function relative_path()
        {
            return "../";
        }
        
        static function list_tracks()
        {
            require("secure.php");

            $relative_path = cAudio::relative_path();

            $preferences = json_decode(file_get_contents("{$relative_path}workspace/storage/{$_SESSION['session']['user']}/app_music.json"), true);
            $new_preferences = $preferences;
            
            $list = array();
            
            $req = $bdd->prepare("SELECT * FROM elements WHERE type = ? AND user = ?");
            $req->execute(array(
                "audio",
                $_SESSION['session']['user']
            ));

            $data = $req->fetchAll();

            for($i = 0; $i < count($data); $i++)
            {
                // Récupération des informations de base
                $list[$i] = array(
                    "name" => $data[$i]["name"],
                    "hash" => $data[$i]["hash"],
                    "extension" => $data[$i]["extension"]
                );

                // Recherche des informations sur le fichier
                $content = track::get_infos("{$relative_path}workspace/files/{$_SESSION['session']['user']}/{$data[$i]['hash']}.data", ".".$data[$i]["extension"]);
            
                $list[$i]["track"] = $content["track"];
                $list[$i]["creator"] = $content["creator"];
                $list[$i]["album"] = $content["album"];
                $list[$i]["num"] = $content["num"];
                $list[$i]["date"] = $content["date"];

                // Recherche des données complémentaires
                if(!isset($preferences["app_music"][$data[$i]["hash"]]))
                {
                    $new_preferences["app_music"][$data[$i]["hash"]] = array(
                        "mark" => 3,
                        "instruments" => ""
                    );

                    $list[$i]["mark"] = 3;
                    $list[$i]["instruments"] = "";
                }
                else 
                {
                    $list[$i]["mark"] = $preferences["app_music"][$data[$i]["hash"]]["mark"];
                    $list[$i]["instruments"] = $preferences["app_music"][$data[$i]["hash"]]["instruments"];
                }
            }

            // Vérification de l'existence des fichiers dans la base des préférences
            foreach($new_preferences["app_music"] as $hash => $value)
            {
                $exist = true;

                for($i = 0; $i < count($list); $i++)
                {
                    if($list[$i]["hash"] == $hash)
                    {
                        $exist = true;
                        break;
                    }
                }

                // Si le hash n'existe pas ou plus, on le supprime de la base des préférences
                if(!$exist)
                {
                    unset($new_preferences["app_music"][$hash]);
                }
            }

            // Nouvelles préférences
            file_put_contents("{$relative_path}workspace/storage/{$_SESSION['session']['user']}/app_music.json", json_encode($new_preferences));

            // On retourne la liste des musiques
            echo json_encode($list);
        }

        static function load_track($hash)
        {
            require("secure.php");
            
            $path = cAudio::relative_path();
            
            // Test des permissions de la vidéo
            $req = $bdd->prepare("SELECT * FROM elements WHERE hash = ? AND type = ? AND user = ?");
            $req->execute(array(
                $hash,
                "audio",
                $_SESSION['session']['user']
            ));
            
            $data = $req->fetchAll();
            
            if(count($data) != 1)
            {
                die("error~||]]");
            }
            
            $file = "{$path}workspace/files/{$_SESSION['session']['user']}/{$hash}.data";
            
            if(!file_exists($file))
            {
                die("error~||]]");
            }
            
            // header('Content-Description: File Transfer');
            header("Content-Type: octet-stream");
            header('Content-Disposition: attachment; filename="'.basename($file).'"');
            header('Expires: 0');
            header('Cache-Control: must-revalidate');
            header('Pragma: public');
            header('Content-Length: ' . filesize($file));
            readfile($file);
            exit;
        }

        static function trigger_instrument($content)
        {
            require("secure.php");

            $relative_path = cAudio::relative_path();

            $hash = explode("|", $content)[0];
            $instrument = explode("|", $content)[1];
            $state = explode("|", $content)[2];

            // Vérification de l'appartenance du fichier audio
            $req = $bdd->prepare("SELECT * FROM elements WHERE user = ? AND type = ? AND hash = ?");
            $req->execute(array(
                $_SESSION['session']['user'],
                "audio",
                $hash
            ));

            if(count($req->fetchAll()) != 1)
            {
                die("error~||]]");
            }

            // Ouverture du fichier des préférences
            $data_json = json_decode(file_get_contents("{$relative_path}workspace/storage/{$_SESSION['session']['user']}/app_music.json"), true);
        
            $data_instruments = explode(",", $data_json["app_music"][$hash]["instruments"]);

            // Mise à jour des instruments
            if($state == "")
            {
                $data_instruments[] = $instrument;
            }
            else 
            {
                $key = array_search($instrument, $data_instruments);

                unset($data_instruments[$key]);
            }

            $data_json["app_music"][$hash]["instruments"] = implode(",", $data_instruments);

            // Ecriture dans le fichier des préférences
            file_put_contents("{$relative_path}workspace/storage/{$_SESSION['session']['user']}/app_music.json", json_encode($data_json));
        }

        static function trigger_mark($content)
        {
            require("secure.php");

            $relative_path = cAudio::relative_path();

            $hash = explode("|", $content)[0];
            $mark = explode("|", $content)[1];

            // Vérification de l'appartenance du fichier audio
            $req = $bdd->prepare("SELECT * FROM elements WHERE user = ? AND type = ? AND hash = ?");
            $req->execute(array(
                $_SESSION['session']['user'],
                "audio",
                $hash
            ));

            if(count($req->fetchAll()) != 1)
            {
                die("error~||]]");
            }

            $data = json_decode(file_get_contents("{$relative_path}workspace/storage/{$_SESSION['session']['user']}/app_music.json"), true);

            $data["app_music"][$hash]["mark"] = $mark;

            file_put_contents("{$relative_path}workspace/storage/{$_SESSION['session']['user']}/app_music.json", json_encode($data));
        }
    }
?>