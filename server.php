<?php
$f = fopen("uneditable","a");
flock($f,LOCK_EX);

$rawdata = file_get_contents("php://input");
$dataJSON = json_decode($rawdata,true);
$ok = true;

if($dataJSON == null) {
    $result = array('status' => false, 'code' => 1, 'value' => 'Bad format');
    $ok = false;
}
flock($f, LOCK_UN); 
    fclose($f);
//print_r(array_column($dataJSON, "FaceDetails"));
// print_r($dataJSON['json']['FaceDetails']['0']);
// print("<br/><br/>");
// print_r($dataJSON['json']['FaceDetails']['1']);
// print("<br/><br/>");
// print_r($dataJSON['json']['FaceDetails']['2']);
$i = 0 ;
print("=================================BEFORE=================================<br/>");
foreach($dataJSON['json']['FaceDetails'] as $chunk) {
	print($i);
	print_r(json_encode($chunk));
	print("<br/><br/>");
	$i++;
  }
  $i = 0 ;
print("==================================AFTER==================================<br/>");
foreach($dataJSON['json']['FaceDetails'] as $chunk) {
	print($i);
	unset($chunk["Landmarks"],$chunk["Pose"],$chunk["BoundingBox"]);
	print_r(json_encode($chunk));
	print("<br/><br/>");
	$i++;
  }

// function loadTable($data){
// 	if($dataJSON['send'] === true)){
// 		$nazwa_pliku = $dataJSON['nazwa_pliku'];
// 		if(isset($dataJSON['wyraz'])){
// 				if(file_exists("OSOBA/$nazwa_pliku")){
// 					$plik = json_decode(file_get_contents("OSOBA/$nazwa_pliku"),true);
// 					if($plik == null) 
// 						$plik = array();
// 				}
// 				else{
// 				$plik = array();
// 				}
				
// 				$panstwa = json_decode(file_get_contents("json/check.json"),true); //wczytanie wszystkich państw JSON
// 			$wyraz = $dataJSON['wyraz']; //przypisanie szukanego ciagu do zmiennej
// 				$result = '';
				
// 				if ($wyraz !== '') {
// 				    $wyraz = strtolower($wyraz); //zamiana na małe litery
// 			    $dlugosc_wyrazu = strlen($wyraz); // liczenie długości ciągu
// 				    foreach($panstwa as $panstwo) { //wczytanie wszystkich państw z JSON w odpowiednim formacie
// 				        if (stristr($wyraz, substr($panstwo, 0, $dlugosc_wyrazu-1))) { 
// 							/*stristr() zwraca wszystko to co jest za stringiem w tym przypadku za $wyraz. 
// 							$wyraz jest podane przez użytkownika (pierwszy znak/znaki - /ogolnie string/). 
// 							substr() wyswietla okreslona liczbe znaków z ciagu w tym przypadku nazwe kraju od poczatku do konca jego nazwy
// 						*/
// 				            if ($result === '') {
// 								$result = '<option value='.$panstwo.'>'; // jeżeli pierwsze państwo to wypisuje bez przecinka
// 				            } else {
// 							$result .= '<option value='.$panstwo.'>'; // dopisuje kolejne pasujące państwo po przecinku
// 				            }
// 				        }
// 				    }
// 				}
// 				//$result = substr($result,0,strlen($result)-1);
// 				$plik['panstwo']=$wyraz;

// 				file_put_contents("OSOBA/$nazwa_pliku",json_encode($plik, JSON_PRETTY_PRINT+JSON_UNESCAPED_UNICODE+JSON_UNESCAPED_SLASHES));			
// 				return $result === '' ? 'Brak państwa' : $result; // jezeli pusty zwraca brak w innym przypadku zwraca państwa
// 			}
// 			else{
// 				return array('status' => false, 'code' => 5, 'value' => 'Brak podanego wyrazu');
// 			}
// 	}
// 	else{
// 			return array('status' => false, 'code' => 2, 'value' => 'Unexpected access');
// 	}
// }
?>