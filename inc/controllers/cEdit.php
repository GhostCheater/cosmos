<?php
    class cEdit
    {
        static function relative_path()
        {
            return "../";
        }
        
        static function load_preferences()
        {
            $path = cEdit::relative_path();
            
            try
            {
                $data_preferences = file_get_contents("{$path}workspace/storage/{$_SESSION['session']['user']}/app_document.json");

                echo "ok~||]]";			
                echo $data_preferences;
            }
            catch(Exception $e)
            {
                die("error~||]]");
            }
        }
        
        static function upload_image($file)
        {
            $path = cEdit::relative_path();
            $infos = explode("|", $file);
            
            $directoryToUpload = "{$path}workspace/temp/{$_SESSION['session']['user']}/";
            
            $extension = substr($infos[0], strrpos($infos[0], "."), strlen($infos[0]));

            $filename = hash("sha256", microtime(true));

            if(move_uploaded_file($infos[2], $directoryToUpload.$filename.$extension))
            {
                echo "ok~||]]";   
                echo substr($directoryToUpload, 3).$filename.$extension;
            }
            else
            {
                die("error~||]]");
            }
        }
        
        static function show_image($link)
        {
            $path = cEdit::relative_path();
            
            if(file_exists($path.$link))
            {
                if(explode("/", $link)[2] == $_SESSION['session']['user'])
                {
                    $file = $path.$link;

                    header('Content-Description: File Transfer');
                    header('Content-Type: application/octet-stream');
                    header('Content-Disposition: attachment; filename="'.basename($file).'"');
                    header('Expires: 0');
                    header('Cache-Control: must-revalidate');
                    header('Pragma: public');
                    header('Content-Length: ' . filesize($file));
                    readfile($file);
                    exit;
                }
            }
        }
        
        static function open_file($hash)
        {
            require("secure.php");
            
            $path = cEdit::relative_path();
            
            // Récupération des informations sur le fichier
            $req_get = $bdd->prepare("SELECT * FROM elements WHERE user = ? AND hash = ?");
            $req_get->execute(array(
                $_SESSION['session']['user'],
                $hash
            ));

            $data = $req_get->fetchAll();

            if(count($data) == 1)
            {
                if($data[0]["type"] == "doc")
                {
                    $content = file_get_contents("{$path}workspace/files/{$_SESSION['session']['user']}/{$hash}.data", FILE_USE_INCLUDE_PATH);

                    // TODO : Escape to have a "sure" string
                    echo $content;
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
        
        static function save_file($content)
        {
            require("secure.php");
            
            $relative_path = cEdit::relative_path();
            
            $hash = explode("[-||||-]", $content)[0];
            $data = explode("[-||||-]", $content)[1];
            
            $req = $bdd->prepare("SELECT * FROM elements WHERE hash = ? AND user = ?");
            $req->execute(array(
                $hash,
                $_SESSION['session']['user']
            ));
            
            $result = $req->fetchAll();
            
            if(count($result) == 1)
            {
                file_put_contents("{$relative_path}workspace/files/{$_SESSION['session']['user']}/{$hash}.data", $data);
                
                die("ok~||]]");
            }
            else
            {
                die("error~||]]");
            }
        }
    }
?>