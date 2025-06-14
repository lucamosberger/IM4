<?php
header('Content-Type: application/json');

session_start();

require_once '../system/config.php';

// 1. Zufällige Frage (Wort) holen
$sql = "SELECT * FROM woerter ORDER BY RAND() LIMIT 1";
$stmt = $pdo->prepare($sql);
$stmt->execute();
$word = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$word) {
    http_response_code(500);
    echo json_encode(['error' => 'Keine Fragen gefunden.']);
    exit;
}

// 2. Die vier Antwort-Optionen zur Frage laden
$sql2 = "SELECT option_label, option_text, is_correct 
         FROM multiple_choice 
         WHERE word_id = ?";
$stmt2 = $pdo->prepare($sql2);
$stmt2->execute([$word['word_id']]);
$choices = $stmt2->fetchAll(PDO::FETCH_ASSOC);

// Zufällige Reihenfolge
shuffle($choices);

// 3. JSON zurückgeben
header('Content-Type: application/json; charset=UTF-8');
echo json_encode([
    'word_id'     => $word['word_id'],
    'word'        => $word['word'],
    'definition'  => $word['definition'],
    'beispiel'    => $word['beispiel'],
    'erklaerung'  => $word['erklaerung'],
    'choices'     => $choices
]);