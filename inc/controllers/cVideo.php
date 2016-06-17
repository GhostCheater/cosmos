<?php
    class cVideo
    {
        static function relative_path()
        {
            return "../";
        }
        
        static function verif_video($hash)
        {
            require("secure.php");
            
            $path = cVideo::relative_path();
            
            // Test des permissions de la vidéo
            $req = $bdd->prepare("SELECT * FROM elements WHERE hash = ? AND type = ? AND user = ?");
            $req->execute(array(
                $hash,
                "video",
                $_SESSION['session']['user']
            ));
            
            $data = $req->fetchAll();
            
            if(count($data) != 1)
            {
                die("error~||]]");
            }
            
            die("ok~||]]");
        }
        
        static function view_video($hash)
        {
            require("secure.php");
            
            $path = cVideo::relative_path();
            
            // Test des permissions de la vidéo
            $req = $bdd->prepare("SELECT * FROM elements WHERE hash = ? AND type = ? AND user = ?");
            $req->execute(array(
                $hash,
                "video",
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
?>