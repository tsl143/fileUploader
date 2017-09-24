
<?php
header("Access-Control-Allow-Origin: *");
$filePath = $_SERVER['DOCUMENT_ROOT']."/a/uploads/";
$fileData = $_POST['dataUrl'];
if($_POST['userData']){
	$filePath .= $_POST['userData'];
}

$filePath = $filePath.$_POST['name'];
$data = explode('base64,',$fileData);
$data = str_replace(' ', '+', $data[1]);
$data = base64_decode($data);
$success = file_put_contents($filePath, $data);
print $success ? $filePath : 'Unable to save the file.';

?>
