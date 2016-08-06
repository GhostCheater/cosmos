<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <meta lang="fr" />
        <title>CosmOS</title>
        <link rel="icon" href="images/logo.png" type="image/png" />
        
        <link rel="stylesheet" type="text/css" href="css/desktop.css" />
        <link rel="stylesheet" type="text/css" href="css/desktop_explorer.css" />
        <link rel="stylesheet" type="text/css" href="css/notifications.css" />
        <link rel="stylesheet" type="text/css" href="css/rightPanel.css" />
        <link rel="stylesheet" type="text/css" href="css/popup.css" />
        <link rel="stylesheet" type="text/css" href="css/popup_content.css" />
        <link rel="stylesheet" type="text/css" href="css/window.css" />
        <link rel="stylesheet" type="text/css" href="css/lockMode.css" />
        <link rel="stylesheet" type="text/css" href="css/disposition.css" />
        
        <script type="text/javascript" src="js/global.js" async></script>
        <script type="text/javascript" src="js/exception.js" async></script>
        <script type="text/javascript" src="js/explorer/explorer.js" async></script>
        <script type="text/javascript" src="js/window.js" async></script>
        <script type="text/javascript" src="js/errorMessages.js" async></script>
        <script type="text/javascript" src="js/popup.js" async></script>
        <script type="text/javascript" src="js/lib/sha512.js" async></script>
    </head>
    
    <body>
        <header>
            <div id="apps"></div>
            
            <div id="rightArea">
                <p title="Notifications" onclick="COSMOS.header.trigger.panel('notifications');"><img src="images/header/notifications.svg" /><br />Notifications</p>
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
            <div id="explorer">
                <div id="path"></div>
                <div id="actions">
                    <p onclick="EXPLORER.actions.createFile();"><img src="images/explorer/actions/newFile.svg" /></p>
                    <p onclick="EXPLORER.actions.createFolder();"><img src="images/explorer/actions/newFolder.svg" /></p>
                    <p onclick="EXPLORER.actions.upload.show();"><img src="images/explorer/actions/upload.svg" /></p>
                </div>
                
                <div class="secondOrbit"></div>
                <div class="thirdOrbit"></div>
                
                <span id="circle_center"><p><img class="" src="images/explorer/principal_dir.svg" /></p></span>
                
                <span id="firstOrbit" class="orbiting_files"></span>
                <span id="secondOrbit" class="orbiting_files"></span>
                <span id="thirdOrbit" class="orbiting_files"></span>
                
                <div id="popUp_explorer" class="orbit_8">
                    <img src="images/explorer/arrows/up.svg" class="arrow up" />
                    <img src="images/explorer/arrows/left.svg" class="arrow left" />
                    <img src="images/explorer/arrows/right.svg" class="arrow right" />
                    <img src="images/explorer/arrows/down.svg" class="arrow down" />
                    
                    <div class="header"></div>
                    <div class="infos"><span class="line"></span><span class="line"></span></div>
                    <div class="actions"><span class="line"></span><span class="line"></span></div>
                </div>
            </div>
        </section>
        
        <section id="notifications_content"></section>
        <section id="notifications_area" class="warning">
            <span class="header"><p>Erreur</p></span>
            <span class="content"><p>Error parsing JSON @script.js:226</p></span>
        </section>
        
        <script type="text/javascript">
            window.onload = function()
            {                
                COSMOS.init();
                EXPLORER.init();
            };
            
            window.onerror = function()
            {
                var err = new Error();
                MESSAGES.display.error(err.stack);
            };
        </script>
    </body>
</html>