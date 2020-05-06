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

$dataJSON['json']['length'] = $dataJSON['length'];
//print_r($dataJSON);

if($dataJSON['send'] == true){
	foreach($dataJSON['json']['FaceDetails'] as $chunk) {
		unset($chunk["Landmarks"],$chunk["Pose"],$chunk["BoundingBox"]);
	}

	foreach ($dataJSON['json'] as $key => $value) {
		if($key === "FaceDetails"){
			$intcols = count($value);
		}
	}

	$array = ['AgeRange','Smile','Eyeglasses','Sunglasses','Gender','Beard','Mustache','EyesOpen','MouthOpen','Confidence'];
	$arrayEmotions = ['Happy','Calm','Sad','Surprised','Disguisted','Fear','Angry','Confused'];

	echo "<table id='table'>";
	echo "<td class='first-line-tab'>Name of Attribute</td>";
	for($j=0;$j<$intcols;$j++) {
		$id = $j +1;
		echo "<td class='first-line-tab' id='colName_".$j."'>Person ".$id."</td>";
	}

	for ($i = 0;$i<10;$i++) {

		echo "<tr id='".$i."'>";
		echo "<td>".$array[$i]."</td>";

		foreach($dataJSON['json']['FaceDetails'] as $chunk) {
			if ($chunk[$array[$i]] == $chunk['AgeRange']){
				echo "<td>".$chunk['AgeRange']['Low']."-".$chunk['AgeRange']['High']."</td>";
			}
			else if($chunk[$array[$i]] == $chunk['Gender']){
				if($chunk['Gender']['Value'] == "Male"){
					echo "<td>Male in ".round($chunk['Gender']['Confidence'],2)."%</td>";
				}
				else {
					echo "<td>Female in ".round($chunk['Gender']['Confidence'],2)."%</td>";
				}
			}
			else if($chunk[$array[$i]] == $chunk['Confidence']){
				echo "<td>" .round($chunk['Confidence'], 2)."%</td>";
			}
			else if($chunk[$array[$i]] != $chunk['AgeRange']){
				if($chunk[$array[$i]]['Value'] == 1){
					echo "<td>Has in ".round($chunk[$array[$i]]['Confidence'],2)."%</td>";
				}
				else {
						echo "<td>Has not in ".round($chunk[$array[$i]]['Confidence'],2)."%</td>";
				}
			}
		}
		echo "</tr>";
	}
	
	for ($j = 0;$j<8;$j++) {
		$rowNumber = $j+10;
		echo "<tr id='".$rowNumber."' style='display:none;'>";
		echo "<td>".$arrayEmotions[$j]."</td>";
	
		foreach($dataJSON['json']['FaceDetails'] as $chunk) {
			echo "<td>".round($chunk['Emotions'][$j]['Confidence'],2)."%</td>";
		}
	
		echo "</tr>";
	}
	echo "</table>";
}


	flock($f, LOCK_UN); 
	fclose($f);
	unlink('uneditable');
?>