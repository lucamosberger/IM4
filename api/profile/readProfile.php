<?php

header('Content-Type: application/json');


session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    header('Content-Type: application/json');
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

// DB-Verbindung
require_once '../../system/config.php';

// Logged-in user ID
$loggedInUserId = $_SESSION['user_id'];

// $loggedInUserId = 1;

// Get the logged-in user's data
$stmt = $pdo->prepare("SELECT 
  user_profiles.firstname,
  user_profiles.lastname,
  user_profiles.anrede,
  users.email
FROM 
  user_profiles
JOIN 
  users ON user_profiles.user_id = :user_id;
");
$stmt->bindParam(':user_id', $loggedInUserId, PDO::PARAM_INT);
$stmt->execute();

$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user) {
    header('Content-Type: application/json');
    echo json_encode([
        "status" => "success",
        "user" => $user
    ]);
} else {
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode(["error" => "User not found"]);
}
?>

