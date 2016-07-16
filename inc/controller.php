<?php
    require("secure.php");

    // Si jamais la requête est avec la méthode GET
    if(isset($_GET['c'])) $_POST['c'] = $_GET['c'];
    if(isset($_GET['a'])) $_POST['a'] = $_GET['a'];
    if(isset($_GET['p'])) $_POST['p'] = $_GET['p'];

    if(isset($_POST['c']) && !empty($_POST['c']))
    {
        $args = (!isset($_POST['p']) || empty($_POST['p'])) ? "" : $_POST['p'];
        $protoAction = (!isset($_POST['a']) || empty($_POST['a'])) ? "default" : $_POST['a'];
        
        // Si jamais c'est un upload, les paramètres sont donc les paramètres du fichier uploadé
        if(isset($_FILES) && !empty($_FILES)) $args = $_FILES['p']["name"]."|".$_FILES['p']["type"]."|".$_FILES['p']["tmp_name"]."|".$_FILES['p']["error"]."|".$_FILES['p']["size"];
        
        switch($_POST['c'])
        {
            case "Edit":
                require_once("controllers/cEdit.php");
                
                if(in_array($protoAction, array("load_preferences", "upload_image", "get_content_file", "show_image"))) eval("cEdit::" . $protoAction . "('{$args}');");
                break;

            case "Explorer":
                require_once("controllers/cExplorer.php");
                
                if(in_array($protoAction, array("change_directory_navBar", "change_directory_workspace", "list_elements", "show_navBar", "upload", "delete_elements", "copy_elements", "cut_elements", "paste", "create_file", "create_folder", "rename_element", "view_infos"))) eval("cExplorer::" . $protoAction . "('{$args}');");
                break;

            case "General":
                require_once("controllers/cGeneral.php");
                
                if(in_array($protoAction, array("load_preferences", "put_content_file", "put_preferences"))) eval("cGeneral::" . $protoAction . "('{$args}');");
                break;

            case "Panel":
                require_once("controllers/cPanel.php");
                
                if(in_array($protoAction, array("tab_apps", "tab_profil", "tab_search", "tab_settings", "edit_sessionName", "edit_mail", "edit_password", "edit_deleteAccount", "logout", "lock", "unlock"))) eval("cPanel::" . $protoAction . "('{$args}');");
                break;

            case "PDF":
                require_once("controllers/cPDF.php");
                
                if(in_array($protoAction, array("get_content_file", "test_file"))) eval("cPDF::" . $protoAction . "('{$args}');");
                break;
                
            case "Image":
                require_once("controllers/cImage.php");
                
                if(in_array($protoAction, array("list_elements", "verif_image", "view_image"))) eval("cImage::" . $protoAction . "('{$args}');");
                break;
                
            case "Video":
                require_once("controllers/cVideo.php");
                
                if(in_array($protoAction, array("verif_video", "view_video"))) eval("cVideo::" . $protoAction . "('{$args}');");
                break;
                
            case "Audio":
                require_once("controllers/cAudio.php");
                require_once("classes/audio2.class.php");
                
                if(in_array($protoAction, array("list_tracks", "load_track", "trigger_instrument", "trigger_mark"))) eval("cAudio::" . $protoAction . "('{$args}');");
                break;

            default:
                break;
        }   
    }