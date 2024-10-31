let questionCount = 0;
let correctAnswers = 0;
let startTime;
let timeTaken = 0;
let countdownInterval;
let questions = [];
let totalQuestions;
let difficultyLevel;
let maxTimePerQuestion;

const operatorsEasy = ['+', '-'];
const operatorsMedium = ['+', '-', '*', '/'];
const operatorsHard = ['*', '/'];

function startGame() {
    // Get difficulty, question count, and max time per question from user input
    difficultyLevel = document.querySelector('input[name="difficulty"]:checked').value;
    totalQuestions = parseInt(document.querySelector('input[name="question-count"]:checked').value);
    maxTimePerQuestion = parseInt(document.querySelector('input[name="max-time"]:checked').value);

    // Hide start screen and show game screen
    document.getElementById('start-container').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';

    // Initialize game and generate questions
    startTime = Date.now();
    generateQuestions();
    showQuestion();
}

function generateQuestions() {
    questions = [];
    const operators = difficultyLevel === 'easy' ? operatorsEasy : (difficultyLevel === 'medium' ? operatorsMedium : operatorsHard);

    for (let i = 0; i < totalQuestions; i++) {
        let num1, num2, question, answer;
        const operator = operators[Math.floor(Math.random() * operators.length)];

        if (operator === '*') {
            num1 = difficultyLevel === 'hard' ? Math.floor(Math.random() * 90) + 10 : Math.floor(Math.random() * 10) + 1;
            num2 = difficultyLevel === 'hard' ? Math.floor(Math.random() * 9) + 1 : Math.floor(Math.random() * 10) + 1;
            question = `${num1} * ${num2}`;
            answer = num1 * num2;
        } else if (operator === '/') {
            num2 = Math.floor(Math.random() * 9) + 1; // One-digit divisor
            answer = difficultyLevel === 'hard' ? Math.floor(Math.random() * 90) + 10 : Math.floor(Math.random() * 10) + 1;
            num1 = answer * num2;
            question = `${num1} / ${num2}`;
        } else {
            num1 = Math.floor(Math.random() * (difficultyLevel === 'easy' ? 10 : 100)) + 1;
            num2 = Math.floor(Math.random() * (difficultyLevel === 'easy' ? 10 : 100)) + 1;
            if (operator === '+') {
                question = `${num1} + ${num2}`;
                answer = num1 + num2;
            } else {
                question = `${num1} - ${num2}`;
                answer = num1 - num2;
            }
        }

        const choices = generateChoices(answer);
        questions.push({ question, answer, choices });
    }
}

function generateChoices(correctAnswer) {
    const choices = new Set([correctAnswer]);
    while (choices.size < 4) {
        choices.add(Math.floor(Math.random() * 200) + 1);  // Random range extended for more variety
    }
    return Array.from(choices).sort(() => Math.random() - 0.5);
}

function showQuestion() {
    if (questionCount < questions.length) {
        startCountdown();
        const currentQuestion = questions[questionCount];
        document.getElementById('question-number').innerText = `Question #${questionCount + 1}`;
        document.getElementById('question').innerText = currentQuestion.question;
        const choicesContainer = document.getElementById('choices');
        choicesContainer.innerHTML = '';
        currentQuestion.choices.forEach(choice => {
            const button = document.createElement('button');
            button.innerText = choice;
            button.onclick = () => checkAnswer(choice);
            choicesContainer.appendChild(button);
        });
    } else {
        endGame();
    }
}

function startCountdown() {
    let timeLeft = maxTimePerQuestion;
    document.getElementById('countdown-timer').innerText = timeLeft;
    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('countdown-timer').innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            endGame(true);
        }
    }, 1000);
}

function checkAnswer(selectedAnswer) {
    const currentQuestion = questions[questionCount];
    clearInterval(countdownInterval);
    if (selectedAnswer === currentQuestion.answer) {
        correctAnswers++;
        questionCount++;
        showQuestion();
    } else {
        endGame(true);
    }
}

function endGame(wrongAnswer = false) {
    const endTime = Date.now();
    timeTaken = Math.round((endTime - startTime) / 1000);
    const score = calculateScore();
    const message = wrongAnswer 
        ? `Incorrect or timeout. Game over! You scored ${score}/100 in ${timeTaken} seconds.`
        : `You completed the game! Final Score: ${score}/100 in ${timeTaken} seconds.`;
    
    document.getElementById('question-number').innerText = '';
    document.getElementById('question').innerText = message;
    document.getElementById('choices').innerHTML = '';
    document.getElementById('countdown').style.display = 'none';
}

function calculateScore() {
    const maxScore = 100;
    const maxTime = maxTimePerQuestion * totalQuestions;  // Optimal time adjusted for total question count
    const timePenalty = Math.max(0, (timeTaken - maxTime) * 0.5);
    return Math.max(0, Math.round((correctAnswers / totalQuestions) * maxScore - timePenalty));
}

function endGame(wrongAnswer = false) {
    const endTime = Date.now();
    timeTaken = Math.round((endTime - startTime) / 1000);
    const score = calculateScore();
    const message = wrongAnswer 
        ? `Incorrect or timeout. Game over! You scored ${score}/100 in ${timeTaken} seconds.`
        : `You completed the game! Final Score: ${score}/100 in ${timeTaken} seconds.`;
    
    document.getElementById('question-number').innerText = '';
    document.getElementById('question').innerText = message;
    document.getElementById('choices').innerHTML = '';
    document.getElementById('countdown').style.display = 'none';

    // Show the "Restart Game" button
    const restartButton = document.createElement('button');
    restartButton.innerText = 'Restart Game';
    restartButton.onclick = restartGame;
    document.getElementById('choices').appendChild(restartButton);
}

function restartGame() {
    // Reset variables
    questionCount = 0;
    correctAnswers = 0;
    timeTaken = 0;
    questions = [];

    // Hide game screen and show start screen
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('start-container').style.display = 'block';

    // Reset countdown display
    document.getElementById('countdown').style.display = 'block';
}
