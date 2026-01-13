// ===== Endoflow MVP - JavaScript =====

// ===== Data Store =====
const userData = {
    name: '',
    age: '',
    email: '',
    whatsapp: '',
    answers: {},
    score: 0,
    riskLevel: '',
    timestamp: null
};

// ===== Questions Configuration =====
const questions = [
    {
        id: 'p1',
        text: 'A sua cólica menstrual (dor durante a menstruação) é forte?',
        emoji: '🤕',
        type: 'scale',
        coefficient: 11,
        cutoff: 6,
        scaleLabels: { min: '0 = Sem dor', max: '10 = Pior dor imaginável' }
    },
    {
        id: 'p2',
        text: 'Você sente dor profunda durante ou após a relação sexual?',
        emoji: '💔',
        type: 'scale',
        coefficient: 6,
        cutoff: 3,
        scaleLabels: { min: '0 = Sem dor', max: '10 = Pior dor imaginável' }
    },
    {
        id: 'p3',
        text: 'Você sente dor ou desconforto intestinal (ex: dor ao evacuar, diarreia, inchaço) forte durante a menstruação?',
        emoji: '😣',
        type: 'scale',
        coefficient: 14,
        cutoff: 5,
        scaleLabels: { min: '0 = Sem desconforto', max: '10 = Desconforto intenso' }
    },
    {
        id: 'p4',
        text: 'Você sente desconforto, dor ao urinar, ou percebe sangue na urina, principalmente durante a menstruação?',
        emoji: '🚽',
        type: 'yesno',
        coefficient: 12,
        cutoff: true
    },
    {
        id: 'p5',
        text: 'Você tem mãe ou irmã com diagnóstico confirmado de endometriose?',
        emoji: '👨‍👩‍👧',
        type: 'yesno',
        coefficient: 14,
        cutoff: true
    },
    {
        id: 'p6',
        text: 'Você está tentando engravidar há 12 meses ou mais sem sucesso, e nunca engravidou antes?',
        emoji: '🤰',
        type: 'yesno',
        coefficient: 6,
        cutoff: true
    },
    {
        id: 'p7',
        text: 'Você sente um cansaço (fadiga) constante, que não melhora com o descanso e atrapalha suas atividades diárias?',
        emoji: '😴',
        type: 'yesno',
        coefficient: 7,
        cutoff: true
    },
    {
        id: 'p8',
        text: 'Seu fluxo menstrual é muito intenso (ex: troca de absorvente a cada 1-2h) ou dura mais de 7 dias?',
        emoji: '🩸',
        type: 'yesno',
        coefficient: 7,
        cutoff: true
    }
];

// ===== State =====
let currentStep = 1;
let currentQuestion = 0;

// ===== DOM Elements =====
const screens = {
    welcome: document.getElementById('screen-welcome'),
    consent: document.getElementById('screen-consent'),
    questionnaire: document.getElementById('screen-questionnaire'),
    results: document.getElementById('screen-results')
};

const progressFill = document.getElementById('progressFill');
const steps = document.querySelectorAll('.step');

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', () => {
    initRegistrationForm();
    initConsentCheckboxes();
    updateProgress();
});

// ===== Registration Form =====
function initRegistrationForm() {
    const form = document.getElementById('registrationForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        userData.name = document.getElementById('name').value.trim();
        userData.age = document.getElementById('age').value;
        userData.email = document.getElementById('email').value.trim();
        userData.whatsapp = document.getElementById('whatsapp').value.trim();
        
        goToStep(2);
    });

    // WhatsApp mask
    const whatsappInput = document.getElementById('whatsapp');
    whatsappInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        
        if (value.length > 6) {
            value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
        } else if (value.length > 2) {
            value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
        } else if (value.length > 0) {
            value = `(${value}`;
        }
        
        e.target.value = value;
    });
}

