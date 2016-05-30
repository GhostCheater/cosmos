"use_strict";

var app_document = 
{
    init: function()
    {
        // Chargement de la toolbar
        this.preferences.load();
        this.tab.load("insert");
        this.update.states();
        
        // Création de l'éditeur
        var page = document.querySelector("#app_document #page");
        page.contentEditable = true;
        page.contentDocument.designMode = "on";
        
        // On place le focus sur l'éditeur
        page.contentWindow.document.execCommand("contentReadOnly", false, true);
        page.contentWindow.focus();
        
        // On espionne l'objet
        page.contentWindow.document.addEventListener("keyup", function(event)
        {
            app_document.keyboard.trigger(event);
        }, false);
        page.contentWindow.document.addEventListener("click", function(event)
        {
            app_document.keyboard.trigger(event);
        }, false);
    },
    
    convert:
    {
        size_to_px: function(size)
        {
            size = parseInt(size);
            
            switch(size)
            {
                case 1:
                    return 10;
                    break;
                    
                case 2:
                    return 13;
                    break;
                    
                case 3:
                    return 16;
                    break;
                    
                case 4:
                    return 18;
                    break;
                    
                case 5:
                    return 24;
                    break;
                    
                case 6:
                    return 32;
                    break;
                    
                case 7:
                    return 48;
                    break;
                    
                default:
                    break;
            }
        },
        
        px_to_size: function(px)
        {
            px = parseInt(px);
            
            switch(px)
            {
                case 10:
                    return 1;
                    break;
                    
                case 13:
                    return 2;
                    break;
                    
                case 16:
                    return 3;
                    break;
                    
                case 18:
                    return 4;
                    break;
                    
                case 24:
                    return 5;
                    break;
                    
                case 32:
                    return 6;
                    break;
                    
                case 48:
                    return 7;
                    break;
                    
                default:
                    break;
            }
        }
    },
    
    loader:
    {
        trigger: function()
        {
            var loaderArea = document.querySelector("#app_document #loaderArea");
            
            loaderArea.className = (loaderArea.className === "") ? "loaderHide" : "";
        }
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
            for(type in data["preferences_documents"])
            {
                if({}.hasOwnProperty.call(data["preferences_documents"], type))
                {
                    var bold = (data["preferences_documents"][type]["bold"]) ? "font-weight: bold;" : "font-weight: normal;";
                    var italic = (data["preferences_documents"][type]["italic"]) ? "font-style: italic;" : "font-style: normal;";
                    var underline = (data["preferences_documents"][type]["underline"]) ? "text-decoration: underline;" : "text-decoration: none;";
                        
                    var style = "color:"+data["preferences_documents"][type]["color"]+
                                ";font-family:"+data["preferences_documents"][type]["font"]+
                                ";font-size:"+app_document.convert.size_to_px(data["preferences_documents"][type]["size"])+"px"+
                                ";" + bold + italic + underline;
                    
                    style += "display: inline;vertical-align:middle;";
                    
                    document.querySelector("#app_document #navBar #preformated_"+type).style = [style];
                }
            }
            
            // On applique le style "Corps de texte" par défaut
            var page = document.querySelector("#app_document #page");
            
            var style_preformated_text = document.querySelector("#app_document #navBar #preformated_text").style;
            
            var color = style_preformated_text.color;
            var size = style_preformated_text.fontSize;
            var font = style_preformated_text.fontFamily;
            var bold = style_preformated_text.fontWeight;
            var italic = style_preformated_text.fontStyle;
            var underline = style_preformated_text.textDecoration;
            
            page.contentWindow.document.body.style.color = color;
            page.contentWindow.document.body.style.fontSize = app_document.convert.size_to_px(size) + "px";
            page.contentWindow.document.body.style.fontFamily = font;
            page.contentWindow.document.body.style.fontWeight = bold;
            page.contentWindow.document.body.style.fontStyle = italic;
            page.contentWindow.document.body.style.textDecoration = underline;
            
            // On "relâche" l'éditeur
            page.contentWindow.document.execCommand("contentReadOnly", false, false);
            page.focus();
            
            // On masque le loader
            app_document.loader.trigger();
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
                
                // Recherche des styles
                var isBold = page.contentWindow.document.queryCommandState("bold");
                var isItalic = page.contentWindow.document.queryCommandState("italic");
                var isUnderline = page.contentWindow.document.queryCommandState("underline");
                var isStroke = page.contentWindow.document.queryCommandState("strikeThrough");
                var isSub = page.contentWindow.document.queryCommandState("subscript");
                var isSup = page.contentWindow.document.queryCommandState("superscript");
                
                var isLeft = page.contentWindow.document.queryCommandState("justifyLeft");
                var isCenter = page.contentWindow.document.queryCommandState("justifyCenter");
                var isRight = page.contentWindow.document.queryCommandState("justifyRight");
                var isJustify = page.contentWindow.document.queryCommandState("justifyFull");

                if(isBold) {buttons[6].className = "selected";} else {buttons[6].className = "";}
                if(isItalic) {buttons[7].className = "selected";} else {buttons[7].className = "";}
                if(isUnderline) {buttons[8].className = "selected";} else {buttons[8].className = "";}
                if(isStroke) {buttons[9].className = "selected";} else {buttons[9].className = "";}
                if(isSub) {buttons[10].className = "selected";} else {buttons[10].className = "";}
                if(isSup) {buttons[11].className = "selected";} else {buttons[11].className = "";}

                if(isLeft) {buttons[15].className = "selected";} else {buttons[15].className = "";}
                if(isCenter) {buttons[16].className = "selected";} else {buttons[16].className = "";}
                if(isRight) {buttons[17].className = "selected";} else {buttons[17].className = "";}
                if(isJustify) {buttons[18].className = "selected";} else {buttons[18].className = "";}
            }, 100);
        },
        
        tree: function()
        {
            var titles = document.querySelector("#app_document #page").contentWindow.document.querySelectorAll("p span font");
            var preforms = document.querySelectorAll("#app_document #navBar .preformatedText");
            var list = [];
            
            // Récupération de la liste des titres suivant les différents styles
            for(var i = 0; i < titles.length; i++)
            {
                var cStyle = getComputedStyle(titles[i]);
                
                for(var a = 0; a < preforms.length; a++)
                {                    
                    var cStyleTab = [
                        cStyle.fontSize,
                        cStyle.fontFamily,
                        cStyle.color,
                        (cStyle.fontWeight === "400" || cStyle.fontWeight === "normal") ? "normal" : "bold",
                        cStyle.fontStyle
                    ];
                    
                    var preformsTab = [
                        preforms[a].style.fontSize,
                        preforms[a].style.fontFamily,
                        preforms[a].style.color,
                        (preforms[a].style.fontWeight === "400" || preforms[a].style.fontWeight === "normal") ? "normal" : "bold",
                        preforms[a].style.fontStyle
                    ];
                    
                    if(preformsTab[0] === cStyleTab[0] && preformsTab[1] === cStyleTab[1] && preformsTab[2] === cStyleTab[2] && preformsTab[3] === cStyleTab[3] && preformsTab[4] === cStyleTab[4])
                    {
                        list.push([preforms[a].id, titles[i].textContent]);
                    }
                }
            }
            
            // Affichage de la liste des titres dans l'architecture
            var toAppend = "";
            
            for(var i = 0, length = list.length; i < length; i++)
            {
                toAppend += "<span><p class='" + list[i][0].replace("preformated_", "") + "'>" + list[i][1] + "</p></span>";
            }
            
            document.querySelector("#app_document #tree .titles").innerHTML = toAppend;
        }
    },
    
    edit:
    {
        page: function(){ return document.querySelector("#app_document #page"); },
        
        /*
        * Actions
        */
        undo: function()
        {
            this.page().contentWindow.document.execCommand("undo", false, null);
            this.page().focus(); 
        },
        
        redo: function()
        {
            this.page().contentWindow.document.execCommand("redo", false, null);
            this.page().focus(); 
        },
        
        
        /*
        * Presse-papier
        */
        paste: function()
        {
            this.page().contentWindow.document.execCommand("paste", false, null);
            this.page().focus(); 
        },
        
        copy: function()
        {
            this.page().contentWindow.document.execCommand("copy", false, null);
            this.page().focus(); 
        },
        
        cut: function()
        {
            this.page().contentWindow.document.execCommand("cut", false, null);
            this.page().focus(); 
        },
        
        selectAll: function()
        {
            this.page().contentWindow.document.execCommand("selectAll", false, null);
            this.page().focus(); 
        },
        
        /* 
        * Police
        */
        setFont: function()
        {
            var e = document.querySelector("#app_document #navBar #fonts");
            var font = e.options[e.selectedIndex].value;
            
            var range = this.page().contentWindow.document.createRange();
                
            if(this.page().contentWindow.document.getSelection().anchorOffset === this.page().contentWindow.document.getSelection().focusOffset && this.page().contentWindow.document.getSelection().anchorNode === this.page().contentWindow.document.getSelection().focusNode)
            {
                // Aucun texte n'est sélectionné, on applique le style à la ligne
                var sel = this.page().contentWindow.document.getSelection();

                range.setStart(sel.anchorNode, 0);
                range.setEnd(sel.anchorNode, sel.anchorNode.textContent.length);

                sel.removeAllRanges();
                sel.addRange(range);
            }
            
            this.page().contentWindow.document.execCommand("fontName", false, font);
            
            // On replace à la fin de la sélection
            this.page().contentWindow.document.getSelection().collapseToEnd();
            this.page().focus();
        },
        
        setSize: function()
        {
            var e = document.querySelector("#app_document #navBar #sizes");
            var size = app_document.convert.px_to_size(e.options[e.selectedIndex].value);
            
            var range = this.page().contentWindow.document.createRange();
                
            if(this.page().contentWindow.document.getSelection().anchorOffset === this.page().contentWindow.document.getSelection().focusOffset && this.page().contentWindow.document.getSelection().anchorNode === this.page().contentWindow.document.getSelection().focusNode)
            {
                // Aucun texte n'est sélectionné, on applique le style à la ligne
                var sel = this.page().contentWindow.document.getSelection();

                range.setStart(sel.anchorNode, 0);
                range.setEnd(sel.anchorNode, sel.anchorNode.textContent.length);

                sel.removeAllRanges();
                sel.addRange(range);
            }
            
            this.page().contentWindow.document.execCommand("fontSize", false, size);
            
            // On replace à la fin de la sélection
            this.page().contentWindow.document.getSelection().collapseToEnd();
            this.page().focus();
        },
        
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
        
        setStroke: function()
        {
            this.page().contentWindow.document.execCommand("strikeThrough", false, null);
            this.page().focus();
        },
        
        setSub: function()
        {
            this.page().contentWindow.document.execCommand("subscript", false, null);
            this.page().focus();
        },
        
        setSup: function()
        {
            this.page().contentWindow.document.execCommand("superscript", false, null);
            this.page().focus();
        },
        
        /*
        * Style
        */
        setColor: function(color)
        {
            var range = this.page().contentWindow.document.createRange();
                
            if(this.page().contentWindow.document.getSelection().anchorOffset === this.page().contentWindow.document.getSelection().focusOffset && this.page().contentWindow.document.getSelection().anchorNode === this.page().contentWindow.document.getSelection().focusNode)
            {
                // Aucun texte n'est sélectionné, on applique le style à la ligne
                var sel = this.page().contentWindow.document.getSelection();

                range.setStart(sel.anchorNode, 0);
                range.setEnd(sel.anchorNode, sel.anchorNode.textContent.length);

                sel.removeAllRanges();
                sel.addRange(range);
            }
            
            this.page().contentWindow.document.execCommand("removeFormat",false, null);
            this.page().contentWindow.document.execCommand("styleWithCSS", false, true);
            
            this.page().contentWindow.document.execCommand("foreColor", false, color);
            
            // On replace à la fin de la sélection
            this.page().contentWindow.document.getSelection().collapseToEnd();
            this.page().focus();
            
            // On ferme la popup
            app_document.popup.trigger("pos_edit_color");
        },
        
        setHighlight: function(color)
        {
            var range = this.page().contentWindow.document.createRange();
                
            if(this.page().contentWindow.document.getSelection().anchorOffset === this.page().contentWindow.document.getSelection().focusOffset && this.page().contentWindow.document.getSelection().anchorNode === this.page().contentWindow.document.getSelection().focusNode)
            {
                // Aucun texte n'est sélectionné, on applique le style à la ligne
                var sel = this.page().contentWindow.document.getSelection();

                range.setStart(sel.anchorNode, 0);
                range.setEnd(sel.anchorNode, sel.anchorNode.textContent.length);

                sel.removeAllRanges();
                sel.addRange(range);
            }
            
            this.page().contentWindow.document.execCommand("removeFormat",false, null);
            this.page().contentWindow.document.execCommand("styleWithCSS", false, true);
            
            this.page().contentWindow.document.execCommand("hiliteColor", false, color);
            
            // On replace à la fin de la sélection
            this.page().contentWindow.document.getSelection().collapseToEnd();
            this.page().focus();
            
            // On ferme la popup
            app_document.popup.trigger("pos_edit_highlight");
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
        
        /*
        * Texte et titres
        */
        preformated: function(section)
        {
            if(document.querySelector("#app_document #navBar #"+section))
            {                
                var range = this.page().contentWindow.document.createRange();
                
                if(this.page().contentWindow.document.getSelection().anchorOffset === this.page().contentWindow.document.getSelection().focusOffset && this.page().contentWindow.document.getSelection().anchorNode === this.page().contentWindow.document.getSelection().focusNode)
                {
                    // Aucun texte n'est sélectionné, on applique le style à la ligne
                    var sel = this.page().contentWindow.document.getSelection();
                    
                    range.setStart(sel.anchorNode, 0);
                    range.setEnd(sel.anchorNode, sel.anchorNode.textContent.length);
                    
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
                
                this.page().contentWindow.document.execCommand("removeFormat",false, null);
                
                this.page().contentWindow.document.execCommand("styleWithCSS", false, true);
                
                var style = document.querySelector("#app_document #navBar #"+section).style;
                
                var color = style.color;
                var size = style.fontSize;
                
                var font = style.fontFamily;
                var bold = style.fontWeight;
                var italic = style.fontStyle;
                var underline = style.textDecoration;
                
                var size = app_document.convert.px_to_size(size);
                
                this.page().contentWindow.document.execCommand("fontSize", false, size);
                
                if(section !== "preformated_text")
                {
                    this.page().contentWindow.document.execCommand("formatBlock", false, "<p>");
                }
                
                this.page().contentWindow.document.execCommand("foreColor", false, color);
                this.page().contentWindow.document.execCommand("fontName", false, font);
                
                if(bold !== "normal"){ this.page().contentWindow.document.execCommand("bold", false, null); }
                if(italic !== "normal"){ this.page().contentWindow.document.execCommand("italic", false, null); }
                if(underline !== "none"){ this.page().contentWindow.document.execCommand("underline", false, null); }
                
                this.page().contentWindow.document.getSelection().collapseToEnd();
                
                this.page().focus();
                
                // Si le style est un titre, on applique un retour à la ligne et on remet en place le style de "Corps de texte"
                if(section !== "preformated_text")
                {
                    this.page().contentWindow.document.execCommand("insertHTML", false, "<br>\001");
                    app_document.edit.preformated("preformated_text");
                    this.page().contentWindow.document.execCommand("insertHTML", false, "<br>\001");
                    app_document.edit.preformated("preformated_text");
                    this.page().contentWindow.document.execCommand("insertHTML", false, "\001");

                    app_document.edit.preformated("preformated_text");
                }
            }
        },
        
        /*
        * Modification
        */
        search:
        {
            trigger: function()
            {
                
            },
            
            all: function()
            {
                
            },
            
            next: function()
            {
                
            },
            
            previous: function()
            {
                
            }
        }
    },
    
    insert:
    {
        page: function(){ return document.querySelector("#app_document #page"); },
        
        tab: function()
        {
            this.page().contentWindow.document.execCommand("insertHTML", false, "<br><table style='width: 100%;border-collapse: collapse;'><tr><td style='border: 1px solid black;'></td><td style='border: 1px solid black;'></td></tr><tr><td style='border: 1px solid black;'></td><td style='border: 1px solid black;'></td></tr></table><br>");   
        }
    },
    
    popup:
    {
        trigger: function(tab)
        {
            var popup = document.querySelector("#app_document #popup");
            
            popup.style.display = (popup.style.display === "none" || popup.style.display === "" || popup.className != tab) ? "block" : "none";
            popup.className = (popup.className === tab) ? "" : tab;
            
            this.load(tab);
        },
        
        load: function(tab)
        {
            switch(tab)
            {
                case "pos_edit_color":
                    var elements = document.querySelectorAll("#app_document #popup .content .parentBlock");
                    
                    for(var i = 0, length = elements.length; i < length; i++)
                    {
                        var color = elements[i].querySelector(".block").style.backgroundColor;
                        elements[i].setAttribute("onclick", "app_document.edit.setColor('"+color+"');");
                    }
                    break;
                    
                case "pos_edit_highlight":
                    var elements = document.querySelectorAll("#app_document #popup .content .parentBlock");
                    
                    for(var i = 0, length = elements.length; i < length; i++)
                    {
                        var color = elements[i].querySelector(".block").style.backgroundColor;
                        elements[i].setAttribute("onclick", "app_document.edit.setHighlight('"+color+"');");
                    }
                    break;
                    
                default:
                    break;
            }
        }
    },
    
    keyboard:
    {
        page: function(){ return document.querySelector("#app_document #page"); },
        
        trigger: function(event)
        {
            /*
            * Mise à jour de l'architecture du document
            */
            app_document.update.tree();
            
            /*
            * Mise à jour des statuts
            */
            // Recherche de la police
            var select = page.contentWindow.document.getSelection();
            var element = (select.anchorNode == page.contentWindow.document.body) ? page.contentWindow.document.body : select.anchorNode.parentNode;
            var font = getComputedStyle(element).fontFamily;

            if(font !== "serif")
            {
                document.querySelector("#app_document #navBar #fonts").value = font;
            }

            // Recherche de la taille
            var size = getComputedStyle(element).fontSize;
            document.querySelector("#app_document #navBar #sizes").value = size;
            
            /*
            * Mise à jour du QuickAccess
            */
            var range = this.page().contentWindow.document.getSelection();
            
            var toAnalyze = (range.anchorNode.toString() == "[object Text]") ? range.anchorNode.parentNode.toString() : range.anchorNode.toString();
            
            console.log(toAnalyze);
            
            var element = document.querySelector("#app_document #quickAccess_popup .body span");
            
            switch(toAnalyze)
            {
                case "[object Text]": // Texte
                case "[object HTMLBodyElement]":
                    this.quickAccess("text");
                    break;
                    
                case "[object HTMLLIElement]": // Liste à puces
                case "[object HTMLUListElement]":
                    this.quickAccess("list");
                    break;
                    
                case "[object HTMLTableCellElement]": // Tableau
                    this.quickAccess("table");
                    break;
                    
                default:
                    break;
            }
        },
        
        quickAccess: function(wht)
        {
            var toAppend = "";
            
            switch(wht)
            {
                case "text":
                    break;
                    
                case "list":
                    break;
                    
                case "table":
                    
                    toAppend = "" +
                        "<p>" +
                            "<img src='apps/app_document/images/quickAccess/table/add_row.svg' style='margin-right: 1vw;' />" +
                            "<img src='apps/app_document/images/quickAccess/table/remove_row.svg' style='margin-right: 1vw;' />" +
                            "<img src='apps/app_document/images/quickAccess/table/add_column.svg' style='margin-right: 1vw;' />" +
                            "<img src='apps/app_document/images/quickAccess/table/remove_column.svg' />" +
                        "</p>";
                    break;
                    
                default:
                    break;
            }
            
            document.querySelector("#app_document #quickAccess_popup #quickAccess_actions_specials").innerHTML = toAppend;
        }
    }
} 
|| {};