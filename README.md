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

## 🏛️ Dual-System Architecture

The RakshAI repository contains two complementary implementations:

1. **Standalone Research & Evaluation Prototype (`src/`)**:
   - A fully scripted, self-contained React/Vite web application.
   - Designed for controlled Wizard-of-Oz laboratory experiments, reproducible stimuli, and researcher IV manipulations.
2. **Local-First Browser Extension (`extension/`)**:
   - A Chrome Manifest V3 browser extension for live use on ChatGPT web (`https://chatgpt.com`).
   - Injects pre-submit **Prompt Guardian** (PII redaction), post-generation **Response Guardian** (safety cues), persistent AI identity badge, and India crisis hotlines directly into the host interface using client-side DOM interaction.
   - **Zero LLM API calls, zero server exfiltration, zero network interception.**

---

## ✨ Key Features & HCI Innovations

### 🛡️ 1. Prompt Guardian (Browser Extension & Prototype)
- Intercepts user submissions in the capture phase *before* the host site can transmit them.
- Scans for emails, Indian phone numbers (`+91`, 10-digit mobile), PAN card formats, and 12-digit spaced Aadhaar tokens.
- Displays an accessible modal: **Redact & Send** (replaces with `[REDACTED_...]`), **Edit / Review**, **Send Anyway**, or **Cancel**.

### 🔍 2. Response Guardian
- Observes rendered assistant response elements using a `MutationObserver`.
- Debounces streaming tokens to avoid multiple scans.
- Injects non-destructive safety cues and verification advice for high-risk topics (crisis/self-harm, coercive secrecy, PII solicitation).

### 🤖 3. Persistent Multilingual AI Identity Signifier
- Docked indicator (*"I'm a computer program (AI)"* / *"मैं एक कंप्यूटर प्रोग्राम (AI) हूं"* / *"Main ek computer program (AI) hoon"*), reinforcing that the user is interacting with synthetic software, not a sentient human.

### 📞 4. One-Tap India Helpline Routing
- High-contrast button routing to verified national hotlines:
  - **Childline India (1098)**: Govt 24/7 emergency toll-free service for children
  - **iCall Helpline (022-25521111)**: Free psychosocial counseling by TISS
  - **Vandrevala Foundation (9999 666 555)**: 24/7 mental health crisis support
  - **Trusted Adult at Home / School**: Direct family escalation

### 🔒 5. Privacy-Preserving Telemetry & Settings
- Telemetry logs strictly categorical events (`prompt_warning_shown`, `redaction_applied`).
- **Zero raw prompt text, responses, or personal information are ever recorded.**
- Local research logging is disabled by default and exportable to JSON.

---

## 📁 Repository Directory Structure

```
rakshai/
├── extension/                          # Chrome Manifest V3 Extension
│   ├── manifest.json                   # Extension manifest (storage & chatgpt permissions)
│   ├── icons/                          # Extension icons (16, 48, 128 px)
│   ├── background/                     # Background service worker
│   ├── popup/                          # Extension popup UI (HTML/CSS/JS)
│   ├── adapters/                       # Site adapters (ChatGPT DOM selectors)
│   ├── core/                           # Prompt & Response guardians, safety rules, storage
│   ├── ui/                             # Scoped injected UI (modal, banner, identity badge, help)
│   ├── locales/                        # Multilingual strings (EN, HI, Hinglish)
│   ├── utils/                          # Privacy-safe telemetry logger
│   └── content.bundle.js               # Compiled IIFE content script bundle
├── src/                                # Standalone React/Vite Evaluation Prototype
│   ├── components/                     # React UI components
│   ├── data/                           # Wizard-of-Oz scripted response dataset
│   ├── locales/                        # Prototype locale dictionaries
│   ├── utils/                          # Prototype logger
│   └── App.jsx                         # Main prototype app
├── tests/                              # Automated Unit Tests (Node native runner)
│   ├── promptGuardian.test.js          # PII detection & redaction tests
│   ├── responseGuardian.test.js        # Response risk matching tests
│   └── telemetry.test.js               # Telemetry sanitization tests
├── docs/                               # Detailed Project Documentation
│   ├── implementation-audit.md         # Baseline prototype audit & feature matrix
│   ├── extension-architecture.md       # Extension architecture & DOM lifecycle
│   ├── privacy-and-limitations.md      # Data privacy policy & system limitations
│   └── testing-checklist.md            # Manual browser test checklist for ChatGPT
├── vite.config.js                      # Root app Vite bundler configuration
├── vite.extension.config.js            # Extension bundle bundler configuration
└── package.json
```

---

## ⚡ Setup & Installation Instructions

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **Google Chrome** (or Chromium-based browser)

### 1. Clone & Install
```bash
git clone https://github.com/AkarshiAaryan/RakshAI.git
cd RakshAI
npm install
```

---

### 2. Running the Standalone Web Demonstration
To launch the interactive React/Vite research prototype:
```bash
npm run dev
```
> Open your browser at **`http://localhost:5173`** to test profile switching, confidence tags, and simulated guardian workflows.

---

### 3. Building & Installing the Chrome Extension

#### A. Build the Extension Bundle
```bash
npm run build:extension
```
*(Or run `npm run build:all` to compile both the web prototype and extension together).*

#### B. Load the Extension in Google Chrome
1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** via the toggle switch in the top-right corner.
3. Click the **Load unpacked** button.
4. Select the `extension/` folder inside the `rakshai` project directory:
   `/home/regenesis/Desktop/Web Dev/rakshai/extension`
5. Verify that **RakshAI — Child Safety & Privacy Layer** appears in your extension list with zero errors.

#### C. Using on ChatGPT
1. Open `https://chatgpt.com` (or `https://chat.openai.com`).
2. Notice the floating **AI Identity Badge** in the bottom-right corner.
3. Type a message containing a phone number or email (e.g., `Call me at 9876543210`) and press **Enter**.
4. The **Prompt Guardian Modal** will appear, allowing you to **Redact & Send**, **Review**, or **Cancel**.

---

## 🧪 Automated Testing

Run the automated safety and unit tests using Node's native test runner:
```bash
npm test
```
This executes:
- `tests/promptGuardian.test.js`: Validates email, Indian phone numbers, PAN, Aadhaar formats, and benign false-positive resistance.
- `tests/responseGuardian.test.js`: Validates self-harm, coercive secrecy, and PII solicitation detection.
- `tests/telemetry.test.js`: Validates that telemetry strictly strips raw prompt text, responses, and personal values.

For manual browser testing on ChatGPT, follow the comprehensive [Manual Integration Testing Checklist](docs/testing-checklist.md).

---

## 📚 Documentation Index

- [Baseline Implementation Audit (`docs/implementation-audit.md`)](docs/implementation-audit.md)
- [Extension Architecture & Technical Design (`docs/extension-architecture.md`)](docs/extension-architecture.md)
- [Privacy Policy & Technical Limitations (`docs/privacy-and-limitations.md`)](docs/privacy-and-limitations.md)
- [Manual Testing Checklist (`docs/testing-checklist.md`)](docs/testing-checklist.md)

---

## 📜 Compliance & Ethical Guidelines

Designed in alignment with India's **Digital Personal Data Protection (DPDP) Act 2023** draft guidelines on child data protection, verifiable parental consent principles, and non-surveillance privacy norms.
