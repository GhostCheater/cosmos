<?php
    class cImage
    {
        static function relative_path()
        {
            return "../";
        }
        
        static function get_preferences()
        {
            require("secure.php");
            
            $path = cImage::relative_path();
            
            if(file_exists("{$path}workspace/preferences/{$_SESSION['session']['user']}/preferences_images.json"))
            {
                if($data = file_get_contents("{$path}workspace/preferences/{$_SESSION['session']['user']}/preferences_images.json", FILE_USE_INCLUDE_PATH))
                {
                    if(json_decode($data))
                    {
                        echo "ok~||]]{$data}";
                    }
                    else
                    {
                        die("error~||]]3");
                    }
                }
                else
                {
                    die("error~||]]2");
                }
            }
            else
            {
                die("error~||]]1");
            }
        }
    }
?>