let currentQuestion;
let score = 0;

document.addEventListener("DOMContentLoaded", () => {
  const wordEl = document.getElementById("word");
  const optionsEl = document.getElementById("options");
  const feedbackEl = document.getElementById("feedback");
  const scoreEl = document.getElementById("score");
  const nextBtn = document.getElementById("nextBtn");

  function loadQuestion() {
    fetch("get_question.php")
      .then(res => res.json())
      .then(data => {
        currentQuestion = data;
        wordEl.textContent = `Was bedeutet: "${data.word}"?`;
        feedbackEl.textContent = "";
        nextBtn.style.display = "none";
        optionsEl.innerHTML = "";

        for (let i = 1; i <= 4; i++) {
          const optionText = data[`option${i}`];
          const button = document.createElement("button");
          button.textContent = optionText;
          button.addEventListener("click", () => checkAnswer(`option${i}`));
          optionsEl.appendChild(button);
        }
      });
  }

  function checkAnswer(selected) {
    const isCorrect = selected === currentQuestion.correct_option;
    if (isCorrect) {
      score++;
      feedbackEl.textContent = "✅ Richtig!";
    } else {
      feedbackEl.textContent = `❌ Falsch! Richtige Antwort: ${currentQuestion[currentQuestion.correct_option]} 
      \nDefinition: ${currentQuestion.definition}`;
    }
    scoreEl.textContent = `Punkte: ${score}`;
    nextBtn.style.display = "inline-block";
    // Buttons deaktivieren
    Array.from(optionsEl.children).forEach(btn => btn.disabled = true);
  }

  nextBtn.addEventListener("click", loadQuestion);

  loadQuestion(); // Erste Frage laden
});
