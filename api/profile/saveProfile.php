// Brauchen wir nicht

<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $json = file_get_contents("php://input");
  $daten = json_decode($json, true);

  // Speichern als Datei (könnte auch DB sein)
  file_put_contents("profil.json", json_encode($daten));

  echo json_encode(["status" => "success"]);
} else {
  echo json_encode(["status" => "error", "message" => "Nur POST erlaubt"]);
}
?>
