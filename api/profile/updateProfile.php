<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    header('Content-Type: application/json');
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

require_once '../../system/config.php';

$loggedInUserId = $_SESSION['user_id'];

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate input
$requiredFields = ['user_name', 'vorname', 'nachname', 'email', 'anrede'];
foreach ($requiredFields as $field) {
    if (empty($input[$field])) {
        http_response_code(400);
        echo json_encode(["error" => "Bitte fülle alle Pflichtfelder aus."]);
        exit;
    }
}

$user_name = trim($input['user_name']);
$vorname = trim($input['vorname']);
$nachname = trim($input['nachname']);
$anrede = trim($input['anrede']) ;
$email = trim($input['email']);
$passwort = isset($input['passwort']) ? trim($input['passwort']) : null;

try {
    // Start transaction
    $pdo->beginTransaction();

    // Update user_profiles table
    $stmtProfile = $pdo->prepare("UPDATE user_profiles 
                                  SET firstname = :vorname, lastname = :nachname, anrede = :anrede, user_name = :user_name
                                  WHERE user_id = :user_id");
    $stmtProfile->execute([
        ':vorname' => $vorname,
        ':nachname' => $nachname,
        ':anrede' => $anrede,
        ':user_name' => $user_name,
        ':user_id' => $loggedInUserId
    ]);

    // Update users table (email and optional password)
    if (!empty($passwort)) {
        $hashedPassword = password_hash($passwort, PASSWORD_DEFAULT);
        $stmtUser = $pdo->prepare("UPDATE users 
                                   SET email = :email, password = :password 
                                   WHERE id = :user_id");
        $stmtUser->execute([
            ':email' => $email,
            ':password' => $hashedPassword,
            ':user_id' => $loggedInUserId
        ]);
    } else {
        $stmtUser = $pdo->prepare("UPDATE users 
                                   SET email = :email 
                                   WHERE id = :user_id");
        $stmtUser->execute([
            ':email' => $email,
            ':user_id' => $loggedInUserId
        ]);
    }

    // Commit transaction
    $pdo->commit();

    echo json_encode(["status" => "success", "message" => "Profil erfolgreich aktualisiert."]);

} catch (PDOException $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(["error" => "Fehler beim Aktualisieren: " . $e->getMessage()]);
}
?>
