<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <meta lang="fr" />
        <title>CosmOS</title>
        <link rel="icon" href="images/logo.png" type="image/png">
        <link rel="stylesheet" type="text/css" href="css/desktop.css" />
        <link rel="stylesheet" type="text/css" href="css/rightPanel.css" />
        <link rel="stylesheet" type="text/css" href="css/popup.css" />
        <link rel="stylesheet" type="text/css" href="css/popup_content.css" />
        <link rel="stylesheet" type="text/css" href="css/window.css" />
        <link rel="stylesheet" type="text/css" href="css/lockMode.css" />
        <script type="text/javascript" src="js/global.js" async></script>
        <script type="text/javascript" src="js/window.js" async></script>
        <script type="text/javascript" src="js/errorMessages.js" async></script>
        <script type="text/javascript" src="js/popup.js" async></script>
        <script type="text/javascript" src="js/lib/sha512.js" async></script>
    </head>
    
    <body>
        <header>
            <div id="apps">
<!--                <p title="Explorateur de fichiers" class="open"><img src="apps/app_explorer/app.svg" /></p>-->
            </div>
            
            <div id="rightArea">
                <p title="Applications" onclick="COSMOS.header.trigger.panel('apps');"><img src="images/header/apps.svg" /><br />Applications</p>
                <p title="Recherche" onclick="COSMOS.header.trigger.panel('search');"><img src="images/header/search.svg" /><br />Recherche</p>
                <p title="Profil" onclick="COSMOS.header.trigger.panel('profil');"><img src="images/header/profil.svg" /><br />Utilisateur</p>
                <p title="Paramètres" onclick="COSMOS.header.trigger.panel('settings');"><img src="images/header/settings.svg" /><br />Paramètres</p>
                <p title="Déconnexion" onclick="COSMOS.header.trigger.panel('logout');"><img src="images/header/logout.svg" /><br />Déconnexion</p>
            </div>
        </header>
        
        <section id="rightPanel" class="close">
            <div id="header"><p></p></div>
            <div id="content"></div>
        </section>
        
        <section id="desktop">
        </section>
        
        <script type="text/javascript">
            window.onload = function()
            {
                COSMOS.init();
                
//                WINDOW.trigger("app_explorer", "orange");
            }
        </script>
    </body>
</html>