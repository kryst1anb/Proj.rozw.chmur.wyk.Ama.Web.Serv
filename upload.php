<?php

$target_path = "upload/" ;
if(!file_exists($target_path)) {
    mkdir($target_path, 0755, true);
}

$filename = basename($_FILES['file']['name']);
$tmp_name = $_FILES['file']['tmp_name'];
$target_path = $target_path . basename( $_FILES['file']['name']);

if(move_uploaded_file($tmp_name, $target_path)) {
    $procedure = "E:/xampp/htdocs/chmurki/.aws/start.py ". $filename;
    exec($procedure);
} else{
    echo "There was an error uploading the file, please try again!";
}
    exit;
?>