var WINDOW = 
{
    trigger: function(app_id, app_color)
    {        
        if(!document.querySelector("div#"+app_id))
        {
            /*
            * Définition de la fenêtre
            */
            var element = document.createElement("div");
            element.id = app_id;
            element.className = "window " + app_color;
            
            /*
            * Définition du header de la fenêtre
            */
            var element_title = document.createElement("div");
            element_title.className = "title";
            element_title.innerHTML = "<p class='title_icon'><img src='apps/"+app_id+"/app.svg' /></p><p class='title_name'>"+app_id+"</p><p class='title_actions'><img src='images/window/reduce.svg' />&nbsp;<img src='images/window/close.svg' onclick='WINDOW.close(\""+app_id+"\");' /></p>";
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
            element_load.innerHTML = "<p><img src='apps/"+app_id+"/app.svg' /><br /><br /><img src='images/loader_app.png' style='height: 3vh;' class='img_loader' /></p>";
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
                if(html.status == 200 && html.readyState == 4)
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
				if(css.status == 200 && css.readyState == 4)
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
				if(js.status == 200 && js.readyState == 4)
				{
                    var includeJS = document.createElement("script");
                    includeJS.setAttribute("type", "text/javascript");
                    includeJS.setAttribute("async", true);
                    includeJS.setAttribute("id", "script_"+app_id);
                    includeJS.innerHTML = js.responseText;
                    
                    document.head.appendChild(includeJS);
                    
					loadJS = true;
                    
                    eval(app_id+ ".init()");
				}
			}
			
			js.send(null);
            
            // Chargement MANIFEST
            var xhr_manifest = new XMLHttpRequest();
            xhr_manifest.open("GET", "apps/"+app_id+"/manifest.json", true);
            xhr_manifest.onreadystatechange = function()
            {
                if(xhr_manifest.status == 200 && xhr_manifest.readyState == 4)
                {
                    try
                    {
                        var data = JSON.parse(xhr_manifest.responseText);
                        
                        element_title.querySelector("p.title_name").innerHTML = data["app"]["name"];
                        loadMANIFEST = true;
                    }
                    catch(e)
                    {
                        console.log("Error parsing JSON");   
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
                    element.className = "window " + app_color;
                    
                    clearInterval(timeout);
                }
            }, 1500); // 1.5s
            
            var verif_timeout = setInterval(function(){ // Deuxième vérification
                if(loadHTML && loadCSS && loadJS && loadMANIFEST)
                {
                    // Affichage du contenu chargé
                    if(document.querySelector("div#"+app_id+" div.load"))
                    {
                        document.querySelector("div#"+app_id).removeChild(document.querySelector("div#"+app_id+" div.load"));
                    }
                    
                    element_title.removeAttribute("style");
                    element.className = "window " + app_color;
                    
                    clearInterval(verif_timeout);   
                }
            }, 3000); // 3s
            
            /*
            * Affichage de la fenêtre
            */
            document.querySelector("section#desktop").appendChild(element);
            
            /*
            * Fermeture du panneau de droite
            */
            COSMOS.header.trigger.panel("apps");
            
            if(document.querySelector("section#rightPanel").className == "open apps")
            {
                COSMOS.header.trigger.panel("apps");
            }
        }
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
		}
	}
} 
|| {};