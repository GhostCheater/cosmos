<?php
    require_once("../../global/checkSession.php");

    /* Suppression dans la table "session" */
    $req = $bdd->prepare("DELETE FROM session WHERE token = ? AND user = ?");
    $req->execute(array(
        $_SESSION['session']['token'],
        $_SESSION['session']['user']
    ));

    /* Suppression dans la table "users" */
    $req = $bdd->prepare("DELETE FROM users WHERE hash = ?");
    $req->execute(array(
        $_SESSION['session']['user']
    ));

    /* Suppression des variables de session */
    $_SESSION['session'] = array();
    $_SESSION['session'] = null;
    unset($_SESSION['session']);
    session_destroy();
?>