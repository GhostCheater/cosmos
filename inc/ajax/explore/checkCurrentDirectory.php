<?php
    require_once("../../global/checkSession.php");

    if(!isset($_SESSION['directory']) || empty($_SESSION['directory']))
    {
        $_SESSION['directory'] = "/";
    }
?>