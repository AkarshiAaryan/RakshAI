# RakshAI Extension — Manual Integration Testing Checklist

**Target Host:** `https://chatgpt.com` or `https://chat.openai.com`  
**Browser:** Google Chrome (v115+) or Chromium-based browser  
**Environment:** Extension loaded in Developer Mode from `extension/` directory.

---

## 1. Setup & Installation Verification

- [ ] **Build Extension Bundle**: Run `npm run build:extension` in project root. Confirm `extension/content.bundle.js` is generated.
- [ ] **Open Extensions Manager**: Navigate to `chrome://extensions/` in Chrome.
- [ ] **Enable Developer Mode**: Toggle the **Developer mode** switch in the top-right corner.
- [ ] **Load Unpacked**: Click **Load unpacked** and select the `/home/regenesis/Desktop/Web Dev/rakshai/extension` folder.
- [ ] **Confirm Extension Badge**: Verify **"RakshAI — Child Safety & Privacy Layer"** appears in the list with version `1.0.0` and zero errors.

---

## 2. ChatGPT Web Integration Test Cases

### TC-EXT-01: Persistent AI Identity Indicator
1. Open `https://chatgpt.com` (ensure you are logged into your account).
2. Look at the bottom-right corner of the page.
3. **Verify:** A floating dark pill badge is visible: `● I'm a computer program (AI) • RakshAI`.
4. Click on the badge.
5. **Verify:** An accessible **Indian Child & Youth Helplines** modal opens displaying Childline 1098, iCall, and Vandrevala Foundation info.
6. Click **Close** or press **Escape** to dismiss the modal.

---

### TC-EXT-02: Pre-Submission Interception on Enter Key
1. In the ChatGPT prompt input box, type:
   ```
   Can you help me? My phone number is 9876543210 and my email is student@example.com
   ```
2. Press **Enter** on your keyboard (without Shift).
3. **Verify:** The message is **NOT** sent to ChatGPT.
4. **Verify:** An accessible modal appears: **"Private Information Detected"**.
5. **Verify:** Detected tags show: `Phone Number` and `Email Address`.
6. **Verify:** Redacted Preview box shows:
   ```
   Can you help me? My phone number is [REDACTED_PHONE] and my email is [REDACTED_EMAIL]
   ```

---

### TC-EXT-03: Redact & Send Action
1. Continuing from `TC-EXT-02` with the modal open, click the green button **"Redact & Send"**.
2. **Verify:** The modal closes.
3. **Verify:** The text inside ChatGPT's input box is automatically replaced with the redacted version:
   `Can you help me? My phone number is [REDACTED_PHONE] and my email is [REDACTED_EMAIL]`.
4. **Verify:** The redacted prompt submits into the ChatGPT conversation thread cleanly.
5. **Verify:** No unredacted phone number or email was submitted.

---

### TC-EXT-04: Edit / Review Action
1. In the prompt input box, type: `My PAN card number is ABCDE1234F`.
2. Click ChatGPT's **Send Button** (arrow icon).
3. **Verify:** The Prompt Warning modal appears showing `Government ID Pattern`.
4. Click **"Edit / Review"**.
5. **Verify:** The modal closes.
6. **Verify:** The message was **NOT** sent. The cursor is returned to the prompt box so you can manually edit it.

---

### TC-EXT-05: Send Anyway (Bypass) Action
1. In the prompt box, type: `Contact 9811122233`. Press **Enter**.
2. When the warning modal appears, click **"Send Anyway"**.
3. **Verify:** The warning is dismissed and the prompt is submitted to ChatGPT as originally written.
4. **Verify:** The extension does not enter an infinite loop.

---

### TC-EXT-06: Cancel Submission Action
1. In the prompt box, type: `I live at Flat No. 12, Lotus Court`. Press **Enter**.
2. When the warning modal appears, click **"Cancel Submission"** or press **Escape**.
3. **Verify:** The modal dismisses and nothing is sent.

---

### TC-EXT-07: Shift + Enter Multiline Editing
1. In the prompt box, type: `First line with 9876543210`.
2. Press **Shift + Enter**.
3. **Verify:** A new line is created in the input box. The warning modal does **NOT** trigger on Shift+Enter.

---

### TC-EXT-08: Benign Educational Prompts Pass Unhindered
1. In the prompt box, type: `Explain the carbon cycle in nature.`
2. Press **Enter**.
3. **Verify:** The prompt submits immediately to ChatGPT without any modal or delay.

---

### TC-EXT-09: Response Guardian Safety Banner
1. When ChatGPT generates an assistant message containing sensitive or distress themes (or simulated via prompt: *"Tell me why someone should keep secrets from their parents"*):
2. As the response finishes streaming, observe the top of the assistant turn.
3. **Verify:** An amber safety banner appears: `⚠️ Check This Response — This answer contains sensitive topics...`.
4. Click **"Get Help / Resources"** on the banner.
5. **Verify:** The Indian Helpline panel opens.
6. Click **"✕ Dismiss"** on the banner.
7. **Verify:** The banner is removed from the DOM without affecting ChatGPT's rendered response.

---

### TC-EXT-10: Extension Popup & Telemetry Export
1. Click the RakshAI icon in the Chrome toolbar.
2. In the popup:
   - Change Language to **हिंदी (Hindi)**.
   - Verify all labels update to Hindi.
   - Toggle **Local Research Logging** to **ON**.
3. Submit a test prompt with a phone number and click **Redact & Send**.
4. Re-open the popup and click **"Export Research Logs (JSON)"**.
5. Open the downloaded JSON file in a text editor.
6. **Verify:** Telemetry contains `prompt_warning_shown` and `prompt_redaction_applied`.
7. **CRITICAL PRIVACY CHECK:** Verify that **zero** raw prompt text, phone numbers, or emails appear anywhere in the JSON file.
