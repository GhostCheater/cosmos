<?php
    session_start();
    
    require_once("constants.php");
    
    $_SESSION['session'] = array(
        "token" => "d9e6762dd1c8eaf6d61b3c6192fc408d4d6d5f1176d0c29169bc24e71c3f274ad27fcd5811b313d681f7e55ec02d73d499c95455b6b5bb503acf574fba8ffe85",
        "user" => "0a041b9462caa4a31bac3567e0b6e6fd9100787db2ab433d96f6d178cabfce90",
        "name" => "Romain",
        "lockSession" => 0
    );

    $db_config = array(
        "SGBD" => "mysql",
        "HOST" => "localhost",
        "DB_NAME" => "cosmos",
        "USER" => "root",
        "PASSWORD" => "",
        "CHARSET" => "utf8",
        "PORT" => 3306,
        "OPTIONS" => array(
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, // Activation des exceptions PDO
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC // Change le fetch mode par défaut sur FETCH_ASSOC ( fetch() retournera un tableau associatif )
        )
    );
	
    try
    {
        $bdd = new PDO("{$db_config['SGBD']}:dbname={$db_config['DB_NAME']};host={$db_config['HOST']};charset={$db_config['CHARSET']};port={$db_config['PORT']}", "{$db_config['USER']}", "{$db_config['PASSWORD']}", $db_config['OPTIONS']);
    }
    catch(Exception $e)
    {
        trigger_error($e->getMessage(), E_USER_ERROR);
    }
?>