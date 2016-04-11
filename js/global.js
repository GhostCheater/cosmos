var COSMOS = 
{
    /*
    * Eléments de l'interface
    */
    elements:
    {
        header:
        {
            global: function() {return document.querySelector("header");},
            listApps: function() {return document.querySelector("header div#apps");},
            buttons: function() {return document.querySelectorAll("header div#rightArea p")},
            
            button:
            {
                apps: function() {return document.querySelectorAll("header div#rightArea p")[0]},
                search: function() {return document.querySelectorAll("header div#rightArea p")[1]},
                user: function() {return document.querySelectorAll("header div#rightArea p")[2]},
                settings: function() {return document.querySelectorAll("header div#rightArea p")[3]},
                logout: function() {return document.querySelectorAll("header div#rightArea p")[4]}
            }
        },
        
        desktop:
        {
            global: function() {return document.querySelector("section#desktop")}
        },
        
		rightPanel:
		{
			global: function() {return document.querySelector("section#rightPanel")},
			header: function() {return document.querySelector("section#rightPanel div#header p")},
            content: function() {return document.querySelector("section#rightPanel div#content")}
		}
    },
    
    /*
    * Fonction d'initialisation de l'interface
    */
    init: function()
    {
        
    },
    
    /*
    * Interaction entre l'utilisateur et le header
    */
    header:
    {
        /*
        * Récupération des actions
        */
        trigger:
        {
            /*
            * Actions liées au panneau de droite
            */
            panel: function(tab)
            {
                // Eléments
                var rightPanel = COSMOS.elements.rightPanel.global();
				var header_rightPanel = COSMOS.elements.rightPanel.header();
                var content_rightPanel = COSMOS.elements.rightPanel.content();
                
                // Ouverture ou fermeture du panneau
                if(rightPanel.className.indexOf(tab) != -1)
                {
                    rightPanel.className = "close"; // Fermeture
                }
                else
                {
                    rightPanel.className = "open "+tab; // Ouverture
                }
                
                // Coloration de l'onglet sélectionné
                for(var i = 0; i < COSMOS.elements.header.buttons().length; i++)
                {
                    COSMOS.elements.header.buttons()[i].className = ""; // Suppression de la coloration sur tous les onglets
                }
                
                
                switch(tab)
                {
                    case "apps":                        
                        if(rightPanel.className.indexOf("apps") != -1)
                        {
                            header_rightPanel.innerHTML = "<img src='images/header/apps.svg' /><br />Applications";
                            content_rightPanel.innerHTML = "<p style='text-align: center'><br /><img src='images/loader.png' style='width: 32px;' /></p>";
                            
                            COSMOS.elements.header.button.apps().className = "selected";
                            
                            var xhr = new XMLHttpRequest();
                            xhr.open("GET", "inc/ajax/rightPanel/apps.php", true);
                    
                            xhr.onreadystatechange = function()
                            {
                                if(xhr.status == 200 && xhr.readyState == 4)
                                {
                                    var state = xhr.responseText.split("~||]]", 1)[0];
                                    var data = xhr.responseText.split("~||]]", 2)[1];
                                    
                                    switch(state)
                                    {
                                        case "ok":
                                            try
                                            {
                                                var json = JSON.parse(data);
                                                var toAppend = "<table id='apps'>";
                                                
                                                for(key in json)
                                                {
                                                    toAppend += "<tr onclick='WINDOW.trigger(\"" + json[key]["id"] + "\", \""+json[key]["color"]+"\");'><td><img src='apps/" + json[key]["id"] + "/app.svg' /></td><td>" + json[key]["name"] + "</td></tr>";
                                                }
                                                
                                                toAppend += "</table>";
                                                
                                                if(rightPanel.className.indexOf("apps") != -1)
                                                {
                                                    content_rightPanel.innerHTML = toAppend;
                                                }
                                            }
                                            catch(e)
                                            {
                                                console.error("Error parsing json");
                                            }
                                            
                                            break;

                                        case "invalidSession":
                                            console.log("Error session :(");
                                            break;

                                        case "error":
                                            console.log("Error :(");
                                            break;

                                        default:
                                            console.log("Unexepted error :(");
                                            break;
                                    }
                                }
                            }

                            xhr.send(null);
                        }
                        break;
                        
                    case "search":
                        if(rightPanel.className.indexOf("search") != -1)
                        {
                            COSMOS.elements.header.button.search().className = "selected";
                            header_rightPanel.innerHTML = "<img src='images/header/search.svg' /><br />Recherche";
                            content_rightPanel.innerHTML = 
                                "<div id='searchBar'>"+
                                    "<p>"+
                                        "<input type='text' placeholder='Votre recherche...' onkeyup='COSMOS.rightPanel.trigger.search(event);' id='area_search_input' />"+
                                    "</p>"+
                                "</div>"+
                                "<div id='contentResults'>"+
                                    "<div id='loader'><p></p></div>"+
                                    "<table id='resultSearch'></table>"+
                                "</div>";
                        }
                        break;
                        
                    case "profil":
                        if(rightPanel.className.indexOf("profil") != -1)
                        {
                            header_rightPanel.innerHTML = "<img src='images/header/profil.svg' /><br />Utilisateur";
                            content_rightPanel.innerHTML = "<p style='text-align: center'><br /><img src='images/loader.png' style='width: 32px;' /></p>";
                            
                            COSMOS.elements.header.button.user().className = "selected";
                            
                            var xhr = new XMLHttpRequest();
                            xhr.open("GET", "inc/ajax/rightPanel/profil.php", true);
                    
                            xhr.onreadystatechange = function()
                            {
                                if(xhr.status == 200 && xhr.readyState == 4)
                                {
                                    var state = xhr.responseText.split("~||]]", 1)[0];
                                    var data = xhr.responseText.split("~||]]", 2)[1];
                                    
                                    switch(state)
                                    {
                                        case "ok":
                                            if(rightPanel.className.indexOf("profil") != -1)
                                            {
                                                content_rightPanel.innerHTML = data;
                                            }
                                            break;

                                        case "invalidSession":
                                            console.log("Error session :(");
                                            break;

                                        case "error":
                                            console.log("Error :(");
                                            break;

                                        default:
                                            console.log("Unexepted error :(");
                                            break;
                                    }
                                }
                            }
                            
                            xhr.send(null);
                        }
                        break;
                        
                    case "settings":
                        if(rightPanel.className.indexOf("settings") != -1)
                        {
                            header_rightPanel.innerHTML = "<img src='images/header/settings.svg' /><br />Paramètres";
                            content_rightPanel.innerHTML = "<p style='text-align: center'><br /><img src='images/loader.png' style='width: 32px;' /></p>";
                            
                            COSMOS.elements.header.button.settings().className = "selected";
                            
                            var xhr = new XMLHttpRequest();
                            xhr.open("GET", "inc/ajax/rightPanel/settings.php", true);
                    
                            xhr.onreadystatechange = function()
                            {
                                if(xhr.status == 200 && xhr.readyState == 4)
                                {
                                    var state = xhr.responseText.split("~||]]", 1)[0];
                                    var data = xhr.responseText.split("~||]]", 2)[1];
                                    
                                    switch(state)
                                    {
                                        case "ok":
                                            if(rightPanel.className.indexOf("settings") != -1)
                                            {
                                                content_rightPanel.innerHTML = data;
                                            }
                                            break;

                                        case "invalidSession":
                                            console.log("Error session :(");
                                            break;

                                        case "error":
                                            console.log("Error :(");
                                            break;

                                        default:
                                            console.log("Unexepted error :(");
                                            break;
                                    }
                                }
                            }
                            
                            xhr.send(null);
                        }
                        break;
                        
                    case "logout":
                        if(rightPanel.className.indexOf("logout") != -1)
                        {
                            header_rightPanel.innerHTML = "<img src='images/header/logout.svg' /><br />Déconnexion";
                            content_rightPanel.innerHTML = 
                                "<div id='logoutContent'>"+
                                    "<table id='resultsLogout'>"+
                                        "<tr><th colspan='2'>Options de fermeture</th></tr>"+
                                        "<tr onclick='COSMOS.rightPanel.trigger.logout.logout();'><td><img src='images/rightPanel/logout/logout.svg' /></td><td>Se déconnecter &nbsp; <img src='images/rightPanel/logout/info.svg' style='height: 1.2vh;' title='La déconnexion entrainera la fermeture de la session ainsi que la perte de toutes données non sauvegardées.' /></td></tr>"+
                                        "<tr onclick='COSMOS.rightPanel.trigger.logout.reload();'><td><img src='images/rightPanel/logout/restart.svg' /></td><td>Recharger l'interface &nbsp; <img src='images/rightPanel/logout/info.svg' style='height: 1.2vh;'</td></tr>"+
                                        "<tr onclick='COSMOS.rightPanel.trigger.logout.sleep();'><td><img src='images/rightPanel/logout/sleep.svg' /></td><td>Mettre en veille &nbsp; <img src='images/rightPanel/logout/info.svg' style='height: 1.2vh;'</td></tr>"+
                                    "</table>"+
                                "</div>";
                            
                            COSMOS.elements.header.button.logout().className = "selected";
                        }
                        break;
                        
                    default:
                        break;
                }
            }
        }
    },
    
    rightPanel:
    {
        trigger:
        {
            search: function(e)
            {
                var evt = e || window.Event;
                
                if(evt.key != "Tab" && evt.key != "Control" && evt.key != "Shift" && evt.key != "Alt")
                {
                    var patternToSearch = document.querySelector("input#area_search_input").value;

                    if(patternToSearch != "")
                    {
                        document.querySelector("div#contentResults div#loader p").innerHTML = "Recherche en cours... &nbsp; <img src='images/loader.png' />";
                        
                        var xhr = new XMLHttpRequest();
                        xhr.open("GET", "inc/ajax/rightPanel/search.php?patternToSearch="+patternToSearch, true);

                        xhr.onreadystatechange = function()
                        {
                            if(xhr.status == 200 && xhr.readyState == 4)
                            {
                                var state = xhr.responseText.split("~||]]", 1)[0];
                                var data = xhr.responseText.split("~||]]", 2)[1];

                                console.log(xhr.responseText);

                                switch(state)
                                {
                                    case "ok":
                                        try
                                        {
                                            var json = JSON.parse(data);
                                            var toAppend = "";
                                            
                                            document.querySelector("div#contentResults div#loader p").innerHTML = "<b>" + (json["Applications"].length + json["Fichiers"].length + json["Dossiers"].length) + "</b> élément(s) trouvé(s)";
                                            
                                            for(key in json)
                                            {
                                                toAppend += "<tr class='noHighlight'><th colspan='2'>" + key + "</th></tr>";
                                                
                                                if(json[key].length == 0)
                                                {
                                                    toAppend += "<tr class='noHighlight'><td colspan='2'>Aucun résultat</td></tr>";
                                                }
                                                else
                                                {
                                                    for(item in json[key])
                                                    {
                                                        if(key == "Applications")
                                                        {
                                                            toAppend += "<tr onclick='WINDOW.trigger(\""+json[key][item][1]+"\", \""+json[key][item][2]+"\")'><td><img src='apps/" + json[key][item][1] + "/app.svg' /></td><td>" + json[key][item][0] + "</td></tr>";
                                                        }
                                                        else if(key == "Fichiers")
                                                        {
                                                            toAppend += "<tr><td><img src='apps/app_explorer/images/types/" + json[key][item][2] + ".svg' /></td><td>" + json[key][item][0] + "<br /><sub>" + json[key][item][3] + "</sub></td></tr>";
                                                        }
                                                        else
                                                        {
                                                            toAppend += "<tr><td><img src='apps/app_explorer/images/types/folder.svg' /></td><td>" + json[key][item][0] + "<br /><sub>" + json[key][item][3] + "</sub></td></tr>";
                                                        }
                                                    }
                                                }
                                            }
                                            
                                            document.querySelector("table#resultSearch").innerHTML = toAppend;
                                            
                                        }
                                        catch(e)
                                        {
                                            console.error("Error parsing json");
                                        }
                                        break;

                                    case "invalidSession":
                                        console.log("Error session :(");
                                        break;

                                    case "error":
                                        console.log("Error");
                                        break;

                                    default:
                                        console.log("Unexcepted error :(");
                                        break;
                                }
                            }
                        }

                        xhr.send(null);
                    }
                }
            },
            
            profil:
            {
                editSessionName: function()
                {
                    popup.open(
                        "popup_editSessionName",
                        "Changement de votre nom de session",
                        "<input type='text' placeholder='Nouveau nom...' id='input_editSessionName' /><br /><br /><span id='return_editSessionName'></span>",
                        "<input type='button' value='Modifier' class='button' onclick='COSMOS.rightPanel.trigger.profil.submit.editSessionName();' />"
                    );
                },
                
                editMail: function()
                {
                    popup.open(
						"popup_editMail",
						"Changement de votre adresse mail",
						"<input type='text' placeholder='Nouvelle adresse mail...' id='input_editMail' /><br /><br /><span id='return_editMail'></span>",
						"<input type='button' value='Modifier' class='button' onclick='COSMOS.rightPanel.trigger.profil.submit.editMail();' />"
					);
                },
                                
                viewPublicKey: function()
                {
                    popup.open(
                        "popup_viewPublicKey",
                        "Visionnage de votre clé publique",
                        "<b>Clé publique</b><br /><br /><textarea id='content_viewPublicKey' style='width: 30vw;height:20vh;resize: none;border-radius: 3px;border: 1px solid #bebebe;padding: 1vh;' readonly='true'>Chargement...</textarea>",
                        ""
                    );
                    
                    COSMOS.rightPanel.trigger.profil.submit.viewPublicKey();
                },
                
                viewPrivateKey: function()
                {
                    popup.open(
                        "popup_viewPrivateKey",
                        "Visionnage de votre clé privée",
                        "<b>Clé privée</b><br /><br /><textarea id='content_viewPrivateKey' style='width: 30vw;height:20vh;resize: none;border-radius: 3px;border: 1px solid #bebebe;padding: 1vh;' readonly='true'>Chargement...</textarea>",
                        ""
                    );
                    
                    COSMOS.rightPanel.trigger.profil.submit.viewPrivateKey();
                },
                
                deleteAccount: function()
                {
                    popup.open(
                        "popup_deleteAccount",
                        "Suppression de votre compte",
                        "Êtes-vous sûr(e) de vouloir supprimer votre compte ? Toutes vos données seront supprimées.",
                        "<input type='button' value='Supprimer' class='button' onclick='COSMOS.rightPanel.trigger.profil.submit.deleteAccount();' />"
                    );
                },
                
                submit:
                {
                    editSessionName: function()
                    {
                        var newName = document.querySelector("#input_editSessionName").value;
						var returnArea = document.querySelector("#return_editSessionName");
						
						returnArea.innerHTML = "<img src='images/loader.png' style='height: 1.5vh;' />";
                        
                        if(newName != "")
                        {
                            var xhr = new XMLHttpRequest();
                            xhr.open("GET", "inc/ajax/rightPanel/profil/edit_sessionName.php?name="+encodeURI(newName), true);
                            
                            xhr.onreadystatechange = function()
                            {
                                if(xhr.status == 200 && xhr.readyState == 4)
                                {
									var state = xhr.responseText.split("~||]]", 1)[0];
									
                                    switch(state)
                                    {
                                        case "ok":
											returnArea.innerHTML = "Votre nom de session est maintenant <b>"+encodeURI(newName)+"</b> !";
											
											if(rightPanel.className.indexOf("profil") != -1)
											{
												document.querySelectorAll("#resultProfil tr td")[1].innerHTML = encodeURI(newName) + " &nbsp; <img src='images/rightPanel/profil/edit.svg' style='height: 1.5vh;' onclick='COSMOS.rightPanel.trigger.profil.editSessionName();' class='action' />";
											}
                                            break;
											
										case "length":
											returnArea.innerHTML = "Désolé mais votre nom de session est trop long";
											break;
                                            
                                        case "invalidSession":
											returnArea.innerHTML = "Erreur au niveau de votre session. Déconnexion...";
                                            break;
                                            
                                        case "error":
											returnArea.innerHTML = "Erreur lors du changement de votre nom de session";
                                            break;
                                            
                                        case "empty":
											returnArea.innerHTML = "Votre nom de session est vide";
                                            break;
                                            
                                        default:
											returnArea.innerHTML = "Une erreur inconnue est survenue";
                                            break;
                                    }
                                }
                            }
                            
                            xhr.send(null);
                        }
                        else
                        {
                            document.querySelector("#return_editSessionName").innerHTML = "Votre nom de session est vide";
                        }
                    },
                    
                    editMail: function()
                    {
                        var newMail = document.querySelector("#input_editMail").value;
						var returnArea = document.querySelector("#return_editMail");
						
						returnArea.innerHTML = "<img src='images/loader.png' style='height: 1.5vh;' />";
                        
                        if(newMail != "")
                        {
                            var xhr = new XMLHttpRequest();
                            xhr.open("GET", "inc/ajax/rightPanel/profil/edit_mail.php?mail="+encodeURI(newMail), true);
                            
                            xhr.onreadystatechange = function()
                            {
                                if(xhr.status == 200 && xhr.readyState == 4)
                                {                                    
									var state = xhr.responseText.split("~||]]", 1)[0];
									
                                    switch(state)
                                    {
                                        case "ok":
											returnArea.innerHTML = "Votre adresse mail est maintenant <b>"+encodeURI(newMail)+"</b> !";
											
											if(rightPanel.className.indexOf("profil") != -1)
											{
												document.querySelectorAll("#resultProfil tr td")[3].innerHTML = encodeURI(newMail) + " &nbsp; <img src='images/rightPanel/profil/edit.svg' style='height: 1.5vh;' onclick='COSMOS.rightPanel.trigger.profil.editMail();' class='action' />";
											}
                                            break;
											
										case "length":
											returnArea.innerHTML = "Désolé mais votre adresse mail est trop longue";
											break;
                                            
                                        case "format":
                                            returnArea.innerHTML = "Mauvais format de votre adresse mail";
                                            break;
                                            
                                        case "invalidSession":
											returnArea.innerHTML = "Erreur au niveau de votre session. Déconnexion...";
                                            break;
                                            
                                        case "error":
											returnArea.innerHTML = "Erreur lors du changement de votre adresse mail";
                                            break;
                                            
                                        case "empty":
											returnArea.innerHTML = "Votre adresse mail est vide";
                                            break;
                                            
                                        default:
											returnArea.innerHTML = "Une erreur inconnue est survenue";
                                            break;
                                    }
                                }
                            }
                            
                            xhr.send(null);
                        }
                        else
                        {
                            document.querySelector("#return_editSessionName").innerHTML = "Votre adresse mail est vide";
                        }
                    },
                    
                    saveNewPassword: function()
                    {
                        var oldPassword = document.querySelector("#edit_password_old").value;
                        var newPassword = document.querySelector("#edit_password_new").value;
                        var repeatPassword = document.querySelector("#edit_password_repeat").value;
                        var button = document.querySelector("#button_edit_password");
                        
                        if(oldPassword != "" && newPassword != "" && repeatPassword != "" && typeof oldPassword == "string" && typeof newPassword == "string" && typeof repeatPassword == "string")
                        {
                            button.value = "Chargement...";
                            
                            var hash_oldPassword = sha512(oldPassword);
                            var hash_newPassword = sha512(newPassword);
                            var hash_repeatPassword = sha512(repeatPassword);
                            
                            var xhr = new XMLHttpRequest();
                            xhr.open("GET", "inc/ajax/rightPanel/profil/edit_password.php?old="+hash_oldPassword+"&new="+hash_newPassword+"&repeat="+hash_repeatPassword, true);
                            
                            xhr.onreadystatechange = function()
                            {
                                if(xhr.status == 200 && xhr.readyState == 4)
                                {
                                    console.log(xhr.responseText);
                                    
                                    var state = xhr.responseText.split("~||]]", 1)[0];
									
                                    switch(state)
                                    {
                                        case "ok":
                                            button.value = "Succès !";
                                            break;
                                            
                                        case "empty":
                                            button.value = "Champ(s) vide(s) !";
                                            break;
                                            
                                        case "badLength":
                                            button.value = "Erreur hash !";
                                            break;
                                            
                                        case "mismatchNewPassword":
                                            button.value = "Mots de passe différents !";
                                            break;
                                            
                                        case "error":
                                            button.value = "Erreur !";
                                            break;
                                            
                                        case "oldPasswordBad":
                                            button.value = "Mauvais mot de passe !";
                                            break;
                                            
                                        default:
                                            button.value = "Erreur inconnue !";
                                            break;
                                    }
                                    
                                    setTimeout(function(){
                                        button.value = "Sauvegarder";
                                        document.querySelector("#edit_password_old").value = "";
                                        document.querySelector("#edit_password_new").value = "";
                                        document.querySelector("#edit_password_repeat").value = "";
                                    }, 1500);
                                }
                            }
                            
                            xhr.send(null);
                        }
                    },
                    
                    viewPublicKey: function()
                    {
                        var xhr = new XMLHttpRequest();
                        xhr.open("GET", "inc/ajax/rightPanel/profil/view_publicKey.php", true);
                        
                        xhr.onreadystatechange = function()
                        {
                            if(xhr.status == 200 && xhr.readyState == 4)
                            {
                                document.querySelector("#content_viewPublicKey").innerHTML = xhr.responseText;
                            }
                        }
                        
                        xhr.send(null);
                    },
                    
                    viewPrivateKey: function()
                    {
                        var xhr = new XMLHttpRequest();
                        xhr.open("GET", "inc/ajax/rightPanel/profil/view_privateKey.php", true);
                        
                        xhr.onreadystatechange = function()
                        {
                            if(xhr.status == 200 && xhr.readyState == 4)
                            {
                                document.querySelector("#content_viewPrivateKey").innerHTML = xhr.responseText;
                            }
                        }
                        
                        xhr.send(null);
                    },

                    deleteAccount: function()
                    {
                        var xhr = new XMLHttpRequest();
                        xhr.open("GET", "inc/ajax/rightPanel/profil/edit_deleteAccount.php", true);
                        
                        xhr.onreadystatechange = function()
                        {
                            if(xhr.status == 200 && xhr.readyState == 4)
                            {
                                document.location.href = "index.php";
                            }
                        }
                        
                        xhr.send(null);
                    }
                }
            },
            
            settings:
            {
                editHeaderBackground: function()
                {
                    popup.open(
                        "popup_changeColorHeader",
                        "Changement du fond du header",
                        "Chargement...",
                        ""
                    );
                    
                    COSMOS.rightPanel.trigger.settings.submit.load_currentBackgroundHeader();
                },
                
                editDesktopBackground: function()
                {
                    popup.open(
                        "popup_changeColorDesktop",
                        "Changement du fond de l'interface",
                        "Chargement...",
                        ""
                    );
                    
                    COSMOS.rightPanel.trigger.settings.submit.load_currentBackgroundDesktop();
                },
                
                editFontSize: function()
                {
                    popup.open(
                        "popup_changeFontSize",
                        "Changement de la taille de la police",
                        "Chargement...",
                        ""
                    );
                    
                    COSMOS.rightPanel.trigger.settings.submit.load_currentFontSize();
                },
                
                changeDisposition: function(disposition)
                {
                    var xhr = new XMLHttpRequest();
                    xhr.open("GET", "inc/ajax/general/put_preferences.php?change=disposition&content="+disposition, true);

                    xhr.onreadystatechange = function()
                    {
                        if(xhr.status == 200 && xhr.readyState == 4)
                        {
                            var elements = document.querySelectorAll("div#settingsContent table#resultSettings tr td img.disposition");
                            
                            for(var i = 0; i < elements.length; i++)
                            {
                                if(elements[i].id == disposition)
                                {
                                    elements[i].className = "disposition selected";
                                }
                                else
                                {
                                    elements[i].className = "disposition";
                                }
                            }
                        }
                    }

                    xhr.send(null);
                },
                
                submit:
                {
                    load_currentBackgroundHeader: function()
                    {
						var xhr = new XMLHttpRequest();
						xhr.open("GET", "inc/ajax/general/load_preferences.php", true);
						
						xhr.onreadystatechange = function()
						{
							if(xhr.status == 200 && xhr.readyState == 4)
							{
								var state = xhr.responseText.split("~||]]", 1)[0];
                                var data = xhr.responseText.split("~||]]", 2)[1];
								
								switch(state)
								{
									case "ok":
										try
										{
											var parsedJSON = JSON.parse(data);
											
											console.log(parsedJSON);
											var currentBackground = parsedJSON["preferences"]["headerBackground"];
											
											var toAppend = "";
                        
											var content = [
												["rgba(255, 0, 0, 0.6)", "<br /><br />"],
												["rgba(255, 0, 88, 0.6)", ""],
												["rgba(255, 0, 157, 0.6)", "<br /><br />"],
												["rgba(255, 0, 245, 0.6)", ""],
												["rgba(167, 0, 255, 0.6)", ""],
												["rgba(78, 0, 255, 0.6)", "<br /><br />"],
												["rgba(0, 10, 255, 0.6)", ""],
												["rgba(0, 157, 255, 0.6)", ""],
												["rgba(0, 216, 255, 0.6)", ""],
												["rgba(217, 217, 217, 0.6)", "<br /><br />"],
												["rgba(124, 124, 124, 0.6)", ""],
												["rgba(67, 67, 67, 0.6)", ""],
												["rgba(0, 0, 0, 0.6)", ""],
												["rgba(36, 36, 36, 0.6)", ""],
												["rgba(178, 178, 178, 0.6)", "<br /><br />"],
												["rgba(0, 255, 196, 0.6)", ""],
												["rgba(0, 255, 128, 0.6)", ""],
												["rgba(0, 255, 98, 0.6)", ""],
												["rgba(0, 255, 10, 0.6)", ""],
												["rgba(98, 255, 0, 0.6)", ""],
												["rgba(206, 255, 0, 0.6)", "<br /><br />"],
												["rgba(255, 167, 0, 0.6)", ""],
												["rgba(255, 88, 0, 0.6)", ""],
												["rgba(255, 0, 0, 0.6)", ""],
												["rgba(173, 0, 0, 0.6)", ""]
											];
											
											for(var i = 0; i < content.length; i++)
											{
												if(content[i][0].indexOf(currentBackground) != -1)
												{
													toAppend += "<span class='colorPickerBlock selected' style='background-color: "+content[i][0]+"' onclick='COSMOS.rightPanel.trigger.settings.submit.preview_headerBackground(this);'></span>" + content[i][1];
												}
												else
												{
													toAppend += "<span class='colorPickerBlock' style='background-color: "+content[i][0]+"' onclick='COSMOS.rightPanel.trigger.settings.submit.preview_headerBackground(this);'></span>" + content[i][1];
												}
											}
											
											document.querySelector("#popup_changeColorHeader div.content p").innerHTML = toAppend;
										}
										catch(err)
										{
											console.log("error");
										}
										break;
										
									case "error":
										console.log("error");
										break;
										
									default:
										console.log("error");
										break;
								}
							}
						}
						
						xhr.send(null);
                    },
                    
                    load_currentBackgroundDesktop: function()
                    {
                        var xhr = new XMLHttpRequest();
						xhr.open("GET", "inc/ajax/general/load_preferences.php", true);
						
						xhr.onreadystatechange = function()
						{
							if(xhr.status == 200 && xhr.readyState == 4)
							{
								var state = xhr.responseText.split("~||]]", 1)[0];
                                var data = xhr.responseText.split("~||]]", 2)[1];
								
								switch(state)
								{
									case "ok":
										try
										{
											var parsedJSON = JSON.parse(data);
											
											var currentBackground = parsedJSON["preferences"]["desktopBackground"];
											
											var toAppend = "";
                        
											var content = [
												["rgba(255, 0, 0, 0.6)", "<br /><br />"],
												["rgba(255, 0, 88, 0.6)", ""],
												["rgba(255, 0, 157, 0.6)", "<br /><br />"],
												["rgba(255, 0, 245, 0.6)", ""],
												["rgba(167, 0, 255, 0.6)", ""],
												["rgba(78, 0, 255, 0.6)", "<br /><br />"],
												["rgba(0, 10, 255, 0.6)", ""],
												["rgba(0, 157, 255, 0.6)", ""],
												["rgba(0, 216, 255, 0.6)", ""],
												["rgba(217, 217, 217, 0.6)", "<br /><br />"],
												["rgba(124, 124, 124, 0.6)", ""],
												["rgba(67, 67, 67, 0.6)", ""],
												["rgba(0, 0, 0, 0.6)", ""],
												["rgba(36, 36, 36, 0.6)", ""],
												["rgba(178, 178, 178, 0.6)", "<br /><br />"],
												["rgba(0, 255, 196, 0.6)", ""],
												["rgba(0, 255, 128, 0.6)", ""],
												["rgba(0, 255, 98, 0.6)", ""],
												["rgba(0, 255, 10, 0.6)", ""],
												["rgba(98, 255, 0, 0.6)", ""],
												["rgba(206, 255, 0, 0.6)", "<br /><br />"],
												["rgba(255, 167, 0, 0.6)", ""],
												["rgba(255, 88, 0, 0.6)", ""],
												["rgba(255, 0, 0, 0.6)", ""],
												["rgba(173, 0, 0, 0.6)", ""]
											];
											
											for(var i = 0; i < content.length; i++)
											{
												if(content[i][0].indexOf(currentBackground) != -1)
												{
													toAppend += "<span class='colorPickerBlock selected' style='background-color: "+content[i][0]+"' onclick='COSMOS.rightPanel.trigger.settings.submit.preview_desktopBackground(this);'></span>" + content[i][1];
												}
												else
												{
													toAppend += "<span class='colorPickerBlock' style='background-color: "+content[i][0]+"' onclick='COSMOS.rightPanel.trigger.settings.submit.preview_desktopBackground(this);'></span>" + content[i][1];
												}
											}
											
											document.querySelector("#popup_changeColorDesktop div.content p").innerHTML = toAppend;
										}
										catch(err)
										{
											console.log("error");
										}
										break;
										
									case "error":
										console.log("error");
										break;
										
									default:
										console.log("error");
										break;
								}
							}
						}
						
						xhr.send(null);
                    },
                    
                    load_currentFontSize: function()
                    {
                        var xhr = new XMLHttpRequest();
						xhr.open("GET", "inc/ajax/general/load_preferences.php", true);
						
						xhr.onreadystatechange = function()
						{
							if(xhr.status == 200 && xhr.readyState == 4)
							{
								var state = xhr.responseText.split("~||]]", 1)[0];
                                var data = xhr.responseText.split("~||]]", 2)[1];
								
								switch(state)
								{
									case "ok":
										try
										{
											var parsedJSON = JSON.parse(data);
											
											var currentSize = parsedJSON["preferences"]["fontSize"];
                                            
                                            var toAppend = "<select onchange='COSMOS.rightPanel.trigger.settings.submit.preview_fontSize(this);'>";
                                            
                                            var sizes = [8, 9, 10, 11, 12, 13, 14, 15, 16];
                                            
                                            for(var i = 0; i < sizes.length; i++)
                                            {
                                                if(currentSize.indexOf(sizes[i]+"px") != -1)
                                                {
                                                    toAppend += "<option selected style='font-size: "+sizes[i]+"px;'>"+sizes[i]+"px</option>";
                                                }
                                                else
                                                {
                                                    toAppend += "<option style='font-size: "+sizes[i]+"px;'>"+sizes[i]+"px</option>";
                                                }
                                            }
                                            
                                            toAppend += "</select>";
                                            
                                            document.querySelector("#popup_changeFontSize div.content p").innerHTML = toAppend;
										}
										catch(err)
										{
											console.log("error");
										}
										break;
										
									case "error":
										console.log("error");
										break;
										
									default:
										console.log("error");
										break;
								}
							}
						}
						
						xhr.send(null);
                    },
                    
                    preview_headerBackground: function(element)
                    {
                        var color = element.style.backgroundColor;
						
						var toAppend = "";
                        
						var content = [
							["rgba(255, 0, 0, 0.6)", "<br /><br />"],
							["rgba(255, 0, 88, 0.6)", ""],
							["rgba(255, 0, 157, 0.6)", "<br /><br />"],
							["rgba(255, 0, 245, 0.6)", ""],
							["rgba(167, 0, 255, 0.6)", ""],
							["rgba(78, 0, 255, 0.6)", "<br /><br />"],
							["rgba(0, 10, 255, 0.6)", ""],
							["rgba(0, 157, 255, 0.6)", ""],
							["rgba(0, 216, 255, 0.6)", ""],
							["rgba(217, 217, 217, 0.6)", "<br /><br />"],
							["rgba(124, 124, 124, 0.6)", ""],
							["rgba(67, 67, 67, 0.6)", ""],
							["rgba(0, 0, 0, 0.6)", ""],
							["rgba(36, 36, 36, 0.6)", ""],
							["rgba(178, 178, 178, 0.6)", "<br /><br />"],
							["rgba(0, 255, 196, 0.6)", ""],
							["rgba(0, 255, 128, 0.6)", ""],
							["rgba(0, 255, 98, 0.6)", ""],
							["rgba(0, 255, 10, 0.6)", ""],
							["rgba(98, 255, 0, 0.6)", ""],
							["rgba(206, 255, 0, 0.6)", "<br /><br />"],
							["rgba(255, 167, 0, 0.6)", ""],
							["rgba(255, 88, 0, 0.6)", ""],
							["rgba(255, 0, 0, 0.6)", ""],
							["rgba(173, 0, 0, 0.6)", ""]
						];
						
						for(var i = 0; i < content.length; i++)
						{
							if(content[i][0].indexOf(color) != -1)
							{
								toAppend += "<span class='colorPickerBlock selected' style='background-color: "+content[i][0]+"' onclick='COSMOS.rightPanel.trigger.settings.submit.preview_headerBackground(this);'></span>" + content[i][1];
							}
							else
							{
								toAppend += "<span class='colorPickerBlock' style='background-color: "+content[i][0]+"' onclick='COSMOS.rightPanel.trigger.settings.submit.preview_headerBackground(this);'></span>" + content[i][1];
							}
						}
						
						document.querySelector("#popup_changeColorHeader div.content p").innerHTML = toAppend;
											
                        document.querySelector("header").style.backgroundColor = color;
						
						var xhr = new XMLHttpRequest();
						xhr.open("GET", "inc/ajax/general/put_preferences.php?change=headerBackground&content="+color, true);
                        
                        xhr.onreadystatechange = function()
                        {
                            if(xhr.status == 200 && xhr.readyState == 4)
                            {
                                document.querySelectorAll("div#settingsContent table#resultSettings tr td b")[0].innerHTML = color;      
                            }
                        }
                        
						xhr.send(null);
                    },
                    
                    preview_desktopBackground: function(element)
                    {
                        var color = element.style.backgroundColor;
						
						var toAppend = "";
                        
						var content = [
							["rgba(255, 0, 0, 0.6)", "<br /><br />"],
							["rgba(255, 0, 88, 0.6)", ""],
							["rgba(255, 0, 157, 0.6)", "<br /><br />"],
							["rgba(255, 0, 245, 0.6)", ""],
							["rgba(167, 0, 255, 0.6)", ""],
							["rgba(78, 0, 255, 0.6)", "<br /><br />"],
							["rgba(0, 10, 255, 0.6)", ""],
							["rgba(0, 157, 255, 0.6)", ""],
							["rgba(0, 216, 255, 0.6)", ""],
							["rgba(217, 217, 217, 0.6)", "<br /><br />"],
							["rgba(124, 124, 124, 0.6)", ""],
							["rgba(67, 67, 67, 0.6)", ""],
							["rgba(0, 0, 0, 0.6)", ""],
							["rgba(36, 36, 36, 0.6)", ""],
							["rgba(178, 178, 178, 0.6)", "<br /><br />"],
							["rgba(0, 255, 196, 0.6)", ""],
							["rgba(0, 255, 128, 0.6)", ""],
							["rgba(0, 255, 98, 0.6)", ""],
							["rgba(0, 255, 10, 0.6)", ""],
							["rgba(98, 255, 0, 0.6)", ""],
							["rgba(206, 255, 0, 0.6)", "<br /><br />"],
							["rgba(255, 167, 0, 0.6)", ""],
							["rgba(255, 88, 0, 0.6)", ""],
							["rgba(255, 0, 0, 0.6)", ""],
							["rgba(173, 0, 0, 0.6)", ""]
						];
						
						for(var i = 0; i < content.length; i++)
						{
							if(content[i][0].indexOf(color) != -1)
							{
								toAppend += "<span class='colorPickerBlock selected' style='background-color: "+content[i][0]+"' onclick='COSMOS.rightPanel.trigger.settings.submit.preview_desktopBackground(this);'></span>" + content[i][1];
							}
							else
							{
								toAppend += "<span class='colorPickerBlock' style='background-color: "+content[i][0]+"' onclick='COSMOS.rightPanel.trigger.settings.submit.preview_desktopBackground(this);'></span>" + content[i][1];
							}
						}
						
						document.querySelector("#popup_changeColorDesktop div.content p").innerHTML = toAppend;
											
                        document.querySelector("body").style.backgroundColor = color;
						
						var xhr = new XMLHttpRequest();
						xhr.open("GET", "inc/ajax/general/put_preferences.php?change=desktopBackground&content="+color, true);
                        
                        xhr.onreadystatechange = function()
                        {
                            if(xhr.status == 200 && xhr.readyState == 4)
                            {
                                document.querySelectorAll("div#settingsContent table#resultSettings tr td b")[1].innerHTML = color;      
                            }
                        }
                        
						xhr.send(null);
                    },
                    
                    preview_fontSize: function(element)
                    {                        
                        var currentSize = element[element.selectedIndex].value;
                        
                        document.querySelector("body").style.fontSize = currentSize;
                        
                        var xhr = new XMLHttpRequest();
						xhr.open("GET", "inc/ajax/general/put_preferences.php?change=fontSize&content="+currentSize, true);
                        
                        xhr.onreadystatechange = function()
                        {
                            if(xhr.status == 200 && xhr.readyState == 4)
                            {
                                document.querySelectorAll("div#settingsContent table#resultSettings tr td b")[2].innerHTML = currentSize;      
                            }
                        }
                        
						xhr.send(null);
                    }
                }
            },
            
            logout:
            {
                logout: function()
                {
                    popup.open(
                        "popup_logoutLogout",
                        "Déconnexion",
                        "Êtes-vous sûr de vouloir vous déconnecter ? Tous vos fichiers non-enregistrés seront perdus.",
                        "<input type='button' class='button' value='Se déconnecter' onclick='COSMOS.rightPanel.trigger.logout.submit.logout();' />"
                    );
                },
                
                reload: function()
                {
                    popup.open(
                        "popup_logoutReload",
                        "Rechargement de l'interface",
                        "Êtes-vous sûr de vouloir recharger l'interface ? Tous vos fichiers non-enregistrés seront perdus.",
                        "<input type='button' class='button' value='Se déconnecter' onclick='COSMOS.rightPanel.trigger.logout.submit.reload();' />"
                    );
                },
                
                sleep: function()
                {
                    
                },
                
                submit:
                {
                    logout: function()
                    {
                        var xhr = new XMLHttpRequest();
                        xhr.open("GET", "inc/ajax/rightPanel/logout/logout.php", true);
                        
                        xhr.onreadystatechange = function()
                        {
                            if(xhr.status == 200 && xhr.readyState == 4)
                            {
                                document.location.href = "index.php?message=success_logout";
                            }
                        }
                        
                        xhr.send(null);
                    }
                }
            }
        }
    }
} 
|| {};