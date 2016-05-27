var app_document = 
{
    init: function()
    {
        this.preferences.load();
        this.tab.load("edit");
        this.update.states();
        
        // Création de l'éditeur
        var page = document.querySelector("#app_document #page");
        page.contentEditable = true;
        page.contentDocument.designMode = "on";
        
        page.focus();
    },
    
    tab:
    {
        load: function(tab)
        {
            var tabs = ["edit", "insert", "layout", "export", "settings"];
            
            
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
            xhr.open("GET", "inc/ajax/edit/load_preferences.php", true);
            
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
                                console.error("Error parsing json.");
                            }
                            break;
                            
                        default:
                            break;
                    }
                }
            }
            
            xhr.send(null);
        },
        
        parse: function(data)
        {
            console.log(data["preferences_documents"]);
            for(type in data["preferences_documents"])
            {
                if({}.hasOwnProperty.call(data["preferences_documents"], type))
                {
                    var bold = (data["preferences_documents"][type]["bold"]) ? "font-weight:bold;" : "";
                    var italic = (data["preferences_documents"][type]["italic"]) ? "font-style:italic;" : "";
                    var underline = (data["preferences_documents"][type]["underline"]) ? "text-decoration:underline;" : "";
                        
                    var style = "background-color:"+data["preferences_documents"][type]["highlight"]+
                                ";color:"+data["preferences_documents"][type]["color"]+
                                ";font-family:"+data["preferences_documents"][type]["font"]+
                                ";font-size:"+data["preferences_documents"][type]["size"]+
                                ";" + bold + italic + underline + "display: inline;vertical-align:middle;";
                    
                    document.querySelector("#app_document #navBar #preformated_"+type).style = [style];
                }
            }
        }
    },
    
    update:
    {
        states: function()
        {
            setInterval(function(){
                var page = document.querySelector("#app_document #page");

                /*
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
                var buttons = document.querySelectorAll("#app_document #navBar img");

                var isBold = page.contentWindow.document.queryCommandState("bold");
                var isItalic = page.contentWindow.document.queryCommandState("italic");
                var isUnderline = page.contentWindow.document.queryCommandState("underline");
                var isLeft = page.contentWindow.document.queryCommandState("justifyLeft");
                var isCenter = page.contentWindow.document.queryCommandState("justifyCenter");
                var isRight = page.contentWindow.document.queryCommandState("justifyRight");
                var isJustify = page.contentWindow.document.queryCommandState("justifyFull");

                if(isBold) {buttons[6].className = "selected";} else {buttons[6].className = "";}
                if(isItalic) {buttons[7].className = "selected";} else {buttons[7].className = "";}
                if(isUnderline) {buttons[8].className = "selected";} else {buttons[8].className = "";}

                if(isLeft) {buttons[15].className = "selected";} else {buttons[15].className = "";}
                if(isCenter) {buttons[16].className = "selected";} else {buttons[16].className = "";}
                if(isRight) {buttons[17].className = "selected";} else {buttons[17].className = "";}
                if(isJustify) {buttons[18].className = "selected";} else {buttons[18].className = "";}
            }, 100);
        }
    },
    
    edit:
    {
        page: function(){ return document.querySelector("#app_document #page"); },
        
        /* 
        * Police
        */
        setBold: function()
        {
            this.page().contentWindow.document.execCommand("bold", false, null);
            this.page().focus();
        },
        
        setItalic: function()
        {
            this.page().contentWindow.document.execCommand("italic", false, null);
            this.page().focus();
        },
        
        setUnderline: function()
        {
            this.page().contentWindow.document.execCommand("underline", false, null);
            this.page().focus();
        },
        
        /*
        * Paragraphe
        */
        setList: function()
        {
            this.page().contentWindow.document.execCommand("insertUnorderedList", false, null);
            this.page().focus();
        },
        
        setLeft: function()
        {
            this.page().contentWindow.document.execCommand("justifyLeft", false, null);
            this.page().focus();
        },
        
        setCenter: function()
        {
            this.page().contentWindow.document.execCommand("justifyCenter", false, null);
            this.page().focus();
        },
        
        setRight: function()
        {
            this.page().contentWindow.document.execCommand("justifyRight", false, null);
            this.page().focus();
        },
        
        setJustify: function()
        {
            this.page().contentWindow.document.execCommand("justifyFull", false, null);
            this.page().focus();
        },
    }
} 
|| {};