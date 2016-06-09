<?php
    class cPDF
    {
        static function relative_path()
        {
            return "../";
        }
        
        static function get_content_file($hash)
        {            
            require("global/bdd.php");
            
            $path = cPDF::relative_path();
            
            $req = $bdd->prepare("SELECT * FROM elements WHERE user = ? AND hash = ? AND type = ?");
            $req->execute(array(
                $_SESSION['session']['user'],
                htmlspecialchars($hash),
                "pdf"
            ));

            $data = $req->fetchAll();

            if(count($data) == 1)
            {
                $file = "{$path}workspace/files/{$_SESSION['session']['user']}/{$hash}.data";
                
                if(file_exists($file))
                {
                    header('Content-Type: application/pdf');
                    header('Content-Length: ' . filesize($file));
                    
                    readfile($file);

                    exit;
                }
                else
                {
                    die("error~||]]");
                }
            }
            else
            {
                die("error~||]]");
            }
        }
        
        static function test_file($hash)
        {
            require("global/bdd.php");
            
            $req = $bdd->prepare("SELECT * FROM elements WHERE user = ? AND hash = ? AND type = ?");
            $req->execute(array(
                $_SESSION['session']['user'],
                htmlspecialchars($hash),
                "pdf"
            ));

            $data = $req->fetchAll();

            if(count($data) == 1)
            {
                die("ok~||]]");
            }
            else
            {
                die("error~||]]");
            }
        }
    }
?>