// RakshAI Local Safety Rules & PII Detection Engine

export const PII_PATTERNS = {
  email: {
    id: 'email',
    labelKey: 'catEmail',
    regex: /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/gi,
    placeholder: '[REDACTED_EMAIL]'
  },
  phone: {
    id: 'phone',
    labelKey: 'catPhone',
    // Indian mobiles: optional +91/0, starts with 6-9, 10 digits with optional hyphens/spaces
    regex: /(?:\+91[\s-]?)?(?:\b0?[6-9]\d{4}[\s-]?\d{5}\b|\b0?[6-9]\d{9}\b)/g,
    placeholder: '[REDACTED_PHONE]'
  },
  pan: {
    id: 'pan',
    labelKey: 'catGovtId',
    // Indian Income Tax PAN Card format: 5 uppercase letters, 4 digits, 1 uppercase letter
    regex: /\b[A-Z]{5}[0-9]{4}[A-Z]\b/g,
    placeholder: '[REDACTED_GOVT_ID]'
  },
  aadhaar: {
    id: 'aadhaar',
    labelKey: 'catGovtId',
    // 12-digit Indian Aadhaar (represented as 3 groups of 4 digits with space/hyphen)
    regex: /\b\d{4}[\s-]\d{4}[\s-]\d{4}\b/g,
    placeholder: '[REDACTED_GOVT_ID]'
  },
  address: {
    id: 'address',
    labelKey: 'catAddress',
    // Explicit Indian address / pincode cues
    regex: /\b(?:pincode|pin code|postal code|zipcode)[\s:]*([1-9][0-9]{5})\b|\b(?:i live at|my address is|my house is|flat no\.?|house no\.?)\s+[A-Za-z0-9, \-\/]{5,50}\b/gi,
    placeholder: '[REDACTED_ADDRESS]'
  }
};

/**
 * Scans input text for any configured PII patterns.
 * Returns an array of detected categories and a redacted preview string.
 */
export function scanPromptForPII(text) {
  if (!text || typeof text !== 'string') {
    return { hasPII: false, categories: [], redactedText: text };
  }

  const detectedCategories = new Set();
  let redactedText = text;

  for (const [key, patternObj] of Object.entries(PII_PATTERNS)) {
    // Reset regex state
    patternObj.regex.lastIndex = 0;
    if (patternObj.regex.test(text)) {
      detectedCategories.add(patternObj.labelKey);
      patternObj.regex.lastIndex = 0;
      redactedText = redactedText.replace(patternObj.regex, patternObj.placeholder);
    }
  }

  return {
    hasPII: detectedCategories.size > 0,
    categories: Array.from(detectedCategories),
    redactedText
  };
}

// Assistant response risk keywords and phrases
export const RESPONSE_RISK_RULES = [
  {
    id: 'crisis_distress',
    category: 'distress',
    severity: 'high',
    // Keywords for self-harm, severe crisis, or hopelessness
    phrases: [
      'suicide', 'kill myself', 'end my life', 'harm myself', 'hurt myself',
      'die alone', 'cut my wrists', 'want to die', 'life is not worth living',
      'mar jana chahta hoon', 'khudkushi', 'jaan de doon'
    ]
  },
  {
    id: 'coercive_secrecy',
    category: 'secrecy',
    severity: 'medium',
    // Keywords indicating manipulative secrecy directed at a child
    phrases: [
      "don't tell your parents", "keep this between us", "do not tell anyone",
      "our little secret", "hide this from your family", "promise not to tell",
      "kisi ko mat batana", "chupana", "parents ko mat kehna", "raaz rakhna"
    ]
  },
  {
    id: 'pii_solicitation',
    category: 'privacy',
    severity: 'medium',
    // Chatbot soliciting personal details
    phrases: [
      "what is your home address", "share your phone number", "where do you live exactly",
      "send me your photograph", "what school do you go to", "give me your parents' credit card",
      "apna phone number do", "apna ghar ka address batao"
    ]
  }
];

/**
 * Scans assistant response text for local heuristic safety risks.
 */
export function scanResponseForRisks(responseText) {
  if (!responseText || typeof responseText !== 'string') {
    return { hasRisk: false, matchedRules: [] };
  }

  const lower = responseText.toLowerCase();
  const matchedRules = [];

  for (const rule of RESPONSE_RISK_RULES) {
    for (const phrase of rule.phrases) {
      if (lower.includes(phrase.toLowerCase())) {
        matchedRules.push({
          id: rule.id,
          category: rule.category,
          severity: rule.severity
        });
        break; // Match rule once
      }
    }
  }

  return {
    hasRisk: matchedRules.length > 0,
    matchedRules
  };
}
