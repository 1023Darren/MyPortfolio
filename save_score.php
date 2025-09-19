<?php
header('Content-Type: application/json');
$name = $_POST['name'] ?? '';
$score = intval($_POST['score'] ?? 0);
if($name==='' || $score<0){ echo json_encode(["status"=>"error"]); exit;}
$file='scores.json';
$scores=file_exists($file) ? json_decode(file_get_contents($file), true) : [];
$scores[]=["name"=>$name,"score"=>$score,"time"=>time()];
$scores=array_slice($scores,-5);
file_put_contents($file,json_encode($scores));
echo json_encode(["status"=>"success","scores"=>$scores]);
