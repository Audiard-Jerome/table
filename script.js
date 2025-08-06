(function() {
    'use strict';

    // Constants for configuration and magic strings
    const CONSTANTS = {
        VIEWS: {
            SETTINGS: 'settings-section',
            QUIZ: 'quiz-section',
            RESULTS: 'results-section'
        },
        MESSAGE_TYPES: {
            CORRECT: 'correct',
            INCORRECT: 'incorrect'
        },
        CSS_CLASSES: {
            HIDDEN: 'hidden',
            SHOW: 'show'
        },
        DEFAULT_NUM_QUESTIONS: 10,
        DEFAULT_TIME_LIMIT: 10,
        MAX_TABLE_NUMBER: 10
    };

    // Application state
    const state = {
        questions: [],
        currentQuestionIndex: 0,
        score: 0,
        timer: null,
        timeLimit: CONSTANTS.DEFAULT_TIME_LIMIT
    };

    // DOM Element References
    const dom = {
        settingsSection: document.getElementById(CONSTANTS.VIEWS.SETTINGS),
        quizSection: document.getElementById(CONSTANTS.VIEWS.QUIZ),
        resultsSection: document.getElementById(CONSTANTS.VIEWS.RESULTS),
        startBtn: document.getElementById('start-btn'),
        submitBtn: document.getElementById('submit-btn'),
        restartBtn: document.getElementById('restart-btn'),
        numQuestionsInput: document.getElementById('num-questions'),
        timeLimitInput: document.getElementById('time-limit'),
        tablesContainer: document.getElementById('tables-container'),
        progressText: document.getElementById('progress-text'),
        timerText: document.getElementById('timer-text'),
        questionText: document.getElementById('question-text'),
        answerInput: document.getElementById('answer-input'),
        scoreText: document.getElementById('score-text'),
        messageBox: document.getElementById('message-box')
    };

    /**
     * Shows a specific view (settings, quiz, or results) and hides the others.
     * @param {string} viewToShow The ID of the view to show.
     */
    function showView(viewToShow) {
        Object.values(CONSTANTS.VIEWS).forEach(viewId => {
            const viewElement = document.getElementById(viewId);
            if (viewId === viewToShow) {
                viewElement.classList.remove(CONSTANTS.CSS_CLASSES.HIDDEN);
            } else {
                viewElement.classList.add(CONSTANTS.CSS_CLASSES.HIDDEN);
            }
        });
    }

    /**
     * Generates the checkboxes for selecting multiplication tables.
     */
    function createTableCheckboxes() {
        for (let i = 1; i <= CONSTANTS.MAX_TABLE_NUMBER; i++) {
            const checkboxId = `table-${i}`;
            const label = document.createElement('label');
            label.className = 'flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 transition-colors p-2 rounded-xl cursor-pointer';
            label.setAttribute('for', checkboxId);

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = 'tables';
            checkbox.value = i;
            checkbox.id = checkboxId;
            checkbox.className = 'rounded-lg text-blue-600 focus:ring-blue-500';

            const span = document.createElement('span');
            span.className = 'text-gray-700 font-semibold';
            span.textContent = i;

            label.appendChild(checkbox);
            label.appendChild(span);
            dom.tablesContainer.appendChild(label);
        }
    }

    /**
     * Displays a temporary message on the screen.
     * @param {string} message The message text.
     * @param {string} type The message type ('correct' or 'incorrect').
     */
    function showMessage(message, type) {
        dom.messageBox.textContent = message;
        dom.messageBox.className = `message-box ${CONSTANTS.CSS_CLASSES.SHOW} ${type}`;
        setTimeout(() => {
            dom.messageBox.className = 'message-box';
        }, 1500);
    }

    /**
     * Generates a list of multiplication questions.
     * @param {number} numQuestions The total number of questions.
     * @param {Array<number>} selectedTables The multiplication tables to use.
     * @returns {Array<{a: number, b: number, answer: number}>} An array of questions.
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
     * Starts a new question.
     */
    function startQuestion() {
        const question = state.questions[state.currentQuestionIndex];
        dom.questionText.textContent = `${question.a} x ${question.b} = ?`;
        dom.progressText.textContent = `Question ${state.currentQuestionIndex + 1}/${state.questions.length}`;
        dom.answerInput.value = '';
        dom.answerInput.focus();

        let timeLeft = state.timeLimit;
        dom.timerText.textContent = `${timeLeft}s`;
        clearInterval(state.timer);
        state.timer = setInterval(() => {
            timeLeft--;
            dom.timerText.textContent = `${timeLeft}s`;
            if (timeLeft <= 0) {
                showMessage(`Temps écoulé ! La réponse était ${question.answer}.`, CONSTANTS.MESSAGE_TYPES.INCORRECT);
                nextQuestion();
            }
        }, 1000);
    }

    /**
     * Moves to the next question or ends the quiz.
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
     * Handles the submission of an answer.
     */
    function submitAnswer() {
        const question = state.questions[state.currentQuestionIndex];
        const userAnswer = parseInt(dom.answerInput.value, 10);
        clearInterval(state.timer);

        if (userAnswer === question.answer) {
            state.score++;
            showMessage("Correct !", CONSTANTS.MESSAGE_TYPES.CORRECT);
        } else {
            showMessage(`Faux ! La bonne réponse était ${question.answer}.`, CONSTANTS.MESSAGE_TYPES.INCORRECT);
        }

        setTimeout(nextQuestion, 1500);
    }

    /**
     * Displays the final results.
     */
    function showResults() {
        dom.scoreText.textContent = `${state.score}/${state.questions.length}`;
        showView(CONSTANTS.VIEWS.RESULTS);
    }

    /**
     * Starts the quiz after validating settings.
     */
    function startQuiz() {
        const numQuestions = parseInt(dom.numQuestionsInput.value, 10);
        const timeLimit = parseInt(dom.timeLimitInput.value, 10);
        const selectedTables = Array.from(document.querySelectorAll('input[name="tables"]:checked'))
            .map(el => parseInt(el.value, 10));

        if (numQuestions < 1 || timeLimit < 1) {
            showMessage("Veuillez entrer des valeurs positives.", CONSTANTS.MESSAGE_TYPES.INCORRECT);
            return;
        }
        if (selectedTables.length === 0) {
            showMessage("Veuillez sélectionner au moins une table.", CONSTANTS.MESSAGE_TYPES.INCORRECT);
            return;
        }

        state.questions = generateQuestions(numQuestions, selectedTables);
        state.currentQuestionIndex = 0;
        state.score = 0;
        state.timeLimit = timeLimit;

        showView(CONSTANTS.VIEWS.QUIZ);
        startQuestion();
    }

    /**
     * Resets the quiz to the settings screen.
     */
    function restartQuiz() {
        showView(CONSTANTS.VIEWS.SETTINGS);
        state.currentQuestionIndex = 0;
        state.score = 0;
        state.questions = [];
    }

    /**
     * Initializes the application.
     */
    function init() {
        // Set default values from constants
        dom.numQuestionsInput.value = CONSTANTS.DEFAULT_NUM_QUESTIONS;
        dom.timeLimitInput.value = CONSTANTS.DEFAULT_TIME_LIMIT;

        // Add event listeners
        dom.startBtn.addEventListener('click', startQuiz);
        dom.submitBtn.addEventListener('click', submitAnswer);
        dom.restartBtn.addEventListener('click', restartQuiz);
        dom.answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                submitAnswer();
            }
        });

        createTableCheckboxes();
        showView(CONSTANTS.VIEWS.SETTINGS);
    }

    // Start the application
    init();

})();
