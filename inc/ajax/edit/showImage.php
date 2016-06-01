<?php
    require_once("../../global/global.php");

    if(isset($_GET['link']) && !empty($_GET['link']))
    {
        if(file_exists("../../../".$_GET['link']))
        {
            $file = "../../../".$_GET['link'];
                
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