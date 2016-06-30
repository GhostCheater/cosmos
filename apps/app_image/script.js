"use_strict";

var app_image =
{
    init: function()
    {
        setTimeout(function(){
            app_image.list();
        }, 500);
    },
    
    reduceSizeName: function(str)
    {
        if(str.length > 25)
        {
            var name = str.substr(0, 20);
            var extension = str.substr(str.lastIndexOf("."), str.length);

            str = name + "..." + extension;
        }

        return str;
    },
    
    list: function()
    {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "inc/controller.php", true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        
        xhr.onreadystatechange = function()
        {
            if(xhr.status === 200 && xhr.readyState == 4)
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
                            
                            if(content.length == 0)
                            {
                                toAppend = "<span><p>Aucun image à afficher</p></span>";
                            }
                            
                            for(var i = 0; i < content.length; i++)
                            {
                                toAppend += "<span>";
                                
                                for(var a = 0; a < content[i].length; a++)
                                {
                                    toAppend += "<p onclick='app_image.viewImage(\""+content[i][a][1]+"\", \"" + app_image.reduceSizeName(content[i][a][0]) + "\");' id='list_image_"+content[i][a][1]+"'><img src='inc/controller.php?c=Image&a=view_image&p=" + content[i][a][1] + "' /><br /><b>" + app_image.reduceSizeName(content[i][a][0]) + "</b><br />" + content[i][a][2] + "</p>";
                                }
                                
                                toAppend += "</span>";
                                
                                document.querySelector("#app_image #list #content").innerHTML = toAppend;
                            }
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
        
        xhr.send("c=Image&a=list_elements");
    },
    
    triggerList: function()
    {
        var button = document.querySelector("#app_image #button_list");
        var content = document.querySelector("#app_image #list");
        
        if(content.style.display == "none")
        {
            content.style.display = "block";
            button.className = "image selected";
        }
        else
        {
            content.style.display = "none";
            button.className = "image";
        }
    },
    
    viewImage: function(hash, name)
    {
        document.querySelector("#app_image #view p").innerHTML = "Chargement de l'image en cours...";
        document.querySelector("#app_image .title .title_name").innerHTML = "Visionneuse d'image - <b>" + name + "</b>";
        
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
                        document.querySelector("#app_image #view p").innerHTML = "<img data-rotate='0' data-hash='"+hash+"' src='inc/controller.php?c=Image&a=view_image&p="+hash+"' />";
                        break;
                        
                    default:
                        break;
                }
            }
        }
        
        xhr.send("c=Image&a=verif_image&p="+hash);
    },
    
    actions:
    {
        rotate: function(deg)
        {
            if(document.querySelector("#app_image #view p img") != undefined)
            {
                var currentRotation = parseInt(document.querySelector("#app_image #view p img").getAttribute("data-rotate"));
                
                var newRotation = currentRotation + deg;
                
                document.querySelector("#app_image #view p img").style.transform = "rotate("+newRotation+"deg)";
                document.querySelector("#app_image #view p img").setAttribute("data-rotate", newRotation);
            }
        },
        
        fullscreen: function()
        {
            if(document.querySelector("#app_image #view p img") != undefined)
            {
                var element = document.createElement("div");
                element.className = "fade";
                element.innerHTML = "<div onclick='app_image.actions.escape();' style='position: absolute;top:0;left:0;height:100%;width:100%;display:table;'><p style='display:table-cell;vertical-align:middle;text-align:center;'><img src='"+document.querySelector("#app_image #view p img").src+"' style='max-height: 90vh;' /></p></div>"
            
                document.body.appendChild(element);
            }
        },
        
        escape: function()
        {
            if(document.querySelector("body .fade"))
            {
                document.body.removeChild(document.querySelector("body .fade"));
            }
        }
    },
    
    extern:
    {
        open: function(hash, name)
        {
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
                            document.querySelector("#app_image .title_name").innerHTML = "Visionneuse d'images - <b>" + name + "</b>";
                            
                            document.querySelector("#app_image #view p").innerHTML = "<img src='inc/controller.php?c=Image&a=view_image&p="+hash+"' />";
                            break;
                            
                        default:
                            break;
                    }
                }
            }
            
            xhr.send("c=Image&a=verif_image&p="+hash);
        }
    }
} 
|| {};