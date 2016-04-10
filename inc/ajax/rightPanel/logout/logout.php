<?php
    require_once("../../../global/checkSession.php");

    // Suppression de la session dans la bdd
    $req = $bdd->prepare("DELETE FROM session WHERE token = ? AND user = ?");
    $req->execute(array(
        $_SESSION['session']['token'],
        $_SESSION['session']['user']
    ));

    // Destruction des variables de session
    $_SESSION['session'] = array();
    $_SESSION['session'] = null;
    unset($_SESSION['session']);
    session_destroy();
?>