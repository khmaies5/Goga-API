<?php

$app->post('/sendnotifById', function (Request $request, Response $response) {

$id = $_POST["id"] ; 
$body = $_POST["msg"] ; 
 
$url = "https://fcm.googleapis.com/fcm/send";
   /*$token = "dXrkTx5ZkGY:APA91bEgqvFn-bLCtdSeACmYXhZMFXRXwrn8QC2hXM94sicqcniMIfPfJgl2rPhAZq-dmqpEweAzoZ216-rIZC5RYBvK_DUen564FMUsKH0e4Quq91fuobaikyGJR4ocjpWzqQahNJ4l";*/
   $token = "/topics/".$id ; 
$serverKey = 'AAAAZqyMyrw:APA91bGSjh35Vub6_pD0XERvUmuCp4JhcPa8wINY4neFCUDfkvP64e2fLVV-cVyo_HRn6EcIDiA2xpAv2C_b8bSao3JytgWyyPp2fnR2qQcNf7BEGUxeG_eHlqq1F3v9A4SY5qudz9CN';
$title = "Test NOTIF ";
//$body = "votre demande de Matriel a été accepté";
$notification = array('title' =>$title , 'text' => $body, 'sound' => 'default', 'badge' => '1');
$arrayToSend = array('to' => $token, 'notification' => $notification,'priority'=>'high');
$json = json_encode($arrayToSend);
$headers = array();
$headers[] = 'Content-Type: application/json';
$headers[] = 'Authorization: key='. $serverKey;
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST,"POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
curl_setopt($ch, CURLOPT_HTTPHEADER,$headers);
//Send the request
$response = curl_exec($ch);
//Close request
if ($response === FALSE) {
die('FCM Send Error: ' . curl_error($ch));
}
curl_close($ch);

return $response;
});