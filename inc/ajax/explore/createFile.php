<?php
    require_once("checkCurrentDirectory.php");

    if(isset($_GET['name']) && !empty($_GET['name']))
    {
        $hash = hash("sha256", microtime());
        $date = date("Y-m-d");
        
        if(isset($_GET['extension']))
        {
            if(empty($_GET['extension']))
            {
                $extension = "txt";
            }
            else
            {
                $extension = $_GET['extension'];
            }
        }
        
        
    }
    else
    {
        die("empty~||]]");
    }
?>