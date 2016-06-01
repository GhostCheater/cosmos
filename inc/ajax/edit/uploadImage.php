<?php
    require_once("../../global/global.php");

    if(isset($_FILES) && !empty($_FILES))
    {
        $directoryToUpload = "../../../workspace/temp/{$_SESSION['session']['user']}/";
        
        $extension = substr($_FILES['file']['name'], strrpos(".", $_FILES['file']['name']), strlen($_FILES['file']['name']));
        
        $filename = hash("sha256", microtime(true));
        
        if(move_uploaded_file($_FILES['file']['tmp_name'], $directoryToUpload.$filename.$extension))
        {
            echo "ok~||]]";   
            echo substr($directoryToUpload, 9).$filename.$extension;
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
?>