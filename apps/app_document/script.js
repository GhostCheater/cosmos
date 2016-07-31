"use_strict";

var app_document = 
{
    init: function()
    {
        // Création de l'éditeur
        var page = document.querySelector("#app_document .page");
        
        localStorage.setItem("app_document#size", parseInt(getComputedStyle(page).height));
        
        page.contentEditable = true;
        page.contentDocument.designMode = "on";
        page.focus();
        
        page.onload = function()
        {
            page.contentWindow.document.execCommand("insertHTML", false, "<br>");   
        }
        
        // Chargement de la toolbar
        this.preferences.load();
        this.tab.load("settings");
        this.update.states();
        
        // Initialisation de la liste des documents
        localStorage.setItem("app_document#files", "{}");
        localStorage.removeItem("app_document#current");
        
        
        // On place le focus sur l'éditeur
        page.addEventListener("load", function()
        {
            page.contentWindow.focus();
        }, false);
        
        // On espionne l'objet
        page.contentWindow.document.addEventListener("keyup", function(event)
        {
            app_document.keyboard.trigger(event);
        }, false);
        page.contentWindow.document.addEventListener("click", function(event)
        {
            app_document.keyboard.trigger(event);
        }, false);   
    },
    
    page: function()
    {
        // Doit retourner la page "focus" ou la première page si aucun focus n'est détecté
        if(document.activeElement.toString() == "[object HTMLIFrameElement]")
        {
            localStorage.setItem("focus", document.activeElement.id);
            return document.activeElement;
        }
        else
        {
            return document.querySelector("#app_document #"+localStorage.getItem("focus"));
        }
    },
    
    documents:
    {
        new: function()
        {
            
        },
        
        switchTo: function(hash, name)
        {
            if(localStorage.getItem("app_document#current") != hash)
            {
                app_document.loader.trigger();
                document.querySelector("#app_document #messages").innerHTML = "<p>Ouverture du fichier <b>"+name+"</b> en cours...</p>";
                
                // Récupération de l'id du fichier courant
                var current_id = localStorage.getItem("app_document#current");
                
                // Récupération du contenu du fichier (au niveau des pages)
                var pages = document.querySelectorAll("#app_document #content .page");
                var content = "";
                
                for(var i = 0; i < pages.length; i++)
                {
                    content += pages[i].contentWindow.document.body.innerHTML;
                    
                    if(i != pages.length - 1)
                    {
                        content += "{-------||-------}"; // Séparateur de pages
                    }
                }
                
                // On sauvegarde le contenu du fichier courant
                if(localStorage.getItem("app_document#current") != null && localStorage.getItem("app_document#current") != undefined) app_document.documents.save(current_id, content);
                
                // On vide l'éditeur
                for(var i = 0; i < pages.length; i++)
                {
                    pages[i].contentWindow.document.execCommand("selectAll", false);
                    pages[i].contentWindow.document.execCommand("delete", false);
                }
                
                // On stocke l'id du fichier en local
                localStorage.setItem("app_document#current", hash);
                
                // On affiche le fichier qui va être ouvert
                for(var i = 0; i < document.querySelectorAll("#app_document #navBar #contentTabs #cT_files #currentFiles .part").length; i++)
                {
                    document.querySelectorAll("#app_document #navBar #contentTabs #cT_files #currentFiles .part")[i].className = "part";
                }
                
                document.querySelector("#app_document #navBar #cT_files #currentFiles #file_" + hash).className = "part current";
                
                // On ouvre le nouveau fichier
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "inc/controller.php", true);
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                
                xhr.onreadystatechange = function()
                {
                    if(xhr.status == 200 && xhr.readyState == 4)
                    {
                        var data = xhr.responseText;
                        
                        var dataToParse = data.split("{-------||-------}");
                        
                        app_document.page().contentWindow.document.execCommand("insertHTML", false, data);
                        
                        document.querySelector("#app_document #messages").innerHTML = "<p>Fichier ouvert : <b>"+name+"</b></p>";
                        
                        app_document.loader.trigger();
                    }
                }
                
                xhr.send("c=Edit&a=open_file&p=" + hash);
            }
        },
        
        open: function(hash, name)
        {
            // Affichage du loader
            app_document.loader.trigger();
            
            // Affichage des fichiers ouverts
            app_document.tab.load("files");
            
            // Enregistrement du nom de fichier
            document.querySelector("#app_document #content iframe").setAttribute("data-name", name);
            
            var file_to_append = document.createElement("div");
            file_to_append.className = "part current";
            file_to_append.style.width = "10vw";
            file_to_append.id = "file_" + hash;
            file_to_append.innerHTML = "<img onclick='app_document.documents.switchTo(\""+hash+"\", \""+name+"\")' src='apps/app_document/images/files/doc.svg' style='height: 5vh;' /><img  onclick='app_document.documents.close(\""+hash+"\")' src='images/status/error.svg' class='img_close' /><br /><b>" + name + "</b><br />(document)";
            
            // Test de l'existence du fichier dans la liste des fichiers ouverts
            var files = localStorage.getItem("app_document#files");
            files = JSON.parse(files);
            
            var alreadyOpened = false;
            
            for(key in files)
            {
                if(key == hash)
                {
                    alreadyOpened = true;
                    break;
                }
            }
            
            // Si le fichier n'est pas dans le liste des fichiers ouverts, on l'ajoute à la liste
            if(!alreadyOpened)
            {                
                files[hash] = {0: hash, 1:name};
                
                document.querySelector("#app_document #navBar #contentTabs #cT_files #currentFiles").appendChild(file_to_append);
                
                // On met à jour la liste des fichiers ouverts en local
                localStorage.setItem("app_document#files", JSON.stringify(files));
                
                // Ouverture du fichier
                app_document.documents.switchTo(hash, name);
            }
            else // S'il existe déjà, on switch dessus
            {
                app_document.documents.switchTo(hash, name);
            }
            
            app_document.loader.trigger();
        },
        
        preSave: function()
        {
            if(localStorage.getItem("app_document#current") != undefined && localStorage.getItem("app_document#current") != null)
            {
                var pages = document.querySelectorAll("#app_document #content .page");
                var content = "";
                
                for(var i = 0; i < pages.length; i++)
                {
                    content += pages[i].contentWindow.document.body.innerHTML;
                    
                    if(i != pages.length - 1)
                    {
                        content += "{-------||-------}"; // Séparateur de pages
                    }
                }
                
                app_document.documents.save(localStorage.getItem("app_document#current"), content);
            }
        },
        
        save: function(hash, content)
        {
            if(hash != "")
            {
                document.querySelector("#app_document #messages").innerHTML = "<p>Sauvegarde en cours...</p>";
            
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "inc/controller.php", true);
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

                xhr.onreadystatechange = function()
                {
                    if(xhr.status == 200 && xhr.readyState == 4)
                    {
                        var state = xhr.responseText.split("~||]]", 1)[0];

                        switch(state)
                        {
                            case "ok":
                                try
                                {
                                    var date = new Date();
                                    var hour = date.getHours();
                                    var minutes = date.getMinutes();
                                    document.querySelector("#app_document #messages").innerHTML = "<p>Sauvegardé à <b>" + ("0" + hour).slice(-2) + ":" + ("0" + minutes).slice(-2) + "</b></p>";
                                    
                                    // Mise à jour de l'historique
                                    app_document.documents.updateHistoric(hash);
                                }
                                catch(err)
                                {
                                    document.querySelector("#app_document #messages").innerHTML = "<p>Une erreur est survenue lors de la sauvegarde</p>";
                                    console.error("Error parsing json : " + err);
                                }
                                break;

                            default:
                                break;
                        }
                    }
                }

                xhr.send("c=Edit&a=save_file&p=" + hash + "[-||||-]" + content);   
            }
        },
        
        updateHistoric: function(hash)
        {
            app_document.loader.trigger();
            
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "inc/controller.php", true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            
            xhr.onreadystatechange = function()
            {
                if(xhr.status == 200 && xhr.readyState == 4)
                {
                    var state = xhr.responseText.split("~||]]", 1)[0];
                    var data = xhr.responseText.split("~||]]", 2)[1];
                    
                    app_document.loader.trigger();
                    
                    switch(state)
                    {
                        case "ok":
                            try
                            {
                                var content = JSON.parse(data);
                                
                                console.log(content);
                                
                                // On supprime l'historique pour le mettre à jour ensuite
                                while(document.querySelector("#app_document #navBar #contentTabs #cT_files #historicFiles").hasChildNodes())
                                {
                                    document.querySelector("#app_document #navBar #contentTabs #cT_files #historicFiles").removeChild(document.querySelector("#app_document #navBar #contentTabs #cT_files #historicFiles").lastChild);
                                }
                            
                                for(key in content)
                                {
                                    if({}.hasOwnProperty.call(content, key))
                                    {
                                        var doc = document.createElement("div");
                                        doc.id = "historic_" + key;
                                        doc.className = "part show";
                                        doc.style.width = "10vw";
                                        doc.innerHTML = "<img onclick='app_document.documents.open(\""+key+"\", \""+content[key]["name"]+"\")' src='apps/app_document/images/files/doc.svg' style='height: 5vh;' /><br /><b>" + content[key]["name"] + "</b><br /> " + content[key]["date"];

                                        document.querySelector("#app_document #navBar #contentTabs #cT_files #historicFiles").appendChild(doc);
                                    }
                                }
                            }
                            catch(err)
                            {
                                console.error("Error parsing JSON : " + err);
                            }
                            break;
                            
                        default:
                            break;
                    }
                }
            }
            
            xhr.send("c=Edit&a=update_historic&p=" + hash);
        },
        
        close: function(hash)
        {
            if(hash == localStorage.getItem("app_document#current"))
            {
                // Sauvegarde du fichier
                app_document.documents.preSave();
                
                // On enlève le texte de l'éditeur
                var pages = document.querySelectorAll("#app_document #content .page");
                
                for(var i = 0; i < pages.length; i++)
                {
                    pages[i].contentWindow.document.execCommand("selectAll", false);
                    pages[i].contentWindow.document.execCommand("delete", false);
                }
                
                localStorage.removeItem("app_document#current");
            }
            
            // On supprime le fichier de la liste des fichiers ouverts
            var opened_files = JSON.parse(localStorage.getItem("app_document#files"));
            
            if(opened_files[hash] != undefined)
            {
                delete opened_files[hash];
            }
            
            localStorage.setItem("app_document#files", JSON.stringify(opened_files));
            
            // Fermeture du fichier
            document.querySelector("#app_document #navBar #contentTabs #cT_files #currentFiles").removeChild(document.querySelector("#app_document #navBar #contentTabs #cT_files #currentFiles #file_" + hash));
        }
    },
    
    editor:
    {        
        initPage: function(page, contentToAdd)
        {
            if(page != undefined)
            {
                page.onload = function()
                {                    
                    page.contentEditable = true;
                    page.contentDocument.designMode = "on";
                    
                    var firstPageStyle = document.querySelector("#app_document #content .page").contentWindow.document.body.style;
                    
                    page.contentWindow.document.body.style.color = firstPageStyle.color;
                    page.contentWindow.document.body.style.fontFamily = firstPageStyle.fontFamily;
                    page.contentWindow.document.body.style.fontWeight = firstPageStyle.fontWeight;
                    page.contentWindow.document.body.style.fontStyle = firstPageStyle.fontStyle;
                    page.contentWindow.document.body.style.textDecorationColor = firstPageStyle.textDecorationColor;
                    page.contentWindow.document.body.style.textDecorationLine = firstPageStyle.textDecorationLine;
                    page.contentWindow.document.body.style.textDecorationStyle = firstPageStyle.textDecorationStyle;
                    page.contentWindow.document.body.style.overflow = firstPageStyle.overflow;
                    
                    page.contentWindow.document.addEventListener("keypress", function(event)
                    {
                        app_document.keyboard.trigger(event);
                    }, false);
                    page.contentWindow.document.addEventListener("click", function(event)
                    {
                        app_document.keyboard.trigger(event);
                    }, false);   
                    
                    page.focus();
                    
                    page.contentWindow.document.execCommand("insertHTML", false, contentToAdd);
                    
                    document.querySelector("#app_document #content").scrollBy(0, 300);
                }
            }
        },
        
        addPage: function(page_num, contentToAdd)
        {
            // On clone les propriétés de la première page (sans le contenu)
            var newPage = document.querySelector("#app_document .page").cloneNode(false);

            newPage.id = "editorPage_" + page_num;
            newPage.setAttribute("data-num", page_num);
            
            var newHeader = document.querySelector("#app_document .header").cloneNode(true);
            
            newHeader.id = "editorHeader_" + page_num;
            newHeader.setAttribute("data-num", page_num);
            
            var newFooter = document.querySelector("#app_document .footer").cloneNode(true);
            
            newFooter.id = "editorFooter_" + page_num;
            newFooter.setAttribute("data-num", page_num);
            
            var separator = document.querySelector("#app_document .separator").cloneNode(false);
            
            var newPageNumber = document.querySelector("#app_document .pageNumber").cloneNode(true);
            newPageNumber.querySelectorAll("o")[0].innerHTML = page_num;
            newPageNumber.querySelectorAll("o")[1].innerHTML = page_num;
            
            for(var i = 0; i < document.querySelectorAll("#app_document #content .pageNumber").length; i++)
            {
                document.querySelectorAll("#app_document #content .pageNumber")[i].querySelectorAll("o")[1].innerHTML = page_num;
            }

            document.querySelector("#app_document #content").appendChild(newHeader);
            document.querySelector("#app_document #content").appendChild(newPage);
            document.querySelector("#app_document #content").appendChild(newFooter);
            document.querySelector("#app_document #content").appendChild(separator);
            document.querySelector("#app_document #content").appendChild(newPageNumber);

            app_document.editor.initPage(newPage, contentToAdd);
        },
        
        addContentToNextPage: function(nextPage, contentToAdd)
        {
            if(document.querySelector("#app_document #editorPage_"+nextPage) != null && document.querySelector("#app_document #editorPage_"+nextPage) != undefined)
            {
                document.querySelector("#app_document #editorPage_"+nextPage).focus();
                var firstline = document.querySelector("#app_document #editorPage_"+nextPage).contentWindow.document.body.firstChild.data;
                
                console.log(firstline);
                
                document.querySelector("#app_document #editorPage_"+nextPage).contentWindow.document.body.removeChild(document.querySelector("#app_document #editorPage_"+nextPage).contentWindow.document.body.firstChild);
                
                document.querySelector("#app_document #editorPage_"+nextPage).contentWindow.document.execCommand("insertHTML", false, contentToAdd + "<br />" + firstline);
            }
        },
        
        cleanPage: function(numPage)
        {
            var lastChild = document.querySelector("#app_document #content #editorPage_" + numPage).contentWindow.document.body.lastChild;
            
            while(parseInt(lastChild.offsetTop) + parseInt(lastChild.offsetHeight) > localStorage.getItem("app_document#size"))
            {
                document.querySelector("#app_document #content #editorPage_" + numPage).contentWindow.document.body.removeChild(lastChild);
                
                lastChild = document.querySelector("#app_document #content #editorPage_" + numPage).contentWindow.document.body.lastChild;
            }
            
            document.querySelector("#app_document #content #editorPage_" + numPage).contentWindow.document.body.lastChild.innerHTML = "\001";
        },
        
        removePage: function()
        {
            
        },
        
        event_method:
        {
            reachEndPage: function(event)
            {
                var parent = app_document.page();
                
                var lastChild = app_document.page().contentWindow.document.body.lastChild;
                
                if(parseInt(getComputedStyle(app_document.page().contentWindow.document.body).height) + app_document.page().contentWindow.document.body.lastChild.offsetHeight > localStorage.getItem("app_document#size"))
                {
                    var num = app_document.page().getAttribute("data-num");
                    var nextPage = parseInt(num) + 1;

                    if(document.querySelector("#app_document #editorPage_"+nextPage) == null || document.querySelector("#app_document #editorPage_"+nextPage) == undefined) // Si la page n'existe pas
                    {                                        
                        app_document.editor.addPage(nextPage, lastChild.innerHTML);
                    }
                    else
                    {                        
                        app_document.editor.addContentToNextPage(nextPage, lastChild.innerHTML);
                    }
                    
                    app_document.editor.cleanPage(parseInt(num));
                }
            },
            
            reachStartPage: function(event)
            {
                
            },
            
            focusPage: function(page)
            {
                
            }
        }
    },
    
    convert:
    {
        size_to_px: function(size)
        {
            size = parseInt(size);
            
            switch(size)
            {
                case 1:
                    return 10;
                    break;
                    
                case 2:
                    return 13;
                    break;
                    
                case 3:
                    return 16;
                    break;
                    
                case 4:
                    return 18;
                    break;
                    
                case 5:
                    return 24;
                    break;
                    
                case 6:
                    return 32;
                    break;
                    
                case 7:
                    return 48;
                    break;
                    
                default:
                    break;
            }
        },
        
        px_to_size: function(px)
        {
            px = parseInt(px);
            
            switch(px)
            {
                case 10:
                    return 1;
                    break;
                    
                case 13:
                    return 2;
                    break;
                    
                case 16:
                    return 3;
                    break;
                    
                case 18:
                    return 4;
                    break;
                    
                case 24:
                    return 5;
                    break;
                    
                case 32:
                    return 6;
                    break;
                    
                case 48:
                    return 7;
                    break;
                    
                default:
                    break;
            }
        }
    },
    
    loader:
    {
        trigger: function()
        {
            var loaderArea = document.querySelector("#app_document #loaderArea");
            
            loaderArea.className = (loaderArea.className === "") ? "loaderHide" : "";
        }
    },
    
    tab:
    {
        load: function(tab)
        {
            var tabs = ["files", "edit", "insert", "export", "draw", "settings"];
            
            
            if(tabs.indexOf(tab) !== -1)
            {
                // Mise en avant du titre de l'onglet
                for(var i = 0, length = tabs.length; i < length; i++)
                {
                    document.querySelector("#app_document #navBar #tab_"+tabs[i]).className = "tab";
                }
                
                document.querySelector("#app_document #navBar #tab_"+tabs[tabs.indexOf(tab)]).className = "tab selected";
                
                
                // Affichage du contenu de l'onglet
                for(var i = 0, length = tabs.length; i < length; i++)
                {
                    document.querySelector("#app_document #navBar #cT_"+tabs[i]).style.display = "none";
                    document.querySelector("#app_document #navBar #tT_"+tabs[i]).style.display = "none";
                }

                
                document.querySelector("#app_document #navBar #cT_"+tabs[tabs.indexOf(tab)]).style.display = "table";
                document.querySelector("#app_document #navBar #tT_"+tabs[tabs.indexOf(tab)]).style.display = "table";
                
            }
        }
    },
    
    preferences:
    {
        load: function()
        {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "inc/controller.php", true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            
            xhr.onreadystatechange = function()
            {
                if(xhr.status === 200 & xhr.readyState === 4)
                {
                    var state = xhr.responseText.split("~||]]", 1)[0];
					var data = xhr.responseText.split("~||]]", 2)[1];
					
					switch(state)
					{
                        case "ok":
                            try
                            {
                                var content = JSON.parse(data);
                                
                                app_document.preferences.parse(content);
                            }
                            catch(err)
                            {
                                console.error("Error parsing json : " + err);
                            }
                            break;
                            
                        default:
                            break;
                    }
                }
            }
            
            xhr.send("c=Edit&a=load_preferences");
        },
        
        parse: function(data)
        {
            // Styles du document
            for(type in data["preferences_documents"])
            {
                if({}.hasOwnProperty.call(data["preferences_documents"], type))
                {
                    var bold = (data["preferences_documents"][type]["bold"]) ? "font-weight: bold;" : "font-weight: normal;";
                    var italic = (data["preferences_documents"][type]["italic"]) ? "font-style: italic;" : "font-style: normal;";
                    var underline = (data["preferences_documents"][type]["underline"]) ? "text-decoration: underline;" : "text-decoration: none;";
                        
                    var style = "color:"+data["preferences_documents"][type]["color"]+
                                ";font-family:"+data["preferences_documents"][type]["font"]+
                                ";font-size:"+app_document.convert.size_to_px(data["preferences_documents"][type]["size"])+"px"+
                                ";" + bold + italic + underline;
                    
                    style += "display: inline;vertical-align:middle;";
                    
                    document.querySelector("#app_document #navBar #preformated_"+type).style = [style];
                }
            }
            
            // Historique des fichiers
            for(key in data["historic"])
            {
                if({}.hasOwnProperty.call(data["historic"], key))
                {
                    var doc = document.createElement("div");
                    doc.id = "historic_" + key;
                    doc.className = "part show";
                    doc.style.width = "10vw";
                    doc.innerHTML = "<img onclick='app_document.documents.open(\""+key+"\", \""+data["historic"][key]["name"]+"\")' src='apps/app_document/images/files/doc.svg' style='height: 5vh;' /><br /><b>" + data["historic"][key]["name"] + "</b><br /> " + data["historic"][key]["date"];
                
                    document.querySelector("#app_document #navBar #contentTabs #cT_files #historicFiles").appendChild(doc);
                }
            }
            
            // Paramètres de l'éditeur
            for(key in data["settings"])
            {
                if({}.hasOwnProperty.call(data["settings"], key))
                {
                    document.querySelector("#app_document #navBar #contentTabs #cT_settings .part .settings_" + key).src = "apps/app_document/images/settings/" + data["settings"][key] + ".svg";
                }
            }
            
            // On applique le style "Corps de texte" par défaut
            var pages = document.querySelectorAll("#app_document .page");
            
            for(var i = 0; i < pages.length; i++)
            {
                var page = pages[i];
                var style_preformated_text = document.querySelector("#app_document #navBar #preformated_text").style;
            
                var color = style_preformated_text.color;
                var size = style_preformated_text.fontSize;
                var font = style_preformated_text.fontFamily;
                var bold = style_preformated_text.fontWeight;
                var italic = style_preformated_text.fontStyle;
                var underline = style_preformated_text.textDecoration;

                page.contentWindow.document.body.style.color = color;
                page.contentWindow.document.body.style.fontSize = app_document.convert.size_to_px(size) + "px";
                page.contentWindow.document.body.style.fontFamily = font;
                page.contentWindow.document.body.style.fontWeight = bold;
                page.contentWindow.document.body.style.fontStyle = italic;
                page.contentWindow.document.body.style.textDecoration = underline;
                page.contentWindow.document.body.style.overflow = "hidden";

                page.focus();

                // On masque le loader
                app_document.loader.trigger();
            }
        },
    },
    
    update:
    {
        states: function()
        {
            var interval = setInterval(function(){
                /*
                * Barre d'édition
                * ---------------
                * 6 : Gras
                * 7 : Italique
                * 8 : Souligné
                * 9 : Barré
                * 10 : Indice
                * 11 : Exposant
                * 15 : Alignement gauche
                * 16 : Alignement centre
                * 17 : Alignement droite
                * 18 : Alignement justifié
                */
                
                if(document.querySelector("#app_document") != undefined)
                {
                    var buttons = document.querySelectorAll("#app_document #navBar img.actions_image");
                    
                    // Recherche des styles
                    var isBold = app_document.page().contentWindow.document.queryCommandState("bold");
                    var isItalic = app_document.page().contentWindow.document.queryCommandState("italic");
                    var isUnderline = app_document.page().contentWindow.document.queryCommandState("underline");
                    var isStroke = app_document.page().contentWindow.document.queryCommandState("strikeThrough");
                    var isSub = app_document.page().contentWindow.document.queryCommandState("subscript");
                    var isSup = app_document.page().contentWindow.document.queryCommandState("superscript");

                    var isLeft = app_document.page().contentWindow.document.queryCommandState("justifyLeft");
                    var isCenter = app_document.page().contentWindow.document.queryCommandState("justifyCenter");
                    var isRight = app_document.page().contentWindow.document.queryCommandState("justifyRight");
                    var isJustify = app_document.page().contentWindow.document.queryCommandState("justifyFull");

                    if(isBold) {buttons[6].className = "actions_image selected";} else {buttons[6].className = "actions_image";}
                    if(isItalic) {buttons[7].className = "actions_image selected";} else {buttons[7].className = "actions_image";}
                    if(isUnderline) {buttons[8].className = "actions_image selected";} else {buttons[8].className = "actions_image";}
                    if(isStroke) {buttons[9].className = "actions_image selected";} else {buttons[9].className = "actions_image";}
                    if(isSub) {buttons[10].className = "actions_image selected";} else {buttons[10].className = "actions_image";}
                    if(isSup) {buttons[11].className = "actions_image selected";} else {buttons[11].className = "actions_image";}

                    if(isLeft) {buttons[15].className = "actions_image selected";} else {buttons[15].className = "actions_image";}
                    if(isCenter) {buttons[16].className = "actions_image selected";} else {buttons[16].className = "actions_image";}
                    if(isRight) {buttons[17].className = "actions_image selected";} else {buttons[17].className = "actions_image";}
                    if(isJustify) {buttons[18].className = "actions_image selected";} else {buttons[18].className = "actions_image";}   
                
                    /*
                    * QuickAccess
                    * -----------
                    * 0 : Gras
                    * 1 : Italique
                    * 2 : Souligné
                    * 3 : Barré
                    */

                    var buttons_2 = document.querySelectorAll("#app_document #quickAccess_popup .body .actions img");

                    if(isBold) {buttons_2[1].className = "selected";} else {buttons_2[1].className = "";}
                    if(isItalic) {buttons_2[2].className = "selected";} else {buttons_2[2].className = "";}
                    if(isUnderline) {buttons_2[3].className = "selected";} else {buttons_2[3].className = "";}
                    if(isStroke) {buttons_2[4].className = "selected";} else {buttons_2[4].className = "";}
                }
                else
                {
                    clearInterval(interval);
                }
            }, 500);
        },
        
        tree: function()
        {
            var titles = app_document.page().contentWindow.document.querySelectorAll("p span font");
            var preforms = document.querySelectorAll("#app_document #navBar .preformatedText");
            var list = [];
            
            // Récupération de la liste des titres suivant les différents styles
            for(var i = 0; i < titles.length; i++)
            {
                var cStyle = getComputedStyle(titles[i]);
                
                for(var a = 0; a < preforms.length; a++)
                {                    
                    var cStyleTab = [
                        cStyle.fontSize,
                        cStyle.fontFamily,
                        cStyle.color,
                        (cStyle.fontWeight === "400" || cStyle.fontWeight === "normal") ? "normal" : "bold",
                        cStyle.fontStyle
                    ];
                    
                    var preformsTab = [
                        preforms[a].style.fontSize,
                        preforms[a].style.fontFamily,
                        preforms[a].style.color,
                        (preforms[a].style.fontWeight === "400" || preforms[a].style.fontWeight === "normal") ? "normal" : "bold",
                        preforms[a].style.fontStyle
                    ];
                    
                    if(preformsTab[0] === cStyleTab[0] && preformsTab[1] === cStyleTab[1] && preformsTab[2] === cStyleTab[2] && preformsTab[3] === cStyleTab[3] && preformsTab[4] === cStyleTab[4])
                    {
                        list.push([preforms[a].id, titles[i].textContent]);
                    }
                }
            }
            
            // Affichage de la liste des titres dans l'architecture
            var toAppend = "";
            
            for(var i = 0, length = list.length; i < length; i++)
            {
                toAppend += "<span><p class='" + list[i][0].replace("preformated_", "") + "'>" + list[i][1] + "</p></span>";
            }
            
            document.querySelector("#app_document #tree .titles").innerHTML = toAppend;
        }
    },
    
    edit:
    {      
        /*
        * Actions
        */
        undo: function()
        {
            app_document.page().contentWindow.document.execCommand("undo", false, null);
            app_document.page().focus(); 
        },
        
        redo: function()
        {
            app_document.page().contentWindow.document.execCommand("redo", false, null);
            app_document.page().focus(); 
        },
        
        
        /*
        * Presse-papier
        */
        paste: function()
        {
            app_document.page().contentWindow.document.execCommand("paste", false, null);
            app_document.page().focus(); 
        },
        
        copy: function()
        {
            app_document.page().contentWindow.document.execCommand("copy", false, null);
            app_document.page().focus(); 
        },
        
        cut: function()
        {
            app_document.page().contentWindow.document.execCommand("cut", false, null);
            app_document.page().focus(); 
        },
        
        selectAll: function()
        {
            app_document.page().contentWindow.document.execCommand("selectAll", false, null);
            app_document.page().focus(); 
        },
        
        /* 
        * Police
        */
        setFont: function()
        {
            var e = document.querySelector("#app_document #navBar #fonts");
            var font = e.options[e.selectedIndex].value;
            
            var range = app_document.page().contentWindow.document.createRange();
                
            if(app_document.page().contentWindow.document.getSelection().anchorOffset === app_document.page().contentWindow.document.getSelection().focusOffset && app_document.page().contentWindow.document.getSelection().anchorNode === app_document.page().contentWindow.document.getSelection().focusNode)
            {
                // Aucun texte n'est sélectionné, on applique le style à la ligne
                var sel = app_document.page().contentWindow.document.getSelection();

                range.setStart(sel.anchorNode, 0);
                range.setEnd(sel.anchorNode, sel.anchorNode.textContent.length);

                sel.removeAllRanges();
                sel.addRange(range);
            }
            
            app_document.page().contentWindow.document.execCommand("fontName", false, font);
            
            // On replace à la fin de la sélection
            app_document.page().contentWindow.document.getSelection().collapseToEnd();
            app_document.page().focus();
        },
        
        setSize: function()
        {
            var e = document.querySelector("#app_document #navBar #sizes");
            var size = app_document.convert.px_to_size(e.options[e.selectedIndex].value);
            
            var range = app_document.page().contentWindow.document.createRange();
                
            if(app_document.page().contentWindow.document.getSelection().anchorOffset === app_document.page().contentWindow.document.getSelection().focusOffset && app_document.page().contentWindow.document.getSelection().anchorNode === app_document.page().contentWindow.document.getSelection().focusNode)
            {
                // Aucun texte n'est sélectionné, on applique le style à la ligne
                var sel = app_document.page().contentWindow.document.getSelection();

                range.setStart(sel.anchorNode, 0);
                range.setEnd(sel.anchorNode, sel.anchorNode.textContent.length);

                sel.removeAllRanges();
                sel.addRange(range);
            }
            
            app_document.page().contentWindow.document.execCommand("fontSize", false, size);
            
            // On replace à la fin de la sélection
            app_document.page().contentWindow.document.getSelection().collapseToEnd();
            app_document.page().focus();
        },
        
        setBold: function()
        {
            app_document.page().contentWindow.document.execCommand("bold", false, null);
            app_document.page().focus();
        },
        
        setItalic: function()
        {
            app_document.page().contentWindow.document.execCommand("italic", false, null);
            app_document.page().focus();
        },
        
        setUnderline: function()
        {
            app_document.page().contentWindow.document.execCommand("underline", false, null);
            app_document.page().focus();
        },
        
        setStroke: function()
        {
            app_document.page().contentWindow.document.execCommand("strikeThrough", false, null);
            app_document.page().focus();
        },
        
        setSub: function()
        {
            app_document.page().contentWindow.document.execCommand("subscript", false, null);
            app_document.page().focus();
        },
        
        setSup: function()
        {
            app_document.page().contentWindow.document.execCommand("superscript", false, null);
            app_document.page().focus();
        },
        
        /*
        * Style
        */
        setColor: function(color)
        {
            var range = app_document.page().contentWindow.document.createRange();
                
            if(app_document.page().contentWindow.document.getSelection().anchorOffset === app_document.page().contentWindow.document.getSelection().focusOffset && app_document.page().contentWindow.document.getSelection().anchorNode === app_document.page().contentWindow.document.getSelection().focusNode)
            {
                // Aucun texte n'est sélectionné, on applique le style à la ligne
                var sel = app_document.page().contentWindow.document.getSelection();

                range.setStart(sel.anchorNode, 0);
                range.setEnd(sel.anchorNode, sel.anchorNode.textContent.length);

                sel.removeAllRanges();
                sel.addRange(range);
            }
            
            app_document.page().contentWindow.document.execCommand("removeFormat",false, null);
            app_document.page().contentWindow.document.execCommand("styleWithCSS", false, true);
            
            app_document.page().contentWindow.document.execCommand("foreColor", false, color);
            
            // On replace à la fin de la sélection
            app_document.page().contentWindow.document.getSelection().collapseToEnd();
            app_document.page().focus();
            
            // On ferme la popup
            app_document.popup.trigger("pos_edit_color");
        },
        
        setHighlight: function(color)
        {
            var range = app_document.page().contentWindow.document.createRange();
                
            if(app_document.page().contentWindow.document.getSelection().anchorOffset === app_document.page().contentWindow.document.getSelection().focusOffset && app_document.page().contentWindow.document.getSelection().anchorNode === app_document.page().contentWindow.document.getSelection().focusNode)
            {
                // Aucun texte n'est sélectionné, on applique le style à la ligne
                var sel = app_document.page().contentWindow.document.getSelection();

                range.setStart(sel.anchorNode, 0);
                range.setEnd(sel.anchorNode, sel.anchorNode.textContent.length);

                sel.removeAllRanges();
                sel.addRange(range);
            }
            
            app_document.page().contentWindow.document.execCommand("removeFormat",false, null);
            app_document.page().contentWindow.document.execCommand("styleWithCSS", false, true);
            
            app_document.page().contentWindow.document.execCommand("hiliteColor", false, color);
            
            // On replace à la fin de la sélection
            app_document.page().contentWindow.document.getSelection().collapseToEnd();
            app_document.page().focus();
            
            // On ferme la popup
            app_document.popup.trigger("pos_edit_highlight");
        },
        
        /*
        * Paragraphe
        */
        setList: function()
        {
            app_document.page().contentWindow.document.execCommand("insertUnorderedList", false, null);
            app_document.page().focus();
        },
        
        setLeft: function()
        {
            app_document.page().contentWindow.document.execCommand("justifyLeft", false, null);
            app_document.page().focus();
        },
        
        setCenter: function()
        {
            app_document.page().contentWindow.document.execCommand("justifyCenter", false, null);
            app_document.page().focus();
        },
        
        setRight: function()
        {
            app_document.page().contentWindow.document.execCommand("justifyRight", false, null);
            app_document.page().focus();
        },
        
        setJustify: function()
        {
            app_document.page().contentWindow.document.execCommand("justifyFull", false, null);
            app_document.page().focus();
        },
        
        /*
        * Texte et titres
        */
        preformated: function(section, focused)
        {
            var page = app_document.page();
            
            if(document.querySelector("#app_document #navBar #"+section))
            {                
                var range = page.contentWindow.document.createRange();
                
                if(page.contentWindow.document.getSelection().anchorOffset === page.contentWindow.document.getSelection().focusOffset && page.contentWindow.document.getSelection().anchorNode === page.contentWindow.document.getSelection().focusNode)
                {
                    // Aucun texte n'est sélectionné, on applique le style à la ligne
                    var sel = page.contentWindow.document.getSelection();
                    
                    range.setStart(sel.anchorNode, 0);
                    range.setEnd(sel.anchorNode, sel.anchorNode.textContent.length);
                    
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
                
                page.contentWindow.document.execCommand("removeFormat",false, null);
                
                page.contentWindow.document.execCommand("styleWithCSS", false, true);
                
                var style = document.querySelector("#app_document #navBar #"+section).style;
                
                var color = style.color;
                var size = style.fontSize;
                
                var font = style.fontFamily;
                var bold = style.fontWeight;
                var italic = style.fontStyle;
                var underline = style.textDecoration;
                
                var size = app_document.convert.px_to_size(size);
                
                page.contentWindow.document.execCommand("fontSize", false, size);
                
                if(section !== "preformated_text")
                {
                    page.contentWindow.document.execCommand("formatBlock", false, "<p>");
                }
                
                page.contentWindow.document.execCommand("foreColor", false, color);
                page.contentWindow.document.execCommand("fontName", false, font);
                
                if(bold !== "normal"){ page.contentWindow.document.execCommand("bold", false, null); }
                if(italic !== "normal"){ page.contentWindow.document.execCommand("italic", false, null); }
                if(underline !== "none"){ page.contentWindow.document.execCommand("underline", false, null); }
                
                page.contentWindow.document.getSelection().collapseToEnd();
                
                page.focus();
                
                // Si le style est un titre, on applique un retour à la ligne et on remet en place le style de "Corps de texte"
                if(section !== "preformated_text")
                {
                    page.contentWindow.document.execCommand("insertHTML", false, "<br>\001");
                    app_document.edit.preformated("preformated_text");
                    page.contentWindow.document.execCommand("insertHTML", false, "<br>\001");
                    app_document.edit.preformated("preformated_text");
                    page.contentWindow.document.execCommand("insertHTML", false, "\001");

                    app_document.edit.preformated("preformated_text");
                }
            }
        },
        
        /*
        * Modification
        */
        search:
        {
            trigger: function()
            {
                window.find("", true, false, false, false, true, true);
            },
            
            all: function()
            {
                
            },
            
            next: function()
            {
                
            },
            
            previous: function()
            {
                
            }
        }
    },
    
    insert:
    {
        tab: function()
        {
            app_document.page().contentWindow.document.execCommand("insertHTML", false, "<br><table style='width: 100%;border-collapse: collapse;'><tr><td style='border: 1px solid black;'></td><td style='border: 1px solid black;'></td></tr><tr><td style='border: 1px solid black;'></td><td style='border: 1px solid black;'></td></tr></table><br>");   
        },
        
        image:
        {
            local: function()
            {
                popup.open(
                    "popUp_doc_insert_image",
                    "Insertion d'une image",
                    "<input type='file' id='input_doc_insert_image' /><br /><br /><span id='return_doc_insert_image'></span>",
                    "<input type='button' class='button' value='Insérer' onclick='app_document.insert.image.nlocal.upload_n_insert();' />"
                );
            },
            
            web: function()
            {
                popup.open(
                    "popUp_doc_insert_image",
                    "Insertion d'une image en ligne",
                    "<input type='text' id='input_doc_insert_image' placeholder='URL de l&apos;image...' /><br /><br /><span id='return_doc_insert_image'></span>",
                    "<input type='button' class='button' value='Insérer' onclick='app_document.insert.image.nweb.test_n_insert();' />"
                );
            },
            
            nlocal:
            {
                upload_n_insert: function()
                {
                    document.querySelector("#return_doc_insert_image").innerHTML = "Upload en cours...";
                    
                    var element = document.querySelector("#input_doc_insert_image");
                    
                    var file = element.files[0];
                    
                    var formData = new FormData();
                    
                    formData.append("c", "Edit");
                    formData.append("a", "upload_image");
                    formData.append("p", file);
                    
                    var xhr = new XMLHttpRequest();
                    xhr.open("POST", "inc/controller.php", true);
                    
                    xhr.onreadystatechange = function()
                    {
                        if(xhr.readyState == 4 && xhr.status === 200)
                        {
                            console.log(xhr.responseText);
                            var state = xhr.responseText.split("~||]]", 1)[0];
                            var data = xhr.responseText.split("~||]]", 2)[1];
					
                            switch(state)
                            {
                                case "ok":
                                    document.querySelector("#return_doc_insert_image").innerHTML = "Upload terminé";
                                    
                                    // On insère l'image
                                    app_document.page().contentWindow.document.execCommand("insertHTML", false, "<br><img src='inc/controller.php?c=Edit&a=show_image&p="+data+"' style='max-width: 100%;margin-bottom: 5px;' /><br><br>");
                                    break;
                                    
                                default:
                                    document.querySelector("#return_doc_insert_image").innerHTML = "Une erreur est survenue lors de l'upload de l'image";
                                    break;
                            }
                        }
                    }
                    
                    xhr.send(formData);
                }
            },
            
            nweb:
            {
                test_n_insert: function()
                {
                    var url = document.querySelector("#input_doc_insert_image").value;
                    
                    var img = document.createElement("img");
                    
                    img.onload = function()
                    {
                        document.querySelector("#return_doc_insert_image").innerHTML = "Insertion de l'&apos;image en cours...";
                        
                        app_document.page().contentWindow.document.execCommand("insertHTML", false, "<br><img src='"+url+"' style='max-width: 100%;margin-bottom: 5px;' /><br><br>");
                    };
                    
                    img.onerror = function()
                    {
                        document.querySelector("#return_doc_insert_image").innerHTML = "L&apos;image n'est pas accessible";
                    };
                    
                    img.src = url;
                }
            }
        },
        
        link:
        {
            open: function()
            {
                popup.open(
                    "popup_doc_insert_link",
                    "Insertion d'un lien",
                    "<input type='text' placeholder='Lien...' id='input_doc_insert_link' /><br /><br /><span id='return_doc_insert_link'></span>",
                    "<input type='button' class='button' value='Insérer' onclick='app_document.insert.link.put();' />"
                );
            },
            
            put: function()
            {
                var returnArea = document.querySelector("#return_doc_insert_link");
                var url = document.querySelector("#input_doc_insert_link").value;
                
                var img = document.createElement("img");
                
                img.onload = function()
                {
                    returnArea.innerHTML = "Insertion du lien en cours...";
                    
                    app_document.page().contentWindow.document.execCommand("createLink", false, url);
                };
                
                img.onerror = function()
                {
                    returnArea.innerHTML = "Le lien n'est pas accessible";
                };
                
                img.src = url;
            }
        },
        
        formula: // TODO : finish
        {
            open: function()
            {
                popup.open(
                    "popup_doc_insert_formula",
                    "Insertion d'une formule",
                    "<input type='text' id='input_doc_insert_formula' placeholder='Votre formule' onkeypress='app_document.insert.formula.preview();' /><br /><br /><span id='return_doc_insert_formula'></span>",
                    "<input type='button' value='Insérer' class='button' onclick='app_document.insert.formula.put();' />"
                );
            },
            
            preview: function()
            {
                var content = document.querySelector("#input_doc_insert_formula").value;
                
                // Permet de visualiser les formules avant de les inclure                
                var element = document.createElement("img");
                element.src = "http://latex.codecogs.com/svg.latex?"+content;
                
                document.querySelector("#return_doc_insert_formula").innerHTML = "Génération en cours...";
                
                element.onload = function()
                {
                    document.querySelector("#return_doc_insert_formula").innerHTML = "<img src='http://latex.codecogs.com/svg.latex?"+content+"' />";
                }
            },
            
            escape: function(str)
            {
                while(str.indexOf("\\") != -1)
                {
                    str = str.replace("\\", "&bsol;");
                }
                
                return str;
            },
            
            put: function()
            {
                var content = document.querySelector("#input_doc_insert_formula").value;
                
                var url = "http://latex.codecogs.com/svg.latex?"+this.escape(content);
                app_document.page().contentWindow.document.execCommand("insertHTML", false, "<img src='"+url+"' style='vertical-align: middle' data-formula='"+this.escape(content)+"' />");
            },
            
            edit: function(formula)
            {
                
            }
        },
        
        jump: function() // TODO
        {
        },
        
        special:
        {
            char:
            {
                open: function()
                {
                    popup.open(
                        "popup_doc_insert_special",
                        "Insertion de caractères spéciaux",
                        "<div style='position: absolute;top: 0;left: 0;height: 100%;width: 100%;overflow: auto;'><table id='table_insert_chars'></table></div>",
                        ""
                    );
                    
                    var toAppend = "";
                    
                    var symbols = ["&fnof;", "&Alpha;", "&Beta;", "&Gamma;", "&Delta;", "&Epsilon;", "&Zeta;", "&Eta;", "&Theta;", "&Iota;", "&Kappa;", "&Lambda;", "&Mu;", "&Nu;", "&Xi;", "&Omicron;", "&Pi;", "&Rho;", "&Sigma;", "&Tau;", "&Upsilon;", "&Phi;", "&Chi;", "&Psi;", "&Omega;", "&alpha;", "&beta;", "&gamma;", "&delta;", "&epsilon;", "&zeta;", "&eta;", "&theta;", "&iota;", "&kappa;", "&lambda;", "&mu;", "&nu;", "&xi;", "&omicron;", "&pi;", "&rho;", "&sigmaf;", "&sigma;", "&tau;", "&upsilon;", "&phi;", "&chi;", "&psi;", "&omega;", "&thetasym;", "&upsih;", "&piv;", "&bull;", "&hellip;", "&prime;",  "&Prime;",  "&oline;",  "&frasl;",  "&weierp;", "&image;",  "&real;",   "&trade;",  "&alefsym;",    "&larr;",   "&rarr;",   "&darr;",   "&harr;",   "&crarr;",  "&lArr;",   "&uArr;",   "&rArr;",   "&dArr;",   "&hArr;",   "&forall;", "&part;",   "&exist;",  "&empty;",  "&nabla;",  "&isin;",   "&notin;",  "&ni;", "&prod;",   "&sum;",    "&minus;",  "&lowast;", "&radic;",  "&prop;",   "&infin;",  "&ang;",    "&and;",    "&or;", "&cap;",    "&cup;",    "&int;",    "&there4;", "&sim;",    "&cong;",   "&asymp;",  "&ne;", "&equiv;",  "&le;", "&ge;", "&sub;",    "&sup;",    "&nsub;",   "&sube;",   "&supe;",   "&oplus;",  "&otimes;", "&perp;",   "&sdot;", "&lceil;", "&rceil;", "&lfloor;", "&rfloor;", "&lang;", "&rang;", "&loz;", "&spades;", "&clubs;", "&hearts;", "&diams;"];
                    var list = [];
                    
                    for(var symbol = 0; symbol < symbols.length; symbol = symbol+10)
                    {
                        list.push(symbols.slice(symbol, symbol + 10));
                    }
                    
                    for(var line = 0; line < list.length; line++)
                    {
                        toAppend += "<tr style='height: 4vh;text-align: center;'>";
                        
                        for(var col = 0; col < 10; col++)
                        {
                            if(list[line][col] != undefined)
                            {
                                toAppend += "<td onclick='app_document.insert.special.char.put(\""+list[line][col]+"\")'>"+list[line][col]+"</td>";
                            }
                        }
                        
                        toAppend += "</tr>";
                    }
                    
                    document.querySelector("#popup_doc_insert_special table").innerHTML = toAppend;
                },
                
                put: function(which)
                {
                    app_document.page().contentWindow.document.execCommand("insertText", false, which);
                    app_document.page().focus();
                }
            }
        }
    },
    
    popup:
    {
        trigger: function(tab)
        {
            var popup = document.querySelector("#app_document #popup");
            
            popup.style.display = (popup.style.display === "none" || popup.style.display === "" || popup.className != tab) ? "block" : "none";
            popup.className = (popup.className === tab) ? "" : tab;
            
            this.load(tab);
        },
        
        load: function(tab)
        {
            switch(tab)
            {
                case "pos_edit_color":
                    var elements = document.querySelectorAll("#app_document #popup .content .parentBlock");
                    
                    for(var i = 0, length = elements.length; i < length; i++)
                    {
                        var color = elements[i].querySelector(".block").style.backgroundColor;
                        elements[i].setAttribute("onclick", "app_document.edit.setColor('"+color+"');");
                    }
                    break;
                    
                case "pos_edit_highlight":
                    var elements = document.querySelectorAll("#app_document #popup .content .parentBlock");
                    
                    for(var i = 0, length = elements.length; i < length; i++)
                    {
                        var color = elements[i].querySelector(".block").style.backgroundColor;
                        elements[i].setAttribute("onclick", "app_document.edit.setHighlight('"+color+"');");
                    }
                    break;
                    
                default:
                    break;
            }
        }
    },
    
    keyboard:
    {
        trigger: function(event)
        {
            /*
            * Mise à jour de l'architecture du document
            */
            app_document.update.tree();
            
            app_document.page().contentWindow.document.execCommand("insertParagraph", false);
            
            
            /*
            * Mise à jour des statuts
            */
            // Recherche de la police
            var select = app_document.page().contentWindow.document.getSelection();
            var element = (select.anchorNode == app_document.page().contentWindow.document.body) ? app_document.page().contentWindow.document.body : select.anchorNode.parentNode;
            var font = getComputedStyle(element).fontFamily;

            if(font !== "serif")
            {
                document.querySelector("#app_document #navBar #fonts").value = font;
            }

            // Recherche de la taille
            var size = getComputedStyle(element).fontSize;
            document.querySelector("#app_document #navBar #sizes").value = size;
            
            
            /*
            * Mise à jour du QuickAccess
            */
            var range = app_document.page().contentWindow.document.getSelection();
            
            var toAnalyze = (range.anchorNode.toString() == "[object Text]") ? range.anchorNode.parentNode.toString() : range.anchorNode.toString();
            toAnalyze = (toAnalyze.indexOf("http://") != -1 || toAnalyze.indexOf("https://") != -1 || toAnalyze.indexOf("ftp://") != -1) ? "[object Link]" : toAnalyze;
            
            var element = document.querySelector("#app_document #quickAccess_popup .body span");
            
            switch(toAnalyze)
            {
                case "[object Text]": // Texte
                case "[object HTMLBodyElement]":
                    this.quickAccess("text");
                    break;
                    
                case "[object HTMLLIElement]": // Liste à puces
                case "[object HTMLUListElement]":
                    this.quickAccess("list");
                    break;
                    
                case "[object HTMLHRElement]": // Saut de page
                    this.quickAccess("jump");
                    break;
                    
                case "[object HTMLTableCellElement]": // Tableau
                    this.quickAccess("table");
                    break;
                    
                case "[object Link]": // Lien
                    this.quickAccess("link");
                    break;
                    
                default:
                    break;
            }
            
            
            /*
            * Détection de la fin de la page
            */
            app_document.editor.event_method.reachEndPage(event);
            
            
            /*
            * Détection du début de la page
            */
            app_document.editor.event_method.reachStartPage(event);
        },
        
        quickAccess: function(wht)
        {
            var toAppend = "";
            
            switch(wht)
            {
                case "text":
                    break;
                    
                case "list":
                    break;
                    
                case "table":
                    toAppend = "" +
                        "<p>" +
                            "<img src='apps/app_document/images/quickAccess/table/add_row.svg' style='margin-right: 1vw;' onclick='app_document.quickAccess.table.insertRow();' />" +
                            "<img src='apps/app_document/images/quickAccess/table/remove_row.svg' style='margin-right: 1vw;' onclick='app_document.quickAccess.table.deleteRow();' />" +
                            "<img src='apps/app_document/images/quickAccess/table/add_column.svg' style='margin-right: 1vw;' onclick='app_document.quickAccess.table.insertColumn();' />" +
                            "<img src='apps/app_document/images/quickAccess/table/remove_column.svg' onclick='app_document.quickAccess.table.deleteColumn();' />" +
                        "</p>";
                    break;
                    
                case "jump":
                    toAppend = "<p><img src='apps/app_document/images/quickAccess/jump/remove.svg' onclick='app_document.quickAccess.jump.remove();' /></p>";
                    break;
                    
                case "link":
                    toAppend = "<p><img src='apps/app_document/images/quickAccess/link/remove.svg' onclick='app_document.quickAccess.link.remove();' /></p>";
                    break;
                    
                default:
                    break;
            }
            
            document.querySelector("#app_document #quickAccess_popup #quickAccess_actions_specials").innerHTML = toAppend;
        },
    },
    
    quickAccess:
    {
        table:
        {
            insertColumn: function()
            {
                var range = app_document.page().contentWindow.document.getSelection();
                
                var element = (range.anchorNode.toString() == "[object Text]") ? range.anchorNode.parentNode.toString() : range.anchorNode.toString();
                
                if(element == "[object HTMLTableCellElement]")
                {
                    var parent = (range.anchorNode.toString() == "[object Text]") ? ((range.anchorNode.parentNode).parentNode).parentNode : (range.anchorNode.parentNode).parentNode;
                                        
                    for(var i = 0; i < parent.querySelectorAll("tr").length; i++)
                    {                        
                        var cell = document.createElement("td");
                        cell.style.border = "1px solid black";
                        
                        parent.querySelectorAll("tr")[i].appendChild(cell);
                    }
                }
                
                app_document.page().focus();
            },
            
            deleteColumn: function()
            {
                var range = app_document.page().contentWindow.document.getSelection();
                
                var element = (range.anchorNode.toString() == "[object Text]") ? range.anchorNode.parentNode.toString() : range.anchorNode.toString();
                
                if(element == "[object HTMLTableCellElement]")
                {
                    var parent = (range.anchorNode.toString() == "[object Text]") ? ((range.anchorNode.parentNode).parentNode).parentNode : (range.anchorNode.parentNode).parentNode;
                    
                    for(var i = 0; i < parent.querySelectorAll("tr").length; i++)
                    {
                        parent.querySelectorAll("tr")[i].removeChild(parent.querySelectorAll("tr")[i].lastChild);
                    }
                    
                    // Teste s'il reste des cellules. Si ce n'est pas le cas, on supprime le tableau
                    if(parent.querySelectorAll("td").length == 0)
                    {
                        app_document.page().contentWindow.document.body.removeChild(parent.parentNode);
                    }
                }
                
                app_document.page().focus();
            },
            
            insertRow: function()
            {
                var range = app_document.page().contentWindow.document.getSelection();
                
                var element = (range.anchorNode.toString() == "[object Text]") ? range.anchorNode.parentNode.toString() : range.anchorNode.toString();
                
                var parent = (range.anchorNode.toString() == "[object Text]") ? ((range.anchorNode.parentNode).parentNode).parentNode : (range.anchorNode.parentNode).parentNode;
                
                if(element == "[object HTMLTableCellElement]")
                {
                    // Compter le nombre de cellule par ligne
                    var nbCol = parent.querySelectorAll("tr td").length / parent.querySelectorAll("tr").length;
                    
                    // Créer l'élément à insérer
                    var row = document.createElement("tr");
                    var toAppend = "";
                    
                    for(var i = 0; i < nbCol; i++)
                    {
                        toAppend += "<td style='border: 1px solid black;'>\001</td>";
                    }
                    
                    row.innerHTML = toAppend;
                    
                    // Insertion de l'élément dans le tableau
                    parent.appendChild(row);
                }
                
                app_document.page().focus();
            },
            
            deleteRow: function()
            {
                var range = app_document.page().contentWindow.document.getSelection();
                
                var element = (range.anchorNode.toString() == "[object Text]") ? range.anchorNode.parentNode.toString() : range.anchorNode.toString();
                
                var elmnt = (range.anchorNode.toString() == "[object Text]") ? (range.anchorNode.parentNode).parentNode : (range.anchorNode).parentNode;
                
                var parent = (range.anchorNode.toString() == "[object Text]") ? ((range.anchorNode.parentNode).parentNode).parentNode : (range.anchorNode.parentNode).parentNode;
                
                if(element == "[object HTMLTableCellElement]")
                {
                    // Suppression de la ligne
                    parent.removeChild(elmnt);
                    
                    // S'il n'y a plus de ligne, on supprime le tableau
                    if(parent.querySelectorAll("tr").length == 0)
                    {
                        app_document.page().contentWindow.document.body.removeChild(parent.parentNode);
                    }
                }
                
                app_document.page().focus();
            }
        },
        
        link:
        {
            remove: function()
            {
                var range = app_document.page().contentWindow.document.createRange();
                var sel = app_document.page().contentWindow.document.getSelection();
                
                range.setStart(sel.anchorNode, 0);
                range.setEnd(sel.anchorNode, sel.anchorNode.textContent.length);

                sel.removeAllRanges();
                sel.addRange(range);
                
                app_document.page().contentWindow.document.execCommand("unlink", false, null);
                
                app_document.page().contentWindow.document.getSelection().collapseToEnd();
                
                app_document.page().focus();
            }
        },
        
        jump:
        {
            remove: function()
            {
                var sel = app_document.page().contentWindow.document.getSelection();
                
                var element = sel.anchorNode;
                
                app_document.page().contentWindow.document.body.removeChild(element);
                
                app_document.page().focus();
            }
        }
    },
    
    extern:
    {
        open: function(hash, name)
        {
            app_document.documents.open(hash, name);
        }
    }
} 
|| {};