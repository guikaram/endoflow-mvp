// ===== Endoflow MVP - JavaScript =====

// ===== Data Store =====
const userData = {
    name: '',
    age: '',
    email: '',
    whatsapp: '',
    cep: '',
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
        scaleLabels: { min: '0 = Sem dor', max: '10 = Pior dor imaginável' },
        domain: 'Dismenorreia'
    },
    {
        id: 'p2',
        text: 'Você sente dor profunda durante ou após a relação sexual?',
        emoji: '💔',
        type: 'scale',
        coefficient: 6,
        cutoff: 3,
        scaleLabels: { min: '0 = Sem dor', max: '10 = Pior dor imaginável' },
        domain: 'Dispareunia'
    },
    {
        id: 'p3',
        text: 'Você sente dor ou desconforto intestinal (ex: dor ao evacuar, diarreia, inchaço) forte durante a menstruação?',
        emoji: '😣',
        type: 'scale',
        coefficient: 14,
        cutoff: 5,
        scaleLabels: { min: '0 = Sem desconforto', max: '10 = Desconforto intenso' },
        domain: 'Sintomas Intestinais'
    },
    {
        id: 'p4',
        text: 'Você sente desconforto, dor ao urinar, ou percebe sangue na urina, principalmente durante a menstruação?',
        emoji: '🚽',
        type: 'yesno',
        coefficient: 12,
        cutoff: true,
        domain: 'Sintomas Urinários'
    },
    {
        id: 'p5',
        text: 'Você tem mãe ou irmã com diagnóstico confirmado de endometriose?',
        emoji: '👨‍👩‍👧',
        type: 'yesno',
        coefficient: 14,
        cutoff: true,
        domain: 'Histórico Familiar'
    },
    {
        id: 'p6',
        text: 'Você está tentando engravidar há 12 meses ou mais sem sucesso, e nunca engravidou antes?',
        emoji: '🤰',
        type: 'yesno',
        coefficient: 6,
        cutoff: true,
        domain: 'Infertilidade Primária'
    },
    {
        id: 'p7',
        text: 'Você sente um cansaço (fadiga) constante, que não melhora com o descanso e atrapalha suas atividades diárias?',
        emoji: '😴',
        type: 'yesno',
        coefficient: 7,
        cutoff: true,
        domain: 'Fadiga Crônica'
    },
    {
        id: 'p8',
        text: 'Seu fluxo menstrual é muito intenso (ex: troca de absorvente a cada 1-2h) ou dura mais de 7 dias?',
        emoji: '🩸',
        type: 'yesno',
        coefficient: 7,
        cutoff: true,
        domain: 'Sangramento Intenso'
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
        userData.cep = document.getElementById('cep').value.trim();
        
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

    // CEP mask
    const cepInput = document.getElementById('cep');
    cepInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 8) value = value.slice(0, 8);
        
        if (value.length > 5) {
            value = `${value.slice(0, 5)}-${value.slice(5)}`;
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
    
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    
    switch(step) {
        case 1: screens.welcome.classList.add('active'); break;
        case 2: screens.consent.classList.add('active'); break;
        case 3: screens.questionnaire.classList.add('active'); break;
        case 4: screens.results.classList.add('active'); break;
    }
    
    updateProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgress() {
    const progressPercent = (currentStep / 4) * 100;
    progressFill.style.width = `${progressPercent}%`;
    
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
    
    questionNum.textContent = `Pergunta ${currentQuestion + 1} de ${questions.length}`;
    progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
    
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
                        onclick="selectYesNo('${question.id}', true, this)">Sim</button>
                <button type="button" class="yesno-btn ${userData.answers[question.id] === false ? 'selected' : ''}" 
                        onclick="selectYesNo('${question.id}', false, this)">Não</button>
            </div>
        `;
    }
    
    container.innerHTML = `
        <div class="question-card">
            <div class="question-domain">${question.domain}</div>
            <h3><span class="question-emoji">${question.emoji}</span>${currentQuestion + 1}. ${question.text}</h3>
            ${inputHTML}
        </div>
    `;
    
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
    
    document.querySelectorAll('.scale-btn').forEach(btn => {
        btn.classList.remove('selected');
        if (parseInt(btn.textContent) === value) {
            btn.classList.add('selected');
        }
    });
}

function selectYesNo(questionId, value, element) {
    userData.answers[questionId] = value;
    
    document.querySelectorAll('.yesno-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    element.classList.add('selected');
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        renderQuestion();
    }
}

function nextQuestion() {
    const question = questions[currentQuestion];
    
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
    
    if (totalScore < 18) {
        userData.riskLevel = 'low';
    } else if (totalScore < 25) {
        userData.riskLevel = 'moderate';
    } else {
        userData.riskLevel = 'high';
    }
}

// ===== Helper: check positive answers =====
function getPositiveAnswers() {
    const positives = {};
    questions.forEach(q => {
        const answer = userData.answers[q.id];
        if (q.type === 'scale') {
            positives[q.id] = answer >= q.cutoff;
        } else {
            positives[q.id] = answer === true;
        }
    });
    return positives;
}

// ===== Results Display =====
function showResults() {
    goToStep(4);
    
    const firstName = userData.name.split(' ')[0];
    document.getElementById('userName').textContent = `Olá, ${firstName}`;
    document.getElementById('resultsDate').textContent = `Relatório gerado em ${userData.timestamp.toLocaleDateString('pt-BR')} às ${userData.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    
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
    
    // Render all sections
    renderExplanation();
    renderDifferentialDiagnosis();
    renderNextSteps();
    renderDoctorGuidance();
    renderAnswersSummary();
}

function renderExplanation() {
    const container = document.getElementById('explanationContent');
    const positives = getPositiveAnswers();
    const hasBleeding = positives['p8'];
    const hasUrinary = positives['p4'];
    const hasIntestinal = positives['p3'];
    const hasFamilyHistory = positives['p5'];
    const hasInfertility = positives['p6'];
    
    let specificFindings = '';
    
    // Build personalized findings based on answers
    if (positives['p1']) {
        specificFindings += `<li>Você relatou <strong>dor menstrual significativa (dismenorreia)</strong>, um dos sintomas mais frequentes da <strong>endometriose</strong>. Dores menstruais intensas que limitam suas atividades diárias merecem investigação médica.</li>`;
    }
    if (positives['p2']) {
        specificFindings += `<li>A <strong>dor durante a relação sexual (dispareunia profunda)</strong> que você relatou pode estar associada a focos de <strong>endometriose</strong> em ligamentos uterossacros ou no fundo de saco de Douglas.</li>`;
    }
    if (hasIntestinal) {
        specificFindings += `<li>Os <strong>sintomas intestinais cíclicos</strong> que você descreveu podem indicar <strong>endometriose intestinal</strong>, mas também podem estar relacionados a outras condições como <strong>Síndrome do Intestino Irritável (SII)</strong> ou <strong>colites</strong>.</li>`;
    }
    if (hasUrinary) {
        specificFindings += `<li>Os <strong>sintomas urinários</strong> relatados podem sugerir <strong>endometriose do trato urinário</strong>, mas também devem ser diferenciados de <strong>cistite intersticial</strong>, <strong>infecções urinárias recorrentes</strong> e outras <strong>doenças urológicas</strong>.</li>`;
    }
    if (hasFamilyHistory) {
        specificFindings += `<li>O <strong>histórico familiar positivo</strong> é um fator de risco importante. Mulheres com parentes de primeiro grau com <strong>endometriose</strong> têm risco até 7 vezes maior de desenvolver a doença.</li>`;
    }
    if (hasInfertility) {
        specificFindings += `<li>A <strong>infertilidade primária</strong> que você relatou pode estar associada à <strong>endometriose</strong>, que é responsável por até 50% dos casos de dificuldade para engravidar.</li>`;
    }
    if (positives['p7']) {
        specificFindings += `<li>A <strong>fadiga crônica</strong> é um sintoma frequentemente subestimado, mas está presente em até 50% das mulheres com <strong>endometriose</strong>. Pode também estar relacionada a <strong>anemia</strong>, <strong>hipotireoidismo</strong> ou <strong>fibromialgia</strong>.</li>`;
    }
    if (hasBleeding) {
        specificFindings += `<li>O <strong>sangramento menstrual intenso (menorragia)</strong> que você relatou, além de estar associado à <strong>endometriose</strong>, é um dos principais sintomas da <strong>adenomiose</strong> — uma condição em que o tecido endometrial cresce dentro da parede muscular do útero. A <strong>adenomiose</strong> frequentemente coexiste com a <strong>endometriose</strong> e também pode causar dor pélvica e cólicas intensas. Outras causas possíveis incluem <strong>miomas uterinos</strong> e <strong>distúrbios de coagulação</strong>.</li>`;
    }
    
    const explanations = {
        low: `
            <p>O Score Endoflow é uma ferramenta de triagem baseada em evidências científicas que avalia sintomas comuns da <strong>endometriose</strong>. Sua pontuação de <strong>${userData.score} pontos</strong> está abaixo do limiar de 18 pontos, o que sugere um risco menor.</p>
            ${specificFindings ? `<p>Com base nas suas respostas, identificamos os seguintes pontos de atenção:</p><ul class="findings-list">${specificFindings}</ul>` : ''}
            <p>Mesmo com risco baixo a moderado, é importante lembrar que:</p>
            <ul>
                <li>A <strong>endometriose</strong> pode se manifestar de formas diferentes em cada pessoa</li>
                <li>Sintomas podem mudar ao longo do tempo</li>
                <li>Este resultado não exclui a possibilidade de outras condições ginecológicas</li>
            </ul>
            <p>Continue acompanhando seus sintomas e converse com seu médico em suas consultas de rotina.</p>
        `,
        moderate: `
            <p>O Score Endoflow é uma ferramenta de triagem baseada em evidências científicas. Sua pontuação de <strong>${userData.score} pontos</strong> está entre 18 e 24 pontos, indicando um <strong>risco elevado</strong> para <strong>endometriose</strong>.</p>
            <p>Com base nas suas respostas, identificamos os seguintes achados relevantes:</p>
            <ul class="findings-list">${specificFindings || '<li>Você apresentou uma combinação de sintomas que, juntos, elevam o risco para endometriose.</li>'}</ul>
            <p>Este resultado merece atenção porque o diagnóstico precoce da <strong>endometriose</strong> pode melhorar significativamente a qualidade de vida e prevenir complicações a longo prazo.</p>
        `,
        high: `
            <p>O Score Endoflow é uma ferramenta de triagem baseada em evidências científicas. Sua pontuação de <strong>${userData.score} pontos</strong> está acima de 25 pontos, indicando um <strong>risco muito elevado</strong> para <strong>endometriose</strong>.</p>
            <p>Com base nas suas respostas, identificamos os seguintes achados importantes:</p>
            <ul class="findings-list">${specificFindings || '<li>Você apresentou múltiplos sintomas fortemente associados à endometriose.</li>'}</ul>
            <p><strong>Recomendamos fortemente</strong> que você procure um médico especialista o mais breve possível. O diagnóstico precoce da <strong>endometriose</strong> é fundamental para iniciar o tratamento adequado e preservar sua qualidade de vida e fertilidade.</p>
        `
    };
    
    container.innerHTML = explanations[userData.riskLevel];
}

function renderDifferentialDiagnosis() {
    const container = document.getElementById('differentialContent');
    const card = document.getElementById('differentialCard');
    const positives = getPositiveAnswers();
    
    let differentials = [];
    
    if (positives['p3']) {
        differentials.push({
            condition: 'Síndrome do Intestino Irritável (SII) e Colites',
            description: 'Sintomas intestinais cíclicos podem mimetizar ou coexistir com a endometriose. A SII e as colites inflamatórias (como Doença de Crohn e Retocolite Ulcerativa) podem causar sintomas semelhantes.'
        });
    }
    if (positives['p4']) {
        differentials.push({
            condition: 'Doenças Urológicas',
            description: 'Cistite intersticial, infecções urinárias recorrentes e outras condições do trato urinário podem apresentar sintomas semelhantes aos da endometriose vesical.'
        });
    }
    if (positives['p8']) {
        differentials.push({
            condition: 'Adenomiose',
            description: 'Condição em que o tecido endometrial cresce na parede muscular do útero. Frequentemente coexiste com a endometriose e causa sangramento intenso, cólicas e aumento do volume uterino.'
        });
        differentials.push({
            condition: 'Miomas Uterinos',
            description: 'Tumores benignos do útero que podem causar sangramento menstrual intenso, dor pélvica e sensação de pressão.'
        });
    }
    if (positives['p7']) {
        differentials.push({
            condition: 'Hipotireoidismo e Anemia',
            description: 'Fadiga crônica pode estar relacionada a distúrbios da tireoide ou anemia por deficiência de ferro, especialmente em mulheres com sangramento menstrual intenso.'
        });
    }
    if (positives['p6']) {
        differentials.push({
            condition: 'Outras Causas de Infertilidade',
            description: 'Distúrbios ovulatórios (como Síndrome dos Ovários Policísticos), alterações tubárias e fatores masculinos também devem ser investigados.'
        });
    }
    if (positives['p1'] || positives['p2']) {
        differentials.push({
            condition: 'Dor Pélvica Crônica de Outras Causas',
            description: 'Condições como aderências pélvicas, neuropatia pudenda, fibromialgia e disfunções do assoalho pélvico podem causar sintomas semelhantes.'
        });
    }
    
    if (differentials.length > 0) {
        card.style.display = 'block';
        
        let html = `<p>Com base nos seus sintomas, é importante que seu médico também considere as seguintes condições que podem apresentar sintomas semelhantes ou coexistir com a <strong>endometriose</strong>:</p>`;
        html += '<div class="differential-list">';
        differentials.forEach(d => {
            html += `
                <div class="differential-item">
                    <h4><strong>${d.condition}</strong></h4>
                    <p>${d.description}</p>
                </div>
            `;
        });
        html += '</div>';
        html += `<p class="differential-note"><em>Estas condições não são mutuamente exclusivas — é possível ter mais de uma ao mesmo tempo. Somente um profissional de saúde pode fazer o diagnóstico correto após avaliação clínica e exames complementares.</em></p>`;
        
        container.innerHTML = html;
    }
}

function renderNextSteps() {
    const container = document.getElementById('stepsList');
    const positives = getPositiveAnswers();
    
    const steps = {
        low: [
            'Continue acompanhando seus sintomas e anote qualquer mudança em um diário menstrual',
            'Mantenha suas consultas ginecológicas de rotina em dia (pelo menos uma vez ao ano)',
            'Se os sintomas piorarem ou novos sintomas surgirem, procure um médico para reavaliação',
            'Compartilhe este relatório com seu médico na próxima consulta para que fique registrado no seu prontuário',
            'Cuide da sua saúde integral: alimentação equilibrada, exercícios regulares e manejo do estresse'
        ],
        moderate: [
            'Agende uma consulta com um ginecologista, preferencialmente com experiência em endometriose',
            'Imprima ou envie este relatório para o médico antes da consulta — ele contém informações úteis para a avaliação',
            'Comece um diário de sintomas anotando: datas, intensidade da dor (0-10), localização e relação com o ciclo menstrual',
            'O médico poderá solicitar exames de imagem como ultrassom transvaginal com preparo intestinal ou ressonância magnética da pelve',
            'Não hesite em buscar uma segunda opinião caso sinta que seus sintomas não estão sendo levados a sério'
        ],
        high: [
            'Procure um médico especialista em endometriose o mais breve possível — a demora no diagnóstico pode agravar a condição',
            'Leve este relatório impresso ou digital para a consulta e descreva detalhadamente cada sintoma',
            'Prepare-se para possíveis exames: ultrassom transvaginal com preparo intestinal, ressonância magnética da pelve e exames laboratoriais',
            'Anote todas as suas dúvidas antes da consulta para não esquecer de perguntar ao médico',
            'Se necessário, busque uma segunda opinião — você tem esse direito e é uma prática recomendada em casos complexos',
            'Considere buscar apoio emocional: grupos de apoio para mulheres com endometriose podem ajudar no enfrentamento'
        ]
    };
    
    container.innerHTML = steps[userData.riskLevel].map((step, index) => `
        <div class="step-item">
            <div class="step-number">${index + 1}</div>
            <div class="step-text">${step}</div>
        </div>
    `).join('');
}

function renderDoctorGuidance() {
    const container = document.getElementById('doctorContent');
    const positives = getPositiveAnswers();
    
    let symptomsToMention = [];
    if (positives['p1']) symptomsToMention.push('dor menstrual intensa');
    if (positives['p2']) symptomsToMention.push('dor na relação sexual');
    if (positives['p3']) symptomsToMention.push('sintomas intestinais cíclicos');
    if (positives['p4']) symptomsToMention.push('sintomas urinários');
    if (positives['p5']) symptomsToMention.push('histórico familiar de endometriose');
    if (positives['p6']) symptomsToMention.push('dificuldade para engravidar');
    if (positives['p7']) symptomsToMention.push('fadiga crônica');
    if (positives['p8']) symptomsToMention.push('sangramento menstrual intenso');
    
    let html = `
        <div class="doctor-intro">
            <p>Sabemos que muitas mulheres enfrentam dificuldades para serem ouvidas em consultas médicas quando relatam sintomas de dor pélvica e menstrual. Este relatório foi criado para <strong>fortalecer a sua voz</strong> e ajudar na comunicação com seu médico.</p>
        </div>
        
        <div class="doctor-tips">
            <h4>Dicas para a consulta:</h4>
            <div class="doctor-tip-item">
                <span class="tip-icon">📋</span>
                <div>
                    <strong>Apresente este relatório</strong>
                    <p>Mostre este documento ao seu médico logo no início da consulta. Diga: <em>"Fiz uma triagem validada cientificamente e gostaria de discutir os resultados."</em></p>
                </div>
            </div>
            <div class="doctor-tip-item">
                <span class="tip-icon">🗣️</span>
                <div>
                    <strong>Descreva seus sintomas com clareza</strong>
                    <p>Com base nas suas respostas, os principais pontos a mencionar são: ${symptomsToMention.length > 0 ? '<strong>' + symptomsToMention.join(', ') + '</strong>' : 'seus sintomas gerais'}.</p>
                </div>
            </div>
            <div class="doctor-tip-item">
                <span class="tip-icon">📅</span>
                <div>
                    <strong>Relate a cronologia</strong>
                    <p>Informe há quanto tempo os sintomas começaram, se pioram durante a menstruação e como afetam sua rotina diária, trabalho e relacionamentos.</p>
                </div>
            </div>
            <div class="doctor-tip-item">
                <span class="tip-icon">❓</span>
                <div>
                    <strong>Faça perguntas</strong>
                    <p>Pergunte ao médico: <em>"Existe a possibilidade de eu ter endometriose${positives['p8'] ? ' ou adenomiose' : ''}?"</em>, <em>"Quais exames são indicados para investigar?"</em> e <em>"Quais são as opções de tratamento?"</em></p>
                </div>
            </div>
            <div class="doctor-tip-item">
                <span class="tip-icon">🛡️</span>
                <div>
                    <strong>Seus direitos como paciente</strong>
                    <p>Você tem direito a ser ouvida, a receber explicações claras sobre seu diagnóstico e tratamento, e a buscar uma segunda opinião. Se sentir que seus sintomas estão sendo minimizados, você pode e deve procurar outro profissional.</p>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
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
            <div class="answer-item ${isPositive ? 'answer-positive' : ''}">
                <div class="answer-question">
                    <span class="answer-domain">${question.domain}</span>
                    ${question.emoji} ${question.text}
                </div>
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
    
    const positives = getPositiveAnswers();
    let mainSymptoms = [];
    if (positives['p1']) mainSymptoms.push('dor menstrual intensa');
    if (positives['p2']) mainSymptoms.push('dor na relação sexual');
    if (positives['p3']) mainSymptoms.push('sintomas intestinais');
    if (positives['p4']) mainSymptoms.push('sintomas urinários');
    if (positives['p8']) mainSymptoms.push('sangramento intenso');
    
    const message = encodeURIComponent(
        `Olá Sof.IA! 👋\n\n` +
        `Acabei de fazer o teste de triagem Endoflow e gostaria de conversar sobre meu resultado.\n\n` +
        `📊 *Meu Score:* ${userData.score} pontos\n` +
        `⚠️ *Nível de Risco:* ${riskTexts[userData.riskLevel]}\n` +
        `${mainSymptoms.length > 0 ? `🔍 *Principais sintomas:* ${mainSymptoms.join(', ')}\n` : ''}` +
        `\nPode me ajudar a entender melhor o que isso significa e quais os próximos passos?`
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
    
    const positives = getPositiveAnswers();
    
    // Header
    doc.setFillColor(92, 10, 42);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Endoflow', 105, 18, { align: 'center' });
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Relatório de Triagem para Suspeita de Endometriose', 105, 27, { align: 'center' });
    
    doc.setFontSize(8);
    doc.text('Endolife HealthTech | Hub Inova UNIMES | SUS Digital', 105, 35, { align: 'center' });
    
    // User info
    doc.setTextColor(33, 33, 33);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Dados da Paciente', 20, 52);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Nome: ${userData.name}`, 20, 60);
    doc.text(`Idade: ${userData.age} anos`, 20, 67);
    doc.text(`CEP: ${userData.cep}`, 120, 60);
    doc.text(`Data: ${userData.timestamp.toLocaleDateString('pt-BR')} às ${userData.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`, 120, 67);
    
    // Divider
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 72, 190, 72);
    
    // Result box
    const riskColor = riskColors[userData.riskLevel];
    doc.setFillColor(riskColor[0], riskColor[1], riskColor[2]);
    doc.roundedRect(20, 76, 170, 30, 3, 3, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('RESULTADO DA TRIAGEM', 105, 88, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text(`Score: ${userData.score} pontos | Risco: ${riskTexts[userData.riskLevel]}`, 105, 100, { align: 'center' });
    
    // Explanation
    let yPos = 118;
    doc.setTextColor(33, 33, 33);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('O que isso significa?', 20, yPos);
    
    yPos += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    
    let explanationParts = [];
    explanationParts.push(`Sua pontuacao de ${userData.score} pontos indica risco ${riskTexts[userData.riskLevel].toLowerCase()} para endometriose.`);
    
    if (positives['p1']) explanationParts.push('Voce relatou dor menstrual significativa (dismenorreia).');
    if (positives['p2']) explanationParts.push('A dor durante a relacao sexual (dispareunia) pode estar associada a endometriose.');
    if (positives['p3']) explanationParts.push('Sintomas intestinais ciclicos podem indicar endometriose intestinal ou condicoes como SII e colites.');
    if (positives['p4']) explanationParts.push('Sintomas urinarios devem ser diferenciados de cistite intersticial e doencas urologicas.');
    if (positives['p5']) explanationParts.push('Historico familiar positivo aumenta o risco em ate 7 vezes.');
    if (positives['p6']) explanationParts.push('A infertilidade pode estar associada a endometriose (ate 50% dos casos).');
    if (positives['p7']) explanationParts.push('Fadiga cronica esta presente em ate 50% das mulheres com endometriose.');
    if (positives['p8']) explanationParts.push('Sangramento intenso pode indicar adenomiose, condicao que frequentemente coexiste com endometriose.');
    
    const fullExplanation = explanationParts.join(' ');
    const splitText = doc.splitTextToSize(fullExplanation, 170);
    doc.text(splitText, 20, yPos);
    yPos += splitText.length * 4 + 6;
    
    // Answers summary
    if (yPos > 240) { doc.addPage(); yPos = 20; }
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
            displayAnswer = answer ? 'Sim' : 'Nao';
        }
        
        if (yPos > 270) { doc.addPage(); yPos = 20; }
        
        const questionText = doc.splitTextToSize(`${index + 1}. [${question.domain}] ${question.text}`, 140);
        doc.text(questionText, 20, yPos);
        doc.text(displayAnswer, 175, yPos, { align: 'right' });
        
        yPos += questionText.length * 4 + 3;
    });
    
    // Doctor guidance
    yPos += 6;
    if (yPos > 240) { doc.addPage(); yPos = 20; }
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Como Informar Este Relatorio ao Seu Medico', 20, yPos);
    
    yPos += 8;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    
    const doctorText = 'Apresente este documento ao seu medico no inicio da consulta. Descreva seus sintomas com clareza, informe ha quanto tempo eles ocorrem e como afetam sua rotina. Voce tem direito a ser ouvida e a buscar uma segunda opiniao se necessario.';
    const splitDoctor = doc.splitTextToSize(doctorText, 170);
    doc.text(splitDoctor, 20, yPos);
    yPos += splitDoctor.length * 4 + 6;
    
    // Disclaimer
    if (yPos > 250) { doc.addPage(); yPos = 20; }
    
    doc.setFillColor(255, 248, 225);
    doc.roundedRect(20, yPos, 170, 28, 2, 2, 'F');
    
    doc.setTextColor(255, 152, 0);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('AVISO IMPORTANTE', 25, yPos + 7);
    
    doc.setTextColor(102, 102, 102);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    const disclaimerText = 'Este questionario e uma ferramenta de triagem e NAO constitui diagnostico medico. O resultado indica apenas uma estimativa de risco baseada em sintomas autorrelatados. Para um diagnostico definitivo, consulte um medico especialista. Este relatorio foi gerado pelo Endoflow (Endolife HealthTech / Hub Inova UNIMES) e seus dados sao protegidos pela LGPD.';
    const splitDisclaimer = doc.splitTextToSize(disclaimerText, 160);
    doc.text(splitDisclaimer, 25, yPos + 13);
    
    // Footer
    doc.setTextColor(153, 153, 153);
    doc.setFontSize(7);
    doc.text('© 2026 Endolife HealthTech | Endoflow - Triagem para Suspeita de Endometriose | SUS Digital', 105, 290, { align: 'center' });
    
    // Save
    const fileName = `Endoflow_Relatorio_${userData.name.split(' ')[0]}_${userData.timestamp.toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
}
