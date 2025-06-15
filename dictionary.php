<?php
session_start();

require_once 'system/config.php';

// Sicherstellen, dass der Benutzer eingeloggt ist
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}

// Paginierungseinstellungen
$pageSize = 20;
$page = isset($_GET['page']) && is_numeric($_GET['page']) ? (int)$_GET['page'] : 1;
if ($page < 1) {
    $page = 1;
}

// Gesamtanzahl der Einträge
$stmtTotal = $pdo->query('SELECT COUNT(*) FROM woerter');
$totalEntries = (int)$stmtTotal->fetchColumn();
$totalPages = (int)ceil($totalEntries / $pageSize);

// Offset berechnen
$offset = ($page - 1) * $pageSize;

// Einträge holen
$stmt = $pdo->prepare(
    'SELECT word, definition, beispiel 
     FROM woerter 
     ORDER BY word ASC 
     LIMIT :limit OFFSET :offset'
);
$stmt->bindValue(':limit', $pageSize, PDO::PARAM_INT);
$stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
$stmt->execute();
$words = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Wörterbuch</title>
  <!-- Font Awesome für Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="css/dictionary.css">
  <style>
    /* Zusätzliche Styles für das Wörterbuch */
    main {
      max-width: 800px;
      margin: 2rem auto;
      padding: 1rem;
    }
    .pagination {
      text-align: center;
      margin: 1rem 0;
    }
    .pagination a {
      margin: 0 0.5rem;
      text-decoration: none;
      color: var(--color-primary);
    }
    .entry {
      margin-bottom: 1.5rem;
      width: 100%;
      padding: 20px;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .entry .word {
      font-size: 1.4rem;
      color: var(--color-secondary);
      margin-bottom: 0.25rem;
    }
    .entry .definition {
      margin-bottom: 0.25rem;
    }
    .entry .example {
      font-style: italic;
      color: #555;
    }

  .logo-link {
    text-decoration: none;
    color: inherit;
    font: inherit;
    cursor: pointer;  
  }

  h1 {
    text-align: center;
  }

  </style>
</head>
<body>
<header>
  <div class="menu-icon">
    <a href="start.php" class="menu-icon" title="Startseite">
      <!-- <i class="fa-solid fa-book"></i> -->
    </a>
  </div>
  <h1><a href="start.php" class="logo-link">Skibidictionary</a></h1>
  <div class="profile-icon">
    <a href="profil.html" title="Profil">
      <i class="fa-solid fa-user"></i>
    </a>
  </div>
</header>
    
    <h1>Dictionary</h1>

  <main>

    <!-- Paginierung oben -->
    <div class="pagination">
      <?php if ($page > 1): ?>
        <a href="?page=<?php echo $page - 1; ?>">&#171; Vorherige</a>
      <?php endif; ?>
      Seite <?php echo $page; ?> von <?php echo $totalPages; ?>
      <?php if ($page < $totalPages): ?>
        <a href="?page=<?php echo $page + 1; ?>">Nächste &#187;</a>
      <?php endif; ?>
    </div>

    <!-- Wörterbuch-Einträge -->
    <?php foreach ($words as $w): ?>
      <div class="entry">
        <h2 class="word"><?php echo htmlspecialchars($w['word']); ?></h2>
        <p class="definition"><?php echo nl2br(htmlspecialchars($w['definition'])); ?></p>
        <p class="example"><strong>Beispiel:</strong> <?php echo nl2br(htmlspecialchars($w['beispiel'])); ?></p>
      </div>
    <?php endforeach; ?>

    <!-- Paginierung unten -->
    <div class="pagination">
      <?php if ($page > 1): ?>
        <a href="?page=<?php echo $page - 1; ?>">&#171; Vorherige</a>
      <?php endif; ?>
      Seite <?php echo $page; ?> von <?php echo $totalPages; ?>
      <?php if ($page < $totalPages): ?>
        <a href="?page=<?php echo $page + 1; ?>">Nächste &#187;</a>
      <?php endif; ?>
    </div>
    
      <a href="start.php" class="back-button">Zurück</a>

  </main>
</body>
</html>
