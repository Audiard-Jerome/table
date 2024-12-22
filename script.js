document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startBtn');
    const quizDiv = document.getElementById('quiz');
    const questionDiv = document.getElementById('question');
    const answerInput = document.getElementById('answer');
    const submitBtn = document.getElementById('submitBtn');
    const timerDiv = document.getElementById('timer');
    const scoreDiv = document.getElementById('score');

    let currentTable;
    let currentQuestion = 0;
    let score = 0;
    let timer;

    startBtn.addEventListener('click', startQuiz);
    submitBtn.addEventListener('click', checkAnswer);

    function startQuiz() {
        currentTable = parseInt(document.getElementById('tables').value);
        currentQuestion = 0;
        score = 0;
        scoreDiv.textContent = `Score: ${score}`;
        quizDiv.style.display = 'block';
        startBtn.style.display = 'none';
        generateQuestion();
        startTimer();
    }

    function generateQuestion() {
        if (currentQuestion < 100) {
            const num1 = currentTable;
            const num2 = Math.floor(Math.random() * 10) + 1;
            questionDiv.textContent = `${num1} x ${num2} = ?`;
            answerInput.value = '';
            answerInput.focus();
            answerInput.dataset.correctAnswer = num1 * num2;
        } else {
            endQuiz();
        }
    }

    function checkAnswer() {
        const userAnswer = parseInt(answerInput.value);
        const correctAnswer = parseInt(answerInput.dataset.correctAnswer);
        if (userAnswer === correctAnswer) {
            score++;
            scoreDiv.textContent = `Score: ${score}`;
        }
        currentQuestion++;
        generateQuestion();
    }

    function startTimer() {
        let timeLeft = 300; // 5 minutes in seconds
        timer = setInterval(() => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerDiv.textContent = `Temps restant: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            if (timeLeft <= 0) {
                clearInterval(timer);
                endQuiz();
            }
            timeLeft--;
        }, 1000);
    }

    function endQuiz() {
        clearInterval(timer);
        quizDiv.style.display = 'none';
        startBtn.style.display = 'block';
        alert(`Temps écoulé! Votre score est de ${score}/100.`);
    }
});
