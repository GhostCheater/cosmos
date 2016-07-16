<?php
    class track
    {
        static function espace($str)
        {
            $chars = array("\001","\002","\003","\004","\005","\006","\007","\008","\009","\010","\011","\012","\013","\014","\015","\016","\017","\018","\019","\020","\021","\022","\023","\024","\025","\026","\027","\028","\029","\030");
            
            for($i = 0; $i < count($chars); $i++)
            {
                $str = str_replace($chars[$i], "", $str);
            }
            
            return $str;
        }

        static function get_key($str)
        {
            $_kw = array(
                (strrpos($str, "TIT2") != false) ? strpos($str, "TIT2") : 1024,
                (strrpos($str, "TALB") != false) ? strpos($str, "TALB") : 1024,
                (strrpos($str, "TRCK") != false) ? strpos($str, "TRCK") : 1024,
                (strrpos($str, "TYER") != false) ? strpos($str, "TYER") : 1024,
                (strrpos($str, "TPE1") != false) ? strpos($str, "TPE1") : 1024,
                (strrpos($str, "POPM") != false) ? strpos($str, "POPM") : 1024,
                (strrpos($str, "TCON") != false) ? strpos($str, "TCON") : 1024,
                (strrpos($str, "COMM") != false) ? strpos($str, "COMM") : 1024
            );

            asort($_kw);
            $key = each($_kw);

            return $key;
        }

        static function get_infos($path, $extension)
        {
            $handle = fopen($path, "r");
            $data = fgets($handle, 1024);

            switch($extension)
            {
                case ".mp3":
                    // Récupération du titre de la piste
                    $title = substr($data, strrpos($data, "TIT2"));
                    $key = track::get_key($title);
                    $title = str_replace("\000", "", substr($title, 4, $key[1] - 4));


                    // Récupération du nom de l'album de la piste
                    $album = substr($data, strrpos($data, "TALB"));
                    $key = track::get_key($album);
                    $album = str_replace("\000", "", substr($album, 4, $key[1] - 4));


                    // Récupération de numéro de la piste
                    $num = substr($data, strrpos($data, "TRCK"));
                    $key = track::get_key($num);
                    $num = str_replace("\000", "", substr($num, 4, $key[1] - 4));


                    // Récupération de l'année de l'album de la piste
                    $date = substr($data, strrpos($data, "TYER"));
                    $key = track::get_key($date);
                    $date = str_replace("\000", "", substr($date, 4, $key[1] - 4));


                    // Récupération des compositeurs de la piste
                    $creator = substr($data, strrpos($data, "TPE1"));
                    $key = track::get_key($creator);
                    $creator = str_replace("\000", "", substr($creator, 4, $key[1] - 4));

                    return array(
                        "commentaries" => "",
                        "num" => ($num != null) ? $num : "?",
                        "album" => ($album != null) ? $album : "?", 
                        "date" => ($date != null) ? $date : "?",
                        "track" => ($title != null) ? $title : "?",
                        "creator" => ($creator != null) ? $creator : "?"
                    );
                    break;

                case ".wma":
                    break;

                default:
                    break;
            }
        }
    }
?>