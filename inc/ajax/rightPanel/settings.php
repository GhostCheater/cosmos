<?php
    require_once("../../global/checkSession.php");

    $dispositions = array(
        "disposition_1",
        "disposition_2",
        "disposition_2_up",
        "disposition_4"
    );

    try
    {
        $data_preferences = file_get_contents("../../../workspace/preferences/{$_SESSION['session']['user']}/preferences.json");
        
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
?>

<div id="settingsContent">
    <table id="resultSettings">
         <!-- Affichage -->
        <tr>
            <th colspan="2">Affichage</th>
        </tr>
        <tr>
            <td><img src="images/rightPanel/settings/header.svg" /></td>
            <td>Fond du header : <b><?php echo $parsed_data["preferences"]["headerBackground"]; ?></b> &nbsp; <img src="images/rightPanel/profil/edit.svg" style="height: 1.5vh;" onclick="COSMOS.rightPanel.trigger.settings.editHeaderBackground();" class="action" /></td>
        </tr>
        <tr>
            <td><img src="images/rightPanel/settings/background.svg" /></td>
            <td>Fond de l'interface : <b><?php echo $parsed_data["preferences"]["desktopBackground"]; ?></b> &nbsp; <img src="images/rightPanel/profil/edit.svg" style="height: 1.5vh;" onclick="COSMOS.rightPanel.trigger.settings.editDesktopBackground();" class="action" /></td>
        </tr>
        <tr>
            <td><img src="images/rightPanel/settings/fontSize.svg" /></td>
            <td>Taille de la police : <b><?php echo $parsed_data["preferences"]["fontSize"]; ?></b> &nbsp; <img src="images/rightPanel/profil/edit.svg" style="height: 1.5vh;" onclick="COSMOS.rightPanel.trigger.settings.editFontSize();" class="action" /></td>
        </tr>
        
        <!-- Disposition -->
        <tr>
            <th colspan="2">Disposition des fenêtres</th>
        </tr>
        <tr>
            <td colspan="2">
                <?php
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
                ?>
            </td>
        </tr>
        
        <!-- Langue -->
        <tr>
            <th colspan="2">Langue</th>
        </tr>
        <tr>
            <td colspan="2">
                <img src="images/rightPanel/settings/lang_french.svg" />
            </td>
        </tr>
        
        <!-- Date et heure -->
        <tr>
            <th colspan="2">Date et heure</th>
        </tr>
        <tr>
            <td><img src="images/rightPanel/settings/date_day.svg" /></td>
            <td>Date : <b><?php echo date("Y - m - d"); ?></b></td>
        </tr>
        <tr>
            <td><img src="images/rightPanel/settings/date_time.svg" /></td>
            <td>Heure : <b><?php echo date("H : i"); ?></b></td>
        </tr>
        <tr>
            <td><img src="images/rightPanel/settings/date_timezone.svg" /></td>
            <td>Timezone : <b><?php echo date("e"); ?></b></td>
        </tr>
        
        <tr>
            <th colspan="2">Version</th>
        </tr>
        <tr>
            <td><img src="images/rightPanel/settings/version.svg" /></td>
            <td>Version : <b><?php echo $_CONSTANTS['version']; ?></b></td>
        </tr>
    </table>
</div>