var app_video =
{
    init: function()
    {
        var player = document.querySelector("#app_video video");
        
        player.onprogress = function()
        {
            app_video.listener._progress(player);
        }
        
        player.ontimeupdate = function()
        {
            app_video.listener._progress(player);
        }
        
        player.onplaying = function()
        {
            app_video.listener._progress(player);
        }
    },
    
    actions:
    {
        play_pause: function()
        {
            var player = document.querySelector("#app_video video");
            var play_pause_button = document.querySelectorAll("#app_video #controls p img")[3];
            
            if(player.paused)
            {
                player.play();
                play_pause_button.src = "apps/app_video/images/pause.svg";
            }
            else
            {
                player.pause();
                play_pause_button.src = "apps/app_video/images/play.svg";
            }
        },
        
        forward: function()
        {
            var player = document.querySelector("#app_video video");
            
            if(player.buffered.end(0) > player.currentTime + 30)
            {
                player.currentTime += 30;   
            }
        },
        
        rewind: function()
        {
            var player = document.querySelector("#app_video video");
            
            player.currentTime -= 30;
        },
        
        end: function()
        {
            var player = document.querySelector("#app_video video");
            
            player.currentTime = player.duration;
        },
        
        beginning: function()
        {
            var player = document.querySelector("#app_video video");
            
            player.currentTime = 0;
        },
        
        expand: function()
        {
            var element = document.querySelector("#app_video video");
            
            if (element.mozRequestFullScreen) 
            {
                element.mozRequestFullScreen();
            } 
            else 
            {
                element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        },
        
        sound: function()
        {
            var player = document.querySelector("#app_video video");
            var sound_button = document.querySelectorAll("#app_video #controls p img")[6];
            
            if(player.muted)
            {
                player.muted = false;
                sound_button.src = "apps/app_video/images/sound_active.svg";
            }
            else
            {
                player.muted = true;
                sound_button.src = "apps/app_video/images/sound_mute.svg";
            }
        }
    },
    
    listener:
    {
        _progress: function(element)
        {
            var duration, current;
            
            duration = parseInt(element.duration);
            current = parseInt(element.currentTime);
            
            if(element.duration == NaN)
            {
                duration = "...";
            }
            
            if(element.currentTime == NaN)
            {
                current = "...";
            }
            
            document.querySelector("#app_video #buffer #progress").style.width = (current / duration) * 100 + "%";
            document.querySelector("#app_video #buffer #buffered").style.width = (element.buffered.end(0) / duration) * 100 + "%";
            document.querySelector("#app_video #time p").innerHTML = current + "s / " + duration + "s";
        }
    },
    
    extern:
    {
        open: function(hash, name)
        {
            document.querySelector("#app_video .title_name").innerHTML = "Visionneuse de vidéos - <b>Chargement...</b>";
            
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "inc/controller.php", true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            
            xhr.onreadystatechange = function()
            {
                if(xhr.status == 200 && xhr.readyState == 4)
                {                    
                    var state = xhr.responseText.split("~||]]", 1)[0];
                    
                    console.log(xhr.responseText);
                    
                    switch(state)
                    {
                        case "ok":
                            document.querySelector("#app_video .title_name").innerHTML = "Visionneuse de vidéos - <b>" + name + "</b>";
                            
                            document.querySelector("#app_video video").innerHTML = "<source src='inc/controller.php?c=Video&a=view_video&p="+hash+"'></source>";
                            break;
                            
                        default:
                            break;
                    }
                }
            }
            
            xhr.send("c=Video&a=verif_video&p="+hash);
        }
    }
} 
|| {};