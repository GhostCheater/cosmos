"use_strict";

var app_pdf = 
{
    init: function()
    {
        
    },
    
    loader: function(action)
    {
        var element = document.querySelector("#app_pdf #loader_area");
        
        if(action == "show")
        {
            element.style.display = "table";
        }
        else
        {
            element.style.display = "none";
        }
    },
    
    extern:
    {
        open: function(hash, name)
        {
            app_pdf.loader("show");
            
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "inc/ajax/pdf/test_file.php?hash="+hash, true);
            
            xhr.onreadystatechange = function()
            {
                if(xhr.status == 200 && xhr.readyState == 4)
                {
                    app_pdf.loader("hide");
                    
                    var state = xhr.responseText.split("~||]]", 1)[0];
                    
                    console.log(xhr.responseText);
                    
                    switch(state)
                    {
                        case "ok":
                            document.querySelector("#app_pdf .title_name").innerHTML = "Visionneuse de PDF - <b>" + name + "</b>";
                            
                            document.querySelector("#app_pdf #pdf_viewer").setAttribute("src", "inc/ajax/pdf/get_content_file.php?hash="+hash);
                            break;
                            
                        default:
                            break;
                    }
                }
            }
            
            xhr.send(null);
        }
    }
};