// ===== Consent =====
function initConsentCheckboxes() {
    const lgpdCheckbox = document.getElementById('lgpdConsent');
    const tcleCheckbox = document.getElementById('tcleConsent');
    const btnStartTest = document.getElementById('btnStartTest');

    const updateButtonState = () => {
        btnStartTest.disabled = !(lgpdCheckbox.checked && tcleCheckbox.checked);
    };

    lgpdCheckbox.addEventListener('change', updateButtonState);
    tcleCheckbox.addEventListener('change', updateButtonState);
}

function toggleConsent(type) {
    const content = document.getElementById(`consent-${type}`);
    const chevron = document.getElementById(`chevron-${type}`);
    
    content.classList.toggle('expanded');
    chevron.classList.toggle('rotated');
}

function startTest() {
    goToStep(3);
    renderQuestion();
}

// ===== Navigation =====
function goToStep(step) {
    currentStep = step;
    
    // Hide all screens
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    
    // Show current screen
    switch(step) {
        case 1:
            screens.welcome.classList.add('active');
            break;
        case 2:
            screens.consent.classList.add('active');
            break;
        case 3:
            screens.questionnaire.classList.add('active');
            break;
        case 4:
            screens.results.classList.add('active');
            break;
    }
    
    updateProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgress() {
    // Update progress bar
    const progressPercent = (currentStep / 4) * 100;
    progressFill.style.width = `${progressPercent}%`;
    
    // Update step indicators
    steps.forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNum < currentStep) {
            step.classList.add('completed');
        } else if (stepNum === currentStep) {
            step.classList.add('active');
        }
    });
}

// ===== Questionnaire =====
function renderQuestion() {
    const container = document.getElementById('questionContainer');
    const question = questions[currentQuestion];
    const questionNum = document.getElementById('questionNumber');
    const progressBar = document.getElementById('questionProgressFill');
    
    // Update progress
    questionNum.textContent = `Pergunta ${currentQuestion + 1} de ${questions.length}`;
    progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
    
    // Render question
    let inputHTML = '';
    
    if (question.type === 'scale') {
        inputHTML = `
            <div class="scale-container">
                <div class="scale-labels">
                    <span>${question.scaleLabels.min}</span>
                    <span>${question.scaleLabels.max}</span>
                </div>
                <div class="scale-input">
                    ${[0,1,2,3,4,5,6,7,8,9,10].map(n => `
                        <button type="button" class="scale-btn ${userData.answers[question.id] === n ? 'selected' : ''}" 
                                onclick="selectScale('${question.id}', ${n})">${n}</button>
                    `).join('')}
                </div>
            </div>
        `;
    } else {
        inputHTML = `
            <div class="yesno-container">
                <button type="button" class="yesno-btn ${userData.answers[question.id] === true ? 'selected' : ''}" 
                        onclick="selectYesNo('${question.id}', true)">Sim</button>
                <button type="button" class="yesno-btn ${userData.answers[question.id] === false ? 'selected' : ''}" 
                        onclick="selectYesNo('${question.id}', false)">Não</button>
            </div>
        `;
    }
    
    container.innerHTML = `
        <div class="question-card">
            <h3><span class="question-emoji">${question.emoji}</span>${currentQuestion + 1}. ${question.text}</h3>
            ${inputHTML}
        </div>
    `;
    
    // Update navigation buttons
    document.getElementById('btnPrevQuestion').disabled = currentQuestion === 0;
    
    const nextBtn = document.getElementById('btnNextQuestion');
    if (currentQuestion === questions.length - 1) {
        nextBtn.textContent = 'Calcular Resultado';
    } else {
        nextBtn.textContent = 'Próximo';
    }
}

function selectScale(questionId, value) {
    userData.answers[questionId] = value;
    
    // Update UI
    document.querySelectorAll('.scale-btn').forEach(btn => {
        btn.classList.remove('selected');
        if (parseInt(btn.textContent) === value) {
            btn.classList.add('selected');
        }
    });
}

function selectYesNo(questionId, value) {
    userData.answers[questionId] = value;
    
    // Update UI
    document.querySelectorAll('.yesno-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.classList.add('selected');
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        renderQuestion();
    }
}

