let questionCount = 0;
let correctAnswers = 0;
let startTime;
let questions = [];
const operators = ['+', '-', '*', '/'];

function startGame() {
    startTime = Date.now();
    generateQuestions();
    showQuestion();
}

function generateQuestions() {
    for (let i = 0; i < 10; i++) {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        const operator = operators[Math.floor(Math.random() * operators.length)];
        let question, answer;
        
        switch (operator) {
            case '+':
                question = `${num1} + ${num2}`;
                answer = num1 + num2;
                break;
            case '-':
                question = `${num1} - ${num2}`;
                answer = num1 - num2;
                break;
            case '*':
                question = `${num1} * ${num2}`;
                answer = num1 * num2;
                break;
            case '/':
                question = `${num1 * num2} / ${num2}`;
                answer = num1;
                break;
        }
        
        const choices = generateChoices(answer);
        questions.push({ question, answer, choices });
    }
}

function generateChoices(correctAnswer) {
    const choices = new Set([correctAnswer]);
    while (choices.size < 4) {
        choices.add(Math.floor(Math.random() * 20) + 1);
    }
    return Array.from(choices).sort(() => Math.random() - 0.5);
}

function showQuestion() {
    if (questionCount < questions.length) {
        const currentQuestion = questions[questionCount];
        document.getElementById('question').innerText = `Question ${questionCount + 1}: ${currentQuestion.question}`;
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

function checkAnswer(selectedAnswer) {
    const currentQuestion = questions[questionCount];
    if (selectedAnswer === currentQuestion.answer) {
        correctAnswers++;
        questionCount++;
        document.getElementById('score').innerText = `Score: ${correctAnswers}/10`;
        showQuestion();
    } else {
        endGame(true);
    }
}

function endGame(wrongAnswer = false) {
    const endTime = Date.now();
    const timeTaken = Math.round((endTime - startTime) / 1000);
    const message = wrongAnswer 
        ? `Incorrect answer. Game over! You scored ${correctAnswers} out of ${questionCount} in ${timeTaken} seconds.`
        : `You completed the game! Final Score: ${correctAnswers} out of 10 in ${timeTaken} seconds.`;
    document.getElementById('question').innerText = message;
    document.getElementById('choices').innerHTML = '';
}
 
startGame();
