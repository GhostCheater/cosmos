<?php
    class cImage
    {
        static function relative_path()
        {
            return "../";
        }
        
        static function list_elements()
        {
            require("secure.php");
            
            $list = array();
            
            $req = $bdd->prepare("SELECT * FROM elements WHERE user = ? AND type = ? ORDER BY name ASC");
            $req->execute(array(
                $_SESSION['session']['user'],
                "image"
            ));
            
            $data = $req->fetchAll();
            
            foreach($data as $element)
            {
                $list[] = array($element["name"].".".$element["extension"], $element["hash"], $element["location"]);
            }
            
            echo "ok~||]]";
            echo json_encode(array_chunk($list, 4));
            
            $req->closeCursor();
        }
        
        static function verif_image($hash)
        {
            require("secure.php");
            
            $path = cImage::relative_path();
            
            // Test des permissions de l'image
            $req = $bdd->prepare("SELECT * FROM elements WHERE hash = ? AND type = ? AND user = ?");
            $req->execute(array(
                $hash,
                "image",
                $_SESSION['session']['user']
            ));
            
            $data = $req->fetchAll();
            
            if(count($data) != 1)
            {
                die("error~||]]");
            }
            
            die("ok~||]]");
        }
        
        static function view_image($hash)
        {
            require("secure.php");
            
            $path = cImage::relative_path();
            
            // Test des permissions de l'image
            $req = $bdd->prepare("SELECT * FROM elements WHERE hash = ? AND type = ? AND user = ?");
            $req->execute(array(
                $hash,
                "image",
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