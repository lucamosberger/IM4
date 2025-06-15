<?php
header('Content-Type: application/json; charset=UTF-8');
session_start();
require_once '../system/config.php';

// 1. Zehn zufällige Wörter aus der Datenbank holen
$sql = "SELECT * FROM woerter ORDER BY RAND() LIMIT 10";
$stmt = $pdo->prepare($sql);
$stmt->execute();
$questions = $stmt->fetchAll(PDO::FETCH_ASSOC);

$result = [];

foreach ($questions as $word) {
    // 2. Antwortoptionen zur Frage laden
    $sql2 = "SELECT option_label, option_text, is_correct 
             FROM multiple_choice 
             WHERE word_id = ?";
    $stmt2 = $pdo->prepare($sql2);
    $stmt2->execute([$word['word_id']]);
    $choices = $stmt2->fetchAll(PDO::FETCH_ASSOC);

    shuffle($choices);

    // 3. Frage zusammensetzen
    $result[] = [
        'word_id'     => $word['word_id'],
        'word'        => $word['word'],
        'definition'  => $word['definition'],
        'beispiel'    => $word['beispiel'],
        'erklaerung'  => $word['erklaerung'],
        'choices'     => $choices
    ];
}

// 4. Rückgabe
echo json_encode($result);
