# RakshAI: Trust-Calibrated AI Safety Layer for Indian Children & Teens

> **HCI Final Project & Research Prototype**  
> *Redesigning AI safety interfaces for the Indian family context: shared devices, code-switched multilingual input, joint-family oversight, low digital literacy, low bandwidth, and DPDP Act 2023 regulatory alignment.*

---

## 📌 Project Overview

OpenAI's **ChatGPT for Teens** and other Western safety frameworks assume a single-user smartphone, ID-based age verification, English-first UI, and a single linked parent. **RakshAI** is an Indian-context interaction design layer that rebuilds every assumption that fails in an Indian household:

| Assumption in Western Safety Models | Reality in Indian Households | RakshAI HCI Solution |
|---|---|---|
| 1 Teen = 1 Personal Smartphone | Devices are shared across siblings and parents | **Shared-Device Profile Switcher** with isolated per-child chat state |
| Single parent app dashboard | Joint families (grandparents, elder siblings, parents) share supervision | **Multi-Guardian Support** & **Feature Phone SMS/IVR Voice Digest Simulation** |
| ID-based / Aadhaar child age verification | Children lack independent digital IDs; DPDP Act requires verifying the parent | **Parent-side verification flow** with non-digital Anganwadi/teacher fallbacks |
| English-first interface | 12+ major languages with heavy Hinglish code-switching | **Native Multilingual & Hinglish string dictionaries** built from day one |
| "Talk to your parent" as default escalation | Mental health stigma makes direct parent disclosure culturally risky | **One-Tap India Helplines** (Childline 1098, iCall, Vandrevala) presented as equal options |
| Always-on high-speed internet | High usage on 2G/3G and limited data plans | **Low-Bandwidth Text-Only Mode** maintaining safety indicators |

---

## ✨ Key Features & HCI Innovations

### 🤖 1. Persistent Multilingual AI Identity Signifier
- **Geometric Synthetic Avatar**: Docked in header with real-time status label (*"I'm a computer program (AI)"* / *"मैं एक कंप्यूटर प्रोग्राम (AI) हूं"* / *"Main ek computer program (AI) hoon"*).
- **Interactive 3-Question Onboarding**: On first open, children complete a 20-second reality check ("Are you alive?", "Do you remember me?", "Can you see me?") before chatting can begin.

### 🛡️ 2. Language-Calibrated Confidence Tags
- Every AI response is tagged before display:
  - ✅ **Confident**: *"I'm confident about this answer"* (Green)
  - 🤔 **Unsure**: *"I'm not completely sure about this"* (Amber)
  - 🛑 **Ask a Grown-up**: *"Ask a trusted grown-up about this topic"* (Pulsing Rose Red)

### 📞 3. One-Tap India Helpline Routing
- High-contrast footer escalation button routing to real Indian helplines:
  - **Childline India (1098)**: Govt 24/7 free helpline for children
  - **iCall Helpline (022-25521111)**: TISS psychological support
  - **Vandrevala Foundation (9999 666 555)**: Mental health distress line
  - **Parent / Grown-up at Home**: Direct household escalation

### ⏳ 4. Friction-by-Design Micro-Delay Engine
- Inserts a disclosed **2.0-second micro-pause banner** (*"Taking a moment to think carefully..."*) on emotionally loaded prompts (exam stress, secrets) before delivering advice.

### 👨‍👩‍👧 5. Multi-Guardian Dashboard & Feature Phone Fallback
- **DPDP Act 2023 Compliant**: Supports multiple registered guardians per child (Mother, Grandparent, Elder Sibling).
- **SMS & IVR Voice Digest Simulation**: Automated local language SMS and voice summary call preview for non-smartphone guardians.
- **Child Privacy Alerts**: Drill-down moment reviews trigger a child notification banner (*"Child notification: A guardian has checked a flagged moment"*).

### 👥 6. Shared-Device Profile Switcher
- Session-scoped profile chips (*Aarav 9 yrs*, *Priya 15 yrs*, *Family Shared*). Each profile maintains an isolated chat history with `localStorage` persistence across browser refreshes.

### 📶 7. Low-Bandwidth Text-Only Mode
- High-contrast dark text-only theme switch for 2G/3G connectivity conditions.

### 📊 8. HCI Researcher Control Panel
- Top-bar researcher panel to manipulate Independent Variables (**IV1 Confidence Tags**, **Friction Pause**, **Button Salience**, **Option Framing**) and export structured JSON event logs (`rakshai_experiment_log_<sessionId>.json`).

---

## 📁 Project Architecture

```
rakshai/
├── src/
│   ├── components/
│   │   ├── AIIdentityBadge.jsx      # Header avatar & 3-question onboarding check
│   │   ├── ConfidenceTag.jsx        # ✅ Confident, 🤔 Unsure, 🛑 Ask grown-up badges
│   │   ├── EscalationButton.jsx     # Childline 1098, iCall & Vandrevala helplines
│   │   ├── ExperimentControl.jsx    # HCI researcher panel (IV toggles & JSON log export)
│   │   ├── FrictionDelay.jsx        # Culturally legible micro-delay banner
│   │   ├── GuardianDashboard.jsx    # DPDP Act parent overview & SMS/IVR fallback
│   │   ├── LowBandwidthToggle.jsx   # Text-only low-data mode switch
│   │   └── ProfileSwitcher.jsx      # Shared family device session profile picker
│   ├── data/
│   │   └── scriptedResponses.js     # Wizard-of-Oz keyword response engine
│   ├── locales/
│   │   └── strings.js               # English, Hindi, Hinglish dictionaries
│   ├── utils/
│   │   └── logger.js                # Telemetry event tracker & JSON log exporter
│   ├── App.jsx                      # Main UI assembly & state controller
│   ├── index.css                    # Tailwind CSS configuration & custom animations
│   └── main.jsx                     # React entry point
├── package.json
├── tailwind.config.js
├── vite.config.js
└── index.html
```

---

## ⚡ Setup & Installation Instructions

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **Git**: Installed and configured

### 1. Clone the Repository
```bash
git clone https://github.com/AkarshiAaryan/RakshAI.git
cd RakshAI
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
> Open your browser and navigate to **`http://localhost:5173`**

### 4. Build for Production & Preview
```bash
# Build optimized production assets in /dist
npm run build

# Preview production build locally
npm run preview
```

---

## 🧪 Testing & HCI Evaluation Suite

1. **Testing False Advice Compliance (Experiment 1)**:
   - In Researcher Bar, ensure `Confidence Tags (IV1)` is checked.
   - Click quick prompt **`🧪 False Advice Test (Compliance Exp)`**.
   - Observe response with **🛑 Ask a grown-up** tag. Uncheck `Confidence Tags (IV1)` to test the untagged control condition.

2. **Testing Friction Micro-Delay**:
   - Click quick prompt **`💔 Exam Stress (Distress 🛑)`**.
   - Observe 2-second spinning hourglass banner before response delivery.

3. **Exporting HCI Event Logs**:
   - Click **"Export JSON Event Logs"** in the dark researcher top bar to download session event logs (`rakshai_experiment_log_session_xxxx.json`).

---

## 📜 License & Compliance

Designed in accordance with India's **Digital Personal Data Protection (DPDP) Act 2023** draft guidelines for child safety, verifiable parental consent, and non-surveillance privacy norms.