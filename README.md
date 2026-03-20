# ◈ FinAccess AI

> **AI-powered financial inclusion for India's informal economy — voice-first, multilingual, explainable.**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Languages](https://img.shields.io/badge/Languages-7_Indian-orange?style=flat-square)](#language-support)
[![Voice](https://img.shields.io/badge/Voice-Web_Speech_API-blue?style=flat-square)](#voice--accessibility)

---

## The Problem

**190 million Indians** are excluded from formal credit — not because they're unreliable, but because they have no credit history. A gig delivery rider who repays ₹500 every week has better financial discipline than many salaried borrowers — but traditional scoring systems give them a zero.

FinAccess AI fixes this by scoring people on their **actual behaviour**: income patterns, repayment consistency, expense ratios — not salary slips. And because 40% of our target users are semi-literate or illiterate, the entire experience is **voice-first**.

---

## Live Demo

> Open the app → choose your portal → speak or tap your questions in your language.

**User Portal** — credit scoring, product matching, risk guidance, AI advisor  
**Bank Portal** — applicant queue, fairness audit, batch scoring, approval workflow

---

## Features

### 🧠 AI & ML Stack

| Component | Technology | What it does |
|-----------|-----------|--------------|
| Credit Scoring | XGBoost + SHAP | Explainable credit score from behavioural data |
| Risk Forecasting | LSTM (simulated) | 12-month financial distress prediction |
| Repayment Learning | Reinforcement Learning | Adapts advice to user's repayment behaviour |
| Economic Constraints | FINNs | Hard financial rules baked into the model loss function |
| Fairness Auditing | Fairlearn | Bias detection across demographic groups |
| AI Advisor | Claude AI / Mock engine | Plain-language financial guidance |

### 🎤 Voice & Accessibility

- **Tap-to-speak mic button** on every screen — no typing required
- **Auto text-to-speech** — every AI response is read aloud automatically
- **Live transcript** shown as the user speaks
- **Animated waveform** feedback during listening and speaking
- **Persistent header mic** — one tap from anywhere in the app
- Works in **Chrome** on Android and desktop (Web Speech API)
- Graceful fallback message if browser doesn't support voice

### 🌐 Language Support

| Language | Code | Speech Recognition |
|----------|------|--------------------|
| English | `en` | `en-IN` |
| Hindi | `hi` | `hi-IN` |
| Tamil | `ta` | `ta-IN` |
| Telugu | `te` | `te-IN` |
| Bengali | `bn` | `bn-IN` |
| Kannada | `kn` | `kn-IN` |
| Marathi | `mr` | `mr-IN` |

All UI labels, AI questions, and mock AI responses are fully localised in all 7 languages.

### 👤 User Portal

- **Credit Score Gauge** — animated arc with Poor / Fair / Good / Excellent rating
- **Live Simulation Sliders** — drag income and expenses to see score and risk update in real time
- **Repayment History Calendar** — 12-month ✓/✗ visual
- **SHAP Feature Impact Chart** — see exactly why your score is what it is
- **Fairness Dashboard** — approval rates across gig workers, salaried, rural, women borrowers
- **12-Month Risk Trend** — bar chart with threshold warning
- **Risk Driver Cards** — plain-language explanation of what's pushing risk up
- **Product Matching** — ranked government loan schemes with eligibility bars
  - PM SVANidhi (Micro Loan)
  - Jan Samarth (Personal Loan)
  - PM Jeevan Jyoti (Insurance)
  - MUDRA Yojana (Subsidy)
- **RL Agent History** — repayment episode log with reward tracking
- **FINNs Constraint Checker** — real-time pass/warn status for economic rules

### 🏦 Bank Officer Portal

- **Portfolio Overview** — total applicants, active loans, avg score, portfolio risk
- **Risk Distribution Bar** — Low / Medium / High / Critical breakdown
- **Applicant Queue** — approve, flag, or reject with one click
- **Batch Score Upload** — CSV drop zone for bulk scoring
- **Fairness Audit** — approval rates and score disparity by group with bias mitigation status
- **Regulatory Compliance** — RBI Fair Practices Code, DPDP Act 2023, Equal Credit Opportunity
- **Federated Learning Status** — simulated multi-bank training rounds
- **Approval Workflow Pipeline** — step-by-step from AI scoring to disbursement
- **Audit Trail** — timestamped officer action log

---

## Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** or **yarn**
- **Chrome** (for voice features)

### Installation

```bash
# Clone the repo
git clone https://github.com/your-username/finaccess-ai.git
cd finaccess-ai

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in Chrome.

### Using with Real AI (Claude API)

By default the app uses a **keyword-matched mock AI** so it works without any API key. To enable real Claude AI responses:

1. Get an API key from [console.anthropic.com](https://console.anthropic.com)
2. Replace the `askAI` function in `App.jsx`:

```js
async function askAI(prompt) {
  setAiLoading(true); setAiResponse(""); voiceEngine.stopSpeaking();
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": "YOUR_API_KEY",           // ← add your key
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 800,
      system: `You are a financial AI advisor for FinAccess...`,
      messages: [{ role: "user", content: prompt }]
    })
  });
  const d = await res.json();
  setAiResponse(d.content?.map(c => c.text || "").join("") || "Unable to respond.");
  setAiLoading(false);
}
```

> ⚠️ Never commit your API key. Use environment variables in production.

---

## How the Mock AI Works

The built-in mock engine matches keywords from typed or spoken questions and returns personalised responses using the user's **live profile data** (income, expenses, score, risk):

| You ask about | Keywords matched | Response |
|---|---|---|
| Credit score | `credit`, `score`, `improve`, `better` | Score-specific advice with ₹ targets |
| Financial risk | `risk`, `distress`, `danger`, `worried` | Risk % with savings recommendation |
| Loans | `loan`, `which`, `best`, `apply`, `mudra` | SVANidhi / Jan Samarth recommendation |
| Savings | `save`, `budget`, `spend`, `expenses` | Expense ratio breakdown |
| Repayments | `repay`, `missed`, `EMI`, `default` | History-based coaching |
| Technology | `FINN`, `AI`, `model`, `XGBoost` | Plain-language tech explanation |
| Anything else | — | Full profile summary + prompt to ask more |

All responses dynamically use the user's **current slider values**, so moving the income/expense sliders changes the advice.

---

## Architecture

```
finaccess-ai/
├── src/
│   └── App.jsx              # Single-file React app (all components inline)
├── public/
├── index.html
├── package.json
└── README.md
```

### Key components

| Component | Description |
|-----------|-------------|
| `useVoiceEngine(lang)` | Custom hook — Web Speech API for STT + TTS, language-aware |
| `VoiceMicButton` | Big accessibility mic button with pulse animation and live transcript |
| `WaveformBars` | Animated equaliser bars for listening/speaking feedback |
| `SpeakButton` | Inline 🔊 button to re-read AI responses |
| `ScoreGauge` | SVG credit score arc with animated needle |
| `SparkLine` | Lightweight SVG sparkline for metric cards |
| `ShapBar` | Horizontal SHAP feature impact bars |
| `AIAdvisorBlock` | Full AI advisor panel (voice + chips + response + TTS) |

### State management

All state is local React (`useState`). The app is fully self-contained — no Redux, no context, no backend required for the demo.

### Voice engine

```
User taps mic
    → SpeechRecognition starts (lang = e.g. hi-IN)
    → interim transcript shown live
    → final transcript → askAI(transcript)
    → mock/real AI returns response
    → SpeechSynthesisUtterance reads it aloud
    → waveform animates during playback
