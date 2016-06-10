<?php
    // Test général de la session (active ou non)
    if(session_status() === PHP_SESSION_DISABLED || session_id() === '')
    {
        session_start();
    }

    // Définition de la variable de session pour l'explorateur de fichier
    if(!isset($_SESSION['directory']) || empty($_SESSION['directory']))
    {
        $_SESSION['directory'] = "/";
    }

    // Définition des constantes
    $_CONSTANTS = array(
        "version" => "1.0.0"
    );

    // Définition de la session par défaut pour les tests
    $_SESSION['session'] = array(
        "token" => "d9e6762dd1c8eaf6d61b3c6192fc408d4d6d5f1176d0c29169bc24e71c3f274ad27fcd5811b313d681f7e55ec02d73d499c95455b6b5bb503acf574fba8ffe85",
        "user" => "0a041b9462caa4a31bac3567e0b6e6fd9100787db2ab433d96f6d178cabfce90",
        "name" => "Romain",
        "lockSession" => 0
    );

    // Création de la connexion à la base de données
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

    // Test de la validité de la session en cours
    if(isset($_SESSION['session']['token']) && isset($_SESSION['session']['user']) && isset($_SESSION['session']['name']))
    {
        $req = $bdd->prepare("SELECT * FROM session WHERE token = ? AND user = ? AND ip = ?");
        $req->execute(array(
            $_SESSION['session']['token'],
            $_SESSION['session']['user'],
            $_SERVER['REMOTE_ADDR']
        ));
        
        if($req->rowCount() != 1)
        {
            die("invalidSession~||]]");
        }
    }
    else
    {
        die("error~||]]");
    }

    // Test de l'ouverture de la session (bloquée ou active)
    if($_SESSION['session']['lockSession'] == 1)
    {
        die("lock~||]]");
    }

    // Test de la requête
    if(!isset($_SESSION['REQUEST_TIME']) || empty($_SESSION['REQUEST_TIME']))
    {
        $_SESSION['REQUEST_TIME'] = microtime(true);
    }
    else
    {
        if($_SESSION['REQUEST_TIME'] + 1 > microtime(true))
        {
            die("error~||]]1111");
        }
    }

    // Liste des extensions
    $_EXTENSIONS = array(
        "archive" => array(
            "7z",
            "s7z",
            "ace",
            "afa",
            "alz",
            "apk",
            "arc",
            "arj",
            "b1",
            "ba",
            "bh",
            "cab",
            "car",
            "cfs",
            "cpt",
            "dar",
            "dgc",
            "dmg",
            "ear",
            "gca",
            "ha",
            "hki",
            "ice",
            "jar",
            "kgb",
            "lzh",
            "lha",
            "lzx",
            "pak",
            "partimg",
            "paq6",
            "paq7",
            "paq8",
            "pea",
            "pim",
            "pit",
            "qda",
            "rar",
            "rk",
            "rk",
            "sda",
            "sea",
            "sen",
            "sfx",
            "shk",
            "sit",
            "sitx",
            "sqx",
            "tar.gz",
            "tgz",
            "tar.Z",
            "tar.bz2",
            "tbz2",
            "tar.lzma",
            "tlz",
            "uc",
            "uc0",
            "uc2",
            "ucn",
            "ur2",
            "ue2",
            "uca",
            "uha",
            "war",
            "wim",
            "xar",
            "xp3",
            "yz1",
            "zip",
            "zipx",
            "zoo",
            "zpaq",
            "zz"
        ),
        "audio" => array(
            "wav",
            "cda",
            "mid",
            "mp2",
            "mp3",
            "mod",
            "rm",
            "ram",
            "vma",
            "ogg",
            "aif",
            "aac",
            "m4a",
            "vqf",
            "au",
            "m3u"
        ),
        "code" => array(
            "asa",
            "as",
            "applescript",
            "script editor",
            "bat",
            "cmd",
            "bib",
            "c",
            "h",
            "cs",
            "cpp",
            "cc",
            "cp",
            "cxx",
            "c++",
            "hh",
            "hpp",
            "hxx",
            "h++",
            "inl",
            "ipp",
            "css",
            "css.erb",
            "clj",
            "d",
            "di",
            "diff",
            "patch",
            "erl",
            "hrl",
            "emakefile",
            "go",
            "dot",
            "groovy",
            "gvy",
            "html",
            "htm",
            "shtml",
            "xhtml",
            "inc",
            "tmpl",
            "tpl",
            "asp",
            "yaws",
            "rhtml",
            "erb",
            "html.erb",
            "adp",
            "hs",
            "json",
            "java",
            "bsh",
            "properties",
            "jsp",
            "js",
            "htc",
            "jsx",
            "js.erb",
            "tex",
            "lisp",
            "cl",
            "l",
            "mud",
            "el",
            "scm",
            "ss",
            "lhs",
            "lua",
            "matlab",
            "make",
            "gnumakefile",
            "makefile",
            "ocammakefile",
            "mak",
            "mk",
            "mdown",
            "markdown",
            "mardn",
            "md",
            "build",
            "ml",
            "mli",
            "mll",
            "mly",
            "m",
            "mm",
            "php",
            "php3",
            "php4",
            "php5",
            "phps",
            "phpt",
            "phtml",
            "pas",
            "p",
            "pl",
            "pm",
            "pod",
            "t",
            "py",
            "rpy",
            "pyw",
            "cpy",
            "sconstruct",
            "sconscript",
            "gpy",
            "gypi",
            "r",
            "s",
            "rprofile",
            "rd",
            "re",
            "rh",
            "rhx",
            "rjs",
            "rakefile",
            "rake",
            "cgi",
            "fcgi",
            "gemspec",
            "irbrc",
            "capfile",
            "gemfile",
            "vagrantfile",
            "haml",
            "sass",
            "rxml",
            "builder",
            "sql",
            "ddl",
            "dml",
            "erbsql",
            "sql.erb",
            "scala",
            "sh",
            "bash",
            "zsh",
            "bash_aliases",
            "bash_functions",
            "bash_login",
            "bash_logout",
            "bash_profile",
            "bash_variables",
            "bashrc",
            "profile",
            "textmate_init",
            "tcl",
            "sty",
            "cls",
            "textile",
            "xml",
            "xsd",
            "tld",
            "dtml",
            "rss",
            "opml",
            "xslt",
            "yaml",
            "yml",
            "rst",
            "rest"
        ),
        "doc" => array(
            "doc"
        ),
        "image" => array(
            "bmp",
            "gif",
            "jpg",
            "jpeg",
            "png",
            "svg"
        ),
        "pdf" => array(
            "pdf"
        ),
        "video" => array(
            "3gp",
            "3g2",
            "asf",
            "wma",
            "wmv",
            "avi",
            "dpx",
            "flv",
            "mkv",
            "mka",
            "mks",
            "mp4",
            "ts",
            "mxf",
            "nut",
            "ogv",
            "ogm",
            "mov",
            "rm",
            "vob",
            "mpg",
            "webm"
        )
    );
?>