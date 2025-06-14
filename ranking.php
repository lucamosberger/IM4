<?php
session_start();

require_once 'system/config.php';

// Sicherstellen, dass der Benutzer eingeloggt ist
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}

// Nutzer und Scores auslesen
$stmt = $pdo->query('SELECT user_name, user_score FROM user_profiles WHERE user_score !=0 ORDER BY user_score DESC');
$rankings = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Rangliste</title>
  <link rel="stylesheet" href="css/ranking.css" />
</head>
<body>

  <header>
    <div class="menu-icon">
      <!-- <img src="images/menu.image.png" alt="menu"> -->
    </div>
    <h1> <a href="start.php" class="logo-link">Skibidictionary</a></h1>
    <a href="profil.html" class="profile-icon">
      <!-- <img src="images/logo.image.png" alt="Profil" /> -->
    </a>
  </header>

  <main>
    <h1>Rangliste</h1>
    <div class="leaderboard">
      <?php
      $rank = 1;
      foreach ($rankings as $user) {
          echo '<div class="entry"><span>' . $rank . '.</span> ' . htmlspecialchars($user['user_name'])
               . ' – ' . htmlspecialchars($user['user_score']) . ' Aura-Punkte</div>';
          $rank++;
      }
      ?>
    </div>

        <a href="start.php" class="back-button">Zurück</a>

  </main>

  <script src="js/ranking.js"></script>
</body>
</html>
