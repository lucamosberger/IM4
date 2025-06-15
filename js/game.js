const TOTAL_QUESTIONS = 10;
let currentQuestion = 0;
let correctCount = 0;
let allQuestions = [];

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
  fetchQuestions().then(() => {
    updateCounter();
    displayQuestion(allQuestions[currentQuestion]);
  });

  nextBtn.addEventListener('click', onNext);
  restartBtn.addEventListener('click', () => location.reload());
});

function fetchQuestions() {
  return fetch('api/get_question.php')
    .then(res => res.json())
    .then(data => {
      allQuestions = data;
    })
    .catch(console.error);
}

function updateCounter() {
  counterEl.textContent = `Frage ${currentQuestion + 1} von ${TOTAL_QUESTIONS}`;
}

function displayQuestion(data) {
  wordEl.textContent = data.word;
  feedbackEl.style.display = 'none';
  choicesEl.innerHTML = '';

  const labels = ['A', 'B', 'C', 'D'];

  data.choices.slice(0, 4).forEach((choice, index) => {
    const btn = document.createElement('button');
    btn.textContent = `${labels[index]}: ${choice.option_text}`;
    btn.classList.add('choice-btn');
    btn.onclick = () => handleAnswer(choice.is_correct, data);
    choicesEl.appendChild(btn);
  });
}

function handleAnswer(isCorrect, data) {
  document.querySelectorAll('#choices button').forEach(b => b.disabled = true);

  const iconEl = document.getElementById('feedback-icon');
  iconEl.classList.remove('correct', 'incorrect');

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
    displayQuestion(allQuestions[currentQuestion]);
  } else {
    finishGame();
  }
}

function finishGame() {
  fetch('api/update_score.php', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({round_points: correctCount})
  })
  .then(res => res.json())
  .then(data => {
    roundScoreEl.textContent = `Dieses Spiel: ${correctCount} von ${TOTAL_QUESTIONS}`;
    totalScoreEl.textContent = `Gesamtpunkte: ${data.total_score}`;
    document.getElementById('game-screen').style.display = 'none';
    endScreen.style.display = 'block';
  })
  .catch(console.error);
}
