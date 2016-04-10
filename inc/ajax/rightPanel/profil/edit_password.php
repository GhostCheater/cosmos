<?php
    require_once("../../../global/checkSession.php");

    if(isset($_GET['old']) && !empty($_GET['old']) && isset($_GET['new']) && !empty($_GET['new']) && isset($_GET['repeat']) && !empty($_GET['repeat']))
    {
        if(strlen($_GET['old']) == 128 && strlen($_GET['new']) == 128 && strlen($_GET['repeat']) == 128)
        {
            if($_GET['new'] == $_GET['repeat'])
            {
                $old = htmlspecialchars($_GET['old']);
                $new = htmlspecialchars($_GET['new']);

                $req = $bdd->prepare("SELECT * FROM users WHERE hash = ?");
                $req->execute(array(
                    $_SESSION['session']['user']
                ));

                $data = $req->fetchAll();

                if($req->rowCount() == 1)
                {
                    if($data[0]["mdp_login"] == $old)
                    {
                        $req2 = $bdd->prepare("UPDATE users SET mdp_login = ? WHERE hash = ?");
                        $req2->execute(array(
                            $new,
                            $_SESSION['session']['user']
                        ));
                        
                        die("ok~||]]");
                    }
                    else
                    {
                        die("oldPasswordBad~||]]");
                    }
                }
                else
                {
                    die("error~||]]");
                }
            }
            else
            {
                die("mismatchNewPassword~||]]");
            }
        }
        else
        {
            die("badLength~||]]");
        }
    }
    else
    {
        die("empty~||]]");
    }
?>