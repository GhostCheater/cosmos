<?php
    require_once("constants.php");

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