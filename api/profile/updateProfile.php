<?php
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

// Read JSON input from fetch request
$input = json_decode(file_get_contents('php://input'), true);

// Validate input
if (!isset($input['birthyear'])) {
    http_response_code(400);
    echo json_encode(["error" => "Wir brauchen das Geburtsjahr."]);
    exit;
}

$geburtsjahr = trim($input['birthyear']);


// Update the user's profile in the database
$stmt = $pdo->prepare("UPDATE user_profiles SET geburtsjahr = :geburtsjahr WHERE user_id = :user_id");
$stmt->bindParam(':geburtsjahr', $geburtsjahr, PDO::PARAM_STR);
$stmt->bindParam(':user_id', $loggedInUserId, PDO::PARAM_INT);


try {
    $stmt->execute();
    echo json_encode(["success" => true, "message" => "Profile updated."]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
