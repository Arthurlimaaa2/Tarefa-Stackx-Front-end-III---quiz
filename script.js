// Dados do quiz
const quizData = [
    {
        question: "Qual é o maior planeta do nosso sistema solar?",
        type: "multiple-choice",
        options: ["Terra", "Marte", "Júpiter", "Saturno"],
        correctAnswer: "Júpiter",
        explanation: "Júpiter é o maior planeta do sistema solar, com um diâmetro de cerca de 142.984 km."
    },
    {
        question: "Qual destes animais NÃO é um mamífero?",
        type: "multiple-choice",
        options: ["Baleia", "Ornitorrinco", "Tubarão", "Morcego"],
        correctAnswer: "Tubarão",
        explanation: "O tubarão é um peixe cartilaginoso, não um mamífero. Os mamíferos têm pelos e amamentam seus filhotes."
    },
    {
        question: "Quantos elementos químicos a tabela periódica possui atualmente?",
        type: "text",
        correctAnswer: "118",
        explanation: "A tabela periódica completa possui 118 elementos, sendo o mais recente o Oganesson (Og), descoberto em 2006."
    },
    {
        question: "Quem pintou a Mona Lisa?",
        type: "multiple-choice",
        options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
        correctAnswer: "Leonardo da Vinci",
        explanation: "A Mona Lisa foi pintada por Leonardo da Vinci entre 1503 e 1506. É uma das obras de arte mais famosas do mundo."
    },
    {
        question: "Em que ano o homem pisou na Lua pela primeira vez?",
        type: "multiple-choice",
        options: ["1965", "1969", "1972", "1975"],
        correctAnswer: "1969",
        explanation: "Neil Armstrong e Buzz Aldrin pisaram na Lua em 20 de julho de 1969, na missão Apollo 11."
    }
];

// Variáveis de estado
let currentQuestion = 0;
let userAnswers = Array(quizData.length).fill(null);
let score = 0;

// Elementos DOM
const quizContainer = document.getElementById('quiz-container');
const resultContainer = document.getElementById('result-container');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const textAnswerContainer = document.getElementById('text-answer-container');
const textAnswer = document.getElementById('text-answer');
const feedback = document.getElementById('feedback');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');
const restartBtn = document.getElementById('restart-btn');
const qNumber = document.getElementById('q-number');
const currentQuestionSpan = document.getElementById('current-question');
const totalQuestionsSpan = document.getElementById('total-questions');
const progressFill = document.getElementById('progress-fill');
const scoreElement = document.getElementById('score');
const resultMessage = document.getElementById('result-message');

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    totalQuestionsSpan.textContent = quizData.length;
    loadQuestion();
    updateProgressBar();
});

// Carregar pergunta atual
function loadQuestion() {
    const question = quizData[currentQuestion];
    qNumber.textContent = currentQuestion + 1;
    questionText.textContent = question.question;
    currentQuestionSpan.textContent = currentQuestion + 1;
    
    // Limpar feedback
    feedback.style.display = 'none';
    
    // Configurar tipo de pergunta
    if (question.type === 'multiple-choice') {
        optionsContainer.innerHTML = '';
        textAnswerContainer.style.display = 'none';
        
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.classList.add('option');
            if (userAnswers[currentQuestion] === option) {
                optionElement.classList.add('selected');
            }
            
            optionElement.innerHTML = `
                <input type="radio" name="answer" id="option${index}" value="${option}">
                <label for="option${index}">${option}</label>
            `;
            
            optionElement.addEventListener('click', () => {
                selectOption(option);
                validateAnswer();
            });
            
            optionsContainer.appendChild(optionElement);
        });
    } else {
        optionsContainer.innerHTML = '';
        textAnswerContainer.style.display = 'block';
        textAnswer.value = userAnswers[currentQuestion] || '';
        textAnswer.addEventListener('input', validateAnswer);
    }
    
    // Atualizar botões
    prevBtn.disabled = currentQuestion === 0;
    nextBtn.style.display = currentQuestion < quizData.length - 1 ? 'block' : 'none';
    submitBtn.style.display = currentQuestion === quizData.length - 1 ? 'block' : 'none';
    validateAnswer();
}

// Selecionar opção
function selectOption(option) {
    // Remover seleção anterior
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Adicionar seleção atual
    event.currentTarget.classList.add('selected');
    userAnswers[currentQuestion] = option;
}

// Validar resposta
function validateAnswer() {
    const question = quizData[currentQuestion];
    let isValid = false;
    
    if (question.type === 'multiple-choice') {
        isValid = userAnswers[currentQuestion] !== null;
    } else {
        isValid = textAnswer.value.trim() !== '';
        if (isValid) {
            userAnswers[currentQuestion] = textAnswer.value.trim();
        }
    }
    
    nextBtn.disabled = !isValid;
    submitBtn.disabled = !isValid;
}

// Navegação
prevBtn.addEventListener('click', () => {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
        updateProgressBar();
    }
});

nextBtn.addEventListener('click', () => {
    if (currentQuestion < quizData.length - 1) {
        currentQuestion++;
        loadQuestion();
        updateProgressBar();
    }
});

// Submeter respostas
submitBtn.addEventListener('click', showResults);

// Reiniciar quiz
restartBtn.addEventListener('click', () => {
    currentQuestion = 0;
    userAnswers = Array(quizData.length).fill(null);
    score = 0;
    quizContainer.style.display = 'block';
    resultContainer.style.display = 'none';
    loadQuestion();
    updateProgressBar();
});

// Mostrar resultados
function showResults() {
    // Calcular pontuação
    quizData.forEach((question, index) => {
        if (userAnswers[index] && userAnswers[index].toString().toLowerCase() === question.correctAnswer.toLowerCase()) {
            score++;
        }
    });
    
    // Atualizar elementos de resultado
    scoreElement.textContent = `${score}/${quizData.length}`;
    
    // Mensagem personalizada baseada na pontuação
    if (score === quizData.length) {
        resultMessage.innerHTML = "🎉 <strong>Perfeito!</strong> Você acertou todas as questões! Seu conhecimento é impressionante!";
    } else if (score >= quizData.length * 0.7) {
        resultMessage.innerHTML = "👍 <strong>Muito bom!</strong> Você demonstrou um excelente conhecimento geral!";
    } else if (score >= quizData.length * 0.5) {
        resultMessage.innerHTML = "😊 <strong>Bom trabalho!</strong> Você tem um conhecimento sólido, mas pode melhorar!";
    } else {
        resultMessage.innerHTML = "📚 <strong>Continue aprendendo!</strong> Algumas áreas precisam de mais atenção, mas você está no caminho certo!";
    }
    
    // Exibir resultado
    quizContainer.style.display = 'none';
    resultContainer.style.display = 'block';
}

// Atualizar barra de progresso
function updateProgressBar() {
    const progress = ((currentQuestion + 1) / quizData.length) * 100;
    progressFill.style.width = `${progress}%`;
}