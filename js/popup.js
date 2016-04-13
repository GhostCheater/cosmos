var popup =
{
    open: function(id, title, body, bottom)
    {
        if(!document.querySelector("section#"+id))
        {
            /* Création de la popup */
            var element = document.createElement("section");
            element.id = id;
            element.className = "popup";

            /* Titre de la popup */
            var header = document.createElement("div");
            header.className = "header";
            header.innerHTML = "<p>" + title + "</p>";

            /* Contenu de la popup */
            var content = document.createElement("div");
            content.className = "content";
            content.innerHTML = "<p>" + body + "</p>";

            /* Bas de la popup */
            var footer = document.createElement("div");
            footer.className = "footer";
            footer.innerHTML = "<p>" + bottom + "&nbsp;&nbsp;<input type='button' value='Fermer' class='close' onclick='popup.close(\""+id+"\");' /></p>";

            /* Attachement des éléments à la popup */
            element.appendChild(header);
            element.appendChild(content);
            element.appendChild(footer);

            /* Attachement à l'interface */
            document.body.appendChild(element);   
        }
    },
    
    close: function(id)
    {
        if(document.querySelector("section#"+id))
        {
            document.body.removeChild(document.querySelector("#"+id));   
        }
    }
} 
|| {};