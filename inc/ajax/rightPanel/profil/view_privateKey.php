<?php
    require_once("../../../global/checkSession.php");

    $data = file_get_contents("../../../../workspace/keys/{$_SESSION['session']['user']}/private.pgp");

    die($data);
?>