```

---

## Financial Models (Simulated)

### Credit Score Formula (live simulation)
```
score = 750 - (expenseRatio × 200) + (income / 1000 × 2)
clamped to [300, 900]
```

### Risk Percentage
```
riskPct = expenseRatio × 60
```

### FINN Constraints checked in real time
| Rule | Threshold |
|------|-----------|
| Expenditure cap | ≤ 90% of income |
| Debt-to-income ratio | ≤ 40% |
| Minimum savings buffer | ≥ 3 months income |
| Repayment floor | ≥ 70% on-time |
| Zero income → zero credit | Hard rule |
| No debt service if income = 0 | Hard rule |

---

## Fairness & Ethics

FinAccess AI is built with responsible AI principles at its core:

- **No proxy discrimination** — no caste, gender, or address used as credit signals
- **Fairlearn bias audits** — approval rates tracked across gig workers, rural borrowers, SC/ST, women borrowers, youth
- **SHAP explainability** — every score decision is explained in plain language
- **RBI Fair Practices Code** compliant (simulated)
- **DPDP Act 2023** compliant (simulated)
- **Federated learning architecture** — model improves across banks without sharing raw user data

---

## Government Schemes Integrated

| Scheme | Type | Interest | Max Amount |
|--------|------|----------|------------|
| PM SVANidhi | Micro Loan | 7% | ₹50,000 |
| Jan Samarth | Personal Loan | 10.5% | ₹1,50,000 |
| PM Jeevan Jyoti | Life Insurance | ₹436/yr | ₹2,00,000 |
| MUDRA Yojana | Business Loan | 8.5% | ₹3,00,000 |

---

## Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Full UI | ✅ | ✅ | ✅ | ✅ |
| Voice input (STT) | ✅ | ❌ | ⚠️ partial | ✅ |
| Text-to-speech (TTS) | ✅ | ✅ | ✅ | ✅ |
| Best experience | ⭐ Chrome | — | — | — |

> Voice recognition works best in **Chrome on Android** (matches our target user base) and **Chrome desktop**.

---

## Roadmap

- [ ] Jan Samarth API integration for one-click loan applications
- [ ] UPI transaction history as a credit signal
- [ ] Aadhaar OTP authentication
- [ ] Real LSTM model served via FastAPI backend
- [ ] Federated learning across partner banks (PySyft / Flower)
- [ ] WhatsApp chatbot interface (voice notes → AI response)
- [ ] Offline-first PWA for low-connectivity areas

---

## Team

Built as a college project focused on financial inclusion, responsible AI, and accessible design for India's informal economy.

---

## License

MIT — free to use, modify, and distribute.

---

<p align="center">
  <b>◈ FinAccess AI — Financial inclusion, one voice at a time.</b>
</p>
