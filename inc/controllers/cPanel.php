<?php
    class cPanel
    {        
        static function relative_path()
        {
            return "../";
        }
        
        static function tab_notif()
        {
            
        }
        
        static function tab_apps()
        {
            $path = cPanel::relative_path();
            
            if($folder_apps = opendir("{$path}apps/"))
            {
                echo "ok~||]]";

                $list = array();

                while(($item = readdir($folder_apps)) !== false)
                {
                    if($item != "." && $item != "..")
                    {
                        if(is_dir("{$path}apps/" . $item . "/"))
                        {
                            if(file_exists("{$path}apps/" . $item . "/manifest.json"))
                            {
                                if($data = file_get_contents("{$path}apps/" . $item . "/manifest.json", FILE_USE_INCLUDE_PATH))
                                {
                                    try
                                    {
                                        $json = json_decode($data, true);

                                        if($json["app"]["name"] != NULL)
                                        {
                                            $list[] =  array(
                                                "id" => $item,
                                                "name" => $json["app"]["name"],
                                                "color" => $json["app"]["color"]
                                            );
                                        }
                                    }
                                    catch(Exception $e)
                                    {
                                        die("error~||]]");
                                    }
                                }
                            }
                        }
                    }
                }

                echo json_encode($list);
            }
        }
        
        static function tab_profil()
        {
            require("secure.php");
            
            $path = cPanel::relative_path();

            /* Récupération des informations sur l'utilisateur */
            $req = $bdd->prepare("SELECT * FROM users WHERE hash = ?");
            $req->execute(array(
                $_SESSION['session']['user']
            ));

            $data = $req->fetchAll();

            if($req->rowCount() == 1)
            {
                $name = $data[0]["name"];
                $mail = $data[0]["mail"];
                $creation_date = $data[0]["creation_date"];
            }
            else
            {
                die("error~||]]");
            }

            /* Calcul de l'espace occupé par les fichiers de l'utilisateur */
            $size = 0;

            if($folder_apps = opendir("{$path}workspace/files/{$_SESSION['session']['user']}"))
            {
                while(($item = readdir($folder_apps)) !== false)
                {
                    if($item != "." && $item != "..")
                    {
                        if(is_file("{$path}workspace/files/{$_SESSION['session']['user']}/{$item}"))
                        {
                            $size += filesize("{$path}workspace/files/{$_SESSION['session']['user']}/{$item}") / pow(2, 20);
                        }
                    }
                }
            }

            $size = round($size, 2);

            /* Calcul du pourcentage occupé */
            $percent = round($size, 1);

            echo "ok~||]]";
            
            echo "
            <div id='profilContent'>
                <table id='resultProfil'>
                    <!-- Général -->
                    <tr>
                        <th colspan='2'>Général</th>
                    </tr>
                    <tr>
                        <td><img src='images/rightPanel/profil/user.svg' /></td>
                        <td>{$name} &nbsp; <img src='images/rightPanel/profil/edit.svg' style='height: 1.5vh;' onclick='COSMOS.rightPanel.trigger.profil.editSessionName();' class='action' /></td>
                    </tr>
                    <tr>
                        <td><img src='images/rightPanel/profil/mail.svg' /></td>
                        <td>{$mail} &nbsp; <img src='images/rightPanel/profil/edit.svg' style='height: 1.5vh;'  onclick='COSMOS.rightPanel.trigger.profil.editMail();' class='action' /></td>
                    </tr>
                    <tr>
                        <td><img src='images/rightPanel/profil/date.svg' /></td>
                        <td>Compte créé le {$creation_date}</td>
                    </tr>
                    <tr>
                        <td><img src='images/rightPanel/profil/storage.svg' /></td>
                        <td>{$size} Mo / 100 Mo ({$percent}%)</td>
                    </tr>

                    <!-- Mot de passe -->
                    <tr>
                        <th colspan='2'>Mot de passe</th>
                    </tr>
                    <tr>
                        <td>Ancien</td>
                        <td><input type='password' id='edit_password_old' /></td>
                    </tr>
                    <tr>
                        <td>Nouveau</td>
                        <td><input type='password' id='edit_password_new' /></td>
                    </tr>
                    <tr>
                        <td>Confirmez</td>
                        <td><input type='password' id='edit_password_repeat' /></td>
                    </tr>
                    <tr>
                        <td colspan='2'><input type='button' value='Sauvegarder' onclick='COSMOS.rightPanel.trigger.profil.submit.saveNewPassword();' id='button_edit_password' /></td>
                    </tr>
                    
                    <!-- Suppression du compte -->
                    <tr>
                        <th colspan='2'>Suppression du compte</th>
                    </tr>
                    <tr>
                        <td colspan='2'><input type='button' value='Supprimer' onclick='COSMOS.rightPanel.trigger.profil.deleteAccount();' /></td>
                    </tr>
                </table>
            </div>
            ";
        }
        
        static function tab_search($pattern)
        {
            $path = cPanel::relative_path();
            
            require("secure.php");
            
            /* Résultats globaux */
            $results = array(
                "Applications" => array(),
                "Fichiers" => array(),
                "Dossiers" => array()
            );

            /* Recherche dans les applications */
            if($folder_apps = opendir("{$path}apps/"))
            {
                while(($item = readdir($folder_apps)) !== false)
                {
                    if($item != "." && $item != "..")
                    {
                        if(is_dir("{$path}apps/" . $item . "/"))
                        {
                            if(file_exists("{$path}apps/" . $item . "/manifest.json"))
                            {
                                if($data = file_get_contents("{$path}apps/" . $item . "/manifest.json", FILE_USE_INCLUDE_PATH))
                                {
                                    try
                                    {
                                        $json = json_decode($data, true);

                                        if($json["app"]["name"] != NULL)
                                        {
                                            if(strpos($json["app"]["name"], $pattern) !== false)
                                            {
                                                $results["Applications"][] = array(
                                                    str_replace($pattern, "<b style='text-decoration: underline;'>{$pattern}</b>", $json["app"]["name"]), 
                                                    $item,
                                                    $json["app"]["color"]
                                                );
                                            }
                                        }
                                    }
                                    catch(Exception $e)
                                    {
                                        die("error~||]]");
                                    }
                                }
                            }
                        }
                    }
                }
            }
            else
            {
                die("error~||]]");
            }

            /* Recherche dans les fichiers */
            $req = $bdd->prepare("SELECT * FROM elements WHERE user = ? AND type != ?");
            $req->execute(array(
                $_SESSION['session']['user'],
                "folder"
            ));

            $data = $req->fetchAll();

            foreach($data as $item)
            {            
                if(strpos($item["name"], $pattern) !== false)
                {                
                    $results["Fichiers"][] = array(
                        str_replace($pattern, "<b style='text-decoration: underline;'>{$pattern}</b>", $item["name"]).".".$item["extension"], 
                        $item["hash"],
                        $item["type"],
                        $item["location"]
                    );
                }
            }

            /* Recherche dans les dossiers */
            $req = $bdd->prepare("SELECT * FROM elements WHERE user = ? AND type = ?");
            $req->execute(array(
                $_SESSION['session']['user'],
                "folder"
            ));

            $data = $req->fetchAll();

            foreach($data as $item)
            {            
                if(strpos($item["name"], $pattern) !== false)
                {                
                    $results["Dossiers"][] = array(
                        str_replace($pattern, "<b style='text-decoration: underline;'>{$pattern}</b>", $item["name"]), 
                        $item["hash"],
                        "folder",
                        $item["location"]
                    );
                }
            }


            echo "ok~||]]";

            echo json_encode($results);
        }
        
        static function tab_settings()
        {
            require("secure.php");
            
            $path = cPanel::relative_path();

            $dispositions = array(
                "dispo_1",
                "dispo_2_v",
                "dispo_2_h",
                "dispo_4"
            );

            try
            {
                $data_preferences = file_get_contents("{$path}workspace/storage/{$_SESSION['session']['user']}/app_global.json");

                try
                {
                    $parsed_data = json_decode($data_preferences, true);
                }
                catch(Exception $e)
                {
                    die("error~||]]");
                }
            }
            catch(Exception $e)
            {
                die("error~||]]");
            }

            echo "ok~||]]";
            
            echo "
            <div id='settingsContent'>
                <table id='resultSettings'>
                     <!-- Affichage -->
                    <tr>
                        <th colspan='2'>Affichage</th>
                    </tr>
                    <tr>
                        <td><img src='images/rightPanel/settings/header.svg' /></td>
                        <td>Fond du header : <b>{$parsed_data['preferences']['headerBackground']}</b> &nbsp; <img src='images/rightPanel/profil/edit.svg' style='height: 1.5vh;' onclick='COSMOS.rightPanel.trigger.settings.editHeaderBackground();' class='action' /></td>
                    </tr>
                    <tr>
                        <td><img src='images/rightPanel/settings/background.svg' /></td>
                        <td>Fond de l'interface : <b>{$parsed_data['preferences']['desktopBackground']}</b> &nbsp; <img src='images/rightPanel/profil/edit.svg' style='height: 1.5vh;' onclick='COSMOS.rightPanel.trigger.settings.editDesktopBackground();' class='action' /></td>
                    </tr>
                    <tr>
                        <td><img src='images/rightPanel/settings/fontSize.svg' /></td>
                        <td>Taille de la police : <b>{$parsed_data['preferences']['fontSize']}</b> &nbsp; <img src='images/rightPanel/profil/edit.svg' style='height: 1.5vh;' onclick='COSMOS.rightPanel.trigger.settings.editFontSize();' class='action' /></td>
                    </tr>

                    <!-- Disposition -->
                    <tr>
                        <th colspan='2'>Disposition des fenêtres</th>
                    </tr>
                    <tr>
                        <td colspan='2'>
            ";
            
            for($i = 0; $i < count($dispositions); $i++)
            {
                $margin = ($i == count($dispositions)-1) ? "0" : "2vw";

                if($dispositions[$i] == $parsed_data["preferences"]["windowDisposition"])
                {
                    echo "<img src='images/rightPanel/settings/{$dispositions[$i]}.svg' style='margin-right: {$margin};' class='disposition selected' id='{$dispositions[$i]}' onclick='COSMOS.rightPanel.trigger.settings.changeDisposition(\"{$dispositions[$i]}\");' />";
                }
                else
                {
                    echo "<img src='images/rightPanel/settings/{$dispositions[$i]}.svg' style='margin-right: {$margin};' class='disposition' id='{$dispositions[$i]}' onclick='COSMOS.rightPanel.trigger.settings.changeDisposition(\"{$dispositions[$i]}\");' />";
                }
            }
            
            echo "
                        </td>
                    </tr>

                    <!-- Langue -->
                    <tr>
                        <th colspan='2'>Langue</th>
                    </tr>
                    <tr>
                        <td colspan='2'>
                            <img src='images/rightPanel/settings/lang_french.svg' />
                        </td>
                    </tr>

                    <!-- Date et heure -->
                    <tr>
                        <th colspan='2'>Date et heure</th>
                    </tr>
                    <tr>
                        <td><img src='images/rightPanel/settings/date_day.svg' /></td>
                        <td>Date : <b>".date("Y - m - d")."</b></td>
                    </tr>
                    <tr>
                        <td><img src='images/rightPanel/settings/date_time.svg' /></td>
                        <td>Heure : <b>".date("H : i")."</b></td>
                    </tr>
                    <tr>
                        <td><img src='images/rightPanel/settings/date_timezone.svg' /></td>
                        <td>Timezone : <b>".date("e")."</b></td>
                    </tr>

                    <tr>
                        <th colspan='2'>Version</th>
                    </tr>
                    <tr>
                        <td><img src='images/rightPanel/settings/version.svg' /></td>
                        <td>Version : <b>{$_CONSTANTS['version']}</b></td>
                    </tr>
                </table>
            </div>
            ";
        }
        
        static function edit_sessionName($newName)
        {
            require("secure.php");
            
            if(isset($newName) && !empty($newName))
            {
                if(strlen($newName) <= 32)
                {
                    /*
                    * Changement dans la table "users"
                    */
                    $req = $bdd->prepare("UPDATE users SET name = ? WHERE hash = ?");
                    $req->execute(array(
                        htmlspecialchars($newName),
                        $_SESSION['session']['user']
                    ));

                    /*
                    * Changement dans la table "session"
                    */
                    $req = $bdd->prepare("UPDATE session SET name = ? WHERE user = ?");
                    $req->execute(array(
                        htmlspecialchars($newName),
                        $_SESSION['session']['user']
                    ));

                    die("ok~||]]");
                }
                else
                {
                    die("length~||]]");
                }
            }
            else
            {
                die("empty~||]]");
            }
        }
        
        static function edit_mail($newMail)
        {
            require("secure.php");
            
            if(isset($newMail) && !empty($newMail))
            {
                if(strlen($newMail) <= 64)
                {
                    if(filter_var($newMail, FILTER_VALIDATE_EMAIL))
                    {
                        /*
                        * Changement dans la table "users"
                        */
                        $req = $bdd->prepare("UPDATE users SET mail = ? WHERE hash = ?");
                        $req->execute(array(
                            htmlspecialchars($newMail),
                            $_SESSION['session']['user']
                        ));

                        die("ok~||]]");
                    }
                    else
                    {
                        die("format~||]]");
                    }
                }
                else
                {
                    die("length~||]]");
                }
            }
            else
            {
                die("empty~||]]");
            }
        }
        
        static function edit_password($content)
        {
            require("secure.php");
            
            $old = htmlspecialchars(explode("|", $content)[0]);
            $new = htmlspecialchars(explode("|", $content)[1]);
            $repeat = htmlspecialchars(explode("|", $content)[2]);
            
            if(isset($old) && !empty($old) && isset($new) && !empty($new) && isset($repeat) && !empty($repeat))
            {
                if(strlen($old) == 128 && strlen($new) == 128 && strlen($repeat) == 128)
                {
                    if($new == $repeat)
                    {
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
        }
        
        static function edit_deleteAccount()
        {
            require("secure.php");
            
            /* Suppression dans la table "session" */
            $req = $bdd->prepare("DELETE FROM session WHERE token = ? AND user = ?");
            $req->execute(array(
                $_SESSION['session']['token'],
                $_SESSION['session']['user']
            ));

            /* Suppression dans la table "users" */
            $req = $bdd->prepare("DELETE FROM users WHERE hash = ?");
            $req->execute(array(
                $_SESSION['session']['user']
            ));

            /* Suppression des variables de session */
            $_SESSION['session'] = array();
            $_SESSION['session'] = null;
            unset($_SESSION['session']);
            session_destroy();
        }
        
        static function logout()
        {
            require("secure.php");
            
            // Suppression de la session dans la bdd
            $req = $bdd->prepare("DELETE FROM session WHERE token = ? AND user = ?");
            $req->execute(array(
                $_SESSION['session']['token'],
                $_SESSION['session']['user']
            ));

            // Destruction des variables de session
            $_SESSION['session'] = array();
            $_SESSION['session'] = null;
            unset($_SESSION['session']);
            session_destroy();
        }
        
        static function lock()
        {
            $_SESSION['session']['lockSession'] = 1;
        }
        
        static function unlock($password)
        {
            require("secure.php");
            
            $req = $bdd->prepare("SELECT * FROM users WHERE mdp_login = ? AND hash = ?");
            $req->execute(array(
                $password,
                $_SESSION['session']['user']
            ));

            if($req->rowCount() == 1)
            {
                $_SESSION['session']['lockSession'] = 0;
                die("ok~||]]");
            }
            else 
            {
                die("error~||]]");
            }
        }
    }
?>