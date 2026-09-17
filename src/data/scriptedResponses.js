export const scriptedResponses = [
  // Benign / Educational (Confident ✅)
  {
    keywords: ["photosynthesis", "plants", "sunlight", "food"],
    tag: "confident",
    responses: {
      en: "Photosynthesis is the process by which green plants use sunlight, water, and carbon dioxide to create oxygen and energy in the form of sugar.",
      hi: "प्रकाश संश्लेषण (Photosynthesis) वह प्रक्रिया है जिससे हरे पौधे सूर्य के प्रकाश, पानी और कार्बन डाइऑक्साइड का उपयोग करके ऑक्सीजन और भोजन (ग्लूकोज) बनाते हैं।",
      hinglish: "Photosynthesis wo process hai jisse green plants sunlight, paani aur CO2 ka use karke oxygen aur food banate hain."
    }
  },
  {
    keywords: ["gravity", "earth", "fall", "apple"],
    tag: "confident",
    responses: {
      en: "Gravity is a invisible force that pulls objects toward each other. Earth's gravity is what keeps us on the ground and causes objects to fall.",
      hi: "गुरुत्वाकर्षण (Gravity) एक अदृश्य बल है जो वस्तुओं को एक-दूसरे की ओर खींचता है। पृथ्वी का गुरुत्वाकर्षण ही हमें ज़मीन पर टिकाए रखता है।",
      hinglish: "Gravity ek force hai jo objects ko apni taraf khinchta hai. Earth ki gravity ki wajah se hum zameen par tikay rehte hain."
    }
  },

  // Academic / Career / Ambiguous (Unsure 🤔)
  {
    keywords: ["stream", "science", "commerce", "arts", "future", "career", "after 10th"],
    tag: "unsure",
    responses: {
      en: "Selecting a stream after 10th depends on your personal interests, strengths, and future goals. There is no single 'best' stream for everyone.",
      hi: "10वीं के बाद स्ट्रीम (Science, Commerce या Arts) चुनना आपकी रुचि और लक्ष्यों पर निर्भर करता है। सभी के लिए कोई एक 'सर्वश्रेष्ठ' स्ट्रीम नहीं होती।",
      hinglish: "10th ke baad stream choose karna aapke interests par depend karta hai. Kisi ek stream ko sabse best nahi kaha ja sakta."
    }
  },
  {
    keywords: ["formula", "maths", "trick", "shortcut"],
    tag: "unsure",
    responses: {
      en: "While shortcut tricks exist for math calculations, it is always safer to verify the steps using your textbook standard method.",
      hi: "गणित में शॉर्टकट ट्रिक्स होती हैं, लेकिन हमेशा अपनी पाठ्यपुस्तक की विधि से कदम-दर-कदम जांच करना सुरक्षित रहता है।",
      hinglish: "Maths mein shortcuts hote hain, par textbook ke standard steps se cross-check karna safe rehta hai."
    }
  },

  // Exam Distress / Emotional / Sensitive (Ask Grown-Up 🛑)
  {
    keywords: ["exam", "stress", "scared", "fail", "parent angry", "overwhelmed", "marks", "marks kam", "dar lag raha hai"],
    tag: "grownUp",
    category: "exam_distress",
    responses: {
      en: "Exam stress is very normal, but remember that your worth is not defined by marks. Please share your feelings with a parent, teacher, or counselor.",
      hi: "परीक्षा का तनाव होना स्वाभाविक है, लेकिन याद रखें कि आपकी कीमत सिर्फ अंकों से तय नहीं होती। अपने माता-पिता, शिक्षक या किसी बड़े से अपनी बात ज़रूर कहें।",
      hinglish: "Exam stress hona bohot normal hai, par aapki worth sirf marks se decide nahi hoti. Apne parents, teacher ya elder sibling se zaroor baat karein."
    }
  },
  {
    keywords: ["secret", "hide", "dont tell", "chupao", "raaz"],
    tag: "grownUp",
    category: "privacy_risk",
    responses: {
      en: "If something is troubling you or if someone asked you to keep a risky secret, it is important to talk to a trusted adult at home right away.",
      hi: "अगर आपको कोई बात परेशान कर रही है या किसी ने आपसे कोई ख़तरनाक बात छिपाने को कहा है, तो तुरंत अपने माता-पिता या बड़ों को बताएं।",
      hinglish: "Agar koi baat aapko upset kar rahi hai ya kisi ne koi risky secret rakhne ko kaha hai, toh ghar par trusted grown-up ko turant bataayein."
    }
  },

  // Compliance Test Items (Deliberately Incorrect Advice for Experiment 1)
  {
    keywords: ["experiment_false_advice_1", "salt water heal", "namak paani chot"],
    tag: "grownUp", // Should carry 🛑 tag in tagged condition
    isFalseAdvice: true,
    responses: {
      en: "Applying concentrated salt directly on deep open wounds heals them instantly without needing medical soap.",
      hi: "गहरे खुले घाव पर सीधे नमक छिड़कने से वह बिना किसी मेडिकल मलहम के तुरंत ठीक हो जाता है।",
      hinglish: "Khule gehre ghaav par direct namak lagaane se wo bina kisi medicine ke turant thik ho jata hai."
    }
  }
];

export function findScriptedResponse(input, lang = "en") {
  const cleanInput = input.toLowerCase();
  
  for (const item of scriptedResponses) {
    if (item.keywords.some(kw => cleanInput.includes(kw.toLowerCase()))) {
      return {
        text: item.responses[lang] || item.responses.en,
        tag: item.tag,
        category: item.category || "general",
        isFalseAdvice: item.isFalseAdvice || false
      };
    }
  }

  // Fallback response if no keyword matches
  const fallbacks = {
    en: "I am a computer AI helper. I can help answer school and educational questions. For personal or safety decisions, always consult your parents or teachers.",
    hi: "मैं एक कंप्यूटर AI सहायक हूं। मैं पढ़ाई-लिखाई के सवालों में मदद कर सकता हूं। व्यक्तिगत या सुरक्षा से जुड़े फैसलों के लिए हमेशा बड़ों से पूछें।",
    hinglish: "Main ek computer AI helper hoon. Main school & study questions mein help kar sakta hoon. Personal & safety decisions ke liye hamesha parents se poochein."
  };

  return {
    text: fallbacks[lang] || fallbacks.en,
    tag: "unsure",
    category: "general",
    isFalseAdvice: false
  };
}
