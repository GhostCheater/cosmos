<?php
    class cSession
    {
        static function update()
        {
            require("secure.php");
            
            $req = $bdd->prepare("UPDATE session SET time = ? WHERE token = ? AND user = ?");
            $req->execute(array(
                time(),
                $_SESSION['session']['token'],
                $_SESSION['session']['user']
            ));
        }
    }
?>