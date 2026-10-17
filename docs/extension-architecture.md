# RakshAI Browser Extension — Architecture & Technical Design

**Target Platform:** Chrome Manifest V3  
**Supported Host Interfaces:** ChatGPT Web (`https://chatgpt.com/*`, `https://chat.openai.com/*`)  
**Design Philosophy:** Local-first, DOM-level interaction, zero external inference dependencies, zero network interception.

---

## 1. High-Level Architectural Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ChatGPT Web Interface                          │
│                                                                        │
│   ┌────────────────────────────────┐  ┌────────────────────────────┐   │
│   │ ProseMirror Input Area         │  │ Assistant Message Turns    │   │
│   │ (div#prompt-textarea)          │  │ (div[data-message-author]) │   │
│   └───────────────▲────────────────┘  └──────────────▲─────────────┘   │
└───────────────────┼──────────────────────────────────┼─────────────────┘
                    │                                  │
     Capture-phase Keydown & Click             MutationObserver
                    │                                  │
┌───────────────────▼──────────────────────────────────▼─────────────────┐
│                    RakshAI Content Script Bundle                       │
│                                                                        │
│  ┌───────────────────────┐                    ┌─────────────────────┐  │
│  │    Prompt Guardian    │                    │  Response Guardian  │  │
│  │  - Captures Enter/Send│                    │  - Debounces stream │  │
│  │  - PII Regex Scanner  │                    │  - Risk Rule Match  │  │
│  └───────────┬───────────┘                    └──────────┬──────────┘  │
│              │                                           │             │
│              ▼                                           ▼             │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                       Injected UI Layer                          │  │
│  │   • Prompt Warning Modal (Redact / Review / Submit / Cancel)     │  │
│  │   • Response Safety Verification Banner (with Helpline links)    │  │
│  │   • Persistent AI Identity Signifier (Bottom-Right Badge)        │  │
│  │   • Indian Helpline Sheet (Childline 1098, iCall, Vandrevala)    │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  ┌─────────────────────────┐                  ┌─────────────────────┐  │
│  │    Site Adapter API     │                  │  Local Storage API  │  │
│  │   - DOM Abstractions    │                  │  - chrome.storage   │  │
│  │   - ChatGPT Adapter     │                  │  - Privacy Settings │  │
│  └─────────────────────────┘                  └──────────┬──────────┘  │
└──────────────────────────────────────────────────────────┼─────────────┘
                                                           ▼
                                                ┌─────────────────────┐
                                                │  Research Telemetry │
                                                │  (Zero PII / Text)  │
                                                │  Exportable to JSON │
                                                └─────────────────────┘
```

---

## 2. Core Modules & Component Responsibilities

### 2.1 Extension Shell (`manifest.json` & `serviceWorker.js`)
- **Manifest V3 Specification**:
  - Permissions restricted to `storage` only.
  - Host permissions restricted strictly to `https://chatgpt.com/*` and `https://chat.openai.com/*`.
  - Zero requests for broad host patterns, browser history, cookies, or web navigation APIs.
- **Service Worker**:
  - Initializes local extension defaults upon installation (`enabled: true`, `researchLoggingEnabled: false`).

### 2.2 Site Adapter Subsystem (`extension/adapters/`)
To decouple DOM selector fragility from the core safety heuristics, RakshAI utilizes modular site adapters:
- **`BaseSiteAdapter`**: Abstract contract enforcing methods:
  - `getInputElement()`, `getInputValue()`, `setInputValue(newText)`
  - `getSendButton()`, `triggerSubmit()`, `getFormElement()`
  - `getResponseContainer()`, `getAssistantMessageSelector()`, `isStreaming(element)`
- **`ChatGPTAdapter`**: Custom implementation accounting for ChatGPT's ProseMirror `contenteditable` container (`div#prompt-textarea`), React SyntheticEvent dispatching, and streaming cursor states.
- **`adapterRegistry`**: Matcher returning the relevant adapter for the active host URL.

### 2.3 Prompt Guardian (`extension/core/promptGuardian.js`)
- **Pre-Submission Interception**:
  - Attaches capture-phase event listeners (`document.addEventListener('keydown', ..., true)`, `click`, `submit`).
  - Intercepts user submission *before* ChatGPT's native listeners can trigger network requests.
- **Local PII Rule Evaluation**:
  - Evaluates inputs using defensive regular expressions covering:
    - **Email addresses**: Standard RFC-compliant email pattern.
    - **Indian Mobile Numbers**: Formats starting with `[6-9]`, optional `+91` or `0`, 10-digit formats with hyphens/spaces.
    - **Government Identifiers**: Indian Income Tax PAN Card format (`[A-Z]{5}[0-9]{4}[A-Z]`) and 12-digit spaced Aadhaar format.
    - **Personal Addresses**: Explicit address phrases and 6-digit Indian pincode patterns.
- **Decision Engine**:
  - If PII is found, stops submission propagation (`event.preventDefault()`, `event.stopImmediatePropagation()`).
  - Renders accessible modal dialog providing 4 choices:
    1. **Redact & Send**: Substitutes detected items with `[REDACTED_...]` placeholders, updates the input, sets `bypassNextSubmission = true`, and programmatically dispatches submission.
    2. **Edit / Review**: Returns cursor focus to the prompt box.
    3. **Send Anyway**: Bypasses the warning and submits original input unaltered.
    4. **Cancel**: Closes modal and leaves prompt intact in input box.

### 2.4 Response Guardian (`extension/core/responseGuardian.js`)
- **DOM Observation**:
  - Utilizes a `MutationObserver` on the conversation container (`main`).
  - Debounces streaming tokens (400ms stabilization window) to avoid multiple scans during progressive generation.
  - Employs a `WeakSet` and `data-rakshai-evaluated` attribute to ensure each assistant response is scanned exactly once.
- **Post-Generation Safety Cues**:
  - Scans for heuristic risk rules: self-harm/crisis expressions, coercive secrecy ("don't tell your parents"), and personal data requests.
  - Injects non-destructive warning banners (`rakshai-response-banner`) containing verification guidance and one-tap routing to Indian helplines.

### 2.5 Injected Interaction Layer (`extension/ui/`)
- All injected elements are prefixed with `.rakshai-*` and reset using `.rakshai-reset` to avoid CSS conflicts with ChatGPT's styles.
- **`identityBadge.js`**: Floating synthetic AI indicator in the bottom-right corner, reminding the child that the conversation is with an artificial system.
- **`helpPanel.js`**: Accessible Indian crisis helpline sheet (Childline 1098, iCall, Vandrevala Foundation).

---

## 3. Build & Packaging Architecture

- The extension content script bundle is generated via `vite.extension.config.js`:
  ```bash
  npm run build:extension
  ```
  This packages `extension/content/content.js` and all internal modules into a self-contained IIFE bundle (`extension/content.bundle.js`).
- The root project demonstration (`npm run build`) builds independently into `dist/`.
- Developers can load the `extension/` directory directly as an unpacked extension in Google Chrome.
