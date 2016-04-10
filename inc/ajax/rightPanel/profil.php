<?php
    require_once("../../global/checkSession.php");

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

    if($folder_apps = opendir("../../../workspace/files/{$_SESSION['session']['user']}"))
    {
        while(($item = readdir($folder_apps)) !== false)
        {
            if($item != "." && $item != "..")
            {
                if(is_file("../../../workspace/files/{$_SESSION['session']['user']}/{$item}"))
                {
                    $size += filesize("../../../workspace/files/{$_SESSION['session']['user']}/{$item}") / pow(2, 20);
                }
            }
        }
    }

    $size = round($size, 2);

    /* Calcul du pourcentage occupé */
    $percent = round($size, 1);

    echo "ok~||]]";
?>

<div id="profilContent">
    <table id="resultProfil">
        <!-- Général -->
        <tr>
            <th colspan="2">Général</th>
        </tr>
        <tr>
            <td><img src="images/rightPanel/profil/user.svg" /></td>
            <td><?php echo $name; ?> &nbsp; <img src="images/rightPanel/profil/edit.svg" style="height: 1.5vh;" onclick="COSMOS.rightPanel.trigger.profil.editSessionName();" class="action" /></td>
        </tr>
        <tr>
            <td><img src="images/rightPanel/profil/mail.svg" /></td>
            <td><?php echo $mail; ?> &nbsp; <img src="images/rightPanel/profil/edit.svg" style="height: 1.5vh;"  onclick="COSMOS.rightPanel.trigger.profil.editMail();" class="action" /></td>
        </tr>
        <tr>
            <td><img src="images/rightPanel/profil/date.svg" /></td>
            <td>Compte créé le <?php echo $creation_date; ?></td>
        </tr>
        <tr>
            <td><img src="images/rightPanel/profil/storage.svg" /></td>
            <td><?php echo $size; ?> Mo / 100 Mo (<?php echo $percent; ?>%)</td>
        </tr>
        
        <!-- Mot de passe -->
        <tr>
            <th colspan="2">Mot de passe</th>
        </tr>
        <tr>
            <td>Ancien</td>
            <td><input type="password" id="edit_password_old" /></td>
        </tr>
        <tr>
            <td>Nouveau</td>
            <td><input type="password" id="edit_password_new" /></td>
        </tr>
        <tr>
            <td>Confirmez</td>
            <td><input type="password" id="edit_password_repeat" /></td>
        </tr>
        <tr>
            <td colspan="2"><input type="button" value="Sauvegarder" onclick="COSMOS.rightPanel.trigger.profil.submit.saveNewPassword();" id="button_edit_password" /></td>
        </tr>
        
        <!-- Chiffrement -->

        <tr>
            <th colspan="2">Chiffrement</th>
        </tr>
        <tr>
            <td><img src="images/rightPanel/profil/public_key.svg" /></td>
            <td>Clé publique  &nbsp; <img src="images/rightPanel/profil/view.svg" style="height: 1.5vh;" onclick="COSMOS.rightPanel.trigger.profil.viewPublicKey();" class="action" /></td>
        </tr>
        <tr>
            <td><img src="images/rightPanel/profil/private_key.svg" /></td>
            <td>Clé privée  &nbsp; <img src="images/rightPanel/profil/view.svg" style="height: 1.5vh;" onclick="COSMOS.rightPanel.trigger.profil.viewPrivateKey();" class="action" /></td>
        </tr>
        
        <tr>
            <th colspan="2">Suppression du compte</th>
        </tr>
        <tr>
            <td colspan="2"><input type="button" value="Supprimer" onclick="COSMOS.rightPanel.trigger.profil.deleteAccount();" /></td>
        </tr>
    </table>
</div>