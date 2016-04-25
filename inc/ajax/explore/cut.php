<?php
    require_once("checkCurrentDirectory.php");
    
    if(isset($_GET['hash']) && !empty($_GET['hash']))
    {
        $hashs = explode(",", $_GET['hash']);
        
        $_SESSION['toPaste'] = array(
            "action" => "cut",
            "elements" => $hashs,
            "startDirectory" => $_SESSION['directory']
        );
        
        die("ok~||]]");
    }
    else 
    {
        die("empty~||]]");
    }
?>