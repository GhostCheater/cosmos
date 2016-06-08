<?php
    require_once("../../global/checkSession.php");

    if(isset($_POST['hash']) && !empty($_POST['hash']) && isset($_POST['content']) && !empty($_POST['content']))
    {
        if($_POST['hash'] == "new_file")
        {
            // Le fichier n'existe pas, on doit le créer
            $hash = hash("sha256", microtime(true));
            $date = date("Y-m-d");
            $type = "doc";
            $extension = "doc";
            $name = "Nouveau document sans nom";
            
            $req_insert = $bdd->prepare("INSERT INTO elements (id, name, hash, user, type, extension, location, date, lastDate, favorite, private, count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $req_insert->execute(array(
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
            
            // Création du fichier de façon "physique"
            if(!file_exists("../../../workspace/files/{$_SESSION['session']['user']}/{$hash}.data"))
            {
                fopen("../../../workspace/files/{$_SESSION['session']['user']}/{$hash}.data", "w");

                echo "ok~||]]";
                echo $hash;
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
                htmlspecialchars($_POST['hash'])
            ));

            $data = $req_test->fetchAll();

            if(count($data) == 1)
            {
                // Le fichier existe, on peut écrire dedans
                file_put_contents("../../../workspace/files/{$_SESSION['session']['user']}/{$_POST['hash']}.data", $_POST['content']);
                
                // Mettre à la jour la date de dernière édition du fichier
                // ...
                
                echo "ok~||]]";
                echo $_POST['hash'];
            }
            else
            {
                die("error~||]]2");
            }   
        }
    }
    else
    {
        die("error~||]]1");
    }
?>