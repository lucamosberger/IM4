<?php
// register.php
session_start();
header('Content-Type: application/json');

require_once '../system/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_name = trim($_POST['user_name'] ?? '');
    $anrede  = trim($_POST['anrede'] ?? '');
    $vorname = trim($_POST['vorname'] ?? '');
    $nachname = trim($_POST['nachname'] ?? '');
    $email    = trim($_POST['email'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if (!$email || !$password) {
        echo json_encode(["status" => "error", "message" => "Email and password are required"]);
        exit;
    }

    // Check if email already exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = :email");
    $stmt->execute([':email' => $email]);
    if ($stmt->fetch()) {
        echo json_encode(["status" => "error", "message" => "Email is already in use"]);
        exit;
    }

    // Hash the password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Insert the new user
    $insert = $pdo->prepare("INSERT INTO users (email, password ) VALUES (:email, :pass)");
    $insert->execute([
        ':email' => $email,
        ':pass'  => $hashedPassword,   
    ]);

    // Insert the new user
    $insert = $pdo->prepare("INSERT INTO user_profiles (user_id, firstname, lastname, Anrede, user_name) VALUES (:user_id, :firstname, :lastname, :anrede, :user_name)");
    $insert->execute([
        ':user_name' => $user_name,
        ':user_id'   => $pdo->lastInsertId(),
        ':firstname' => $vorname,
        ':lastname'  => $nachname,
        ':anrede'    => $anrede
    ]);


    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
}
