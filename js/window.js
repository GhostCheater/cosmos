"use_strict";

var app_list = [
    "app_code",     // Editeur de codes
    "app_document", // Editeur de documents
    "app_explorer", // Explorateur de fichiers
    "app_pdf",      // Visionneuse de PDF
    "app_image",    // Visionneuse d'images
    "app_video",    // Visionneuse de vidéos
    "app_music"     // Lecteur audio
];

var WINDOW = 
{
    trigger: function(app_id, app_color)
    {        
        if(!document.querySelector("#"+app_id))
        {
            /*
            * Définition de la fenêtre
            */
            var element = document.createElement("div");
            element.id = app_id;
            element.className = "window " + app_color;
            element.setAttribute("data-status", "active");
            element.setAttribute("onclick", "WINDOW.setActiveWindow('"+app_id+"')");
            element.setAttribute("style", "display:block;");
            
            /*
            * Disposition de la fenêtre
            */
            var dispo = WINDOW.disposition();
            
            element.className = "window " + app_color + dispo;
            
            /*
            * Définition du header de la fenêtre
            */
            var element_title = document.createElement("div");
            element_title.className = "title";
            element_title.innerHTML = "<p class='title_icon'><img src='apps/"+app_id+"/app.svg' /></p><p class='title_name'>"+app_id+"</p><p class='title_actions' onclick='WINDOW.interact(\""+app_id+"\")'><img src='images/window/reduce.svg' />&nbsp;<img src='images/window/close.svg' onclick='WINDOW.close(\""+app_id+"\");' /></p>";
            element_title.style.backgroundColor = "white";
            element.appendChild(element_title);
			
			/*
			* Définition du contenu de la fenêtre
			*/
			var element_content = document.createElement("div");
			element_content.className = "content";
			element.appendChild(element_content);
            
            /*
            * Définition du cadre de chargement
            */
            var element_load = document.createElement("div");
            element_load.className = "load";
            element_load.innerHTML = "<p><img src='apps/"+app_id+"/app.svg' /><br /><br /><img src='images/loader.png' style='height: 3vh;' class='img_loader' /></p>";
            element.appendChild(element_load);
            
            /*
            * Chargement des éléments de la fenêtre
            */
            var loadHTML = false;
            var loadJS = false;
            var loadCSS = false;
            var loadMANIFEST = false;
            
            // Chargement HTML
            var html = new XMLHttpRequest();
            html.open("GET", "apps/"+app_id+"/application.html?rand="+Math.random(), true);
            html.onreadystatechange = function()
            {
                if(html.status === 200 && html.readyState === 4)
                {
					element_content.innerHTML = html.responseText;
                    loadHTML = true;
                }
            }
            html.send(null);
            
            // Chargement CSS
            var css = new XMLHttpRequest();
			css.open("GET", "apps/"+app_id+"/style.css?rand="+Math.random(), true);
			
			css.onreadystatechange = function()
			{
				if(css.status === 200 && css.readyState === 4)
				{
                    var includeCSS = document.createElement("style");
                    includeCSS.setAttribute("rel", "stylesheet");
                    includeCSS.setAttribute("type", "text/css");
                    includeCSS.setAttribute("id", "style_"+app_id);
                    includeCSS.innerHTML = css.responseText;
                    
                    document.head.appendChild(includeCSS);
                    
					loadCSS = true;
				}
			}
			
			css.send(null);
			
            // Chargement JS
			var js = new XMLHttpRequest();
			js.open("GET", "apps/"+app_id+"/script.js?rand="+Math.random(), true);
			
			js.onreadystatechange = function()
			{
				if(js.status === 200 && js.readyState === 4)
				{
                    var includeJS = document.createElement("script");
                    includeJS.setAttribute("type", "text/javascript");
                    includeJS.setAttribute("async", true);
                    includeJS.setAttribute("id", "script_"+app_id);
                    includeJS.innerHTML = js.responseText;
                    
                    document.head.appendChild(includeJS);
                    
					loadJS = true;
                    
                    if(app_list.indexOf(app_id) !== -1)
                    {
                        setTimeout(function(){
                            eval(app_id + ".init()");
                        }, 500);
                    }
				}
			}
			
			js.send(null);
            
            // Chargement MANIFEST
            var xhr_manifest = new XMLHttpRequest();
            xhr_manifest.open("GET", "apps/"+app_id+"/manifest.json", true);
            xhr_manifest.onreadystatechange = function()
            {
                if(xhr_manifest.status === 200 && xhr_manifest.readyState === 4)
                {
                    try
                    {
                        var data = JSON.parse(xhr_manifest.responseText);
                        
                        element_title.querySelector("p.title_name").innerHTML = data["app"]["name"];
                        loadMANIFEST = true;
                    }
                    catch(e)
                    {
                        throw new DesktopExeption(err);
                    }
                }
            }
            xhr_manifest.send(null);
            
            /*
            * Vérification du chargement complet
            */
            var timeout = setInterval(function(){
                if(loadHTML && loadCSS && loadJS && loadMANIFEST)
                {
                    // Affichage du contenu chargé
                    document.querySelector("div#"+app_id).removeChild(document.querySelector("div#"+app_id+" div.load"));
                    element_title.removeAttribute("style");
                    element.className = "window " + app_color + dispo;
                    
                    clearInterval(timeout);
                }
            }, 1000); // 1s
            
            var verif_timeout = setInterval(function(){ // Deuxième vérification
                if(loadHTML && loadCSS && loadJS && loadMANIFEST)
                {
                    // Affichage du contenu chargé
                    if(document.querySelector("div#"+app_id+" div.load"))
                    {
                        document.querySelector("div#"+app_id).removeChild(document.querySelector("div#"+app_id+" div.load"));
                    }
                    
                    element_title.removeAttribute("style");
                    element.className = "window " + app_color + dispo;
                    
                    clearInterval(verif_timeout);   
                }
            }, 2000); // 2s
            
            /*
            * Fermeture du panneau de droite
            */
            COSMOS.header.trigger.panel("apps");
            
            if(document.querySelector("section#rightPanel").className === "open apps")
            {
                COSMOS.header.trigger.panel("apps");
            }
            
            /*
            * Ajout de l'application dans la barre des tâches
            */
            var task = document.createElement("p");
            task.className = "open";
            task.id = "task_" + app_id;
            task.innerHTML = "<img src='apps/"+app_id+"/app.svg' />";
            task.setAttribute("onclick", "WINDOW.interact('" + app_id + "')");
            document.querySelector("header #apps").appendChild(task);
            
            /*
            * Affichage de la fenêtre
            */
            document.querySelector("section#desktop").appendChild(element);
        }
    },
    
    interact: function(app_id)
    {        
        if(document.querySelector("div#"+app_id))
        {
            if(document.querySelector("div#"+app_id).style.display == "block")
            {
                document.querySelector("div#"+app_id).style.display = "none";
                document.querySelector("header #apps #task_" + app_id).className = "reduce";
            }
            else
            {
                document.querySelector("div#"+app_id).style.display = "block";
                document.querySelector("header #apps #task_" + app_id).className = "open";
            }
        }
    },
    
    changeDisposition: function()
    {
        var disposition = localStorage.getItem("disposition");
        var windows = document.querySelectorAll("#desktop .window");
        
        switch(disposition)
        {
            case "dispo_1":
                for(var i = 0; i < windows.length; i++)
                {
                    
                }
                break;
                
            case "dispo_2_v":
                break;
                
            case "dispo_2_h":
                break;
                
            case "dispo_4":
                break;
        }
    },
    
    disposition: function(element)
    {
        var disposition = localStorage.getItem("disposition");
        
        switch(disposition)
        {
            case "dispo_1":
                return " dispo_1";
                break;
                
            case "dispo_2_v":
                var nb_windows = document.querySelectorAll("#desktop .window").length;
                var position = nb_windows % 2;
                
                return " dispo_2_v elmt_" + position;
                break;
                
            case "dispo_2_h":
                var nb_windows = document.querySelectorAll("#desktop .window").length;
                var position = nb_windows % 2;
                
                return " dispo_2_h elmt_" + position;
                break;
                
            case "dispo_4":
                var nb_windows = document.querySelectorAll("#desktop .window").length;
                var position = nb_windows % 4;
                
                return " dispo_4 elmt_" + position;
                break;
        }
    },
    
    setActiveWindow: function(app_id)
    {
        // Liste des applications ouvertes
        var elements = document.querySelectorAll("section#desktop div.window");
        
        // Passage de toutes les applications en tant qu'inactives
        for(var i = 0; i < elements.length; i++)
        {
            elements[i].setAttribute("data-status", "inactive");
        }
        
        // Activation de l'application
        document.querySelector("div#"+app_id).setAttribute("data-status", "active");
    },
	
	close: function(app_id)
	{
		if(document.querySelector("div#"+app_id))
		{
            // Suppression du style lié à l'application
            document.head.removeChild(document.querySelector("style#style_"+app_id));
            
            // Suppression du script lié à l'application
            document.head.removeChild(document.querySelector("script#script_"+app_id));
            
            // Suppression de la fenêtre
			document.querySelector("section#desktop").removeChild(document.querySelector("div#"+app_id));
            
            // Suppression de l'icône dans la barre des tâches
            document.querySelector("header #apps").removeChild(document.querySelector("header #apps #task_"+app_id));
		}
	}
} 
|| {};