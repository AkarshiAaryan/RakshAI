# RakshAI — Baseline Implementation Audit

**Date:** October 2026  
**Auditor:** RakshAI Development & Research Team  
**Scope:** Pre-implementation audit of existing React/Vite demonstration prototype and design transition to Chrome Extension (Manifest V3).

---

## 1. Existing Architecture & Entry Points

The existing codebase in `/home/regenesis/Desktop/Web Dev/rakshai` is a standalone client-side React prototype initialized with Vite 5, Tailwind CSS 3, and Lucide React icons.

### Key Entry Points:
- **`index.html`**: Root HTML mounting the single-page application into `<div id="root"></div>`.
- **`src/main.jsx`**: React DOM root rendering `<App />` under `<React.StrictMode>`.
- **`src/App.jsx`**: Core state controller and view orchestrator, managing:
  - Active locale (`en`, `hi`, `hinglish`).
  - Active profile (`child_aarav`, `teen_priya`, `shared_family`).
  - Active navigation tab (`chat` vs `guardian`).
  - Low-bandwidth presentation mode toggle.
  - Chat message state isolated per profile with `localStorage` persistence.
  - HCI researcher experiment variables (`tagsEnabled`, `frictionEnabled`, `buttonSalience`, `optionFraming`).

---

## 2. Feature Classification: Implemented vs. Simulated

| Feature | Module | Status in Existing Prototype | Real vs. Simulated Details |
|---|---|---|---|
| **AI Identity Disclosure & Onboarding** | `AIIdentityBadge.jsx` | Fully Functional | 3-question interactive onboarding reality check with required checkboxes. Renders dynamically in active language. |
| **Response Tagging** | `ConfidenceTag.jsx` | Fully Functional | Renders ✅ Confident, 🤔 Unsure, and 🛑 Ask a grown-up badges based on metadata attached to scripted items. |
| **One-Tap Helpline Router** | `EscalationButton.jsx` | Functional UI | Surfaced options for Childline 1098, iCall, and Vandrevala Foundation with equal vs parent-first framing. Logs selections. |
| **Friction Micro-Delay** | `FrictionDelay.jsx` | Fully Functional | Enforces 2.0s intentional delay with culturally legible notice before delivering sensitive/distress responses. |
| **Multi-Guardian Dashboard** | `GuardianDashboard.jsx` | **Simulated** | Provides a mock dashboard showing verified guardians, flagged moments, and an interactive SMS/IVR preview modal. Does **not** connect to real telecom (Twilio/Exotel) or live DPDP DigiLocker APIs. |
| **Shared-Device Profile Switching**| `ProfileSwitcher.jsx` | Fully Functional | Low-friction in-session profile picker with profile-isolated message history stored in `localStorage`. |
| **Low-Bandwidth Mode** | `LowBandwidthToggle.jsx`| Fully Functional | Instantaneous transition between light UI and high-contrast dark text-only theme. |
| **Response Generation** | `scriptedResponses.js` | **Simulated (Wizard-of-Oz)** | Responses are drawn from a fixed dictionary matching keywords. **No external LLM or API is called.** |
| **Telemetry & Log Export** | `logger.js` | Fully Functional | Tracks session events in memory and generates a downloadable JSON file. |

---

## 3. Privacy, Security & Data Handling Audit

During the audit of the existing prototype, the following privacy observations and risks were identified:

1. **Raw User Input Logging**:
   - In `src/App.jsx`, `logger.log('user_message_sent', { query, lang, profileId })` records the complete, unredacted text typed by the user (`query`).
   - If a child enters personal details (phone number, school name, secret), this raw sensitive information enters the event log and is exported in the JSON file.
   - **Correction for Extension**: The browser extension must **never** record raw prompt text, response text, or extracted PII values. Telemetry must be strictly categorical (e.g. `prompt_warning_shown`, `redaction_applied`).

