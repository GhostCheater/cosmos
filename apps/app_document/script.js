var app_document = 
{
    init: function()
    {
        this.tab.load("edit");
    },
    
    tab:
    {
        load: function(tab)
        {
            var tabs = ["edit", "insert", "layout", "export"];
            
            
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
    }
} 
|| {};