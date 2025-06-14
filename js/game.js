const TOTAL_QUESTIONS = 10;
let currentQuestion = 0;
let correctCount = 0;

// NEU: Counter-Element
const counterEl     = document.getElementById('counter');

const wordEl        = document.getElementById('word');
const choicesEl     = document.getElementById('choices');
const feedbackEl    = document.getElementById('feedback');
const feedbackText  = document.getElementById('feedback-text');
const feedbackEx    = document.getElementById('feedback-example');
const nextBtn       = document.getElementById('next-btn');
const endScreen     = document.getElementById('end-screen');
const roundScoreEl  = document.getElementById('round-score');
const totalScoreEl  = document.getElementById('total-score');
const restartBtn    = document.getElementById('restart-btn');

document.addEventListener('DOMContentLoaded', () => {
  updateCounter();
  loadQuestion();
  nextBtn.addEventListener('click', onNext);
  restartBtn.addEventListener('click', () => location.reload());
});

function updateCounter() {
  // currentQuestion ist 0-basiert, daher +1
  counterEl.textContent = `Frage ${currentQuestion + 1} von ${TOTAL_QUESTIONS}`;
}

function loadQuestion() {
  fetch('api/get_question.php')
    .then(res => res.json())
    .then(data => {
      updateCounter();
      displayQuestion(data);
    })
    .catch(console.error);
}

function displayQuestion(data) {
  // Frage anzeigen
  wordEl.textContent = data.word;
  // Feedback ausblenden
  feedbackEl.style.display = 'none';
  // Auswahl zurücksetzen
  choicesEl.innerHTML = '';

  // Antwort-Buttons erzeugen
  data.choices.forEach(choice => {
    const btn = document.createElement('button');
    btn.textContent = `${choice.option_label}: ${choice.option_text}`;
    btn.classList.add('choice-btn');
    btn.onclick = () => handleAnswer(choice.is_correct, data);
    choicesEl.appendChild(btn);
  });
}

function handleAnswer(isCorrect, data) {
  // Buttons deaktivieren
  document.querySelectorAll('#choices button')
          .forEach(b => b.disabled = true);

  // Icon-Element referenzieren & vorherige Klasse entfernen
  const iconEl = document.getElementById('feedback-icon');
  iconEl.classList.remove('correct', 'incorrect');

  // Icon und Text je nach Antwort
  if (isCorrect) {
    correctCount++;
    iconEl.textContent = '✓';
    iconEl.classList.add('correct');
    feedbackText.textContent = data.definition;
  } else {
    iconEl.textContent = '✗';
    iconEl.classList.add('incorrect');
    feedbackText.textContent = data.erklaerung;
  }

  feedbackEx.textContent = data.beispiel;
  feedbackEl.style.display = 'block';
}

function onNext() {
  currentQuestion++;
  if (currentQuestion < TOTAL_QUESTIONS) {
    updateCounter();
    loadQuestion();
  } else {
    finishGame();
  }
}

function finishGame() {
  // Score beim Server aktualisieren
  fetch('api/update_score.php', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({round_points: correctCount})
  })
  .then(res => res.json())
  .then(data => {
    // Endbildschirm füllen
    roundScoreEl.textContent = `Dieses Spiel: ${correctCount} von ${TOTAL_QUESTIONS}`;
    totalScoreEl.textContent = `Gesamtpunkte: ${data.total_score}`;
    document.getElementById('game-screen').style.display = 'none';
    endScreen.style.display = 'block';
  })
  .catch(console.error);
}