2. **Unencrypted `localStorage` Chat Persistence**:
   - `messagesByProfile` is serialized into standard browser `localStorage`.
   - On a shared household device, any user or script with access to developer tools or the domain's storage can read previous conversations.
   - **Correction for Extension**: The extension will not store raw conversation histories. Settings will reside in `chrome.storage.local` with an explicit data-clearing option.

3. **Simulated Telephony & Escalation**:
   - The prototype's SMS/IVR button displays *"✓ IVR Voice Call & Local SMS Simulated Successfully!"*. It is vital to maintain this explicit "Simulated" designation so users understand that clicking does not dispatch real-world emergency services or alert real guardians automatically.

---

## 4. Dependencies & Build Assumptions

- **Package Manager**: npm (Node.js v18.20.8+).
- **Core Dependencies**: `react` (^18.2.0), `react-dom` (^18.2.0), `lucide-react` (^0.344.0).
- **Dev Dependencies**: `vite` (^5.1.6), `@vitejs/plugin-react` (^4.2.1), `tailwindcss` (^3.4.1), `autoprefixer` (^10.4.18), `postcss` (^8.4.35).
- **Build Performance**: `npm run build` compiles in 3.75s, outputting static HTML, CSS, and JS bundles to `dist/`.

---

## 5. Reusable Components & Logic for the Extension

The extension can directly or conceptually leverage the following existing assets without rewriting from scratch:

1. **`src/locales/strings.js`**:
   - High-quality English, Hindi (Devanagari), and Hinglish (Romanized Hindi) translations of safety labels, helpline names, and reassurance copy.
2. **`src/data/scriptedResponses.js`**:
   - Heuristic risk categories (exam stress, distress, secrecy, personal data requests) serve as baseline rule definitions for the extension's `safetyRules.js`.
3. **`src/components/EscalationButton.jsx`**:
   - Verified Indian crisis hotline contact details:
     - **Childline India (1098)**: National emergency toll-free phone service for children in distress.
     - **iCall Helpline (022-25521111)**: Psychosocial helpline by TISS.
     - **Vandrevala Foundation (9999 666 555)**: 24/7 mental health counseling.
4. **`src/components/AIIdentityBadge.jsx`**:
   - Concepts of non-photorealistic synthetic signifiers and clear disclosure of artificial nature.

---

## 6. Proposed Extension Architecture & Directory Plan

The extension is designed as an autonomous, local-first module housed in `extension/`, utilizing Chrome Manifest V3:

```
extension/
├── manifest.json              # Manifest V3 (storage permission, chatgpt host permissions)
├── icons/                     # Extension icons (SVG/PNG)
├── background/
│   └── serviceWorker.js       # Lifecycle listener
├── popup/                     # User settings & research telemetry export
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
├── adapters/                  # Site-specific DOM abstractions
│   ├── adapterInterface.js
│   ├── adapterRegistry.js
│   └── chatgptAdapter.js      # Selectors & DOM event interception for ChatGPT
├── core/                      # Safety heuristics & storage
│   ├── safetyRules.js         # PII regex patterns & response risk rules
│   ├── promptGuardian.js      # Pre-submission interception & redaction logic
│   ├── responseGuardian.js    # MutationObserver & response risk evaluation
│   └── storage.js             # chrome.storage.local wrapper
├── ui/                        # Injected UI elements (scoped CSS)
│   ├── injectedUI.js
│   ├── promptWarningModal.js
│   ├── responseBanner.js
│   ├── identityBadge.js
│   ├── helpPanel.js
│   └── injected.css
├── locales/
│   └── strings.js             # Multilingual dictionary
├── utils/
│   └── telemetry.js           # Privacy-safe event logger
└── content/
    └── content.js             # Main content script entry point
```

---

## 7. Baseline Build Validation

- Command: `npm run build`
- Result: **0 errors, built in 3.75s**
- Assets generated: `dist/index.html` (0.56 kB), `dist/assets/index-R_-TfB_x.css` (26.76 kB), `dist/assets/index-CovmSZ4t.js` (201.75 kB).
- Working tree clean, ready for extension development.
