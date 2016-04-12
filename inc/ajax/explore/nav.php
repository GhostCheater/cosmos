<?php
    require_once("checkCurrentDirectory.php");

    $array = explode("/", $_SESSION['directory']);
    $list = array();

    for($i = 1; $i < count($array); $i++)
    {
        $link = "";
        $name = "";
        $hash = "";
        
        for($a = 0; $a < $i; $a++)
        {
            if($a == $i - 1)
            {
                $name = $array[$a];
            }
            else
            {
                $link .= $array[$a]."/";
            }
        }
        
        if($name != "" && $link != "")
        {
            $list[] = array($name, $link, $hash);   
        }
    }

    for($i = 0; $i < count($list); $i++)
    {
        $req = $bdd->prepare("SELECT hash FROM elements WHERE name = ? AND location = ? AND user = ? AND type = ?");
        $req->execute(array(
            $list[$i][0],
            $list[$i][1],
            $_SESSION['session']['user'],
            "folder"
        ));
        
        if($req->rowCount() == 1)
        {
            $list[$i][2] = $req->fetch()["hash"];
        }
        else
        {
            die("error~||]]");
        }
    }

    $toAppend = "<p class='directory' onclick='app_explorer.actions.changeDirectoryNavBar(\"Home\");'>Home</p>";

    for($i = 0; $i < count($list); $i++)
    {
        $toAppend .= "<p class='separator'>&gt;</p>";
        $toAppend .= "<p class='directory' onclick='app_explorer.actions.changeDirectoryNavBar(\"".$list[$i][2]."\");'>".$list[$i][0]."</p>";
    }

    echo "ok~||]]";
    echo $toAppend;
?>