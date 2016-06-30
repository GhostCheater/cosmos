"use_strict";

var app_music =
{
    /*
    * Initialisation de l'application
    */
    init: function()
    {
        // Permet de lister toutes les musiques de l'utilisateur
        app_music.libraryActions.list();
    },
    
    triggerLoader: function()
    {
        var element = document.querySelector("#app_music #list #title .loader");
        
        var state = (element.style.opacity == 0 || element.style.opacity == "0") ? 1 : 0;
        
        element.style.opacity = state;
    },
    
    /*
    * Action sur la barre de contrôle
    */
    controlActions:
    {
        // Piste précédente
        previous: function()
        {
            
        },
        
        // Jouer/Mettre en pause
        triggerPlay: function()
        {
            
        },
        
        // Piste suivante
        next: function()
        {
            
        },
        
        // Mute/Un-mute
        triggerSound: function()
        {
            
        },
        
        // Lecture aléatoire des pistes (supprime "repeat")
        shuffle: function()
        {
            
        },
        
        // Repéter une piste en boucle (supprime "shuffle")
        repeat: function()
        {
            
        }
    },
    
    /*
    * Actions sur la piste courante
    */
    trackActions:
    {
        // Affiche les paramètres de la piste en cours et permet de les changer
        displaySettings: function()
        {
            
        },
        
        // Changement des paramètres de la piste
        changeSettings: function()
        {
            
        },
        
        // Changement de la note de la piste
        triggerMark: function(mark)
        {
            var marks = document.querySelectorAll("#app_music #playing #mark p img");
            
            for(var i = 0; i < marks.length; i++)
            {
                marks[i].src = "apps/app_music/images/star_empty.svg";
            }
            
            for(var i = 0; i < mark; i++)
            {
                marks[i].src = "apps/app_music/images/star_full.svg";
            }
        },
        
        // Ajout ou suppression d'un instrument
        triggerInstrument: function(element)
        {
            // Changement au niveau des icônes
            var state = (element.className == "") ? "unselected" : "";
            element.className = state;
            
            // Récupération du nom de l'instrument
            var instrument = element.src.substr(element.src.lastIndexOf("/") + 1, element.src.length).replace(".svg", "");
            
            // Changement au niveau du fichier de la piste
            // TODO
        }
    },
    
    /*
    * Action sur la bibliothèque
    */
    libraryActions:
    {
        // Liste de toutes les pistes de l'utilisateur
        list: function()
        {
            app_music.triggerLoader();
            
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "inc/controller.php", true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            
            xhr.onreadystatechange = function()
            {
                if(xhr.status === 200 && xhr.readyState == 4)
                {
                    
                }
            }
            
            xhr.send("c=Audio&a=list_tracks");
        },
        
        // Permet de charger une piste
        loadTrack: function(hash)
        {
            
        },
        
        // Affiche la zone de recherche
        displaySearch: function()
        {
            var element = document.querySelector("#app_music #search_area");
            
            var state = (element.style.display == "none") ? "block" : "none";
            
            element.style.display = state;
        },
        
        // Effectue une recherche
        search: function()
        {
            
        }
    },
    
    /*
    * Actions extérieures
    */
    extern:
    {
        open: function(hash)
        {
            // Chargement de la piste
            app_music.libraryActions.loadTrack(hash);
        }
    }
}
|| {};