<?php
    if(!isset($_SESSION['REQUEST_TIME']) || empty($_SESSION['REQUEST_TIME']))
    {
        $_SESSION['REQUEST_TIME'] = microtime(true);
    }
    else
    {
        if($_SESSION['REQUEST_TIME'] + 3 > microtime(true))
        {
            die("error~||]]");
        }
    }
?>