function nextQuestion() {
    const question = questions[currentQuestion];
    
    // Validate answer
    if (userData.answers[question.id] === undefined) {
        alert('Por favor, responda a pergunta antes de continuar.');
        return;
    }
    
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        renderQuestion();
    } else {
        calculateScore();
        showResults();
    }
}

// ===== Score Calculation =====
function calculateScore() {
    let totalScore = 0;
    
    questions.forEach(question => {
        const answer = userData.answers[question.id];
        
        if (question.type === 'scale') {
            if (answer >= question.cutoff) {
                totalScore += question.coefficient;
            }
        } else {
            if (answer === question.cutoff) {
                totalScore += question.coefficient;
            }
        }
    });
    
    userData.score = totalScore;
    userData.timestamp = new Date();
    
    // Determine risk level
    if (totalScore < 18) {
        userData.riskLevel = 'low';
    } else if (totalScore < 25) {
        userData.riskLevel = 'moderate';
    } else {
        userData.riskLevel = 'high';
    }
}

// ===== Results Display =====
function showResults() {
    goToStep(4);
    
    // User name
    document.getElementById('userName').textContent = `Olá, ${userData.name.split(' ')[0]}`;
    
    // Risk card
    const riskCard = document.getElementById('riskCard');
    const riskScore = document.getElementById('riskScore');
    const riskLevel = document.getElementById('riskLevel');
    const riskDescription = document.getElementById('riskDescription');
    
    riskCard.className = 'result-card risk-card ' + userData.riskLevel;
    riskScore.textContent = userData.score;
    
    const riskData = {
        low: {
            level: 'Risco Baixo a Moderado',
            description: 'Sua pontuação indica um risco baixo a moderado para endometriose. Isso não significa que você não tenha a condição, mas os sintomas relatados são menos indicativos.'
        },
        moderate: {
            level: 'Risco Elevado',
            description: 'Sua pontuação indica um risco elevado para endometriose. Recomendamos que você procure um médico especialista para uma avaliação mais detalhada.'
        },
        high: {
            level: 'Risco Muito Elevado',
            description: 'Sua pontuação indica um risco muito elevado para endometriose. É importante que você procure um médico especialista o mais breve possível para investigação diagnóstica.'
        }
    };
    
    riskLevel.textContent = riskData[userData.riskLevel].level;
    riskDescription.textContent = riskData[userData.riskLevel].description;
    
    // Explanation
    renderExplanation();
    
    // Next steps
    renderNextSteps();
    
    // Answers summary
    renderAnswersSummary();
}

function renderExplanation() {
    const container = document.getElementById('explanationContent');
    
    const explanations = {
        low: `
            <p>O Score Endoflow é uma ferramenta de triagem baseada em evidências científicas que avalia sintomas comuns da endometriose. Sua pontuação de <strong>${userData.score} pontos</strong> está abaixo do limiar de 18 pontos.</p>
            <p>Isso significa que, com base nas suas respostas, você apresenta poucos dos sintomas tipicamente associados à endometriose. No entanto, é importante lembrar que:</p>
            <ul>
                <li>A endometriose pode se manifestar de formas diferentes em cada pessoa</li>
                <li>Sintomas podem mudar ao longo do tempo</li>
                <li>Este resultado não exclui a possibilidade de outras condições</li>
            </ul>
            <p>Continue acompanhando seus sintomas e converse com seu médico em suas consultas de rotina.</p>
        `,
        moderate: `
            <p>O Score Endoflow é uma ferramenta de triagem baseada em evidências científicas. Sua pontuação de <strong>${userData.score} pontos</strong> está entre 18 e 24 pontos, indicando um risco elevado.</p>
            <p>Isso significa que você apresenta alguns sintomas que são frequentemente associados à endometriose. Este resultado merece atenção porque:</p>
            <ul>
                <li>Você relatou sintomas que são comuns em mulheres com endometriose</li>
                <li>Uma avaliação médica especializada pode ajudar a esclarecer o quadro</li>
                <li>O diagnóstico precoce pode melhorar significativamente a qualidade de vida</li>
            </ul>
            <p>Recomendamos que você agende uma consulta com um ginecologista, preferencialmente com experiência em endometriose.</p>
        `,
        high: `
            <p>O Score Endoflow é uma ferramenta de triagem baseada em evidências científicas. Sua pontuação de <strong>${userData.score} pontos</strong> está acima de 25 pontos, indicando um risco muito elevado.</p>
            <p>Isso significa que você apresenta vários sintomas fortemente associados à endometriose. Este resultado é importante porque:</p>
            <ul>
                <li>Você relatou múltiplos sintomas característicos da condição</li>
                <li>O diagnóstico precoce pode prevenir complicações e melhorar sua qualidade de vida</li>
                <li>Existem tratamentos eficazes disponíveis que podem ajudar a controlar os sintomas</li>
            </ul>
            <p><strong>Recomendamos fortemente</strong> que você procure um médico especialista o mais breve possível para uma avaliação completa.</p>
        `
    };
    
    container.innerHTML = explanations[userData.riskLevel];
}

