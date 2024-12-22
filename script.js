document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startBtn');
    const quizDiv = document.getElementById('quiz');
    const questionDiv = document.getElementById('question');
    const answerInput = document.getElementById('answer');
    const submitBtn = document.getElementById('submitBtn');
    const skipBtn = document.getElementById('skipBtn');
    const timerDiv = document.getElementById('timer');
    const scoreDiv = document.getElementById('score');
    const tableButtonsDiv = document.getElementById('tableButtons');
    const numQuestionsInput = document.getElementById('numQuestions');
    const timerMinutesInput = document.getElementById('timerMinutes');
    const showTimerCheckbox = document.getElementById('showTimer');
    const errorMessageDiv = document.getElementById('errorMessage');

    let selectedTables = [];
    let currentQuestion = 0;
    let score = 0;
    let timer;
    let totalQuestions;
    let totalTime;

    // Create table selection buttons
    for (let i = 1; i <= 10; i++) {
        const label = document.createElement('label');
        label.textContent = i;
        label.classList.add('table-button');
        label.addEventListener('click', () => toggleTableSelection(i));
        tableButtonsDiv.appendChild(label);
    }

    startBtn.addEventListener('click', startQuiz);
    submitBtn.addEventListener('click', checkAnswer);
    skipBtn.addEventListener('click', skipQuestion);
    answerInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            checkAnswer();
        }
    });

    function toggleTableSelection(table) {
        const label = tableButtonsDiv.querySelector(`label:nth-child(${table})`);
        if (selectedTables.includes(table)) {
            selectedTables = selectedTables.filter(t => t !== table);
            label.classList.remove('selected');
        } else {
            selectedTables.push(table);
            label.classList.add('selected');
        }
    }

    function startQuiz() {
        if (selectedTables.length === 0) {
            errorMessageDiv.style.display = 'block';
            return;
        }
        errorMessageDiv.style.display = 'none';
        totalQuestions = parseInt(numQuestionsInput.value);
        totalTime = parseInt(timerMinutesInput.value) * 60; // Convert minutes to seconds
        currentQuestion = 0;
        score = 0;
        scoreDiv.textContent = `Score: ${score}`;
        quizDiv.style.display = 'block';
        startBtn.style.display = 'none';
        generateQuestion();
        startTimer();
    }

    function generateQuestion() {
        if (currentQuestion < totalQuestions) {
            const table = selectedTables[Math.floor(Math.random() * selectedTables.length)];
            const num2 = Math.floor(Math.random() * 10) + 1;
            questionDiv.textContent = `${table} x ${num2} = ?`;
            answerInput.value = '';
            answerInput.focus();
            answerInput.dataset.correctAnswer = table * num2;
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

    function skipQuestion() {
        currentQuestion++;
        generateQuestion();
    }

    function startTimer() {
        let timeLeft = totalTime;
        if (showTimerCheckbox.checked) {
            timerDiv.style.display = 'block';
        } else {
            timerDiv.style.display = 'none';
        }
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
        alert(`Temps écoulé! Votre score est de ${score}/${totalQuestions}.`);
    }
});
