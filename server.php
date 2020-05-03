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

foreach($dataJSON['json']['FaceDetails'] as $chunk) {
	unset($chunk["Landmarks"],$chunk["Pose"],$chunk["BoundingBox"]);
}

foreach ($dataJSON['json'] as $key => $value) {
    $intcols = count($value);
}

	$array = ['AgeRange','Smile','Eyeglasses','Sunglasses','Gender','Beard','Mustache','EyesOpen','MouthOpen','Confidence'];
	$arrayEmotions = ['Happy','Calm','Sad','Surprised','Disguisted','Fear','Angry','Confused'];

	echo "<table id='table1'>";
	echo "<td>Name of Attribute</td>";
	for($j=0;$j<$intcols;$j++) {
		$id = $j +1;
		echo "<td>Person ".$id."</td>";
	}

	for ($i = 0;$i<10;$i++) {

			echo "<tr id='".$i."'>";
			echo "<td>".$array[$i]."</td>";

			foreach($dataJSON['json']['FaceDetails'] as $chunk) {
				if ($chunk[$array[$i]] == $chunk['AgeRange']){
					echo "<td>".$chunk['AgeRange']['Low']."-".$chunk['AgeRange']['High']."</td>";
				}
				else if($chunk[$array[$i]] == $chunk['Confidence']){
					echo "<td>". $chunk['Confidence']."</td>";
				}
				else if($chunk[$array[$i]] != $chunk['AgeRange']){
					echo "<td>".$chunk[$array[$i]]['Confidence']."</td>";
				}
			}
		echo "</tr>";
	}
	for ($j = 0;$j<8;$j++) {

		echo "<tr id='".$j."'>";
		echo "<td>".$arrayEmotions[$j]."</td>";

		foreach($dataJSON['json']['FaceDetails'] as $chunk) {
			echo "<td>".$chunk['Emotions'][$j]['Confidence']."</td>";
		}
	echo "</tr>";
}
	echo "</table>";
?>