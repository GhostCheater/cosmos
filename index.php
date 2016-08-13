<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>CosmOS - Accueil</title>
        <meta lang="fr" />
        <link rel="icon" href="images/logo.png" type="image/png" />
        <link rel="stylesheet" type="text/css" href="css/home/index.css" />
        <link rel="stylesheet" type="text/css" href="css/home/general.css" />
    </head>
    
    <body>
        <header>
            <p style="width: 20%">
                <a href="index.php">Cosm<b>OS</b></a>
            </p>
            <p style="font-size: 16px;text-align:center;width: 80%">
                <a href="about.php">&Agrave; propos</a>
                <a href="apps.php">Fonctionnalités</a>
                <a href="prices.php">Prix</a>
                <a href="https://github.com/Ne0blast/cosmos">GitHub</a>
                <a href="donate.php">Faire un don</a>
                <a href="connect.php">Se connecter</a>
                <a href="register.php">S'inscrire</a>
            </p>
        </header>
        
        <section>
            <div id="slogan"><p>Accédez à vos fichiers où que vous soyez</p></div>
            <div id="screenshots"><p><img src="images/screenshots/1.png" /></p></div>
            <div id="buttons"><p><a href="apps.php"><input type="button" value="Voir les fonctionnalités" /></a></p><p><a href="register.php"><input type="button" value="Rejoindre l'aventure" /></a></p></div>
        </section>
        
        <script type="text/javascript">
            var $ = document.querySelector("#screenshots p img"),
                list = ["1.png", "2.png", "3.png"],
                cooldown = 5000;
            setInterval(function(){
                $.className = "hide";
                
                var newId = list.indexOf($.src.substr(parseInt($.src.lastIndexOf("/")) + 1, $.src.length)) + 1;
                
                if(newId == list.length) newId = 0;
                
                setTimeout(function(){$.src = "images/screenshots/" + list[newId];}, 400);
                
                setTimeout(function(){$.className = ""}, 1000);
            }, cooldown);
        </script>
    </body>
</html>