function renderNextSteps() {
    const container = document.getElementById('stepsList');
    
    const steps = {
        low: [
            'Continue acompanhando seus sintomas e anote qualquer mudança',
            'Mantenha suas consultas ginecológicas de rotina em dia',
            'Se os sintomas piorarem, procure um médico para reavaliação',
            'Compartilhe este relatório com seu médico na próxima consulta'
        ],
        moderate: [
            'Agende uma consulta com um ginecologista, preferencialmente especialista em endometriose',
            'Leve este relatório para a consulta e discuta seus sintomas em detalhes',
            'O médico pode solicitar exames de imagem (ultrassom transvaginal ou ressonância magnética)',
            'Anote a frequência e intensidade dos seus sintomas até a consulta'
        ],
        high: [
            'Procure um médico especialista em endometriose o mais breve possível',
            'Leve este relatório e descreva detalhadamente seus sintomas',
            'Prepare-se para possíveis exames de imagem e avaliação clínica completa',
            'Não hesite em buscar uma segunda opinião se necessário'
        ]
    };
    
    container.innerHTML = steps[userData.riskLevel].map((step, index) => `
        <div class="step-item">
            <div class="step-number">${index + 1}</div>
            <div class="step-text">${step}</div>
        </div>
    `).join('');
}

function renderAnswersSummary() {
    const container = document.getElementById('answersContent');
    
    const answersHTML = questions.map(question => {
        const answer = userData.answers[question.id];
        let displayAnswer = '';
        let isPositive = false;
        
        if (question.type === 'scale') {
            displayAnswer = `${answer}/10`;
            isPositive = answer >= question.cutoff;
        } else {
            displayAnswer = answer ? 'Sim' : 'Não';
            isPositive = answer === question.cutoff;
        }
        
        return `
            <div class="answer-item">
                <div class="answer-question">${question.emoji} ${question.text}</div>
                <div class="answer-value ${isPositive ? 'positive' : ''}">${displayAnswer}</div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = answersHTML;
}

function toggleAnswers() {
    const content = document.getElementById('answersContent');
    const chevron = document.getElementById('chevron-answers');
    
    content.classList.toggle('expanded');
    chevron.classList.toggle('rotated');
}

// ===== WhatsApp Integration =====
function openWhatsApp() {
    const phoneNumber = '5511999999999'; // Replace with actual number
    
    const riskTexts = {
        low: 'Baixo a Moderado',
        moderate: 'Elevado',
        high: 'Muito Elevado'
    };
    
    const message = encodeURIComponent(
        `Olá Sof.IA! 👋\n\n` +
        `Acabei de fazer o teste de triagem Endoflow e gostaria de conversar sobre meu resultado.\n\n` +
        `📊 *Meu Score:* ${userData.score} pontos\n` +
        `⚠️ *Nível de Risco:* ${riskTexts[userData.riskLevel]}\n\n` +
        `Pode me ajudar a entender melhor o que isso significa?`
    );
    
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
}

// ===== PDF Generation =====
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const riskTexts = {
        low: 'Baixo a Moderado',
        moderate: 'Elevado',
        high: 'Muito Elevado'
    };
    
    const riskColors = {
        low: [76, 175, 80],
        moderate: [255, 152, 0],
        high: [244, 67, 54]
    };
    
    // Header
    doc.setFillColor(233, 30, 99);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Endoflow', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Relatório de Triagem para Suspeita de Endometriose', 105, 30, { align: 'center' });
    
    // User info
    doc.setTextColor(33, 33, 33);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Dados da Paciente', 20, 55);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Nome: ${userData.name}`, 20, 63);
    doc.text(`Idade: ${userData.age} anos`, 20, 70);
    doc.text(`Data do Teste: ${userData.timestamp.toLocaleDateString('pt-BR')} às ${userData.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`, 20, 77);
    
    // Result box
    const riskColor = riskColors[userData.riskLevel];
    doc.setFillColor(riskColor[0], riskColor[1], riskColor[2]);
    doc.roundedRect(20, 85, 170, 35, 3, 3, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('RESULTADO DA TRIAGEM', 105, 97, { align: 'center' });
    
    doc.setFontSize(18);
    doc.text(`Score: ${userData.score} pontos | Risco: ${riskTexts[userData.riskLevel]}`, 105, 112, { align: 'center' });
    
    // Explanation
    doc.setTextColor(33, 33, 33);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('O que isso significa?', 20, 135);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    
    const explanationTexts = {
        low: 'Sua pontuação indica um risco baixo a moderado para endometriose. Isso não significa que você não tenha a condição, mas os sintomas relatados são menos indicativos. Continue acompanhando seus sintomas e mantenha suas consultas de rotina.',
        moderate: 'Sua pontuação indica um risco elevado para endometriose. Recomendamos que você procure um médico especialista para uma avaliação mais detalhada. O diagnóstico precoce pode melhorar significativamente a qualidade de vida.',
        high: 'Sua pontuação indica um risco muito elevado para endometriose. É importante que você procure um médico especialista o mais breve possível para investigação diagnóstica. Existem tratamentos eficazes disponíveis.'
    };
    
    const splitText = doc.splitTextToSize(explanationTexts[userData.riskLevel], 170);
    doc.text(splitText, 20, 143);
    
    // Answers summary
    let yPos = 165;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumo das Respostas', 20, yPos);
    
    yPos += 8;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    
    questions.forEach((question, index) => {
        const answer = userData.answers[question.id];
        let displayAnswer = '';
        
        if (question.type === 'scale') {
            displayAnswer = `${answer}/10`;
        } else {
            displayAnswer = answer ? 'Sim' : 'Não';
        }
        
        const questionText = doc.splitTextToSize(`${index + 1}. ${question.text}`, 140);
        doc.text(questionText, 20, yPos);
        doc.text(displayAnswer, 175, yPos, { align: 'right' });
        
        yPos += questionText.length * 4 + 3;
        
        if (yPos > 270) {
            doc.addPage();
            yPos = 20;
        }
    });
    
    // Disclaimer
    yPos += 10;
    if (yPos > 250) {
        doc.addPage();
        yPos = 20;
    }
    
    doc.setFillColor(255, 248, 225);
    doc.roundedRect(20, yPos, 170, 25, 2, 2, 'F');
    
    doc.setTextColor(255, 152, 0);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('⚠️ AVISO IMPORTANTE', 25, yPos + 7);
    
    doc.setTextColor(102, 102, 102);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    const disclaimerText = 'Este questionário é uma ferramenta de triagem e NÃO constitui diagnóstico médico. O resultado indica apenas uma estimativa de risco baseada em sintomas autorrelatados. Para um diagnóstico definitivo, consulte um médico especialista.';
    const splitDisclaimer = doc.splitTextToSize(disclaimerText, 160);
    doc.text(splitDisclaimer, 25, yPos + 13);
    
    // Footer
    doc.setTextColor(153, 153, 153);
    doc.setFontSize(8);
    doc.text('© 2026 Endolife HealthTech | Endoflow - Triagem para Suspeita de Endometriose', 105, 290, { align: 'center' });
    
    // Save
    const fileName = `Endoflow_Relatorio_${userData.name.split(' ')[0]}_${userData.timestamp.toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
}
