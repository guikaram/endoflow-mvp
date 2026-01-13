# Endoflow MVP - Triagem para Suspeita de Endometriose

## Visão Geral

O Endoflow é uma ferramenta de triagem digital para suspeita de endometriose, desenvolvida para o Sistema Único de Saúde (SUS) em parceria com a Endolife HealthTech e o Hub Inova UNIMES.

## Funcionalidades

### 1. Cadastro Inicial
- Nome completo
- Idade
- E-mail
- WhatsApp (com máscara de formatação)

### 2. Consentimento Duplo
- **Política de Privacidade (LGPD)**: Texto resumido com opção de expandir para leitura completa
- **TCLE para Pesquisa**: Termo de consentimento para validação científica

### 3. Questionário de Triagem (Score Endoflow)
8 perguntas baseadas em evidências científicas:
1. Cólica menstrual (EVA 0-10)
2. Dor na relação sexual (EVA 0-10)
3. Sintomas intestinais (EVA 0-10)
4. Sintomas urinários (Sim/Não)
5. Histórico familiar (Sim/Não)
6. Infertilidade primária (Sim/Não)
7. Fadiga crônica (Sim/Não)
8. Sangramento intenso (Sim/Não)

### 4. Tela de Resultado
- **Score e Nível de Risco**: Baixo (<18), Elevado (18-24), Muito Elevado (≥25)
- **Explicação do Resultado**: Texto personalizado por nível de risco
- **Próximos Passos**: Recomendações específicas
- **Resumo das Respostas**: Todas as respostas da usuária
- **Botão WhatsApp**: Abre conversa com texto pré-preenchido
- **Botão Download PDF**: Gera relatório completo em PDF
- **Disclaimer Ético**: Aviso de que não substitui diagnóstico médico

## Tecnologias Utilizadas

- HTML5 semântico
- CSS3 com variáveis e design responsivo
- JavaScript vanilla (ES6+)
- jsPDF para geração de PDF
- Google Fonts (Inter)

## Como Executar

```bash
cd /home/ubuntu/endoflow-mvp
python3 -m http.server 8080
```

Acesse: http://localhost:8080

## Estrutura de Arquivos

```
endoflow-mvp/
├── index.html          # Estrutura HTML
├── styles.css          # Estilos CSS
├── script.js           # Lógica JavaScript
├── assets/
│   ├── logo-endolife.png
│   └── logo-sus-digital.png
└── README.md           # Este arquivo
```

## Cálculo do Score

| Pergunta | Tipo | Coeficiente | Ponto de Corte |
|----------|------|-------------|----------------|
| P1 - Cólica | EVA 0-10 | 11 | ≥ 6 |
| P2 - Dor sexual | EVA 0-10 | 6 | ≥ 3 |
| P3 - Intestinal | EVA 0-10 | 14 | ≥ 5 |
| P4 - Urinário | Sim/Não | 12 | Sim |
| P5 - Histórico | Sim/Não | 14 | Sim |
| P6 - Infertilidade | Sim/Não | 6 | Sim |
| P7 - Fadiga | Sim/Não | 7 | Sim |
| P8 - Sangramento | Sim/Não | 7 | Sim |

**Score Máximo**: 91 pontos

## Classificação de Risco

| Score | Nível | Recomendação |
|-------|-------|--------------|
| < 18 | Baixo a Moderado | Acompanhamento de rotina |
| 18-24 | Elevado | Consulta com especialista |
| ≥ 25 | Muito Elevado | Encaminhamento imediato |

## Conformidade

- **LGPD**: Lei Geral de Proteção de Dados
- **WCAG 2.1**: Acessibilidade web
- **eMAG**: Modelo de Acessibilidade em Governo Eletrônico

## Licença

© 2026 Endolife HealthTech. Todos os direitos reservados.
