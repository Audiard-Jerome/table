// État de l'application
const state = {
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    timer: null,
    timeLimit: 10
};

// Références des éléments du DOM
const settingsSection = document.getElementById('settings-section');
const quizSection = document.getElementById('quiz-section');
const resultsSection = document.getElementById('results-section');
const startBtn = document.getElementById('start-btn');
const submitBtn = document.getElementById('submit-btn');
const restartBtn = document.getElementById('restart-btn');

const numQuestionsInput = document.getElementById('num-questions');
const timeLimitInput = document.getElementById('time-limit');
const tablesContainer = document.getElementById('tables-container');

const progressText = document.getElementById('progress-text');
const timerText = document.getElementById('timer-text');
const questionText = document.getElementById('question-text');
const answerInput = document.getElementById('answer-input');
const scoreText = document.getElementById('score-text');

const messageBox = document.getElementById('message-box');

// Générer les cases à cocher pour les tables
for (let i = 1; i <= 10; i++) {
    const label = document.createElement('label');
    label.className = 'flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 transition-colors p-2 rounded-xl cursor-pointer';
    label.innerHTML = `
        <input type="checkbox" name="tables" value="${i}" class="rounded-lg text-blue-600 focus:ring-blue-500">
        <span class="text-gray-700 font-semibold">${i}</span>
    `;
    tablesContainer.appendChild(label);
}

// Événements
startBtn.addEventListener('click', startQuiz);
submitBtn.addEventListener('click', submitAnswer);
restartBtn.addEventListener('click', restartQuiz);
answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        submitAnswer();
    }
});

/**
 * Génère une liste de questions de multiplication.
 * @param {number} numQuestions Le nombre total de questions.
 * @param {Array<number>} selectedTables Les tables de multiplication à utiliser.
 * @returns {Array<{a: number, b: number, answer: number}>} Un tableau de questions.
 */
function generateQuestions(numQuestions, selectedTables) {
    const questions = [];
    for (let i = 0; i < numQuestions; i++) {
        const a = selectedTables[Math.floor(Math.random() * selectedTables.length)];
        const b = Math.floor(Math.random() * 10) + 1;
        questions.push({ a, b, answer: a * b });
    }
    return questions;
}

/**
 * Affiche un message temporaire à l'écran.
 * @param {string} message Le texte du message.
 * @param {string} type Le type de message ('correct' ou 'incorrect').
 */
function showMessage(message, type) {
    messageBox.textContent = message;
    messageBox.className = `message-box show ${type}`;
    setTimeout(() => {
        messageBox.className = 'message-box';
    }, 1500); // Le message disparaît après 1.5 secondes
}

/**
 * Démarre le quiz.
 */
function startQuiz() {
    // Récupère les paramètres de l'utilisateur
    const numQuestions = parseInt(numQuestionsInput.value);
    const timeLimit = parseInt(timeLimitInput.value);
    
    // Récupère les tables sélectionnées
    const selectedTablesElements = document.querySelectorAll('input[name="tables"]:checked');
    const selectedTables = Array.from(selectedTablesElements).map(el => parseInt(el.value));

    // Validation des entrées
    if (numQuestions < 1 || timeLimit < 1) {
        showMessage("Veuillez entrer des valeurs positives.", "incorrect");
        return;
    }
    if (selectedTables.length === 0) {
        showMessage("Veuillez sélectionner au moins une table.", "incorrect");
        return;
    }

    // Met à jour l'état du jeu
    state.questions = generateQuestions(numQuestions, selectedTables);
    state.currentQuestionIndex = 0;
    state.score = 0;
    state.timeLimit = timeLimit;

    // Met à jour l'interface
    settingsSection.classList.add('hidden');
    resultsSection.classList.add('hidden');
    quizSection.classList.remove('hidden');

    startQuestion();
}

/**
 * Démarre une nouvelle question.
 */
function startQuestion() {
    const question = state.questions[state.currentQuestionIndex];
    
    // Met à jour le texte de la question et la progression
    questionText.textContent = `${question.a} x ${question.b} = ?`;
    progressText.textContent = `Question ${state.currentQuestionIndex + 1}/${state.questions.length}`;
    answerInput.value = '';
    answerInput.focus();

    // Réinitialise et démarre le timer
    let timeLeft = state.timeLimit;
    timerText.textContent = `${timeLeft}s`;
    clearInterval(state.timer);
    state.timer = setInterval(() => {
        timeLeft--;
        timerText.textContent = `${timeLeft}s`;
        if (timeLeft <= 0) {
            // Si le temps est écoulé, la réponse est incorrecte
            showMessage(`Temps écoulé ! La réponse était ${question.answer}.`, "incorrect");
            nextQuestion();
        }
    }, 1000);
}

/**
 * Valide la réponse de l'utilisateur.
 */
function submitAnswer() {
    const question = state.questions[state.currentQuestionIndex];
    const userAnswer = parseInt(answerInput.value);
    clearInterval(state.timer);

    if (userAnswer === question.answer) {
        state.score++;
        showMessage("Correct !", "correct");
    } else {
        showMessage(`Faux ! La bonne réponse était ${question.answer}.`, "incorrect");
    }
    
    // Attendre un peu avant de passer à la question suivante
    setTimeout(() => {
        nextQuestion();
    }, 1500);
}

/**
 * Passe à la question suivante ou termine le quiz.
 */
function nextQuestion() {
    state.currentQuestionIndex++;
    if (state.currentQuestionIndex < state.questions.length) {
        startQuestion();
    } else {
        showResults();
    }
}

/**
 * Affiche les résultats du quiz.
 */
function showResults() {
    quizSection.classList.add('hidden');
    resultsSection.classList.remove('hidden');
    scoreText.textContent = `${state.score}/${state.questions.length}`;
}

/**
 * Réinitialise l'application pour recommencer.
 */
function restartQuiz() {
    resultsSection.classList.add('hidden');
    settingsSection.classList.remove('hidden');
    // Réinitialisation de l'état (optionnel car il est recréé au démarrage)
    state.currentQuestionIndex = 0;
    state.score = 0;
    state.questions = [];
}

// L'écouteur DOMContentLoaded a été retiré car le script est chargé avec l'attribut `defer` dans le HTML.
// Cela garantit que le script s'exécute après le chargement complet du DOM.
