<?php
header('Content-Type: application/json');

session_start();

require_once '../system/config.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error'=>'Nicht eingeloggt.']);
    exit;
}

$user_id = $_SESSION['user_id'];
$input = json_decode(file_get_contents('php://input'), true);
$roundPoints = intval($input['round_points']);

// 1. Aktuellen Score auslesen
$sql = "SELECT user_score FROM user_profiles WHERE user_id = ?";
$stmt = $pdo->prepare($sql);
$stmt->execute([$user_id]);
$current = (int)$stmt->fetchColumn();

// 2. Neuen Gesamtscore berechnen und speichern
$newTotal = $current + $roundPoints;
$sql2 = "UPDATE user_profiles SET user_score = ? WHERE user_id = ?";
$stmt2 = $pdo->prepare($sql2);
$stmt2->execute([$newTotal, $user_id]);

// 3. Antwort zurück
header('Content-Type: application/json; charset=UTF-8');
echo json_encode(['total_score' => $newTotal]);