var EXPLORER =
{
    init: function()
    {
        EXPLORER.actions.list();
        EXPLORER.actions.getCurrentDirectory();
    },
    
    triggerLoader: function(state)
    {
        document.querySelector("#desktop #explorer #circle_center p img").className = state; 
    },
    
    actions:
    {
        getCurrentDirectory: function()
        {
            EXPLORER.triggerLoader("animate");
			
			var xhr = new XMLHttpRequest();
			xhr.open("POST", "inc/controller.php", true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			
			xhr.onreadystatechange = function()
			{
				if(xhr.status === 200 && xhr.readyState === 4)
				{
					var state = xhr.responseText.split("~||]]", 1)[0];
					var data = xhr.responseText.split("~||]]", 2)[1];
					
					switch(state)
					{
                        case "ok":
							document.querySelector("#desktop #explorer #path").innerHTML = data;
							break;
							
						default:
							break;
					}
                    
                    EXPLORER.triggerLoader("");
				}
			}
			
			xhr.send("c=Explorer&a=show_navBar");
        },
        
        list: function()
        {
            EXPLORER.triggerLoader("animate");
            
            EXPLORER.actions.actionsOnSelection();
            
            var xhr = new XMLHttpRequest();
			xhr.open("POST", "inc/controller.php", true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			
			xhr.onreadystatechange = function()
			{
				if(xhr.status === 200 && xhr.readyState === 4)
				{
					var state = xhr.responseText.split("~||]]", 1)[0];
					var data = xhr.responseText.split("~||]]", 2)[1];
					
					switch(state)
					{
						case "ok":
							try
							{								
								var content = JSON.parse(data);
                                
                                var colors = [];
                                
                                colors["archive"] = "grey";
                                colors["audio"] = "orange";
                                colors["code"] = "green";
                                colors["doc"] = "blue";
                                colors["folder"] = "orange";
                                colors["image"] = "blue";
                                colors["pdf"] = "red";
                                colors["text"] = "grey";
                                colors["video"] = "purple";
                                
                                /*
                                * [0] : Nom
                                * [1] : id
                                * [2] : type
                                * [3] : extension
                                */
                                
                                document.querySelector("#desktop #explorer #firstOrbit").innerHTML = "";
                                document.querySelector("#desktop #explorer #secondOrbit").innerHTML = "";
                                document.querySelector("#desktop #explorer #thirdOrbit").innerHTML = "";
								
								for(key in content)
								{
									if({}.hasOwnProperty.call(content, key))
									{
                                        var num = parseInt(key) + 1;
                                        
                                        var element = document.createElement("div");
                                        element.id = "element_" + content[key][0][1];
                                        element.setAttribute("data-hash", content[key][0][1]);
                                        
                                        if(content[key][0][2] == "folder")
                                        {
                                            name = content[key][0][0];
                                        }
                                        else
                                        {
                                            name = content[key][0][0] + "." + content[key][0][3];
                                        }
                                        
                                        element.innerHTML = "" +
                                            "<span onclick='EXPLORER.actions.open(\""+content[key][0][2]+"\", \""+name+"\", \""+content[key][0][1]+"\", \"orbit_"+num+"\")' class='orbit_"+num+" icon color_"+colors[content[key][0][2]]+"'><p><img src='images/explorer/types/"+content[key][0][2]+".svg' /></p></span>" +
                                            "<span onclick='EXPLORER.actions.open(\""+content[key][0][2]+"\", \""+name+"\", \""+content[key][0][1]+"\", \"orbit_"+num+"\")' class='name_"+num+" name color_"+colors[content[key][0][2]]+"'><p>"+name+"</p></span>";
                                        
                                        if(key < 8)
                                        {
                                            document.querySelector("#desktop #explorer #firstOrbit").appendChild(element);
                                        }
                                        else if(key >= 8 && key < 16)
                                        {
                                            document.querySelector("#desktop #explorer #secondOrbit").appendChild(element);
                                        }
									}
								}
							}
							catch(err)
							{
                                throw new DesktopExeption(err);
							}
							break;
							
						default:
							break;
					}
                    
                    EXPLORER.triggerLoader("");
				}
			}
			
			xhr.send("c=Explorer&a=list_elements");
        },
        
        createFile: function()
		{
			popup.open(
				"popup_createFile",
				"Création d'un nouveau fichier",
				"<input type='text' placeholder='Nom du nouveau fichier...' id='input_createFile_1' /> . <input type='text' placeholder='Extension...' id='input_createFile_2' style='width: 5vw;' /><br /><br /><span id='return_createFile'></span>",
				"<input type='button' value='Créer' class='button' onclick='EXPLORER.request.createFile();' />"
			);
		},
        
        createFolder: function()
		{
			popup.open(
				"popup_createFolder",
				"Création d'un nouveau dossier",
				"<input type='text' placeholder='Nom du nouveau dossier' id='input_createFolder' /><br /><br /><span id='return_createFolder'></span>",
				"<input type='button' value='Créer' class='button' onclick='EXPLORER.request.createFolder();' />"
			);
		},
        
        open: function(type, name, id, orbit)
        {
            var popup = document.querySelector("#desktop #explorer #popUp_explorer");
            var load = false;
            
            if(orbit != popup.className && popup.style.display == "block")
            {
                popup.className = orbit;
                
                load = true;
            }
            else if(popup.style.display == "none" || popup.style.display == "")
            {
                popup.className = orbit;
                popup.style.display = "block";
                
                load = true;
            }
            else
            {
                popup.style.display = "none";
            }
            
            if(load)
            {
                // Pré-chargement
                document.querySelector("#desktop #popUp_explorer .header").innerHTML = "<p><img src='images/explorer/types/"+type+".svg' /><br />"+name+"</p>";
                
                document.querySelectorAll("#desktop #popUp_explorer .infos .line")[0].innerHTML = "<p>Chargement en cours...</p>";
                document.querySelectorAll("#desktop #popUp_explorer .infos .line")[1].innerHTML = "";
                
                document.querySelectorAll("#desktop #popUp_explorer .actions .line")[0].innerHTML = "<p onclick='EXPLORER.actions.select(\""+orbit+"\")'><img src='images/explorer/actions/select.svg' /></p><p onclick='EXPLORER.actions.copy(\""+id+"\");'><img src='images/explorer/actions/copy.svg' /></p><p onclick='EXPLORER.actions.cut(\""+id+"\");'><img src='images/explorer/actions/cut.svg' /></p><p onclick='EXPLORER.actions.delete(\""+id+"\", \""+name+"\", \""+type+"\");'><img src='images/explorer/actions/delete.svg' /></p>";
                document.querySelectorAll("#desktop #popUp_explorer .actions .line")[1].innerHTML = "<p onclick='EXPLORER.actions.call(\""+id+"\", \""+type+"\", \""+name+"\", \"workspace\")'><img src='images/explorer/actions/open.svg' /></p><p onclick='EXPLORER.actions.download(\""+id+"\")'><img src='images/explorer/actions/download.svg' /></p><p onclick='EXPLORER.actions.rename(\""+id+"\", \""+type+"\", \""+name+"\")'><img src='images/explorer/actions/rename.svg' /></p><p onclick='EXPLORER.actions.zip(\""+id+"\")'><img src='images/explorer/actions/zip.svg' /></p>";
                
                // Chargement
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "inc/controller.php", true);
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

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
                                    
                                    document.querySelectorAll("#desktop #popUp_explorer .infos .line")[0].innerHTML = "<p><b>Taille</b><br />"+content[0]["size"]+" o</p><p><b>Créé le</b><br />"+content[0]["date"]+"</p><p><b>Type</b><br />"+type+"</p>";
                                    document.querySelectorAll("#desktop #popUp_explorer .infos .line")[1].innerHTML = "<p><b>Modifié le</b><br />"+content[0]["lastDate"]+"</p><p><b>Favoris ?</b><br />"+content[0]["favorite"]+"</p><p><b>Privé ?</b><br />"+content[0]["private"]+"</p>";
                                }
                                catch(err)
                                {
                                    throw new DesktopExeption(err);
                                }
                                break;

                            default:
                                break;
                        }
                    }
                }
                
                xhr.send("c=Explorer&a=view_infos&p=" + id);
            }
        },
        
        copy: function(hash)
        {
            EXPLORER.triggerLoader("animate");
			
			var defaultActions = document.querySelector("#desktop #explorer #actions");
            
            localStorage.setItem("explorer#toPaste", true);

			var xhr = new XMLHttpRequest();
			xhr.open("POST", "inc/controller.php", true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

			xhr.onreadystatechange = function ()
			{
				if (xhr.status === 200 && xhr.readyState === 4)
				{
					EXPLORER.triggerLoader("");
					
					var state = xhr.responseText.split("~||]]", 1)[0];
					
					switch(state)
					{
						case "ok":
							if(defaultActions.querySelectorAll("p").length === 3)
							{
								var element = document.createElement("p");
								element.innerHTML = "<img src='images/explorer/actions/paste.svg' />";
								element.setAttribute("onclick", "EXPLORER.actions.paste();");
								
								defaultActions.appendChild(element);
							}
							break;
							
						default:
							break;
					}
				}    
			}

			xhr.send("c=Explorer&a=copy_elements&p="+encodeURIComponent(hash));  
        },
        
        cut: function(hash)
		{
			EXPLORER.triggerLoader("animate");
			
			var defaultActions = document.querySelector("#desktop #explorer #actions");
            
            localStorage.setItem("explorer#toPaste", true);

			var xhr = new XMLHttpRequest();
            xhr.open("POST", "inc/controller.php", true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

			xhr.onreadystatechange = function ()
			{
				if (xhr.status === 200 && xhr.readyState === 4)
				{
					EXPLORER.triggerLoader("");
					
					var state = xhr.responseText.split("~||]]", 1)[0];
					
					switch(state)
					{
						case "ok":
							if(defaultActions.querySelectorAll("p").length === 3)
							{
								var element = document.createElement("p");
								element.innerHTML = "<img src='images/explorer/actions/paste.svg' />";
								element.setAttribute("onclick", "EXPLORER.actions.paste();");
								
								defaultActions.appendChild(element);
							}
							break;
							
						default:
							break;
					}
				}    
			}

			xhr.send("c=Explorer&a=cut_elements&p="+encodeURIComponent(hash));
		},
        
        paste: function()
		{
			var defaultActions = document.querySelector("#desktop #explorer #actions");
			
			EXPLORER.triggerLoader("animate");
			
			var xhr = new XMLHttpRequest();
			xhr.open("POST", "inc/controller.php", true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

			xhr.onreadystatechange = function ()
			{
				if(xhr.status === 200 && xhr.readyState === 4)
				{
					EXPLORER.triggerLoader("");
					
					var state = xhr.responseText.split("~||]]", 1)[0];
					
					switch(state)
					{
						case "ok":
							EXPLORER.actions.list();
                            
                            localStorage.removeItem("explorer#toPaste");
							
							defaultActions.removeChild(defaultActions.querySelectorAll("p")[3]);
							break;
							
						default:
							break;
					}
				}
			}
			
			xhr.send("c=Explorer&a=paste");
		},
        
        delete: function(hash, name, type)
		{			
			var toShow;
			
			if(type === "folder")
			{
				toShow = "Êtes-vous sûr(e) de vouloir supprimer le dossier <b>" + name + "</b> ?";
			}
			else
			{
				toShow = "Êtes-vous sûr(e) de vouloir supprimer le fichier <b>" + name + "</b> ?"
			}
			
			popup.open(
				"popup_delete_" + hash,
				"Suppression d'un élément",
				toShow + "<br /><br /><span id='return_delete_"+hash+"'></span>",
				"<input type='button' value='Supprimer' class='button' onclick='EXPLORER.request.delete(\""+name+"\", \""+hash+"\")' />"
			);
		},
        
        rename: function(hash, type, name)
		{		
			var show = "";
            var baseName;
            var extension;
			
			if(type === "folder")
			{
                baseName = name;
				show = "<input type='text' placeholder='"+baseName+"' id='input_rename_"+hash+"_1' />";
			}
			else
			{
                baseName = name.substr(0, name.lastIndexOf("."));
                extension = name.substr(parseInt(name.lastIndexOf(".")) + 1, name.length);
                
				show = "<input type='text' placeholder='"+baseName+"' id='input_rename_"+hash+"_1' /> . <input type='text' placeholder='"+extension+"' id='input_rename_"+hash+"_2' style='width: 5vw;' />";
			}
			
			popup.open(
				"popup_rename_"+hash,
				"Renommer un élément",
				show + "<br /><br /><span id='return_rename_"+hash+"'></span>",
				"<input type='button' value='Renommer' class='button' onclick='EXPLORER.request.rename(\""+hash+"\", \""+type+"\");' />"
			);
		},
        
        select: function(orbit)
        {
            var element = document.querySelector("#desktop #explorer .orbiting_files ." + orbit).parentNode;
            
            if(element.className == "")
            {
                element.className = "selected";
            }
            else
            {
                element.className = "";
            }
            
            EXPLORER.actions.actionsOnSelection();
        },
        
        actionsOnSelection: function()
        {
            var defaultActions = document.querySelector("#desktop #explorer #actions");
            var elements = document.querySelectorAll("#desktop #explorer .selected");
            
            var toPaste = false;
            
            if(localStorage.getItem("explorer#toPaste"))
            {
                toPaste = true;
            }
            
            if(elements.length > 1)
            {
                defaultActions.innerHTML = "" +
                    "<p onclick='EXPLORER.actions.group.delete();'><img src='images/explorer/actions/delete.svg' /></p>" +
                    "<p onclick='EXPLORER.actions.group.copy();'><img src='images/explorer/actions/copy.svg' /></p>" +
                    "<p onclick='EXPLORER.actions.group.cut();'><img src='images/explorer/actions/cut.svg' /></p>";
            }
            else
            {
                defaultActions.innerHTML = "" +
                    "<p onclick='EXPLORER.actions.createFile();'><img src='images/explorer/actions/newFile.svg' /></p>" +
                    "<p onclick='EXPLORER.actions.createFolder();'><img src='images/explorer/actions/newFolder.svg' /></p>" +
                    "<p onclick='EXPLORER.actions.upload.show();'><img src='images/explorer/actions/upload.svg' /></p>";
            }
            
            if(toPaste)
            {
                defaultActions.innerHTML += "<p onclick='EXPLORER.actions.paste();'><img src='images/explorer/actions/paste.svg' /></p>";
            }
        },
        
		upload:
		{
			show: function()
            {
                popup.open(
                    "popup_upload",
                    "Upload d'un ou plusieurs fichiers",
                    "<input type='file' id='input_upload' multiple /><br /><br /><span id='return_upload'></span>",
                    "<input type='button' value='Upload' class='button' onclick='EXPLORER.actions.upload.init();' />"
                );
            },
            
            computeSize: function(input)
            {
                var output;
                
                if(input / Math.pow(2, 10) >= 1) 
                {
                    if(input / Math.pow(2, 20) >= 1)
                    {
                        if(input / Math.pow(2, 30) >= 1) // Go
                        {
                            output = Math.round(input / Math.pow(2, 30)) + " Go";
                        }
                        else // Mo
                        {
                            output = Math.round(input / Math.pow(2, 20)) + " Mo";
                        }
                    }
                    else // Ko
                    {
                        output = Math.round(input / Math.pow(2, 10)) + " Ko";
                    }
                }
                else // o
                {
                    output = Math.round(input) + " octets";
                }
                
                return output;  
            },
			
			shortName: function(input)
			{
				var extension;
				var name;
				var output;
				
				extension = input.substring(input.lastIndexOf(".") + 1, input.length);
				name = input.substring(0, input.lastIndexOf("."));
				
				
				if(name.length > 15)
				{
					output = name.substring(0, 14) + "..." + extension;
				}
				else
				{
					output = name + "." + extension;
				}
				
				return output;
			},
            
            init: function()
            {
                var files = document.querySelector("#popup_upload #input_upload").files;
                
                var toAppend = "<div style='position: absolute;top:0;left:0;height:100%;width:100%;overflow:auto;'><table style='width: 100%;text-align: center;'>";
                toAppend += "<tr><th style='width: 25%;'>Statut</th><th style='width: 25%;'>Nom</th><th style='width: 25%;'>Taille</th><th style='width: 25%;'>Progression</th></tr>";
                
                for(var i = 0; i < files.length; i++)
                {
                    toAppend += "<tr style='height: 5vh' id='upload_file_"+i+"'><td><img src='images/status/wait.svg' style='height: 2.5vh' /></td><td>"+this.shortName(files[i].name)+"</td><td>"+this.computeSize(files[i].size)+"</td><td><progress style='height: 1vh;width: 4vw;' value='0' min='0' max='100'></progress></td><td></td></tr>";
                }
                
                toAppend += "</table></div>";
                
                document.querySelector("#popup_upload .content").innerHTML = toAppend;
                
                this.upload(files, 0);
            },
			
			upload: function(files, key)
			{
                if(key < files.length)
                {
                    var formData = new FormData();
                    formData.append("p", files[key]);
                    formData.append("c", "Explorer");
                    formData.append("a", "upload");

                    // Création de la requête
                    var xhr = new XMLHttpRequest();
                    xhr.open("POST", "inc/controller.php", true);
                    
                    xhr.addEventListener("readystatechange", function(e)
                    {
                        EXPLORER.actions.upload._readystatechange(this, files, key, e);
                    }, false);

                    xhr.upload.addEventListener("progress", function(e){
                        EXPLORER.actions.upload._progress(xhr, files, key, e);
                    }, false);

                    xhr.send(formData);
                }
			},
			
			_progress: function(xhr, files, key, e)
			{
				if(e.lengthComputable)
				{
					var percent = (e.loaded / e.total) * 100;
					
					document.querySelector("#popup_upload .content #upload_file_"+key+" progress").value = percent;
				    document.querySelector("#popup_upload .content #upload_file_"+key+" img").src = "images/status/upload.svg";
                }
			},
            
            _readystatechange: function(xhr, files, key, e)
            {
                if(xhr.readyState == 4)
                {
                    document.querySelector("#popup_upload .content #upload_file_"+key+" progress").value = 100;
                    
                    switch(xhr.responseText)
                    {
                        case "ok~||]]":
                            document.querySelector("#popup_upload .content #upload_file_"+key+" img").src = "images/status/ok.svg";
                            break;
                            
                        default:
                            document.querySelector("#popup_upload .content #upload_file_"+key+" img").src = "images/status/error.svg";
                            break;
                    }
                    
                    key++;
                
                    if(key <= files.length - 1)
                    {
                        EXPLORER.actions.upload.upload(files, key);
                    }
                    else
                    {
                        setTimeout(function(){
                            EXPLORER.actions.list();
                            popup.close("popup_upload");
                        }, 1000);
                    }
                }
            }
		},
        
        call: function(hash, type, name, state)
        {
            switch(type)
            {
                case "archive":
                    if(document.querySelector("#app_archive") == undefined) WINDOW.trigger("app_archive", "grey");
                    
                    setTimeout(function(){
                        app_archive.extern.open(hash, name);
                    }, 2000);
                    break;
                    
                case "audio":
                    if(document.querySelector("#app_music") == undefined) WINDOW.trigger("app_music", "red");
                    
                    setTimeout(function(){
                        app_music.extern.open(hash, name);
                    }, 2000);
                    break;
                    
                case "code":
                    if(document.querySelector("#app_code") == undefined) WINDOW.trigger("app_code", "green");
                    
                    setTimeout(function(){
                        app_code.extern.open(hash, name);
                    }, 2000);
                    break;
                    
                case "doc":
                    if(document.querySelector("#app_document") == undefined)WINDOW.trigger("app_document", "blue");
                    
                    setTimeout(function(){
                        app_document.extern.open(hash, name);
                    }, 2000);
                    break;
                    
                case "image":
                    if(document.querySelector("#app_image") == undefined) WINDOW.trigger("app_image", "blue");
                    
                    setTimeout(function(){
                        app_image.extern.open(hash, name);
                    }, 2000);
                    break;
                    
                case "pdf":
                    if(document.querySelector("#app_pdf") == undefined) WINDOW.trigger("app_pdf", "red");
                    
                    setTimeout(function(){
                        app_pdf.extern.open(hash, name);
                    }, 2000);
                    break;
                    
                case "video":
                    if(document.querySelector("#app_video") == undefined) WINDOW.trigger("app_video", "purple");
                    
                    setTimeout(function(){
                        app_video.extern.open(hash, name);
                    }, 2000);
                    break;
                    
                case "folder":
                    EXPLORER.triggerLoader("animate");
                    
                    if(document.querySelector("#desktop #explorer #popUp_explorer").style.display == "block")
                    {
                        document.querySelector("#desktop #explorer #popUp_explorer").style.display = "none";
                    }
			
                    var xhr = new XMLHttpRequest();

                    if(state === "workspace")
                    {
                        xhr.open("POST", "inc/controller.php", true);
                        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                        xhr.send("c=Explorer&a=change_directory_workspace&p="+encodeURIComponent(hash));
                    }
                    else
                    {
                        xhr.open("POST", "inc/controller.php", true);
                        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                        xhr.send("c=Explorer&a=change_directory_navBar&p="+encodeURIComponent(hash));
                    }

                    xhr.onreadystatechange = function()
                    {
                        if(xhr.status === 200 && xhr.readyState === 4)
                        {
                            var state = xhr.responseText.split("~||]]", 1)[0];
                            
                            EXPLORER.triggerLoader("");

                            switch(state)
                            {
                                case "ok":
                                    EXPLORER.actions.list();
                                    EXPLORER.actions.getCurrentDirectory();
                                    break;

                                default:
                                    break;
                            }
                        }
                    }
                    break;
                    
                default:
                    if(document.querySelector("#app_text") == undefined) WINDOW.trigger("app_text", "black");
                    
                    setTimeout(function(){
                        app_text.extern.open(hash, name);
                    }, 2000);
                    break;
            }
        },
        
        group:
        {
            delete: function()
            {
                popup.open(
                    "popup_deleteGroup",
                    "Suppression d'éléments",
                    "Êtes-vous sûr(e) de vouloir supprimer ces éléments ?<br /><br /><span id='return_deleteGroup'></span>",
                    "<input type='button' value='Supprimer' class='button' onclick='EXPLORER.request.deleteGroup();' />"
                );
            },
            
            copy: function()
            {
                var defaultActions = document.querySelector("#desktop #explorer #actions");
                
                localStorage.setItem("explorer#toPaste", true);

                var hashs = [];
                var elements = document.querySelectorAll("#desktop #explorer .selected");

                for(key in elements)
                {
                    if({}.hasOwnProperty.call(elements, key))
                    {
                        hashs.push(elements[key].getAttribute("data-hash"));
                    }
                }

                var xhr = new XMLHttpRequest();
                xhr.open("POST", "inc/controller.php", true);
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

                xhr.onreadystatechange = function()
                {
                    if(xhr.status === 200 && xhr.readyState == 4)
                    {
                        var state = xhr.responseText.split("~||]]", 1)[0];

                        switch(state)
                        {
                            case "ok":
                                if(defaultActions.querySelectorAll("p").length === 3)
                                {
                                    var element = document.createElement("p");
                                    element.innerHTML = "<img src='images/explorer/actions/paste.svg' />";
                                    element.setAttribute("onclick", "EXPLORER.actions.paste();");

                                    defaultActions.appendChild(element);
                                }
                                break;

                            default:
                                break;
                        }
                    }
                }

                xhr.send("c=Explorer&a=copy_elements&p="+(hashs.toString()));
            },
            
            cut: function()
            {
                var defaultActions = document.querySelector("#desktop #explorer #actions");
                
                localStorage.setItem("explorer#toPaste", true);

                var hashs = [];
                var elements = document.querySelectorAll("#desktop #explorer .selected");

                for(key in elements)
                {
                    if({}.hasOwnProperty.call(elements, key))
                    {
                        hashs.push(elements[key].getAttribute("data-hash"));
                    }
                }

                var xhr = new XMLHttpRequest();
                xhr.open("POST", "inc/controller.php", true);
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

                xhr.onreadystatechange = function()
                {
                    if(xhr.status === 200 && xhr.readyState == 4)
                    {
                        var state = xhr.responseText.split("~||]]", 1)[0];

                        switch(state)
                        {
                            case "ok":
                                if(defaultActions.querySelectorAll("p").length === 3)
                                {
                                    var element = document.createElement("p");
                                    element.innerHTML = "<img src='images/explorer/actions/paste.svg' />";
                                    element.setAttribute("onclick", "EXPLORER.actions.paste();");

                                    defaultActions.appendChild(element);
                                }
                                break;

                            default:
                                break;
                        }
                    }
                }

                xhr.send("c=Explorer&a=cut_elements&p="+(hashs.toString()));
            }
        }
    },
    
    request:
    {
        createFile: function()
        {
			var nameFile = document.querySelector("section#popup_createFile input#input_createFile_1").value;
			var extension = document.querySelector("section#popup_createFile input#input_createFile_2").value;
			
			var returnArea = document.querySelector("#return_createFile");
			returnArea.innerHTML = "<img src='images/loader.png' style='height: 1.5vh;' />";
			
			if(extension === "")
			{
				extension = "txt";
			}
            
            if(nameFile != "")
            {
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "inc/controller.php", true);
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

                xhr.onreadystatechange = function()
                {
                    if(xhr.status === 200 && xhr.readyState === 4)
                    {
                        var state = xhr.responseText.split("~||]]", 1)[0];

                        switch(state)
                        {
                            case "ok":
                                EXPLORER.actions.list();
                                returnArea.innerHTML = "Le fichier <b>" + nameFile + "." + extension + "</b> a été créé avec succès.";

                                setTimeout(function(){
                                    popup.close("popup_createFile");
                                }, 1000);
                                break;

                            default:
                                returnArea.innerHTML = "Une erreur est survenue lors de la création du fichier <b>" + nameFile + "." + extension + "</b>.";
                                break;
                        }
                    }
                }

                xhr.send("c=Explorer&a=create_file&p="+encodeURIComponent(nameFile) + "|" + encodeURIComponent(extension));   
            }
        },
        
        createFolder: function()
        {
            var nameFolder = document.querySelector("section#popup_createFolder input#input_createFolder").value;
			
			var returnArea = document.querySelector("#return_createFolder");
			returnArea.innerHTML = "<img src='images/loader.png' style='height: 1.5vh;' />";
			
            if(nameFolder != "")
            {
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "inc/controller.php", true);
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

                xhr.onreadystatechange = function()
                {
                    if(xhr.status === 200 && xhr.readyState === 4)
                    {
                        var state = xhr.responseText.split("~||]]", 1)[0];

                        switch(state)
                        {
                            case "ok":
                                EXPLORER.actions.list();
                                returnArea.innerHTML = "Le dossier <b>" + nameFolder + "</b> a été créé avec succès.";

                                setTimeout(function(){
                                    popup.close("popup_createFolder");
                                }, 1000);
                                break;

                            default:
                                returnArea.innerHTML = "Une erreur est survenue lors de la création du dossier <b>" + nameFolder + "</b>.";
                                break;
                        }
                    }
                }

                xhr.send("c=Explorer&a=create_folder&p="+encodeURIComponent(nameFolder));
            }
        },
        
        delete: function(name, hash)
		{
			var returnArea = document.querySelector("#return_delete_"+hash);
			returnArea.innerHTML = "<img src='images/loader.png' style='height: 1.5vh;' />";
			
			var xhr = new XMLHttpRequest();
			xhr.open("POST", "inc/controller.php", true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			
			xhr.onreadystatechange = function()
			{
				if(xhr.status === 200 && xhr.readyState === 4)
				{
					var state = xhr.responseText.split("~||]]", 1)[0];
					
					switch(state)
					{
						case "ok":
							EXPLORER.actions.list();
							
							returnArea.innerHTML = "<b>" + name + "</b> a été supprimé avec succès.";

							setTimeout(function(){
								popup.close("popup_delete_"+hash);
							}, 1000);
							break;

						default:
							returnArea.innerHTML = "Une erreur est survenue lors de la suppression de <b>" + name + "</b>";
							break;
					}
				}
			}
			
			xhr.send("c=Explorer&a=delete_elements&p="+encodeURIComponent(hash));
		},
        
        rename: function(hash, type)
		{
			var element = document.querySelector("section#popup_rename_"+hash);
			var name = element.querySelectorAll("input")[0].value;
			
			var returnArea = element.querySelector("#return_rename_"+hash);
			returnArea.innerHTML = "<img src='images/loader.png' style='height: 1.5vh;' />";
			
			var xhr = new XMLHttpRequest();
			
			if(type === "folder")
			{
				xhr.open("POST", "inc/controller.php", true);
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhr.send("c=Explorer&a=rename_element&p="+encodeURIComponent(hash)+"|"+encodeURIComponent(name));
			}
			else
			{
				var extension = element.querySelectorAll("input")[1].value;
				
				xhr.open("POST", "inc/controller.php", true);
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhr.send("c=Explorer&a=rename_element&p="+encodeURIComponent(hash)+"|"+encodeURIComponent(name)+"|"+encodeURIComponent(extension));
			}
			
			xhr.onreadystatechange = function()
			{
				if(xhr.status === 200 && xhr.readyState === 4)
				{
					var state = xhr.responseText.split("~||]]", 1)[0];
					
					switch(state)
					{
						case "ok":
							EXPLORER.actions.list();
							
							if(type === "folder")
							{
								returnArea.innerHTML = "L'élément a été renommé avec succès en <b>" + name + "</b>";   
							}
							else
							{
								returnArea.innerHTML = "L'élément a été renommé avec succès en <b>" + name + "." + extension + "</b>";
							}

							setTimeout(function(){
								popup.close("popup_rename_"+hash);
							}, 1000);
							break;

						default:
							if(type === "folder")
							{
								returnArea.innerHTML = "Une erreur est survenue lors du renommage de l'élément en <b>" + name + "</b>";   
							}
							else
							{
								returnArea.innerHTML = "Une erreur est survenue lors du renommage de l'élément en <b>" + name + "." + extension + "</b>";
							}
							break;
					}
				}
			}
		},
        
        deleteGroup: function()
        {
            var returnArea = document.querySelector("#return_deleteGroup");
			returnArea.innerHTML = "<img src='images/loader.png' style='height: 1.5vh;' />";
			
			var hashs = [];
			var elements = document.querySelectorAll("#desktop #explorer .selected");
			
			for(key in elements)
			{
				if({}.hasOwnProperty.call(elements, key))
				{
					hashs.push(elements[key].getAttribute("data-hash"));
				}
			}
			
            var xhr = new XMLHttpRequest();
			xhr.open("POST", "inc/controller.php", true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            
			xhr.onreadystatechange = function()
			{
				if(xhr.status === 200 && xhr.readyState == 4)
				{
					var state = xhr.responseText.split("~||]]", 1)[0];
					
					switch(state)
					{
						case "ok":
							EXPLORER.actions.list();
						
							returnArea.innerHTML = "Les éléments ont bien été supprimés";
							
							setTimeout(function(){
								popup.close("popup_deleteGroup");
							}, 1000);
							break;
							
						default:
							returnArea.innerHTML = "Une erreur est survenue lors de la suppression des éléments";
							break;
					}
				}
			}
			
			xhr.send("c=Explorer&a=delete_elements&p="+encodeURIComponent(hashs));
        }
    }
} 
|| {};