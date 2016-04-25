<?php
	header('Content-Type: text/html; charset=utf-8');
	require_once("checkCurrentDirectory.php");
	
	/* Permet de copier un élément */
	function copyElement($hash, $bdd, $sessionDirectory, $sessionUser, $sessionToPaste)
	{		
		// Récupération des informations sur l'élément à copier
		$get_element_hash = $bdd->prepare("SELECT * FROM elements WHERE hash = ? AND user = ?");
		$get_element_hash->execute(array(
			$hash,
			$sessionUser
		));
		
		if($get_element_hash->rowCount() != 1) die("error~||]]");
		
		$data_element_hash = $get_element_hash->fetch();
		
		// Détermination du type de l'élément : dossier ou fichier
		if($data_element_hash["type"] == "folder")
		{			
			$get_list_elements = $bdd->prepare("SELECT * FROM elements WHERE user = ? AND location LIKE ?");
			$get_list_elements->execute(array(
				$sessionUser,
				$sessionToPaste['startDirectory'] . $data_element_hash["name"] . "/%"
			));
			
			$list_elements = $get_list_elements->fetchAll();
			
			// Test de l'existence des éléments contenus dans le dossier allant être copiés
			foreach($list_elements as $element)
			{
				// Répertoire de copie
				$directory_copy = $sessionDirectory.substr($element["location"], strpos($element["location"], $data_element_hash["location"])+1, strlen($element["location"]));
				
				// Récupération de la liste des éléments dans le répertoire de copie
				$get_list_targetFolder = $bdd->prepare("SELECT * FROM elements WHERE user = ? AND location = ?");
				$get_list_targetFolder->execute(array(
					$sessionUser,
					$directory_copy
				));
				
				$list_targetFolder = $get_list_targetFolder->fetchAll();
				
				// Détermination du type de l'élément : dossier ou fichier
				// Si c'est un dossier, on teste juste s'il existe déjà dans le dossier de copie. S'il n'existe pas, on l'ajoute à la liste de copie
				// Si c'est un fichier, on teste plusieurs combinaisons du type "Copie_de_" + nom + "_" + nombre entre 0 et 20 afin de copier le fichier dans tous les cas
				if($element["type"] == "folder")
				{
					$existing = false;
					
					foreach($list_targetFolder as $alreadyHere)
					{
						if($alreadyHere["name"] == $element["name"] && $alreadyHere["extension"] == $element["extension"])
						{
							$existing = true;
						}
					}
					
					// Si le dossier n'existe pas déjà dans le dossier de copie, on doit le créer
					if(!$existing)
					{
						$list[] = array(
							"name" => $element["name"],
							"element" => $element,
							"directory" => $directory_copy
						);
						
						$newHash = hash("sha256", microtime(true));
						$date = date("Y-m-d");
						
						$req_insert = $bdd->prepare("INSERT INTO elements (id, name, hash, user, type, extension, location, date, lastDate, favorite, private, count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
						$req_insert->execute(array(
							"",
							$element["name"],
							$newHash,
							$sessionUser,
							$element["type"],
							$element["extension"],
							$directory_copy,
							$date,
							$date,
							0,
							1,
							0
						));
					}
				}
				else
				{
					// Liste des "extensions" que l'on peut rajouter aux fichiers pour éviter d'écraser un fichier avec le même nom lors de la copie
					$toExtend = ["", "_0", "_1", "_2", "_3", "_4", "_5", "_6", "_7", "_8", "_9", "_10", "_11", "_12", "_13", "_14", "_15", "_16", "_17", "_18", "_19", "_20"];
					$count = 0;
					
					// Test des noms de fichier
					do
					{
						$existing = false;
						
						foreach($list_targetFolder as $alreadyHere)
						{
							if($alreadyHere["name"] == $element["name"].$toExtend[$count] && $alreadyHere["extension"] == $element["extension"])
							{
								$existing = true;
							}
						}
						
						$count++;
						
						if($count >= 20)
						{
							die("overflow~||]]");
						}
					} while($existing);
					
					$newHash = hash("sha256", microtime(true));
					$date = date("Y-m-d");
					
					$req_insert = $bdd->prepare("INSERT INTO elements (id, name, hash, user, type, extension, location, date, lastDate, favorite, private, count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
					$req_insert->execute(array(
						"",
						$element["name"].$toExtend[$count - 1],
						$newHash,
						$sessionUser,
						$element["type"],
						$element["extension"],
						$directory_copy,
						$date,
						$date,
						0,
						1,
						0
					));
					
					if($element["type"] != "folder")
					{
						copy("../../../workspace/files/{$sessionUser}/{$element['hash']}.data", "../../../workspace/files/{$sessionUser}/{$newHash}.data");
					}
				}
			}
			
			// Test du dossier lui-même afin de déterminer s'il faut qu'il soit copié ou non
			$get_list_existingElements_in_copyFolder = $bdd->prepare("SELECT * FROM elements WHERE location = ? AND user = ? AND type = ?");
			$get_list_existingElements_in_copyFolder->execute(array(
				$sessionDirectory,
				$sessionUser,
				"folder"
			));
			
			$list_existingElements_in_copyFolder = $get_list_existingElements_in_copyFolder->fetchAll();
			
			$existing = false;
			
			foreach($list_existingElements_in_copyFolder as $existingElements)
			{
				if($data_element_hash["name"] == $existingElements["name"])
				{
					$existing = true;
				}
			}
			
			if(!$existing)
			{				
				$newHash = hash("sha256", microtime(true));
				$date = date("Y-m-d");
				
				$req_insert = $bdd->prepare("INSERT INTO elements (id, name, hash, user, type, extension, location, date, lastDate, favorite, private, count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
				$req_insert->execute(array(
					"",
					$data_element_hash["name"],
					$newHash,
					$sessionUser,
					$data_element_hash["type"],
					$elmt["element"]["extension"],
					$sessionDirectory,
					$date,
					$date,
					0,
					1,
					0
				));
			}
		}
		else
		{
			// Récupération des informations sur l'élément à copier
			$get_element_hash = $bdd->prepare("SELECT * FROM elements WHERE hash = ? AND user = ?");
			$get_element_hash->execute(array(
				$hash,
				$sessionUser
			));
			
			if($get_element_hash->rowCount() != 1) die("error~||]]");
			
			$element = $get_element_hash->fetch();
			
			// Récupération du noms des fichiers dans le dossier de destination
			$get_files_targetFolder = $bdd->prepare("SELECT * FROM elements WHERE location = ? AND user = ? AND extension = ? AND type = ?");
			$get_files_targetFolder->execute(array(
				$sessionDirectory,
				$sessionUser,
				$element["extension"],
				$element["type"]
			));
			
			$list_files_targetFolder = $get_files_targetFolder->fetchAll();
			
			$toExtend = ["", "_0", "_1", "_2", "_3", "_4", "_5", "_6", "_7", "_8", "_9", "_10", "_11", "_12", "_13", "_14", "_15", "_16", "_17", "_18", "_19", "_20"];
			$count = 0;
			
			// Test des noms de fichier
			do
			{
				$existing = false;
				
				foreach($list_files_targetFolder as $alreadyHere)
				{
					if($alreadyHere["name"] == $element["name"].$toExtend[$count])
					{
						$existing = true;
					}
				}
				
				$count++;
				
				if($count >= 20)
				{
					die("overflow~||]]");
				}
			} while($existing);
			
			$newName = $element["name"].$toExtend[$count - 1];
			$newHash = hash("sha256", microtime(true));
			$date = date("Y-m-d");
			
			$req_insert = $bdd->prepare("INSERT INTO elements (id, name, hash, user, type, extension, location, date, lastDate, favorite, private, count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
			$req_insert->execute(array(
				"",
				$newName,
				$newHash,
				$sessionUser,
				$element["type"],
				$element["extension"],
				$sessionDirectory,
				$date,
				$date,
				0,
				1,
				0
			));
			
			copy("../../../workspace/files/{$sessionUser}/{$element['hash']}.data", "../../../workspace/files/{$sessionUser}/{$newHash}.data");
		}
	}
	
	/* Permet de couper un élément */
	function cutElement($hash, $bdd, $sessionDirectory, $sessionUser, $sessionToPaste)
	{
		// Récupération des informations sur l'élément
		$get_info_element = $bdd->prepare("SELECT * FROM elements WHERE hash = ? AND user = ?");
		$get_info_element->execute(array(
			$hash,
			$sessionUser
		));
		
		if($get_info_element->rowCount() != 1) die("error~||]]");
		
		$baseElement = $get_info_element->fetch();
		
		// Test du type de l'élément : dossier ou fichier
		if($baseElement["type"] == "folder")
		{
			// Récupération de la liste des éléments du dossier
			$list_element_toCut = $bdd->prepare("SELECT * FROM elements WHERE user = ? AND location LIKE ?");
			$list_element_toCut->execute(array(
				$sessionUser,
				$sessionToPaste["startDirectory"].$baseElement["name"]."/%"
			));
			
			$list_elements = $list_element_toCut->fetchAll();
			
			foreach($list_elements as $element)
			{
				// Répertoire de copie
				$directory_copy = $sessionDirectory.substr($element["location"], strpos($element["location"], $baseElement["location"])+1, strlen($element["location"]));
				
				// Test du type de l'élément : dossier ou fichier
				if($element["type"] == "folder")
				{
					$get_existingElements = $bdd->prepare("SELECT * FROM elements WHERE user = ? AND type = ? AND location = ?");
					$get_existingElements->execute(array(
						$sessionUser,
						"folder",
						$directory_copy
					));
					
					$existingElements = $get_existingElements->fetchAll();
					
					// Si le dossier n'existe pas, il faut le créer, sinon on supprime l'ancien
					$existing = false;
					
					foreach($existingElements as $existingElement)
					{
						if($element["name"] == $existingElement["name"])
						{
							$existing = true;
						}
					}
					
					if(!$existing)
					{
						$req_update = $bdd->prepare("UPDATE elements SET location = ? WHERE user = ? AND hash = ?");
						$req_update->execute(array(
							$directory_copy,
							$sessionUser,
							$element["hash"]
						));
					}
					else
					{
						$req_delete = $bdd->prepare("DELETE FROM elements WHERE hash = ? AND user = ?");
						$req_delete->execute(array(
							$element["hash"],
							$sessionUser
						));
					}
				}
				else
				{
					// Récupération de la liste des fichiers dans le dossier de copie
					$get_existingElements = $bdd->prepare("SELECT * FROM elements WHERE user = ? AND type != ? AND location = ?");
					$get_existingElements->execute(array(
						$sessionUser,
						"folder",
						$directory_copy
					));
					
					$existingElements = $get_existingElements->fetchAll();
					
					$toExtend = ["", "_0", "_1", "_2", "_3", "_4", "_5", "_6", "_7", "_8", "_9", "_10", "_11", "_12", "_13", "_14", "_15", "_16", "_17", "_18", "_19", "_20"];
					$count = 0;
					
					// Test des noms de fichier
					do
					{
						$existing = false;
						
						foreach($existingElements as $alreadyHere)
						{
							if($alreadyHere["name"] == $element["name"].$toExtend[$count])
							{
								$existing = true;
							}
						}
						
						$count++;
						
						if($count >= 20)
						{
							die("overflow~||]]");
						}
					} while($existing);
					
					$newName = $newName = $element["name"].$toExtend[$count - 1];
					$date = date("Y-m-d");
					
					$req_update = $bdd->prepare("UPDATE elements SET name = ?, date = ?, location = ? WHERE user = ? AND hash = ?");
					$req_update->execute(array(
						$newName,
						$date,
						$directory_copy,
						$sessionUser,
						$element["hash"]
					));
				}
			}
			
			// Copie du dossier parent
			$get_list_elements = $bdd->prepare("SELECT * FROM elements WHERE location = ? AND user = ? AND type = ?");
			$get_list_elements->execute(array(
				$sessionDirectory,
				$sessionUser,
				"folder"
			));
			
			$list_elements = $get_list_elements->fetchAll();
			
			$existing = false;
			
			foreach($list_elements as $existingElement)
			{
				if($existingElement["name"] == $baseElement["name"])
				{
					$existing = true;
				}
			}
			
			if(!$existing)
			{
				$req_update = $bdd->prepare("UPDATE elements SET location = ? WHERE user = ? AND hash = ?");
				$req_update->execute(array(
					$sessionDirectory,
					$sessionUser,
					$baseElement["hash"]
				));
			}
		}
		else
		{
			// Test de l'existence du fichier dans le dossier de copie
			$get_list_element_from_copyFolder = $bdd->prepare("SELECT * FROM elements WHERE user = ? AND location LIKE ?");
			$get_list_element_from_copyFolder->execute(array(
				$sessionUser,
				$sessionDirectory."%"
			));
			
			$list_element_copyFolder = $get_list_element_from_copyFolder->fetchAll();
			
			// Test pour chaque élément distant
			$toExtend = ["", "_0", "_1", "_2", "_3", "_4", "_5", "_6", "_7", "_8", "_9", "_10", "_11", "_12", "_13", "_14", "_15", "_16", "_17", "_18", "_19", "_20"];
			$count = 0;
			
			do
			{
				$existing = false;
				
				foreach($list_element_copyFolder as $alreadyHere)
				{
					if($alreadyHere["name"] == $baseElement["name"].$toExtend[$count] AND $alreadyHere["extension"] == $baseElement["extension"])
					{
						$existing = true;
					}
				}
				
				$count++;
				
				if($count >= 20)
				{
					die("overflow~||]]");
				}
			} while($existing);
			
			$newName = $baseElement["name"].$toExtend[$count - 1];
			$date = date("Y-m-d");
			
			$req_update = $bdd->prepare("UPDATE elements SET name = ?, date = ?, location = ? WHERE user = ? AND hash = ?");
			$req_update->execute(array(
				$newName,
				$date,
				$sessionDirectory,
				$sessionUser,
				$baseElement["hash"]
			));
		}
	}
	
	if(isset($_SESSION['toPaste']) && gettype($_SESSION['toPaste']) == "array" && $_SESSION['toPaste']['action'] != "" && count($_SESSION['toPaste']['elements']) >= 1 && $_SESSION['toPaste']['startDirectory'] != "")
	{
		switch($_SESSION['toPaste']['action'])
		{
			case "copy":
				foreach($_SESSION['toPaste']['elements'] as $element)
				{
					if(strlen($element) == 64)
					{
						copyElement($element, $bdd, $_SESSION['directory'], $_SESSION['session']['user'], $_SESSION['toPaste']);
					}
				}
				
				unset($_SESSION['toPaste']);
				
				die("ok~||]]");
				break;
				
			case "cut":
				foreach($_SESSION['toPaste']['elements'] as $element)
				{
					if(strlen($element) == 64)
					{
						cutElement($element, $bdd, $_SESSION['directory'], $_SESSION['session']['user'], $_SESSION['toPaste']);
					}
				}
				// unset($_SESSION['toPaste']);
				
				die("ok~||]]");
				break;
				
			default:
				die("error~||]]");
				break;
		}
	}
	else 
	{
		die("error~||]]");
	}
?>