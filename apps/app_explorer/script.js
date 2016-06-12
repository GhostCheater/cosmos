var app_explorer = 
{
	/* Initialisation de l'application */
	init: function()
	{
		app_explorer.actions.list();
		app_explorer.actions.nav();
	},
	
	/* Affichage ou non du loader */
	load:
	{
		trigger: function(toDo)
		{
			var element = document.querySelector("div#app_explorer div#loaderArea");
			
			if(toDo === "show")
			{
				element.className = "show";
			}
			else
			{
				element.className = "";
			}
		}
	},
	
	/* Actions sur les éléments de l'application */
	actions:
	{
        /* Permet de réduire la taille du nom du fichier ou du dossier */
        reduce: function(str, type)
        {
            if(str.length > 25)
            {
                if(type == "folder")
                {
                    str = str.substr(0, 20) + "...";   
                }
                else
                {
                    var name = str.substr(0, 20);
                    var extension = str.substr(str.lastIndexOf("."), str.length);
                    
                    str = name + "..." + extension;
                }
            }
            
            return str;
        },
        
		/* Permet le listage du répertoire courant */
		list: function()
		{
			app_explorer.load.trigger("show");
			
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
								app_explorer.load.trigger("hide");
								
								var content = JSON.parse(data);
								
								var toAppend = "";
								var name = "";
								var actions = "";
								var actionsFolder = "<img src='apps/app_explorer/images/actions/delete.svg' class='action' onclick='app_explorer.actions.delete(this)' />&nbsp;&nbsp;"+
													"<img src='apps/app_explorer/images/actions/rename.svg' class='action' onclick='app_explorer.actions.rename(this)' />&nbsp;&nbsp;"+
													"<img src='apps/app_explorer/images/actions/copy.svg' class='action' onclick='app_explorer.actions.copy(this)' />&nbsp;&nbsp;"+
													"<img src='apps/app_explorer/images/actions/cut.svg' class='action' onclick='app_explorer.actions.cut(this)' />&nbsp;&nbsp;"+
													"<img src='apps/app_explorer/images/actions/properties.svg' class='action' onclick='app_explorer.actions.infos(this)' />&nbsp;&nbsp;";
								var actionFile = actionsFolder + "<img src='apps/app_explorer/images/actions/download.svg' class='action' onclick='app_explorer.actions.download(this)' />";
								var onclickAction = "";
								
								for(line_key in content)
								{
									if({}.hasOwnProperty.call(content, line_key))
									{
										toAppend += "<div class='line'>";

										for(element_key in content[line_key])
										{
											if({}.hasOwnProperty.call(content[line_key], element_key))
											{
												if(content[line_key][element_key][0][2] === "folder")
												{
													name = content[line_key][element_key][0][0];
													actions = actionsFolder;
													onclickAction = "app_explorer.actions.changeDirectory(\"workspace\", \""+content[line_key][element_key][0][1]+"\")";
												}
												else
												{
													name = content[line_key][element_key][0][0] + "." + content[line_key][element_key][0][3];
													actions = actionFile;
													onclickAction = "app_explorer.actions.open(this);";
												}
											
												toAppend += "<div class='element' data-name='" + name + "' data-hash='" + content[line_key][element_key][0][1] + "' data-type='" + content[line_key][element_key][0][2] + "' data-extension='" + content[line_key][element_key][0][3] + "' data-baseName='" + content[line_key][element_key][0][0] + "'>";
												toAppend += "<img src='apps/app_explorer/images/types/" + content[line_key][element_key][0][2] + ".svg' onclick='app_explorer.select.trigger(this);' ondblclick='"+onclickAction+"' /><br />";
												toAppend += "<div onclick='app_explorer.select.trigger(this);' ondblclick'"+onclickAction+"'>"+app_explorer.actions.reduce(name, content[line_key][element_key][0][2])+"</div>";
												toAppend += "<br />";
												toAppend += "<p>"+actions+"</p>";
												toAppend += "</div>";
											}
										}
									
										toAppend += "</div>";
									}
								}
								
								document.querySelector("div#app_explorer div#listArea div#list").innerHTML = toAppend;
								
								app_explorer.select.showActions();
								app_explorer.select.showInfo();
							}
							catch(err)
							{
								console.log("Error parsing json.");
							}
							break;
							
						default:
							break;
					}
				}
			}
			
			xhr.send("c=Explorer&a=list_elements");
		},
		
		/* Affichage de l'arborescence du répertoire courant */
		nav: function()
		{
			app_explorer.load.trigger("show");
			
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
							app_explorer.load.trigger("hide");
							
							document.querySelector("div#navBar div#path").innerHTML = data;
							break;
							
						default:
							break;
					}
				}
			}
			
			xhr.send("c=Explorer&a=show_navBar");
		},
		
		/* Ouverture d'un fichier */
		open: function(call)
		{
            var element = call.parentNode;
            
            var hash = element.getAttribute("data-hash");
            var extension = element.getAttribute("data-type");
            var name = element.getAttribute("data-name");
            
            switch(extension)
            {
                case "archive":
                    WINDOW.trigger("app_archive", "grey");
                    
                    setTimeout(function(){
                        app_archive.extern.open(hash, name);
                    }, 2000);
                    break;
                    
                case "audio":
                    WINDOW.trigger("app_audio", "orange");
                    
                    setTimeout(function(){
                        app_audio.extern.open(hash, name);
                    }, 2000);
                    break;
                    
                case "code":
                    WINDOW.trigger("app_code", "blue");
                    
                    setTimeout(function(){
                        app_code.extern.open(hash, name);
                    }, 2000);
                    break;
                    
                case "doc":
                    WINDOW.trigger("app_document", "blue");
                    
                    setTimeout(function(){
                        app_document.extern.open(hash, name);
                    }, 2000);
                    break;
                    
                case "image":
                    WINDOW.trigger("app_image", "blue");
                    
                    setTimeout(function(){
                        app_image.extern.open(hash, name);
                    }, 2000);
                    break;
                    
                case "pdf":
                    WINDOW.trigger("app_pdf", "red");
                    
                    setTimeout(function(){
                        app_pdf.extern.open(hash, name);
                    }, 2000);
                    break;
                    
                case "video":
                    WINDOW.trigger("app_video", "orange");
                    
                    setTimeout(function(){
                        app_video.extern.open(hash, name);
                    }, 2000);
                    break;
                    
                default:
                    WINDOW.trigger("app_text", "black");
                    
                    setTimeout(function(){
                        app_text.extern.open(hash, name);
                    }, 2000);
                    break;
            }
		},
		
		/* Changement de répertoire */
		changeDirectory: function(state, idDirectory)
		{
			app_explorer.load.trigger("show");
			
			var xhr = new XMLHttpRequest();
			
			if(state === "workspace")
			{
				xhr.open("POST", "inc/controller.php", true);
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhr.send("c=Explorer&a=change_directory_workspace&p="+encodeURIComponent(idDirectory));
			}
			else
			{
				xhr.open("POST", "inc/controller.php", true);
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhr.send("c=Explorer&a=change_directory_navBar&p="+encodeURIComponent(idDirectory));
			}
            
			xhr.onreadystatechange = function()
			{
				if(xhr.status === 200 && xhr.readyState === 4)
				{
					var state = xhr.responseText.split("~||]]", 1)[0];

					switch(state)
					{
						case "ok":
							app_explorer.actions.list();
							app_explorer.actions.nav();
							break;

						default:
							break;
					}
				}
			}
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
			popup.open(
				"popup_createFolder",
				"Création d'un nouveau dossier",
				"<input type='text' placeholder='Nom du nouveau dossier' id='input_createFolder' /><br /><br /><span id='return_createFolder'></span>",
				"<input type='button' value='Créer' class='button' onclick='app_explorer.ajaxRequest.createFolder();' />"
			);
		},
		
		/* Upload d'un ou plusieurs fichiers */
		upload:
		{
			show: function()
            {
                popup.open(
                    "popup_upload",
                    "Upload d'un ou plusieurs fichiers",
                    "<input type='file' id='input_upload' multiple /><br /><br /><span id='return_upload'></span>",
                    "<input type='button' value='Upload' class='button' onclick='app_explorer.actions.upload.init();' />"
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
                        app_explorer.actions.upload._readystatechange(this, files, key, e);
                    }, false);

                    xhr.upload.addEventListener("progress", function(e){
                        app_explorer.actions.upload._progress(xhr, files, key, e);
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
                    
                    console.log(xhr.responseText);
                    
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
                
                    if(key < files.length)
                    {
                        app_explorer.actions.upload.upload(files, key);
                    }
                    
                    if(key == files.length - 1)
                    {                        
                        setTimeout(function(){
                            app_explorer.actions.list();
                            popup.close("popup_upload");
                        }, 1000)
                    }
                }
            }
		},
		
		/* Suppression d'un élément */
		delete: function(callButton)
		{
			var element = callButton.parentNode.parentNode;
			
			var hash = element.getAttribute("data-hash");
			var name = element.getAttribute("data-name");
			var type = element.getAttribute("data-type");
			
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
				"<input type='button' value='Supprimer' class='button' onclick='app_explorer.ajaxRequest.delete(\""+name+"\", \""+hash+"\")' />"
			);
		},
		
		/* Renommer un élément */
		rename: function(callButton)
		{
			var element = callButton.parentNode.parentNode;
			
			var hash = element.getAttribute("data-hash");
			var baseName = element.getAttribute("data-baseName");
			var extension = element.getAttribute("data-extension");
			var type = element.getAttribute("data-type");
			
			var show = "";
			
			if(type === "folder")
			{
				show = "<input type='text' placeholder='"+baseName+"' id='input_rename_"+hash+"_1' />";
			}
			else
			{
				show = "<input type='text' placeholder='"+baseName+"' id='input_rename_"+hash+"_1' /> . <input type='text' placeholder='"+extension+"' id='input_rename_"+hash+"_2' style='width: 5vw;' />";
			}
			
			popup.open(
				"popup_rename_"+hash,
				"Renommer un élément",
				show + "<br /><br /><span id='return_rename_"+hash+"'></span>",
				"<input type='button' value='Renommer' class='button' onclick='app_explorer.ajaxRequest.rename(\""+hash+"\", \""+type+"\");' />"
			);
		},
		
		/* Copier un élément */
		copy: function(callButton)
		{
			app_explorer.load.trigger("show");
			
			var element = callButton.parentNode.parentNode;
			var hash = element.getAttribute("data-hash");
			
			var defaultActions = document.querySelector("div#app_explorer div#defaultActions p");

			var xhr = new XMLHttpRequest();
			xhr.open("POST", "inc/controller.php", true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

			xhr.onreadystatechange = function ()
			{
				if (xhr.status === 200 && xhr.readyState === 4)
				{
					app_explorer.load.trigger("hide");
					
					var state = xhr.responseText.split("~||]]", 1)[0];
					
					switch(state)
					{
						case "ok":
							if(defaultActions.querySelectorAll("img").length === 3)
							{
								var image = document.createElement("img");
								image.src = "apps/app_explorer/images/actions/paste.svg";
								image.setAttribute("onclick", "app_explorer.actions.paste();");
								
								defaultActions.appendChild(image);
							}
							break;
							
						default:
							break;
					}
				}    
			}

			xhr.send("c=Explorer&a=copy_elements&p="+encodeURIComponent(hash));
		},
		
		/* Couper un élément */
		cut: function(callButton)
		{
			app_explorer.load.trigger("show");
			
			var element = callButton.parentNode.parentNode;
			var hash = element.getAttribute("data-hash");
			
			var defaultActions = document.querySelector("div#app_explorer div#defaultActions p");

			var xhr = new XMLHttpRequest();
            xhr.open("POST", "inc/controller.php", true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

			xhr.onreadystatechange = function ()
			{
				if (xhr.status === 200 && xhr.readyState === 4)
				{
					app_explorer.load.trigger("hide");
					
					var state = xhr.responseText.split("~||]]", 1)[0];
					
					switch(state)
					{
						case "ok":
							if(defaultActions.querySelectorAll("img").length === 3)
							{
								var image = document.createElement("img");
								image.src = "apps/app_explorer/images/actions/paste.svg";
								image.setAttribute("onclick", "app_explorer.actions.paste();");
								
								defaultActions.appendChild(image);
							}
							break;
							
						default:
							break;
					}
				}    
			}

			xhr.send("c=Explorer&a=cut_elements&p="+encodeURIComponent(hash));
		},
		
		/* Coller un élément */
		paste: function()
		{
			var defaultActions = document.querySelector("div#app_explorer div#defaultActions p");
			
			app_explorer.load.trigger("show");
			
			var xhr = new XMLHttpRequest();
			xhr.open("POST", "inc/controller.php", true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

			xhr.onreadystatechange = function ()
			{
				if(xhr.status === 200 && xhr.readyState === 4)
				{
					app_explorer.load.trigger("hide");
					
					var state = xhr.responseText.split("~||]]", 1)[0];
					
					switch(state)
					{
						case "ok":
							app_explorer.actions.list();
							
							defaultActions.removeChild(defaultActions.querySelectorAll("img")[3]);
							break;
							
						default:
							break;
					}
				}
			}
			
			xhr.send("c=Explorer&a=paste");
		},

		/* Afficher les informations sur un élément */
		infos: function(callButton)
		{
			app_explorer.load.trigger("show");
			
			var hash = callButton.parentNode.parentNode.getAttribute("data-hash");
			
			app_explorer.ajaxRequest.infos(hash);
		}
	},
	
	/* Actions sur plusieurs éléments */
	groupAction:
	{
		/* Suppression de plusieurs éléments */
		delete: function()
		{
			popup.open(
				"popup_deleteGroup",
				"Suppression d'éléments",
				"Êtes-vous sûr(e) de vouloir supprimer ces éléments ?<br /><br /><span id='return_deleteGroup'></span>",
				"<input type='button' value='Supprimer' class='button' onclick='app_explorer.ajaxRequest.deleteGroup();' />"
			);
		},
		
		copy: function()
		{
			var defaultActions = document.querySelector("div#app_explorer div#defaultActions p");
					
			var hashs = [];
			var elements = document.querySelectorAll("#app_explorer div.element.selected");
			
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
							if(defaultActions.querySelectorAll("img").length === 3)
							{
								var image = document.createElement("img");
								image.src = "apps/app_explorer/images/actions/paste.svg";
								image.setAttribute("onclick", "app_explorer.actions.paste();");
								
								defaultActions.appendChild(image);
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
            var defaultActions = document.querySelector("div#app_explorer div#defaultActions p");
					
			var hashs = [];
			var elements = document.querySelectorAll("#app_explorer div.element.selected");
			
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
							if(defaultActions.querySelectorAll("img").length === 3)
							{
								var image = document.createElement("img");
								image.src = "apps/app_explorer/images/actions/paste.svg";
								image.setAttribute("onclick", "app_explorer.actions.paste();");
								
								defaultActions.appendChild(image);
							}
							break;
							
						default:
							break;
					}
				}
			}
			
			xhr.send("c=Explorer&a=cut_elements&p="+(hashs.toString()));
        }
	},
	
	/* Envoi des requêtes et récupération des données */
	ajaxRequest:
	{
		/* Création d'un fichier */
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
							app_explorer.actions.list();
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
		},
		
		/* Création d'un dossier */
		createFolder: function()
		{
			var nameFolder = document.querySelector("section#popup_createFolder input#input_createFolder").value;
			
			var returnArea = document.querySelector("#return_createFolder");
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
							app_explorer.actions.list();
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
		},
		
		/* Suppression d'un élément */
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
							app_explorer.actions.list();
							
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
		
		/* Suppression de plusieurs éléments */
		deleteGroup: function()
		{
			var returnArea = document.querySelector("#return_deleteGroup");
			returnArea.innerHTML = "<img src='images/loader.png' style='height: 1.5vh;' />";
			
			var hashs = [];
			var elements = document.querySelectorAll("#app_explorer div.element.selected");
			
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
							app_explorer.actions.list();
						
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
		},
		
		/* Renommer un élément */
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
                xhr.send("c=Explorer&a=rename&p="+encodeURIComponent(hash)+"|"+encodeURIComponent(name));
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
							app_explorer.actions.list();
							
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
		
		/* Afficher les informations sur un élément */
		infos: function(hash)
		{
			var element = document.querySelector("div#app_explorer div#infos_popup");
			
			var xhr = new XMLHttpRequest();
			xhr.open("POST", "inc/controller.php", true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			
			xhr.onreadystatechange = function()
			{
				if(xhr.status === 200 && xhr.readyState === 4)
				{
					var state = xhr.responseText.split("~||]]", 1)[0];
					var data = xhr.responseText.split("~||]]", 2)[1];
					
					app_explorer.load.trigger("hide");
					
					switch(state)
					{
						case "ok":
							element.style.display = "block";
							
							try
							{
								var response = JSON.parse(data);

								if (response[0]["type"] !== "folder")
								{
									var name = response[0]["name"] + "." + response[0]["extension"];    
								}
								else
								{
									var name = response[0]["name"];
								}

								var state_favorite = (response[0]["favorite"] === "0") ? "Non" : "Oui";
								var state_private = (response[0]["private"] === "0") ? "Non" : "Oui";
								
								element.querySelector("div.header_infos").innerHTML = "<p><img src='apps/app_explorer/images/types/" + response[0]["type"] + ".svg' /><br /><br />" + name + "</p>";

								element.querySelector("div.content_infos").innerHTML = "Nom du fichier : <b>" + name + "</b><br /><br />" +
									"Type du fichier : <b>" + response[0]["type"] + "</b><br /><br />" +
									"Localisation : <b>" + response[0]["location"] + "</b><br /><br />" +
									"Date de création : <b>" + response[0]["date"] + "</b><br /><br />" +
									"Dernière utilisation : <b>" + response[0]["lastDate"] + "</b><br /><br />" +
									"Favoris ? <b>" + state_favorite + "</b><br /><br />" +
									"Privé ? <b>" + state_private + "</b>";
							}
							catch (err)
							{
								console.log("Error parsing json.");
							}
							break;
							
						default:
							break;
					}
				}
			}
			
			xhr.send("c=Explorer&a=view_infos&p="+encodeURIComponent(hash));
		}
	},
	
	select:
	{
		/* Sélection d'un élément */
		trigger: function(element)
		{
			// Affichage des éléments sélectionnés
			var globalElement = element.parentNode;
			
			if(globalElement.className === "element")
			{
				globalElement.className = "element selected";
			}
			else
			{
				globalElement.className = "element";
			}
			
			app_explorer.select.showInfo();
		},
		
		/* Affiche les informations sur la sélection */
		showInfo: function()
		{
			// Nombre d'éléments sélectionnés
			var elements = document.querySelectorAll("#listArea #list .element.selected");
			
			var nbFiles = 0;
			var nbFolders = 0;
			
			for(key in elements)
			{
				if({}.hasOwnProperty.call(elements, key))
				{
					if(elements[key].getAttribute("data-type") === "folder")
					{
						nbFolders++;
					}
					else
					{
						nbFiles++;
					}
				}
			}
			
			if(nbFiles === 0 && nbFolders === 0)
			{
				document.querySelector("#app_explorer #bandActions span.firstLine p").innerHTML = "Aucun élément sélectionné";
			}
			else
			{
				document.querySelector("#app_explorer #bandActions span.firstLine p").innerHTML = nbFiles + " fichier(s) et " + nbFolders + " dossier(s) sélectionné(s)";                
			}
			
			app_explorer.select.showActions(nbFiles, nbFolders);
		},
		
		/* Affiche les actions spécifiques à la sélection */
		showActions: function(nbFiles, nbFolders)
		{
			if(nbFiles + nbFolders > 1)
			{
				document.querySelector("#app_explorer #bandActions span.secondLine").innerHTML =    "<p class='action' onclick='app_explorer.groupAction.delete();'><img src='apps/app_explorer/images/actions/delete.svg' /></p>"+
																									"<p class='action' onclick='app_explorer.groupAction.copy();'><img src='apps/app_explorer/images/actions/copy.svg' /></p>"+
																									"<p class='action' onclick='app_explorer.groupAction.cut();'><img src='apps/app_explorer/images/actions/cut.svg' /></p>";
			}
			else
			{
				document.querySelector("#app_explorer #bandActions span.secondLine").innerHTML = "";
			}
		}
	}
}
|| {};