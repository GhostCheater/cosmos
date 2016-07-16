<?php
    class track
    {
        static function escape_ascii_chars($str)
        {
            $chars = array("\000","\001","\002","\003","\004","\005","\006","\007","\008","\009","\010","\011","\012","\013","\014","\015","\016","\017","\018","\019","\020","\021","\022","\023","\024","\025","\026","\027","\028","\029","\030","\031");
            
            for($i = 0; $i < count($chars); $i++)
            {
                $str = str_replace($chars[$i], "", $str);
            }
            
            return $str;
        }
        
        static function mp3_get_infos($path)
        {
            // Ouverture du fichier
            $handle = fopen($path, "r");

            // Lecture des 1024 premiers bits
            $data = explode("\000", fread($handle, 1024));

            // Récupération des informations sur la piste
            return array(
                "commentaries" => track::escape_ascii_chars(str_replace("COMM", "", $data[11])),
                "num" => track::escape_ascii_chars(str_replace("TALB", "", $data[46])),
                "album" => track::escape_ascii_chars(str_replace("TYER", "", $data[52])),
                "date" => track::escape_ascii_chars(str_replace("TPE1", "", $data[58])),
                "track" => track::escape_ascii_chars(str_replace("POPM", "", $data[10])),
                "creator" => track::escape_ascii_chars(str_replace("TPE1", "", $data[64])),
            );
        }
        
        static function wma_get_infos($path)
        {
            $handle = fopen($path, "r");

            $data = explode("\000", fread($handle, 1024));

            $content = "";

            for($i = 0; $i < count($data); $i++)
            {
                $content .= $data[$i];
            }

            $arr = explode("WM/", $content);

            return array(
                "commentaries" => "",
                "num" => track::escape_ascii_chars(str_replace("TrackNumber", "", $arr[5])),
                "album" => track::escape_ascii_chars(str_replace("AlbumTitle,", "", $arr[2])), 
                "date" => track::escape_ascii_chars(str_replace("Year\n", "", $arr[6])),
                "track" => track::escape_ascii_chars(substr(substr($arr[0], 34, strlen($arr[0])), 0, strrpos(substr($arr[0], 34, strlen($arr[0])), track::escape_ascii_chars(str_replace("AlbumArtist", "", $arr[8]))))),
                "creator" => track::escape_ascii_chars(str_replace("AlbumArtist", "", $arr[8]))
            );
        }
    }
?>