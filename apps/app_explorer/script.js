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
		/* Permet le listage du répertoire courant */
		list: function()
		{
			app_explorer.load.trigger("show");
			
			var xhr = new XMLHttpRequest();
			xhr.open("GET", "inc/ajax/explore/list.php", true);
			
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
												toAppend += "<div onclick='app_explorer.select.trigger(this);' ondblclick'"+onclickAction+"'>"+name+"</div>";
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
			
			xhr.send(null);
		},
		
		/* Affichage de l'arborescence du répertoire courant */
		nav: function()
		{
			app_explorer.load.trigger("show");
			
			var xhr = new XMLHttpRequest();
			xhr.open("GET", "inc/ajax/explore/nav.php", true);
			
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
			
			xhr.send(null);
		},
		
		/* Ouverture d'un fichier */
		open: function(call)
		{
		},
		
		/* Changement de répertoire */
		changeDirectory: function(state, idDirectory)
		{
			app_explorer.load.trigger("show");
			
			var xhr = new XMLHttpRequest();
			
			if(state === "workspace")
			{
				xhr.open("GET", "inc/ajax/explore/changeDirectoryWorkspace.php?directoryID="+encodeURIComponent(idDirectory), true);
			}
			else
			{
				xhr.open("GET", "inc/ajax/explore/changeDirectoryNavBar.php?directoryID="+encodeURIComponent(idDirectory), true);
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
			xhr.open("GET", "inc/ajax/explore/copy.php?hash=" + encodeURIComponent(hash), true);

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

			xhr.send(null);
		},
		
		/* Couper un élément */
		cut: function(callButton)
		{
			app_explorer.load.trigger("show");
			
			var element = callButton.parentNode.parentNode;
			var hash = element.getAttribute("data-hash");
			
			var defaultActions = document.querySelector("div#app_explorer div#defaultActions p");

			var xhr = new XMLHttpRequest();
			xhr.open("GET", "inc/ajax/explore/cut.php?hash=" + encodeURIComponent(hash), true);

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

			xhr.send(null);
		},
		
		/* Coller un élément */
		paste: function()
		{
			var defaultActions = document.querySelector("div#app_explorer div#defaultActions p");
			
			app_explorer.load.trigger("show");
			
			var xhr = new XMLHttpRequest();
			xhr.open("GET", "inc/ajax/explore/paste.php", true);

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
			
			xhr.send(null);
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
			xhr.open("GET", "inc/ajax/explore/copy.php?hash="+(hashs.toString()), true);
			
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
			
			xhr.send(null);
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
			xhr.open("GET", "inc/ajax/explore/createFile.php?name="+encodeURIComponent(nameFile)+"&extension="+encodeURIComponent(extension), true);
			
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
			
			xhr.send(null);
		},
		
		/* Création d'un dossier */
		createFolder: function()
		{
			var nameFolder = document.querySelector("section#popup_createFolder input#input_createFolder").value;
			
			var returnArea = document.querySelector("#return_createFolder");
			returnArea.innerHTML = "<img src='images/loader.png' style='height: 1.5vh;' />";
			
			var xhr = new XMLHttpRequest();
			xhr.open("GET", "inc/ajax/explore/createFolder.php?name="+encodeURIComponent(nameFolder), true);
			
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
			
			xhr.send(null);
		},
		
		/* Suppression d'un élément */
		delete: function(name, hash)
		{
			var returnArea = document.querySelector("#return_delete_"+hash);
			returnArea.innerHTML = "<img src='images/loader.png' style='height: 1.5vh;' />";
			
			var xhr = new XMLHttpRequest();
			xhr.open("GET", "inc/ajax/explore/delete.php?hash="+encodeURIComponent(hash), true);
			
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
			
			xhr.send(null);
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
			xhr.open("GET", "inc/ajax/explore/delete.php?hash="+(hashs.toString()), true);
			
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
			
			xhr.send(null);
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
				 xhr.open("GET", "inc/ajax/explore/rename.php?hash="+encodeURIComponent(hash)+"&name="+encodeURIComponent(name), true);
			}
			else
			{
				var extension = element.querySelectorAll("input")[1].value;
				
				xhr.open("GET", "inc/ajax/explore/rename.php?hash="+encodeURIComponent(hash)+"&name="+(name)+"&extension="+encodeURIComponent(extension), true);
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
			
			xhr.send(null);
		},
		
		/* Afficher les informations sur un élément */
		infos: function(hash)
		{
			var element = document.querySelector("div#app_explorer div#infos_popup");
			
			var xhr = new XMLHttpRequest();
			xhr.open("GET", "inc/ajax/explore/infos.php?hash="+encodeURIComponent(hash), true);
			
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
			
			xhr.send(null);
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