"use_strict";

var app_music =
{
    /*
    * Initialisation de l'application
    */
    init: function()
    {
        var audio = document.querySelector("#app_music audio");

        localStorage.setItem("app_music#mode", "normal");

        audio.ontimeupdate = function()
        {
            app_music.on._progress(audio);
        }

        audio.onended = function()
        {
            app_music.on._ended(audio);
        }


        // Permet de lister toutes les musiques de l'utilisateur
        app_music.libraryActions.list();
    },

    on:
    {
        _progress: function(track)
        {
            var percent = track.currentTime / track.duration * 100;

            document.querySelector("#app_music #player #progress .current").style.width = percent + "%";
            document.querySelector("#app_music #player #time p").innerHTML = parseInt(track.currentTime) + "s / " + parseInt(track.duration) + "s";
        },

        _ended: function(track)
        {
            var mode = localStorage.getItem("app_music#mode");
            var list_track = document.querySelectorAll("#app_music #tracks .track");
            var current_track = track.currentSrc.substr(track.currentSrc.lastIndexOf("=") + 1, track.currentSrc.length);
            var tracks = [];

            for(var i = 0; i < list_track.length; i++)
            {
                tracks.push(list_track[i].id.replace("track_", ""));
            }

            var current_pos = tracks.indexOf(current_track);
            var last_pos = tracks.length - 1;
            var first_pos = 0;
            var track_to_load = "";

            switch(mode)
            {
                case "normal":
                    if(current_pos == last_pos)
                    {
                        track_to_load = tracks[first_pos];
                    }
                    else
                    {
                        track_to_load = tracks[current_pos + 1];
                    }

                    app_music.libraryActions.loadTrack(document.querySelector("#app_music #track_" + track_to_load));
                    break;

                case "shuffle":
                    track_to_load = tracks[Math.floor(Math.random() * (last_pos - first_pos)) + first_pos];

                    app_music.libraryActions.loadTrack(document.querySelector("#app_music #track_" + track_to_load));
                    break;

                default:
                    break;
            }
        }
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
            var audio = document.querySelector("#app_music audio");
            var list_track = document.querySelectorAll("#app_music #tracks .track");

            var tracks = [];

            for(var i = 0; i < list_track.length; i++)
            {
                tracks.push(list_track[i].id.replace("track_", ""));
            }

            var first_pos = 0;
            var last_pos = list_track.length - 1;
            var current_pos = tracks.indexOf(audio.currentSrc.substr(audio.currentSrc.lastIndexOf("=") + 1, audio.currentSrc.length));
            var track_to_load = "";

            if(current_pos == first_pos)
            {
                track_to_load = tracks[last_pos];
            }
            else
            {
                track_to_load = tracks[current_pos - 1];
            }

            app_music.libraryActions.loadTrack(document.querySelector("#app_music #track_" + track_to_load));
        },
        
        // Jouer/Mettre en pause
        triggerPlay: function()
        {
            var player = document.querySelector("#app_music audio");
            var button = document.querySelectorAll("#app_music #player #basic_control img")[1];

            if(player.paused)
            {
                player.play();
                button.src = "apps/app_music/images/actions/pause.svg";
            }
            else
            {
                player.pause();
                button.src = "apps/app_music/images/actions/play.svg";
            }
        },
        
        // Piste suivante
        next: function()
        {
            var audio = document.querySelector("#app_music audio");
            var list_track = document.querySelectorAll("#app_music #tracks .track");

            var tracks = [];

            for(var i = 0; i < list_track.length; i++)
            {
                tracks.push(list_track[i].id.replace("track_", ""));
            }

            var first_pos = 0;
            var last_pos = list_track.length - 1;
            var current_pos = tracks.indexOf(audio.currentSrc.substr(audio.currentSrc.lastIndexOf("=") + 1, audio.currentSrc.length));
            var track_to_load = "";

            if(current_pos == last_pos)
            {
                track_to_load = tracks[first_pos];
            }
            else
            {
                track_to_load = tracks[current_pos + 1];
            }

            app_music.libraryActions.loadTrack(document.querySelector("#app_music #track_" + track_to_load));
        },
        
        // Mute/Un-mute
        triggerSound: function()
        {
            var player = document.querySelector("#app_music audio");
            var button = document.querySelectorAll("#app_music #player #repeat_control img")[0];

            if(player.muted)
            {
                player.muted = false;
                button.src = "apps/app_music/images/actions/sound_active.svg";
            }
            else
            {
                player.muted = true;
                button.src = "apps/app_music/images/actions/sound_mute.svg";
            }
        },
        
        // Lecture aléatoire des pistes (supprime "repeat")
        shuffle: function()
        {
            var player = document.querySelector("#app_music audio");
            var button = document.querySelectorAll("#app_music #player #repeat_control img")[1];

            localStorage.setItem("app_music#mode", "shuffle");

            if(document.querySelectorAll("#app_music #player #repeat_control img")[2].className == "selected")
            {
                app_music.controlActions.repeat();
            }

            if(button.className == "")
            {
                button.className = "selected";
            }
            else
            {
                button.className = "";
            }
        },
        
        // Repéter une piste en boucle (supprime "shuffle")
        repeat: function()
        {
            var player = document.querySelector("#app_music audio");
            var button = document.querySelectorAll("#app_music #player #repeat_control img")[2];

            localStorage.setItem("app_music#mode", "repeat");

            if(document.querySelectorAll("#app_music #player #repeat_control img")[1].className == "selected")
            {
                app_music.controlActions.shuffle();
            }

            if(button.className == "")
            {
                player.loop = true;
                button.className = "selected";
            }
            else
            {
                player.loop = false;
                button.className = "";
            }
        }
    },
    
    /*
    * Actions sur la piste courante
    */
    trackActions:
    {        
        // Changement de la note de la piste
        triggerMark: function(mark)
        {
            var src = document.querySelector("#app_music audio").currentSrc;
            var marks = document.querySelectorAll("#app_music #playing #mark p img");
            
            if(src != "")
            {
                var hash = src.substr(src.lastIndexOf("=") + 1, src.length);

                for(var i = 0; i < marks.length; i++)
                {
                    marks[i].src = "apps/app_music/images/star_empty.svg";
                }
                
                for(var i = 0; i < mark; i++)
                {
                    marks[i].src = "apps/app_music/images/star_full.svg";
                }

                document.querySelector("#app_music #track_"+hash).setAttribute("data-mark", mark);

                var xhr = new XMLHttpRequest();
                xhr.open("POST", "inc/controller.php", true);
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

                xhr.onreadystatechange = function()
                {
                    if(xhr.status == 200 && xhr.readyState == 4)
                    {
                        console.log(xhr.responseText);
                    }
                }
                xhr.send("c=Audio&a=trigger_mark&p="+hash+"|"+mark);
            }
        },
        
        // Ajout ou suppression d'un instrument
        triggerInstrument: function(element)
        {
            var src = document.querySelector("#app_music audio").currentSrc;
            
            if(src != "")
            {
                // Récupération de l'identifiant de la piste
                var hash = src.substr(src.lastIndexOf("=") + 1, src.length);

                // Récupération du nom de l'instrument
                var instrument = element.src.substr(element.src.lastIndexOf("/") + 1, element.src.length).replace(".svg", "");

                // Changement au niveau des icônes
                var state = (element.className == "") ? "unselected" : "";
                element.className = state;

                var currentInstruments_arr = document.querySelector("#app_music #track_"+hash).getAttribute("data-instruments").split(",");

                if(state == "")
                {
                    currentInstruments_arr.push(instrument);
                }
                else
                {
                    delete currentInstruments_arr[currentInstruments_arr.indexOf(instrument)];
                }

                document.querySelector("#app_music #track_"+hash).setAttribute("data-instruments", currentInstruments_arr.toString());
                
                // Changement au niveau du fichier de la piste
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "inc/controller.php", true);
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhr.send("c=Audio&a=trigger_instrument&p="+hash+"|"+instrument+"|"+state);
            }
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
                    try
                    {
                        var parsedData = JSON.parse(xhr.responseText);
                        var toAppend = "";

                        for(key in parsedData)
                        {
                            toAppend += "" +
                                "<div class='track' id='track_"+parsedData[key]["hash"]+"' onclick='app_music.libraryActions.loadTrack(this);' data-mark='"+parsedData[key]["mark"]+"' data-instruments='"+parsedData[key]["instruments"]+"' data-hash='"+parsedData[key]["hash"]+"' data-track='"+parsedData[key]["track"]+"' data-album='"+parsedData[key]["album"]+"' data-creator='"+parsedData[key]["creator"]+"' data-date='"+parsedData[key]["date"]+"'>"+
                                    "<span><img src='apps/app_music/images/actions/stoping.svg' class='status_track' /></span>"+
                                    "<span><img src='apps/app_music/images/track.svg' /></span>"+
                                    "<span>"+parsedData[key]["track"]+"</span>"+
                                    "<span>"+parsedData[key]["album"]+"</span>"+
                                    "<span>"+parsedData[key]["creator"]+"</span>"+
                                    "<span>"+parsedData[key]["date"]+"</span>"+
                                    "<span>Durée</span>"+
                                "</div>";
                        }

                        document.querySelector("#app_music #tracks").innerHTML = toAppend;
                    } 
                    catch(err)
                    {
                        console.error("Error : " + err);
                    }

                    app_music.triggerLoader();
                }
            }
            
            xhr.send("c=Audio&a=list_tracks");
        },
        
        // Permet de charger une piste
        loadTrack: function(track)
        {
            // Récupération de l'identifiant de la piste
            var hash = track.getAttribute("data-hash");

            // Chargement de la piste 
            var audio = document.querySelector("#app_music audio");

            app_music.controlActions.triggerPlay();
            audio.currentTime = 0;

            if(audio.querySelector("source") != null)
            {
                audio.querySelector("source").src = "inc/controller.php?c=Audio&a=load_track&p="+hash;
                audio.load();
            }
            else
            {
                audio.innerHTML = "<source src='inc/controller.php?c=Audio&a=load_track&p="+hash+"' type='audio/mpeg'></source>";
            }
            
            // Affichage de la piste en cours de lecture
            track = document.querySelector("#app_music #tracks #track_"+hash);

            for(var i = 0; i < document.querySelectorAll("#app_music #tracks .track .status_track").length; i++)
            {
                document.querySelectorAll("#app_music #tracks .track .status_track")[i].src = "apps/app_music/images/actions/stoping.svg"
            }

            track.querySelector(".status_track").src = "apps/app_music/images/actions/playing.svg";

            // Mise à jour de la musique en cours dans le panneau des détails
            var name = track.getAttribute("data-track");
            var album = track.getAttribute("data-album");
            var creator = track.getAttribute("data-creator");
            var mark = track.getAttribute("data-mark");
            var instruments = track.getAttribute("data-instruments").split(",");

            document.querySelector("#app_music #song_name p").innerHTML = name + " - " + creator;

            document.querySelector("#app_music #content p .creator").innerHTML = creator;
            document.querySelector("#app_music #content p .track").innerHTML = name + " - ";
            document.querySelector("#app_music #content p .album").innerHTML = "(" +album + ")";

            for(var i = 0; i < 5; i++)
            {
                if(i < mark)
                {
                    document.querySelectorAll("#app_music #content #mark img")[i].src = "apps/app_music/images/star_full.svg";
                }
                else
                {
                    document.querySelectorAll("#app_music #content #mark img")[i].src = "apps/app_music/images/star_empty.svg";
                }
            }

            for(var i = 0; i < 30; i++)
            {
                var element = document.querySelectorAll("#app_music #content #instruments img")[i];

                if(instruments.indexOf(element.src.substr(element.src.lastIndexOf("/") + 1, element.src.length).replace(".svg", "")) != -1)
                {
                    element.className = "";
                }
                else
                {
                    element.className = "unselected";
                }
            }

            document.querySelectorAll("#app_music #player #basic_control img")[1].src = "apps/app_music/images/actions/pause.svg";
        },
        
        // Affiche la zone de recherche
        displaySearch: function()
        {
            var element = document.querySelector("#app_music #search_area");
            
            var state = (element.style.display == "none") ? "block" : "none";
            
            element.style.display = state;
        },
        
        // Effectue une recherche
        search:
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