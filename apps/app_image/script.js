var app_image =
{
    init: function()
    {
        this.preferences.get();
    },
    
    preferences:
    {
        get: function()
        {
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
                                var toAppend = "";
                                
                                if(content["preferences_images"]["auto_archive"])
                                {
                                    var toAppend = "" +
                                        "Aucune image à afficher pour le moment.<br /><br />" +
                                        "Vous n&apos;avez pas encore activé l&apos;archivage automatique de vos images. Cliquez sur le bouton ci-dessous pour l&apos;activer :<br /><br />" +
                                        "<input type='button' value='Débuter l&apos;archivage' class='button blue' onclick='app_image.archive.activate();' />";
                                }
                                else
                                {
                                    var toAppend = "" +
                                        "Aucune image à afficher pour le moment.<br /><br />" +
                                        "Vous avez activé l&apos;archivage automatique de vos images. Cliquez sur le bouton ci-dessous pour l&apos;annuler :<br /><br />" +
                                        "<input type='button' value='Annuler l&apos;archivage' class='button red' onclick='app_image.archive.desactivate();' />";
                                }
                                
                                document.querySelector("#app_image #view p").innerHTML = toAppend;
                            }
                            catch(err)
                            {
                                console.log("Error parsing json : " + err);
                            }
                            break;
                            
                        default:
                            console.log(xhr.responseText);
                            break;
                    }
                }
            }
            
            xhr.send("c=Image&a=get_preferences");
        },
        
        put: function()
        {
            
        }
    },
    
    archive:
    {
        activate: function()
        {
            
        },
        
        desactivate: function()
        {
            
        }
    }
} 
|| {};