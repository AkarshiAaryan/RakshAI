# RakshAI — Privacy Policy & System Limitations

**Document Status:** Public Reference & Ethical Audit  
**Target Systems:** RakshAI Web Prototype & Chrome Browser Extension

---

## 1. Privacy Architecture & Data Handling Guarantees

RakshAI is strictly designed around a **local-first, zero-exfiltration principle**:

1. **No External Server Transmission**:
   - The extension makes **zero** outbound network requests to any RakshAI server, third-party analytics service, or cloud inference API.
   - All evaluation of user prompts and chatbot responses occurs entirely inside the client browser's local JavaScript execution context.

2. **Zero Raw Prompt / Response Logging**:
   - The research telemetry system (`extension/utils/telemetry.js`) enforces strict filtering rules.
   - Keys such as `prompt`, `query`, `text`, `response`, `email`, `phone`, and `address` are completely stripped from event payloads.
   - Events record only categorical action counts (e.g. `prompt_warning_shown`, `prompt_redaction_applied`, `response_warning_shown`).

3. **Opt-In Research Mode**:
   - Research telemetry logging is **disabled by default**. It is only activated if explicitly toggled on by a researcher or parent in the extension popup.
   - All stored logs reside in `chrome.storage.local` and can be exported as a standard JSON file or cleared at any time with a single click.

4. **No Network Traffic Interception**:
   - RakshAI does not intercept, modify, or inspect underlying HTTP/WebSocket network traffic between the user and OpenAI.
   - It operates purely at the user interface DOM layer.

---

## 2. Technical Limitations & Boundaries

### 2.1 Heuristic PII Detection Limits
- Regular expressions can reliably detect structured identifiers (RFC emails, 10-digit Indian phone numbers with country codes, PAN format, 12-digit spaced Aadhaar).
- **Unstructured / Contextual Information**: Heuristic rules cannot reliably recognize every informal school name, neighborhood reference, personal friend name, or implicit identifier (e.g., *"the yellow building near the metro station"*).
- Users and parents must understand that detection is a protective aid, **not an infallible guarantee**.

### 2.2 Post-Generation Response Observation
- The Response Guardian operates on text **already rendered into the DOM** by the chatbot.
- It is a **post-generation verification and help-seeking trigger**, not a real-time block on the model's weights or server-side output.
- While high-risk turns trigger verification notices and helpline links, RakshAI does not claim to detect every nuanced form of inappropriate or hallucinated content.

### 2.3 Provider DOM Fragility
- ChatGPT's web application is a frequently updated Single Page Application (SPA).
- Major UI redesigns or class name refactors by OpenAI may require updating the CSS selectors in `extension/adapters/chatgptAdapter.js`.
- The modular site adapter pattern minimizes this fragility, but updates may be required as the host site evolves.

---

## 3. Regulatory Alignment (DPDP Act 2023)

In accordance with India's **Digital Personal Data Protection Act (DPDP) 2023**:
- RakshAI prevents involuntary exposure of children's personal data before transmission.
- It respects children's dignity by avoiding covert surveillance or secret keylogging.
- Telephony and helpline recommendations route directly to verified public and NGO hotlines (**Childline India 1098**, **iCall**, **Vandrevala Foundation**).
