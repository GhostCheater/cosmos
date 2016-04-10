<?php
    require_once("../../global/checkSession.php");

    if($folder_apps = opendir("../../../apps/"))
    {
        echo "ok~||]]";
        
        $list = array();
        
        while(($item = readdir($folder_apps)) !== false)
        {
            if($item != "." && $item != "..")
            {
                if(is_dir("../../../apps/" . $item . "/"))
                {
                    if(file_exists("../../../apps/" . $item . "/manifest.json"))
                    {
                        if($data = file_get_contents("../../../apps/" . $item . "/manifest.json", FILE_USE_INCLUDE_PATH))
                        {
                            try
                            {
                                $json = json_decode($data, true);

                                if($json["app"]["name"] != NULL)
                                {
                                    $list[] =  array(
                                        "id" => $item,
                                        "name" => $json["app"]["name"],
                                        "color" => $json["app"]["color"]
                                    );
                                }
                            }
                            catch(Exception $e)
                            {
                                die("error~||]]");
                            }
                        }
                    }
                }
            }
        }
        
        echo json_encode($list);
    }
?>