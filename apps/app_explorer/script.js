var app_explorer = 
{
    init: function()
    {
        app_explorer.actions.list();
    },
    
    /* 
    * Clic sur un élément 
    */
    actions:
    {
        /* Permet le listage du répertoire courant */
        list: function()
        {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "inc/ajax/explore/list.php", true);
            
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
                                var content = JSON.parse(data);
                                
                                var toAppend = "";
                                
                                for(line_key in content)
                                {
                                    toAppend += "<div class='line'>";
                                    
                                    for(element_key in content[line_key])
                                    {
                                        if(content[line_key][element_key][0][2] == "folder")
                                        {
                                            toAppend += "<div class='element' data-name='" + content[line_key][element_key][0][0] + "' data-hash='" + content[line_key][element_key][0][1] + "' data-type='" + content[line_key][element_key][0][2] + "'>";
                                        }
                                        else
                                        {
                                            toAppend += "<div class='element' data-name='" + content[line_key][element_key][0][0] + "." + content[line_key][element_key][0][3] + "' data-hash='" + content[line_key][element_key][0][1] + "' data-type='" + content[line_key][element_key][0][2] + "'>";
                                        }
                                        
                                        
                                        toAppend += "<img src='apps/app_explorer/images/types/" + content[line_key][element_key][0][2] + ".svg' onclick='app_explorer.actions.open(this)' /><br /><br />";
                                        
                                        if(content[line_key][element_key][0][2] == "folder")
                                        {
                                            toAppend += content[line_key][element_key][0][0];
                                        }
                                        else
                                        {
                                            toAppend += content[line_key][element_key][0][0] + "." + content[line_key][element_key][0][3];
                                        }
                                        
                                        toAppend += "<br /><br />";
                                        
                                        toAppend += "<p>"+
                                                        "<img src='apps/app_explorer/images/actions/delete.svg' class='action' onclick='app_explorer.actions.delete(this)' />&nbsp;"+
                                                        "<img src='apps/app_explorer/images/actions/rename.svg' class='action' onclick='app_explorer.actions.rename(this)' />&nbsp;"+
                                                        "<img src='apps/app_explorer/images/actions/properties.svg' class='action' onclick='app_explorer.actions.infos(this)' />&nbsp;"+
                                                        "<img src='apps/app_explorer/images/actions/download.svg' class='action' onclick='app_explorer.actions.download(this)' />&nbsp;"+
                                                        "<img src='apps/app_explorer/images/actions/zip.svg' class='action' onclick='app_explorer.actions.zip(this)' />"+
                                                    "</p>";
                                        
                                        toAppend += "</div>";
                                    }
                                    
                                    toAppend += "</div>";
                                }
                                
                                document.querySelector("div#app_explorer div#listArea div#list").innerHTML = toAppend;
                            }
                            catch(e)
                            {
                                console.log("Error parsing json.");
                            }
                            break;
                            
                        case "error":
                            break;
                            
                        default:
                            break;
                    }
                }
            }
            
            xhr.send(null);
        },
        
        open: function(call)
        {
        },
        
        /* Changement de répertoire : sélection d'un dossier dans le WorkSpace */
        changeDirectoryWorkspace: function(idDirectory)
        {
            if(idDirectory != "")
            {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", "inc/ajax/explore/changeDirectoryNavBar.php?directoryID="+directory, true);

                xhr.onreadystatechange = function()
                {
                    if(xhr.status == 200 && xhr.readyState == 4)
                    {
                        var state = xhr.responseText.split("~||]]", 1)[0];
                        var data = xhr.responseText.split("~||]]", 2)[1];
                    
                        switch(state)
                        {
                            case "ok":
                                app_explorer.actions.list();
                                break;
                                
                            case "exists":
                                break;
                                
                            case "error":
                                break;
                                
                            default:
                                break;
                        }
                    }
                }

                xhr.send(null);
            }
        },

        /* Changement de répertoire : sélection d'un dossier dans la barre de navigation */
        changeDirectoryNavBar: function(directory)
        {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "inc/ajax/explore/changeDirectoryNavBar.php?directoryID="+directory, true);
            
            xhr.onreadystatechange = function()
            {
                if(xhr.status == 200 && xhr.readyState == 4)
                {
                    var state = xhr.responseText.split("~||]]", 1)[0];
                    var data = xhr.responseText.split("~||]]", 2)[1];

                    switch(state)
                    {
                        case "ok":
                            app_explorer.actions.list();
                            break;

                        case "exists":
                            break;

                        case "error":
                            break;

                        default:
                            break;
                    }
                }
            }
            
            xhr.send(null);
        },
        
        /* Création d'un fichier */
        createFile: function()
        {
            popup.open(
                "popup_createFile",
                "Création d'un nouveau fichier",
                "<input type='text' placeholder='Nom du nouveau fichier...' id='input_createFile_1' /> . <input type='text' placeholder='Extension...' id='input_createFile_2' style='width: 5vw;' /><br /><br /><span id='return_createFile'></span>",
                "<input type='button' value='Créer' class='button' onclick='app_explorer.ajaxRequest.createFile();' />"
            );
        },
        
        /* Création d'un dossier */
        createFolder: function()
        {
            
        },
        
        /* Upload d'un ou plusieurs fichiers */
        upload:
        {
            
        }
        
    },
    
    /*
    * Envoi des requêtes et récupération des données
    */
    ajaxRequest:
    {
        changeDirectoryWorkspace: function(idDirectory)
        {
            
        },
        
        changeDirectoryNavBar: function(idDirectory)
        {
            
        },
        
        createFile: function()
        {
            var name = document.querySelector("section#popup_createFile input#input_createFile_1").value;
            var extension = document.querySelector("section#popup_createFile input#input_createFile_2").value;
            
            var returnArea = document.querySelector("#return_createFile");
            returnArea.innerHTML = "<img src='images/loader.png' style='height: 1.5vh;' />";
            
            if(extension == "")
            {
                extension = "txt";
            }
            
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "inc/ajax/explore/createFile.php?name="+name+"&extension="+extension, true);
            
            xhr.onreadystatechange = function()
            {
                if(xhr.status == 200 && xhr.readyState == 4)
                {
                    var state = xhr.responseText.split("~||]]", 1)[0];
                        var data = xhr.responseText.split("~||]]", 2)[1];
                    
                        switch(state)
                        {
                            case "ok":
                                app_explorer.actions.list();
                                returnArea.innerHTML = "Le fichier <b>" + name + "." + extension + "</b> a été créé avec succès.";
                                
                                setTimeout(function(){
                                    popup.close("popup_createFile");
                                }, 1000);
                                break;
                                
                            default:
                                returnArea.innerHTML = "Une erreur est survenue lors de la création du fichier <b>" + name + "." + extension + "</b>.";
                                break;
                        }
                }
            }
            
            xhr.send(null);
        },
        
        createFolder: function(name)
        {
            
        }
    }
}
|| {};