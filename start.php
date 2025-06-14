<?php
session_start();

require_once 'system/config.php';

// Sicherstellen, dass der Benutzer eingeloggt ist
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}

// User-ID aus Session holen
$user_id = $_SESSION['user_id'];

// Aktuellen Score aus der DB laden
$stmt = $pdo->prepare('SELECT user_score FROM user_profiles WHERE user_id = ?');
$stmt->execute([$user_id]);
$user_score = $stmt->fetchColumn();
if ($user_score === false) {
    $user_score = 0;
}
?>

<!DOCTYPE html>
<html lang="de">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Startseite</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="css/start.css" />
</head>

<body>

  <header>

    <div class="menu-icons">

      <a href="dictionary.php" class="menu-icon" title="Wörterbuch">
        <i class="fa-solid fa-book fa-1x"></i>
      </a>

      <a href="ranking.php" class="menu-icon" title="Rangliste">
        <i class="fa-solid fa-trophy fa-1x"></i>
      </a>

    </div>

    <h1>Skibidictionary</h1>

    <a href="profil.html" class="profile-icon" title="Profil">
      <i class="fa-solid fa-user fa-1x"></i>
    </a>

  </header>

  <main>

    <div class="punkte">

      <span class="anzahl"><?php echo htmlspecialchars($user_score); ?></span>
      <span class="beschreibung">Aura-Punkte</span>

    </div>

    <a href="game.html"><button class="start-button">Start</button></a>

  </main>

</body>

</html>